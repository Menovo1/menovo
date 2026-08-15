import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, CalendarDays, ExternalLink, Loader2, MessageCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { listBookings, isAdmin, claimAdmin, updateBookingStatus, retryCalendar } from "@/lib/bookings.functions";
import { BOOKING_STATUSES, CALENDAR_STATUS_LABELS } from "@/lib/booking-schema";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "MENOVO Admin — Bookings" },
      { name: "description", content: "Private MENOVO admin area for managing appointment bookings." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
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

function AdminPage() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="pt-32 pb-20">
      <Section eyebrow="Admin" title="Bookings">
        {!ready ? (
          <Loader2 className="h-5 w-5 animate-spin text-gold" />
        ) : signedIn ? (
          <BookingsDashboard />
        ) : (
          <SignIn />
        )}
        <div className="mt-12">
          <Link to="/" className="btn-outline px-6 py-3 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to MENOVO
          </Link>
        </div>
      </Section>
    </div>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    setBusy(false);
  };

  const field =
    "w-full rounded-2xl border border-input bg-background px-4 py-3 text-base sm:text-sm outline-none focus:border-gold";

  return (
    <form onSubmit={submit} className="max-w-sm space-y-4 rounded-3xl border border-border p-8">
      <p className="text-sm text-muted-foreground">Sign in to manage appointment requests.</p>
      <input className={field} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className={field} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button className="btn-primary w-full px-8 py-3 text-sm" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
      </button>
    </form>
  );
}

function BookingsDashboard() {
  const fetchBookings = useServerFn(listBookings);
  const checkAdmin = useServerFn(isAdmin);
  const takeAdmin = useServerFn(claimAdmin);
  const setStatus = useServerFn(updateBookingStatus);
  const retry = useServerFn(retryCalendar);

  const [admin, setAdmin] = useState<boolean | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await checkAdmin({});
      setAdmin(result.admin);
      if (result.admin) setBookings((await fetchBookings({})) as Booking[]);
    } catch {
      setError("Could not load bookings.");
    }
  }, [checkAdmin, fetchBookings]);

  useEffect(() => {
    void load();
  }, [load]);

  if (admin === null) return <Loader2 className="h-5 w-5 animate-spin text-gold" />;

  if (!admin) {
    return (
      <div className="max-w-md space-y-4">
        <p className="text-sm text-muted-foreground">
          This account has no admin access. If you are the first MENOVO owner, claim admin access now.
        </p>
        <button
          className="btn-primary px-7 py-3 text-sm"
          onClick={async () => {
            const res = await takeAdmin({});
            if (res.admin) void load();
            else setError(res.reason ?? "Not allowed.");
          }}
        >
          Claim admin access
        </button>
        <button className="btn-outline px-7 py-3 text-sm" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

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

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{bookings.length} booking(s)</p>
        <button className="btn-outline px-5 py-2 text-xs" onClick={() => void load()}>
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-3xl border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              {["Client", "Hotel", "Date", "Time", "Status", "Calendar", "Created"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                className="border-t border-border cursor-pointer hover:bg-secondary/60 transition-colors"
                onClick={() => setOpen(open === b.id ? null : b.id)}
              >
                <td className="px-4 py-3">{b.full_name}</td>
                <td className="px-4 py-3">{b.company ?? "—"}</td>
                <td className="px-4 py-3">{b.preferred_date}</td>
                <td className="px-4 py-3">{b.preferred_time.slice(0, 5)} <span className="text-muted-foreground">{b.time_zone}</span></td>
                <td className="px-4 py-3 capitalize">{b.status}</td>
                <td className="px-4 py-3">{CALENDAR_STATUS_LABELS[b.calendar_status] ?? b.calendar_status}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={7}>No bookings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {bookings
        .filter((b) => b.id === open)
        .map((b) => (
          <div key={b.id} className="mt-8 rounded-3xl border border-border p-6 sm:p-8">
            <div className="eyebrow">{b.booking_ref}</div>
            <h3 className="mt-3 font-display text-2xl">{b.full_name} — {b.company ?? "—"}</h3>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2 text-sm">
              {[
                ["Email", b.email],
                ["WhatsApp / phone", b.phone],
                ["Date", b.preferred_date],
                ["Time", `${b.preferred_time.slice(0, 5)} (${b.time_zone})`],
                ["Status", b.status],
                ["Calendar", CALENDAR_STATUS_LABELS[b.calendar_status] ?? b.calendar_status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-border pb-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium text-right">{v}</dd>
                </div>
              ))}
            </dl>
            {b.message && <p className="mt-5 text-sm leading-relaxed text-foreground/80">{b.message}</p>}
            {b.calendar_error && <p className="mt-3 text-xs text-destructive">Calendar error: {b.calendar_error}</p>}

            <div className="mt-6 flex flex-wrap gap-3">
              {BOOKING_STATUSES.filter((s) => s !== b.status).map((s) => (
                <button
                  key={s}
                  disabled={busyId === b.id}
                  className="btn-outline px-5 py-2.5 text-xs capitalize"
                  onClick={() => void act(() => setStatus({ data: { id: b.id, status: s } }), b.id)}
                >
                  Mark {s}
                </button>
              ))}
              <a
                href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-gold px-5 py-2.5 text-xs"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp client
              </a>
              {b.calendar_link && (
                <a href={b.calendar_link} target="_blank" rel="noreferrer noopener" className="btn-outline px-5 py-2.5 text-xs">
                  <ExternalLink className="h-3.5 w-3.5" /> Open in Google Calendar
                </a>
              )}
              {b.calendar_status !== "created" && (
                <button
                  disabled={busyId === b.id}
                  className="btn-outline px-5 py-2.5 text-xs"
                  onClick={() => void act(() => retry({ data: { id: b.id } }), b.id)}
                >
                  <CalendarDays className="h-3.5 w-3.5" /> Retry calendar
                </button>
              )}
            </div>
          </div>
        ))}

      <button className="btn-outline mt-8 px-6 py-2.5 text-xs" onClick={() => supabase.auth.signOut()}>
        Sign out
      </button>
    </div>
  );
}
