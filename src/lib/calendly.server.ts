import type { CalendlyMeeting, CalendlyResult } from "@/lib/calendly.functions";

const GATEWAY = "https://connector-gateway.lovable.dev/calendly";

type Raw = {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  location?: { type?: string; join_url?: string; location?: string } | null;
};

async function call(path: string, params?: Record<string, string>) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const calendlyKey = process.env["CALENDLY_API_KEY"];
  if (!lovableKey || !calendlyKey) throw new Error("Calendly is not connected yet.");

  const url = new URL(`${GATEWAY}${path}`);
  for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": calendlyKey,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Calendly request failed [${res.status}]: ${body}`);
  }
  return res.json();
}

function map(e: Raw): CalendlyMeeting {
  return {
    uri: e.uri,
    name: e.name,
    status: e.status,
    start: e.start_time,
    end: e.end_time,
    location: e.location?.type ?? e.location?.location ?? null,
    joinUrl: e.location?.join_url ?? null,
    invitees: [],
  };
}

export async function fetchCalendlyMeetings(): Promise<CalendlyResult> {
  try {
    const me = (await call("/users/me")) as {
      resource: { uri: string; scheduling_url: string };
    };
    const user = me.resource.uri;
    const now = new Date().toISOString();

    const [upcoming, past] = await Promise.all([
      call("/scheduled_events", { user, count: "30", status: "active", min_start_time: now, sort: "start_time:asc" }),
      call("/scheduled_events", { user, count: "20", max_start_time: now, sort: "start_time:desc" }),
    ]);

    const upcomingList = ((upcoming as { collection: Raw[] }).collection ?? []).map(map);
    const pastList = ((past as { collection: Raw[] }).collection ?? []).map(map);

    await Promise.all(
      upcomingList.map(async (m) => {
        try {
          const id = m.uri.split("/").pop();
          const res = (await call(`/scheduled_events/${id}/invitees`, { count: "5" })) as {
            collection: Array<{ name: string; email: string; timezone: string | null }>;
          };
          m.invitees = (res.collection ?? []).map((i) => ({
            name: i.name,
            email: i.email,
            timezone: i.timezone ?? null,
          }));
        } catch {
          /* invitee lookup is best-effort */
        }
      }),
    );

    return {
      connected: true,
      schedulingUrl: me.resource.scheduling_url,
      error: null,
      upcoming: upcomingList,
      past: pastList,
    };
  } catch (err) {
    return {
      connected: false,
      schedulingUrl: null,
      error: err instanceof Error ? err.message : "Unknown Calendly error",
      upcoming: [],
      past: [],
    };
  }
}

export async function countUpcomingCalendly(): Promise<number | null> {
  try {
    const me = (await call("/users/me")) as { resource: { uri: string } };
    const res = (await call("/scheduled_events", {
      user: me.resource.uri,
      count: "100",
      status: "active",
      min_start_time: new Date().toISOString(),
    })) as { collection: unknown[] };
    return (res.collection ?? []).length;
  } catch {
    return null;
  }
}
