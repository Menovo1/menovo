import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck, Loader2 } from "lucide-react";
import { createBooking } from "@/lib/bookings.functions";
import { bookingSchema } from "@/lib/booking-schema";

const fallbackZones = [
  "UTC",
  "Africa/Addis_Ababa",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Singapore",
  "America/New_York",
  "America/Los_Angeles",
];

function useTimeZones() {
  return useMemo(() => {
    const supported = (
      Intl as unknown as { supportedValuesOf?: (k: string) => string[] }
    ).supportedValuesOf;
    try {
      const zones = supported?.("timeZone");
      if (zones && zones.length) return zones;
    } catch {
      /* ignore */
    }
    return fallbackZones;
  }, []);
}

type Confirmation = { bookingRef: string; date: string; time: string; timeZone: string };

export function BookingForm() {
  const submitBooking = useServerFn(createBooking);
  const zones = useTimeZones();

  const [form, setForm] = useState(() => ({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    timeZone: "",
    message: "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const detectedZone =
    form.timeZone ||
    (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC");

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value } = e.target;
      setForm((f) => ({ ...f, [key]: value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setFailure("");

    const payload = { ...form, timeZone: detectedZone };
    const parsed = bookingSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    const chosen = new Date(`${parsed.data.date}T${parsed.data.time}`);
    if (Number.isNaN(chosen.getTime()) || chosen.getTime() < Date.now() - 60_000) {
      setErrors({ date: "Please choose a date and time in the future." });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const result = await submitBooking({ data: parsed.data });
      setConfirmation(result as Confirmation);
    } catch {
      setFailure("Something went wrong while sending your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full rounded-2xl border border-input bg-background px-4 py-3 text-base sm:text-sm outline-none transition-colors focus:border-gold";
  const labelText = "text-xs uppercase tracking-widest text-muted-foreground";

  if (confirmation) {
    return (
      <div className="rounded-3xl border border-border p-8 sm:p-10 text-center">
        <CalendarCheck className="mx-auto h-8 w-8 text-gold" />
        <h3 className="mt-5 font-display text-2xl sm:text-3xl">
          Your appointment request has been received.
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          We'll review it and confirm the meeting with you on WhatsApp or email.
        </p>
        <dl className="mt-8 grid gap-3 text-sm text-left mx-auto max-w-sm">
          {[
            ["Booking ID", confirmation.bookingRef],
            ["Requested date", confirmation.date],
            ["Requested time", confirmation.time.slice(0, 5)],
            ["Time zone", confirmation.timeZone],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-border p-6 sm:p-10 space-y-5">
      <div className="eyebrow">Book an appointment</div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelText}>Full name</span>
          <input className={`mt-2 ${field}`} value={form.fullName} onChange={set("fullName")} autoComplete="name" />
          {errors["fullName"] && <p className="mt-1 text-xs text-destructive">{errors["fullName"]}</p>}
        </label>
        <label className="block">
          <span className={labelText}>Hotel / company</span>
          <input className={`mt-2 ${field}`} value={form.company} onChange={set("company")} autoComplete="organization" />
        </label>
        <label className="block">
          <span className={labelText}>Email</span>
          <input type="email" inputMode="email" className={`mt-2 ${field}`} value={form.email} onChange={set("email")} autoComplete="email" />
          {errors["email"] && <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>}
        </label>
        <label className="block">
          <span className={labelText}>WhatsApp / phone</span>
          <input type="tel" inputMode="tel" className={`mt-2 ${field}`} value={form.phone} onChange={set("phone")} autoComplete="tel" />
          {errors["phone"] && <p className="mt-1 text-xs text-destructive">{errors["phone"]}</p>}
        </label>
        <label className="block">
          <span className={labelText}>Preferred date</span>
          <input type="date" className={`mt-2 ${field}`} value={form.date} onChange={set("date")} />
          {errors["date"] && <p className="mt-1 text-xs text-destructive">{errors["date"]}</p>}
        </label>
        <label className="block">
          <span className={labelText}>Preferred time</span>
          <input type="time" className={`mt-2 ${field}`} value={form.time} onChange={set("time")} />
          {errors["time"] && <p className="mt-1 text-xs text-destructive">{errors["time"]}</p>}
        </label>
      </div>

      <label className="block">
        <span className={labelText}>Time zone</span>
        <select className={`mt-2 ${field}`} value={detectedZone} onChange={set("timeZone")}>
          {(zones.includes(detectedZone) ? zones : [detectedZone, ...zones]).map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
        {errors["timeZone"] && <p className="mt-1 text-xs text-destructive">{errors["timeZone"]}</p>}
      </label>

      <label className="block">
        <span className={labelText}>Project / message</span>
        <textarea rows={4} className={`mt-2 ${field}`} value={form.message} onChange={set("message")} />
      </label>

      {failure && <p className="text-sm text-destructive">{failure}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full px-9 py-4 text-sm tracking-wide disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending request…
          </>
        ) : (
          "Request appointment"
        )}
      </button>
      <p className="text-xs text-muted-foreground">
        We'll reply personally to confirm. Meetings run on WhatsApp or Zoom.
      </p>
    </form>
  );
}
