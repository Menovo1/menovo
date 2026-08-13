import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { processSteps } from "@/content/site";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Our Process — Hotel Website Projects | MENOVO" },
      {
        name: "description",
        content:
          "How a hotel website project runs at MENOVO: discovery, strategy, design, development, review, launch and ongoing support.",
      },
      { property: "og:title", content: "Our Process — Hotel Website Projects | MENOVO" },
      {
        property: "og:description",
        content: "A transparent, seven-step process for hotel website design and development.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://menovo.lovable.app/process" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://menovo.lovable.app/process" }],
  }),
  component: ProcessPage,
});

function ProcessPage() {
  return (
    <>
      <PageHeader
        eyebrow="Process"
        title="From first conversation to launch — and beyond."
        subtitle="A calm, transparent process designed around how hotels actually work."
      />

      <Section>
        <ol className="relative border-l border-border max-w-3xl">
          {processSteps.map((s, i) => (
            <Reveal key={s.step} delay={i * 70} as="li" className="relative pl-8 sm:pl-12 pb-12 last:pb-0">
              <span className="absolute left-0 top-2 -translate-x-1/2 h-2 w-2 rounded-full bg-gold" />
              <div className="eyebrow">{s.step}</div>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl">{s.title}</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section className="bg-secondary" align="center" eyebrow="Ready when you are" title="Start your hotel website project.">
        <Reveal className="flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="btn-primary px-8 py-4 text-sm tracking-wide">
            Get Started
          </Link>
          <Link to="/services" className="btn-outline px-8 py-4 text-sm tracking-wide">
            See Services
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
