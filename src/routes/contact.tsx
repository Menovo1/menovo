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
                  <span className="block text-sm font-medium">Appointments</span>
                  <span className="block text-sm text-muted-foreground">
                    Pick a date and time in the form. We confirm every request personally.
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
            <BookingForm />
          </Reveal>

        </div>
      </Section>
    </>
  );
}
