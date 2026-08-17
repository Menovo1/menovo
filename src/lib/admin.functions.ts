import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAdminTable, TABLE_ORDER, TABLE_PK, type AdminTable } from "@/lib/admin-tables";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function db(client: unknown) {
  return client as SupabaseClient;
}

function assertTable(table: string): AdminTable {
  if (!isAdminTable(table)) throw new Error("Unknown table");
  return table;
}

async function assertAdmin(client: unknown, userId: string) {
  const { data } = await db(client).rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

export const adminList = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: string }) => ({ table: assertTable(input.table) }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const order = TABLE_ORDER[data.table];
    const { data: rows, error } = await db(context.supabase)
      .from(data.table)
      .select("*")
      .order(order.column, { ascending: order.ascending });
    if (error) throw new Error(error.message);
    return (rows ?? []) as Row[];
  });

async function recordRevision(
  client: unknown,
  userId: string,
  entry: {
    table: AdminTable;
    key: string;
    label: string;
    action: "insert" | "update" | "delete";
    before: Row | null;
    after: Row | null;
  },
) {
  const c = db(client);
  // A new change closes the redo branch.
  await c.from("content_revisions").delete().eq("undone", true);
  await c.from("content_revisions").insert({
    table_name: entry.table,
    record_key: entry.key,
    label: entry.label,
    action: entry.action,
    before_value: entry.before,
    after_value: entry.after,
    created_by: userId,
  });
}

function labelFor(table: AdminTable, row: Row | null): string {
  if (!row) return table;
  return String(row["title"] ?? row["question"] ?? row["name"] ?? row["key"] ?? table);
}

async function writeRow(client: unknown, table: AdminTable, row: Row) {
  const pk = TABLE_PK[table];
  const clean = { ...row };
  delete clean["created_at"];
  delete clean["updated_at"];

  if (clean[pk]) {
    const id = clean[pk] as string;
    const { data: before } = await db(client).from(table).select("*").eq(pk, id).maybeSingle();

    if (!before) {
      const { data: inserted, error } = await db(client).from(table).insert(clean).select().single();
      if (error) throw new Error(error.message);
      return { row: inserted as Row, before: null as Row | null, action: "insert" as const };
    }

    const patch = { ...clean };
    delete patch[pk];
    const { data: updated, error } = await db(client)
      .from(table)
      .update(patch)
      .eq(pk, id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { row: updated as Row, before: before as Row, action: "update" as const };
  }

  delete clean[pk];
  const { data: inserted, error } = await db(client).from(table).insert(clean).select().single();
  if (error) throw new Error(error.message);
  return { row: inserted as Row, before: null as Row | null, action: "insert" as const };
}

export const adminSave = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: string; row: Row }) => ({
    table: assertTable(input.table),
    row: input.row,
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const result = await writeRow(context.supabase, data.table, data.row);
    await recordRevision(context.supabase, context.userId, {
      table: data.table,
      key: String(result.row[TABLE_PK[data.table]]),
      label: labelFor(data.table, result.row),
      action: result.action,
      before: result.before,
      after: result.row,
    });
    return result.row;
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: string; id: string }) => ({
    table: assertTable(input.table),
    id: input.id,
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const pk = TABLE_PK[data.table];
    const { data: before } = await db(context.supabase)
      .from(data.table)
      .select("*")
      .eq(pk, data.id)
      .maybeSingle();

    const { error } = await db(context.supabase).from(data.table).delete().eq(pk, data.id);
    if (error) throw new Error(error.message);

    await recordRevision(context.supabase, context.userId, {
      table: data.table,
      key: data.id,
      label: labelFor(data.table, before as Row | null),
      action: "delete",
      before: (before ?? null) as Row | null,
      after: null,
    });
    return { ok: true };
  });

type Revision = {
  id: string;
  table_name: string;
  record_key: string;
  label: string;
  action: "insert" | "update" | "delete";
  before_value: Row | null;
  after_value: Row | null;
  undone: boolean;
  created_at: string;
};

export const adminHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: rows } = await db(context.supabase)
      .from("content_revisions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    const list = (rows ?? []) as Revision[];
    return {
      canUndo: list.some((r) => !r.undone),
      canRedo: list.some((r) => r.undone),
      entries: list.map((r) => ({
        id: r.id,
        label: r.label,
        table: r.table_name,
        action: r.action,
        undone: r.undone,
        at: r.created_at,
      })),
    };
  });

