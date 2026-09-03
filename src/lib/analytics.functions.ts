import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  path: z.string().trim().min(1).max(200),
  referrer: z.string().trim().max(300).optional().or(z.literal("")),
  sessionId: z.string().trim().max(64).optional().or(z.literal("")),
});

function deviceFrom(ua: string): string {
  const s = ua.toLowerCase();
  if (/ipad|tablet/.test(s)) return "tablet";
  if (/mobi|android|iphone/.test(s)) return "mobile";
  if (!s) return "unknown";
  return "desktop";
}

function sourceFrom(referrer: string): string {
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (/google\./.test(host)) return "google";
    if (/(facebook|fb)\./.test(host)) return "facebook";
    if (/instagram\./.test(host)) return "instagram";
    if (/(t\.co|twitter|x)\.com$/.test(host)) return "twitter";
    if (/tiktok\./.test(host)) return "tiktok";
    if (/linkedin\./.test(host)) return "linkedin";
    if (/whatsapp|wa\.me/.test(host)) return "whatsapp";
    return host;
  } catch {
    return "direct";
  }
}

/** Records one public page view. Admin-only to read; write is intentionally open. */
export const trackPageView = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    if (data.path.startsWith("/admin")) return { ok: true };
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const ua = getRequestHeader("user-agent") ?? "";
    const country =
      getRequestHeader("cf-ipcountry") ?? getRequestHeader("x-vercel-ip-country") ?? null;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("page_views").insert({
      path: data.path,
      referrer: data.referrer || null,
      session_id: data.sessionId || null,
      user_agent: ua || null,
      device: deviceFrom(ua),
      country,
      source: sourceFrom(data.referrer || ""),
    });
    return { ok: true };
  });

type ViewRow = {
  path: string;
  referrer: string | null;
  session_id: string | null;
  device: string | null;
  country: string | null;
  source: string | null;
  created_at: string;
};

function tally(rows: ViewRow[], key: (r: ViewRow) => string | null) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = (key(r) || "unknown").trim() || "unknown";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/** Aggregated analytics for the admin dashboard. */
export const analyticsOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ days: z.number().int().min(1).max(365) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: allowed } = await (
      context.supabase as unknown as {
        rpc: (n: string, a: Record<string, unknown>) => Promise<{ data: boolean | null }>;
      }
    ).rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!allowed) throw new Error("Forbidden");

    const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000).toISOString();
    const { data: rows, error } = await (context.supabase as never as {
      from: (t: string) => {
        select: (s: string) => {
          gte: (c: string, v: string) => {
            order: (c: string, o: { ascending: boolean }) => Promise<{ data: ViewRow[] | null; error: { message: string } | null }>;
          };
        };
      };
    })
      .from("page_views")
      .select("path, referrer, session_id, device, country, source, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const views = rows ?? [];
    const visitors = new Set(views.map((v) => v.session_id ?? `${v.path}-${v.created_at}`)).size;

    const byDay = new Map<string, number>();
    for (let i = data.days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      byDay.set(d, 0);
    }
    for (const v of views) {
      const d = v.created_at.slice(0, 10);
      if (byDay.has(d)) byDay.set(d, (byDay.get(d) ?? 0) + 1);
    }

    return {
      totalViews: views.length,
      visitors,
      days: data.days,
      timeline: [...byDay.entries()].map(([date, value]) => ({ date, value })),
      topPages: tally(views, (r) => r.path).slice(0, 10),
      sources: tally(views, (r) => r.source ?? (r.referrer ? "referral" : "direct")).slice(0, 8),
      devices: tally(views, (r) => r.device).slice(0, 5),
      countries: tally(views, (r) => r.country).slice(0, 8),
    };
  });
