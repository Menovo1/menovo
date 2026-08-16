import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, ExternalLink, Loader2, MessageCircle, RefreshCw } from "lucide-react";
import { listBookings, updateBookingStatus, retryCalendar } from "@/lib/bookings.functions";
import { BOOKING_STATUSES, CALENDAR_STATUS_LABELS } from "@/lib/booking-schema";
import { AdminButton, AdminCard, AdminHeading } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/bookings")({
  component: BookingsPage,
});

type Booking = {
  id: string;
  booking_ref: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  time_zone: string;
  message: string | null;
  status: string;
  calendar_status: string;
  calendar_link: string | null;
  calendar_error: string | null;
  created_at: string;
};

function BookingsPage() {
  const fetchBookings = useServerFn(listBookings);
  const setStatus = useServerFn(updateBookingStatus);
  const retry = useServerFn(retryCalendar);

  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setBookings((await fetchBookings({})) as Booking[]);
    } catch {
      setError("Could not load bookings.");
      setBookings([]);
    }
  }, [fetchBookings]);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (fn: () => Promise<unknown>, id: string) => {
    setBusyId(id);
    setError("");
    try {
      await fn();
      await load();
    } catch {
      setError("Action failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const visible = (bookings ?? []).filter((b) => filter === "all" || b.status === filter);

  return (
    <div>
      <AdminHeading title="Bookings" subtitle="Every appointment request, with calendar status." />

      <div className="flex flex-wrap items-center gap-2">
        {["all", ...BOOKING_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-2 text-xs capitalize transition-colors ${
              filter === s ? "bg-gold text-[#00002B]" : "border border-white/20 text-white/65 hover:text-gold"
            }`}
          >
            {s}
          </button>
        ))}
        <AdminButton variant="ghost" onClick={() => void load()} className="ml-auto">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </AdminButton>
      </div>

      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

      {bookings === null ? (
        <Loader2 className="mt-6 h-5 w-5 animate-spin text-gold" />
      ) : (
        <div className="mt-6 space-y-3">
          {visible.map((b) => (
            <AdminCard key={b.id}>
              <button
                className="flex w-full flex-wrap items-center justify-between gap-4 text-left"
                onClick={() => setOpen(open === b.id ? null : b.id)}
              >
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">{b.booking_ref}</div>
                  <div className="mt-1 font-medium text-white">
                    {b.full_name} <span className="text-white/50">— {b.company ?? "—"}</span>
                  </div>
                  <div className="mt-1 text-xs text-white/55">
                    {b.preferred_date} · {b.preferred_time.slice(0, 5)} ({b.time_zone})
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                    {b.status}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-white/60">
                    {CALENDAR_STATUS_LABELS[b.calendar_status] ?? b.calendar_status}
                  </span>
                </div>
              </button>

              {open === b.id && (
                <div className="mt-5 border-t border-white/10 pt-5">
                  <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    {[
                      ["Email", b.email],
                      ["WhatsApp / phone", b.phone],
                      ["Requested", new Date(b.created_at).toLocaleString()],
                      ["Time zone", b.time_zone],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-white/10 pb-2">
                        <dt className="text-white/50">{k}</dt>
                        <dd className="text-right text-white/90">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {b.message && <p className="mt-4 text-sm leading-relaxed text-white/75">{b.message}</p>}
                  {b.calendar_error && (
                    <p className="mt-3 text-xs text-red-300">Calendar error: {b.calendar_error}</p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    {BOOKING_STATUSES.filter((s) => s !== b.status).map((s) => (
                      <AdminButton
                        key={s}
                        variant="ghost"
                        disabled={busyId === b.id}
                        onClick={() => void act(() => setStatus({ data: { id: b.id, status: s } }), b.id)}
                      >
                        Mark {s}
                      </AdminButton>
                    ))}
                    <a
                      href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-medium text-[#00002B]"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                    {b.calendar_link && (
                      <a
                        href={b.calendar_link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs text-white/80 hover:text-gold"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Calendar event
                      </a>
                    )}
                    {b.calendar_status !== "created" && (
                      <AdminButton
                        variant="ghost"
                        disabled={busyId === b.id}
                        onClick={() => void act(() => retry({ data: { id: b.id } }), b.id)}
                      >
                        <CalendarDays className="h-3.5 w-3.5" /> Retry calendar
                      </AdminButton>
                    )}
                  </div>
                </div>
              )}
            </AdminCard>
          ))}
          {visible.length === 0 && <p className="text-sm text-white/50">No bookings here.</p>}
        </div>
      )}
    </div>
  );
}
