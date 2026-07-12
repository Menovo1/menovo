import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { MessageCircle, Mail, Clock, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MENOVO" },
      { name: "description", content: "Book a call or send a message. MENOVO responds 24/7 via WhatsApp and email." },
      { property: "og:title", content: "Contact MENOVO" },
      { property: "og:description", content: "Let's bring your hospitality business online." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please share your name").max(80),
  phone: z.string().trim().min(6, "Please share a valid phone").max(30),
  service: z.string().trim().min(2).max(60),
  message: z.string().trim().min(1, "Please write a short message").max(1000),
});

function Contact() {
  const [state, setState] = useState<{ status: "idle" | "ok" | "err"; msg?: string }>({ status: "idle" });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setState({ status: "err", msg: parsed.error.issues[0]?.message ?? "Please check the form" });
      return;
    }
    const text = `Hello MENOVO,%0A%0AName: ${encodeURIComponent(parsed.data.name)}%0APhone: ${encodeURIComponent(parsed.data.phone)}%0AService: ${encodeURIComponent(parsed.data.service)}%0A%0AMessage:%0A${encodeURIComponent(parsed.data.message)}`;
    window.open(`https://wa.me/251946471234?text=${text}`, "_blank", "noopener");
    setState({ status: "ok", msg: "Opening WhatsApp… your message is ready to send." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="pt-28">
      <Section eyebrow="Get in touch" title={<>Let's begin your <span className="text-gradient-gold">digital story.</span></>} subtitle="Tell us a little about your business—we'll take it from there.">
        <div className="grid lg:grid-cols-5 gap-8">
          <form onSubmit={onSubmit} className="lg:col-span-3 card-luxe p-8 space-y-5">
            <Field label="Your name" name="name" placeholder="E.g. Asad Je." />
            <Field label="Phone number" name="phone" placeholder="E.g. +251946471234 …" />
            <div>
              <label className="text-xs uppercase tracking-widest text-gold">Service needed</label>
              <select name="service" className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold focus:outline-none">
                <option className="bg-navy" value="Website">Website</option>
                <option className="bg-navy" value="Digital Menu">Digital Menu</option>
                <option className="bg-navy" value="Website + Digital Menu">Website + Digital Menu</option>
                <option className="bg-navy" value="Not sure yet">Not sure yet</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gold">Your message</label>
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us about your project…"
                className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold focus:outline-none resize-y"
              />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 rounded-full btn-gold px-7 py-3.5 text-sm">
              Send via WhatsApp <Send className="h-4 w-4" />
            </button>
            {state.status !== "idle" && (
              <p className={`text-sm ${state.status === "ok" ? "text-gold" : "text-destructive"}`}>{state.msg}</p>
            )}
          </form>

          <aside className="lg:col-span-2 space-y-4">
            <InfoCard icon={MessageCircle} title="WhatsApp" value="+251 946 471 234" href="https://wa.me/251946471234?text=Hello%20MENOVO,%0A%0AI'm%20interested%20in%20your%20services." />
            <InfoCard icon={Mail} title="Email" value="7menovo@gmail.com" href="mailto:7menovo@gmail.com" />
            <InfoCard icon={Clock} title="Working Hours" value="Available 24/7" />
            <div className="card-luxe p-2">
              <div className="rounded-2xl overflow-hidden aspect-video grid place-items-center bg-navy-soft/40 border border-gold/10">
                <div className="text-center">
                  <MapPin className="h-6 w-6 text-gold mx-auto" />
                  <div className="mt-2 text-sm text-muted-foreground">Serving hospitality worldwide</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}

function Field({ label, name, placeholder }: { label: string; name: string; placeholder: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-gold">{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}

function InfoCard({ icon: Icon, title, value, href }: { icon: any; title: string; value: string; href?: string }) {
  const inner = (
    <div className="card-luxe p-6 flex items-center gap-4">
      <div className="h-11 w-11 rounded-xl bg-gold/10 grid place-items-center text-gold"><Icon className="h-5 w-5" /></div>
      <div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{title}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer noopener" className="block">{inner}</a> : inner;
}
