import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { SocialIcons } from "@/components/site/SocialIcons";
import { Reveal } from "@/components/site/Reveal";
import { ContactForm } from "@/components/site/ContactForm";
import { site, waDigits } from "@/content/site";
import { pageBackground } from "@/lib/page-backgrounds";
import { cmsText } from "@/content/cms";
import { useSite } from "@/lib/site-data";
import { Mail, MessageCircle, PhoneCall, Globe } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact MENOVO | Digital Agency" },
      {
        name: "description",
        content:
          "Contact MENOVO to discuss website design, development, redesigns, SEO and digital solutions for your business. Send your project details and we’ll get back to you directly.",
      },
      { property: "og:title", content: "Contact MENOVO — Start Your Project" },
      { property: "og:description", content: "Tell MENOVO about your business website project and we’ll help shape the right digital solution." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.menovo.agency/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.menovo.agency/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const data = useSite();
  const c = data.content;
  const settings = data.settings;

  const whatsapp = settings?.["whatsapp"] || site.whatsappNumber;
  const email = settings?.["email"] || site.email;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={cmsText(c, "contact", "title")}
        subtitle={cmsText(c, "contact", "subtitle")}
        image={pageBackground("contact", cmsText(c, "backgrounds", "contactImageUrl"))}
      />

      <Section>
        <div className="space-y-14">
          <Reveal delay={120}>
            <div className="mx-auto w-full max-w-6xl rounded-3xl border border-border bg-card/30 p-8 sm:p-10 lg:p-12">
              <div className="eyebrow">Start a conversation</div>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">Tell us what you’re building.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">Answer seven quick questions about your project. We’ll review your answers and get back to you directly.</p>
              <ContactForm />
            </div>
          </Reveal>

          <Reveal>
            <div className="mx-auto w-full max-w-6xl">
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
                  <span className="block text-sm text-muted-foreground">Businesses internationally · English</span>
                </span>
              </li>
              <li className="flex items-start gap-4">
                <PhoneCall className="h-5 w-5 text-gold mt-0.5" />
                <span>
                  <span className="block text-sm font-medium">Project enquiries</span>
                  <span className="block text-sm text-muted-foreground">Tell us what you need and we’ll get back to you.</span>
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
            </div>
          </Reveal>

          <Reveal>
            <SocialIcons links={data.socials} surface="contact" className="mt-8" />
          </Reveal>
        </div>
      </Section>

    </>
  );
}
