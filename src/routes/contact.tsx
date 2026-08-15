import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { BookingForm } from "@/components/site/BookingForm";
import { site, whatsappLink, emailLink } from "@/content/site";
import { Mail, MessageCircle, PhoneCall, Globe } from "lucide-react";


export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact MENOVO — Start a Hotel Website Project" },
      {
        name: "description",
        content:
          "Talk to MENOVO about your hotel website. Reach us on WhatsApp or email, or send an enquiry and we'll arrange a call.",
      },
      { property: "og:title", content: "Contact MENOVO — Start a Hotel Website Project" },
      { property: "og:description", content: "WhatsApp, email or send an enquiry to start your hotel website." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://menovo.lovable.app/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://menovo.lovable.app/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Book an appointment."
        subtitle="Request a consultation and we'll confirm the meeting personally on WhatsApp or Zoom."
      />


      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="eyebrow">Direct contact</div>
            <ul className="mt-6 space-y-5">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noreferrer noopener" className="group flex items-start gap-4">
                  <MessageCircle className="h-5 w-5 text-gold mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium group-hover:text-gold-deep transition-colors">WhatsApp</span>
                    <span className="block text-sm text-muted-foreground">{site.whatsappNumber}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={emailLink()} className="group flex items-start gap-4">
                  <Mail className="h-5 w-5 text-gold mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium group-hover:text-gold-deep transition-colors">Email</span>
                    <span className="block text-sm text-muted-foreground">{site.email}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Globe className="h-5 w-5 text-gold mt-0.5" />
                <span>
                  <span className="block text-sm font-medium">Working worldwide</span>
                  <span className="block text-sm text-muted-foreground">Hotels internationally · English</span>
                </span>
              </li>
              <li className="flex items-start gap-4">
                <PhoneCall className="h-5 w-5 text-gold mt-0.5" />
                <span>
                  <span className="block text-sm font-medium">Book a call</span>
                  <span className="block text-sm text-muted-foreground">
                    Tick “Book a call” in the form, or message us on WhatsApp and we'll agree a time
                    that suits you.
                  </span>
                </span>
              </li>
            </ul>

            <div className="mt-10 border-t border-border pt-6">
              <div className="eyebrow">Social media</div>
              <p className="mt-3 text-sm text-muted-foreground">Coming soon.</p>
            </div>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-primary mt-8 inline-block px-9 py-4 text-sm tracking-wide"
            >
              Message us on WhatsApp
            </a>
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={submit} className="border border-border p-8 sm:p-10 space-y-5">
              <div className="eyebrow">Project enquiry</div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Your name</span>
                  <input className={`mt-2 ${field}`} value={form.name} onChange={set("name")} required />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Hotel name</span>
                  <input className={`mt-2 ${field}`} value={form.hotel} onChange={set("hotel")} />
                </label>
              </div>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
                <input type="email" className={`mt-2 ${field}`} value={form.email} onChange={set("email")} />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Message</span>
                <textarea rows={5} className={`mt-2 ${field}`} value={form.message} onChange={set("message")} required />
              </label>
              <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <input type="checkbox" checked={form.call} onChange={set("call")} className="accent-[var(--gold)]" />
                I'd like to book a call
              </label>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" className="btn-primary w-full px-9 py-4 text-sm tracking-wide">
                Send enquiry via WhatsApp
              </button>
              <p className="text-xs text-muted-foreground">
                Your message opens in WhatsApp so you can send it directly to our team.
              </p>
            </form>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
