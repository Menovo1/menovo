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

export const adminSave = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: string; row: Row }) => ({
    table: assertTable(input.table),
    row: input.row,
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const pk = TABLE_PK[data.table];
    const row = { ...data.row };
    delete row["created_at"];
    delete row["updated_at"];

    if (row[pk]) {
      const id = row[pk];
      delete row[pk];
      const { data: updated, error } = await db(context.supabase)
        .from(data.table)
        .update(row)
        .eq(pk, id as string)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated as Row;
    }

    delete row[pk];
    const { data: inserted, error } = await db(context.supabase)
      .from(data.table)
      .insert(row)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return inserted as Row;
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: string; id: string }) => ({
    table: assertTable(input.table),
    id: input.id,
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await db(context.supabase)
      .from(data.table)
      .delete()
      .eq(TABLE_PK[data.table], data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
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
