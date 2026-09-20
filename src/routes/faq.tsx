import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { pageBackground } from "@/lib/page-backgrounds";
import { cmsText } from "@/content/cms";
import { useSite } from "@/lib/site-data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Website Design FAQ | MENOVO" },
      {
        name: "description",
        content:
          "Answers to common questions about website design, development, SEO, mobile-friendly experiences, integrations, maintenance and working with MENOVO.",
      },
      { business: "og:title", content: "FAQ — Business Website Development | MENOVO" },
      {
        business: "og:description",
        content: "Answers about business website design, development, SEO, bookings, maintenance and working with MENOVO.",
      },
      { business: "og:type", content: "website" },
      { business: "og:url", content: "https://www.menovo.agency/faq" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.menovo.agency/faq" }],
  }),
  component: FaqPage,
});

function FaqPage() {
  const data = useSite();
  const c = data.content;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title={cmsText(c, "faq", "title")}
        subtitle={cmsText(c, "faq", "subtitle")}
        image={pageBackground("faq", cmsText(c, "backgrounds", "faqImageUrl"))}
      />

      <Section>
        <div className="max-w-3xl border-t border-border">
          {data.faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.id} delay={Math.min(i, 6) * 40} className="border-b border-border">
                <h2>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                  >
                    <span className="font-display text-xl sm:text-2xl group-hover:text-gold-deep transition-colors">
                      {f.question}
                    </span>
                    <Plus
                      className={`h-5 w-5 shrink-0 mt-1 text-gold transition-transform duration-500 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                </h2>
                <div
                  className={`overflow-hidden transition-[max-height,opacity] duration-500 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="pb-6 pr-10 text-muted-foreground leading-relaxed">{f.answer}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={150} className="mt-14 max-w-3xl">
          <p className="text-muted-foreground">Still have a question about your business?</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-primary px-9 py-4 text-sm tracking-wide">
              Get Started
            </Link>
            <Link to="/services" className="btn-outline px-9 py-4 text-sm tracking-wide">
              See Services
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
