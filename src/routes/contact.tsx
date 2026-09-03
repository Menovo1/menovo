import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { SocialIcons } from "@/components/site/SocialIcons";
import { Reveal } from "@/components/site/Reveal";
import { CalendlyEmbed } from "@/components/site/CalendlyEmbed";
import { ContactForm } from "@/components/site/ContactForm";
import { site, waDigits } from "@/content/site";
import { pageBackground } from "@/lib/page-backgrounds";
import { cmsText } from "@/content/cms";
import { siteDataQuery, useSite } from "@/lib/site-data";
import { Mail, MessageCircle, PhoneCall, Globe } from "lucide-react";

export const Route = createFileRoute("/contact")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteDataQuery),
  head: () => ({
    meta: [
      { title: "Contact MENOVO — Book a Hotel Website Consultation" },
      {
        name: "description",
        content:
          "Book a Zoom consultation with MENOVO, or reach us on WhatsApp and email to start your hotel website project.",
      },
      { property: "og:title", content: "Contact MENOVO — Book a Hotel Website Consultation" },
      { property: "og:description", content: "Pick a time that suits you — we'll meet on Zoom." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://menovo.lovable.app/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://menovo.lovable.app/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const data = useSite();
  const c = data.content;
  const settings = data.settings;

  const whatsapp = settings?.["whatsapp"] || site.whatsappNumber;
  const email = settings?.["email"] || site.email;
  const calendlyUrl = cmsText(c, "contact", "calendlyUrl");

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={cmsText(c, "contact", "title")}
        subtitle={cmsText(c, "contact", "subtitle")}
        image={pageBackground("contact", cmsText(c, "backgrounds", "contactImageUrl"))}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="eyebrow">Direct contact</div>
            <ul className="mt-6 space-y-5">
              <li>
                <a
                  href={`https://wa.me/${waDigits(whatsapp)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-start gap-4"
                >
                  <MessageCircle className="h-5 w-5 text-gold mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium group-hover:text-gold-deep transition-colors">WhatsApp</span>
                    <span className="block text-sm text-muted-foreground">{whatsapp}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="group flex items-start gap-4">
                  <Mail className="h-5 w-5 text-gold mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium group-hover:text-gold-deep transition-colors">Email</span>
                    <span className="block text-sm text-muted-foreground">{email}</span>
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
                    {cmsText(c, "contact", "calendlyNote")}
                  </span>
                </span>
              </li>
            </ul>

            <a
              href={`https://wa.me/${waDigits(whatsapp)}`}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-primary mt-8 inline-block px-9 py-4 text-sm tracking-wide"
            >
              Message us on WhatsApp
            </a>
          </Reveal>

          <Reveal delay={120}>
            <CalendlyEmbed url={calendlyUrl} />
            <SocialIcons links={data.socials} surface="contact" className="mt-8" />
          </Reveal>
        </div>
      </Section>

      <Section className="bg-secondary" eyebrow="Or send a message" title="Tell us about your property.">
        <div className="max-w-2xl">
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