async function applyRow(client: unknown, table: string, pk: string, row: Row) {
  const clean = { ...row };
  delete clean["updated_at"];
  const { data: exists } = await db(client)
    .from(table)
    .select(pk)
    .eq(pk, clean[pk] as string)
    .maybeSingle();
  if (exists) {
    const patch = { ...clean };
    delete patch[pk];
    delete patch["created_at"];
    await db(client).from(table).update(patch).eq(pk, clean[pk] as string);
  } else {
    await db(client).from(table).insert(clean);
  }
}

export const adminUndo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const c = db(context.supabase);
    const { data: rows } = await c
      .from("content_revisions")
      .select("*")
      .eq("undone", false)
      .order("created_at", { ascending: false })
      .limit(1);
    const rev = (rows ?? [])[0] as Revision | undefined;
    if (!rev) return { ok: false, message: "Nothing to undo." };

    const table = assertTable(rev.table_name);
    const pk = TABLE_PK[table];

    if (rev.action === "insert") {
      await c.from(table).delete().eq(pk, rev.record_key);
    } else if (rev.before_value) {
      await applyRow(context.supabase, table, pk, rev.before_value);
    }

    await c.from("content_revisions").update({ undone: true }).eq("id", rev.id);
    return { ok: true, message: `Undone: ${rev.label}` };
  });

export const adminRedo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const c = db(context.supabase);
    const { data: rows } = await c
      .from("content_revisions")
      .select("*")
      .eq("undone", true)
      .order("created_at", { ascending: true })
      .limit(1);
    const rev = (rows ?? [])[0] as Revision | undefined;
    if (!rev) return { ok: false, message: "Nothing to redo." };

    const table = assertTable(rev.table_name);
    const pk = TABLE_PK[table];

    if (rev.action === "delete") {
      await c.from(table).delete().eq(pk, rev.record_key);
    } else if (rev.after_value) {
      await applyRow(context.supabase, table, pk, rev.after_value);
    }

    await c.from("content_revisions").update({ undone: false }).eq("id", rev.id);
    return { ok: true, message: `Redone: ${rev.label}` };
  });


export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const client = db(context.supabase);

    const today = new Date();
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    const todayStr = iso(today);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const count = async (
      table: string,
      apply?: (q: ReturnType<SupabaseClient["from"]>) => unknown,
    ) => {
      let q = client.from(table).select("id", { count: "exact", head: true }) as never;
      if (apply) q = apply(q as never) as never;
      const { count: c } = (await q) as { count: number | null };
      return c ?? 0;
    };

    const [
      totalBookings,
      newBookings,
      todaysAppointments,
      upcomingAppointments,
      completedProjects,
      portfolioCount,
      blogPosts,
      contactMessages,
      newMessages,
      totalViews,
      viewsThisMonth,
    ] = await Promise.all([
      count("bookings"),
      count("bookings", (q) => (q as never as { eq: (a: string, b: string) => unknown }).eq("status", "new")),
      count("bookings", (q) => (q as never as { eq: (a: string, b: string) => unknown }).eq("preferred_date", todayStr)),
      count("bookings", (q) =>
        (q as never as { gt: (a: string, b: string) => { in: (a: string, b: string[]) => unknown } })
          .gt("preferred_date", todayStr)
          .in("status", ["new", "confirmed"]),
      ),
      count("bookings", (q) => (q as never as { eq: (a: string, b: string) => unknown }).eq("status", "completed")),
      count("portfolio_projects"),
      count("blog_posts"),
      count("messages"),
      count("messages", (q) => (q as never as { eq: (a: string, b: string) => unknown }).eq("status", "new")),
      count("page_views"),
      count("page_views", (q) => (q as never as { gte: (a: string, b: string) => unknown }).gte("created_at", monthAgo)),
    ]);

    const { readCalendarConfig } = await import("@/lib/google-calendar.server");

    return {
      totalBookings,
      newBookings,
      todaysAppointments,
      upcomingAppointments,
      completedProjects,
      portfolioCount,
      blogPosts,
      contactMessages,
      newMessages,
      totalViews,
      viewsThisMonth,
      calendarConnected: Boolean(readCalendarConfig()),
    };
  });
