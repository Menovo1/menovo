import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  path: z.string().trim().min(1).max(200),
  referrer: z.string().trim().max(300).optional().or(z.literal("")),
  sessionId: z.string().trim().max(64).optional().or(z.literal("")),
});

/** Records one public page view. Admin-only to read; write is intentionally open. */
export const trackPageView = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    if (data.path.startsWith("/admin")) return { ok: true };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("page_views").insert({
      path: data.path,
      referrer: data.referrer || null,
      session_id: data.sessionId || null,
    });
    return { ok: true };
  });
