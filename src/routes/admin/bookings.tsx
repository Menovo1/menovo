import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Loader2, RefreshCw, Video, Mail, MessageCircle } from "lucide-react";
import { calendlyMeetings, type CalendlyResult, type CalendlyMeeting } from "@/lib/calendly.functions";
import { adminList } from "@/lib/admin.functions";
import { AdminButton, AdminCard, AdminHeading } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/bookings")({ component: Page });

function fmt(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MeetingCard({ m }: { m: CalendlyMeeting }) {
  return (
    <AdminCard>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">{fmt(m.start)}</div>
          <h3 className="mt-1 font-display text-lg text-white">{m.name}</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[11px] ${
            m.status === "active" ? "bg-gold/15 text-gold" : "bg-white/10 text-white/60"
          }`}
        >
          {m.status}
        </span>
      </div>

      {m.invitees.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm text-white/75">
          {m.invitees.map((i) => (
            <li key={i.email}>
              {i.name} — <span className="text-white/50">{i.email}</span>
              {i.timezone && <span className="text-white/40"> · {i.timezone}</span>}
            </li>
          ))}
        </ul>
      )}

      {m.joinUrl && (
        <a
          href={m.joinUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-2 text-sm text-gold hover:underline"
        >
          <Video className="h-4 w-4" /> Join Zoom meeting
        </a>
      )}
    </AdminCard>
  );
}

type CustomerEnquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string;
  status: string;
  created_at: string;
};

function Page() {
  const fetchMeetings = useServerFn(calendlyMeetings);
  const listMessages = useServerFn(adminList);
  const [data, setData] = useState<CalendlyResult | null>(null);
  const [customers, setCustomers] = useState<CustomerEnquiry[] | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const [meetings, messages] = await Promise.all([
        fetchMeetings({}),
        listMessages({ data: { table: "messages" } }),
      ]);
      setData(meetings);
      setCustomers(messages as unknown as CustomerEnquiry[]);
    } catch {
      setData({ connected: false, schedulingUrl: null, error: "Could not reach Calendly.", upcoming: [], past: [] });
      setCustomers([]);
    }
    setBusy(false);
  }, [fetchMeetings, listMessages]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <AdminHeading
        title="Bookings"
        subtitle="Live appointments from Calendly. Every meeting includes an automatic Zoom link."
      />

      <section className="mb-10">
        <div className="mb-4">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-white/50">Customer enquiries</h2>
          <p className="mt-2 text-sm text-white/55">Project information submitted through the website questionnaire.</p>
        </div>
        {customers === null ? (
          <Loader2 className="h-5 w-5 animate-spin text-gold" />
        ) : customers.length === 0 ? (
          <AdminCard><p className="text-sm text-white/50">No customer enquiries yet.</p></AdminCard>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {customers.map((customer) => (
              <AdminCard key={customer.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl text-white">{customer.name}</h3>
                    <p className="mt-1 text-sm text-white/55">
                      {customer.company || "Business not provided"} · {new Date(customer.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                    {customer.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  {customer.email && (
                    <a href={`mailto:${customer.email}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-white/70 hover:text-gold">
                      <Mail className="h-3.5 w-3.5" /> {customer.email}
                    </a>
                  )}
                  {customer.phone && (
                    <a
                      href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-white/70 hover:text-gold"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> {customer.phone}
                    </a>
                  )}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="whitespace-pre-line text-sm leading-7 text-white/75">{customer.message}</p>
                </div>
              </AdminCard>
            ))}
          </div>
        )}
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <AdminButton variant="ghost" onClick={() => void load()} disabled={busy}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Refresh
        </AdminButton>
        {data?.schedulingUrl && (
          <a
            href={data.schedulingUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Open Calendly
          </a>
        )}
      </div>

      {!data ? (
        <Loader2 className="h-5 w-5 animate-spin text-gold" />
      ) : !data.connected ? (
        <AdminCard>
          <p className="text-sm text-white/70">
            Calendly is not reachable right now. Clients can still schedule — meetings will appear here
            once the connection is restored.
          </p>
          {data.error && <p className="mt-3 text-xs text-red-300">{data.error}</p>}
        </AdminCard>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-[11px] uppercase tracking-[0.2em] text-white/50">Upcoming</h2>
            {data.upcoming.length === 0 ? (
              <p className="text-sm text-white/50">No upcoming meetings.</p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {data.upcoming.map((m) => (
                  <MeetingCard key={m.uri} m={m} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-[11px] uppercase tracking-[0.2em] text-white/50">Past</h2>
            {data.past.length === 0 ? (
              <p className="text-sm text-white/50">Nothing yet.</p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {data.past.map((m) => (
                  <MeetingCard key={m.uri} m={m} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
