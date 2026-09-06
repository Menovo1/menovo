import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type CalendlyInvitee = { name: string; email: string; timezone: string | null };

export type CalendlyMeeting = {
  uri: string;
  name: string;
  status: string;
  start: string;
  end: string;
  location: string | null;
  joinUrl: string | null;
  invitees: CalendlyInvitee[];
};

export type CalendlyResult = {
  connected: boolean;
  schedulingUrl: string | null;
  error: string | null;
  upcoming: CalendlyMeeting[];
  past: CalendlyMeeting[];
};

export const calendlyMeetings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CalendlyResult> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { fetchCalendlyMeetings } = await import("@/lib/calendly.server");
    return fetchCalendlyMeetings();
  });
