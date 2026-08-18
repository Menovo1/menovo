import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { submitMessage } from "@/lib/public-content.functions";

const field =
  "mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold transition-colors";

export function ContactForm() {
  const send = useServerFn(submitMessage);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await send({ data: form });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
    setBusy(false);
  };

  if (done) {
    return (
      <div className="border border-border p-8">
        <h3 className="font-display text-2xl">Message received.</h3>
        <p className="mt-3 text-sm text-muted-foreground">We'll reply to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          Name
          <input required minLength={2} className={field} value={form.name} onChange={set("name")} />
        </label>
        <label className="block text-sm">
          Email
          <input required type="email" className={field} value={form.email} onChange={set("email")} />
        </label>
        <label className="block text-sm">
          Hotel / Company
          <input className={field} value={form.company} onChange={set("company")} />
        </label>
        <label className="block text-sm">
          WhatsApp / Phone
          <input className={field} value={form.phone} onChange={set("phone")} />
        </label>
      </div>
      <label className="block text-sm">
        Message
        <textarea required minLength={2} rows={5} className={field} value={form.message} onChange={set("message")} />
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary inline-flex items-center gap-2 px-9 py-4 text-sm">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Send message
      </button>
    </form>
  );
}
