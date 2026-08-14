import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { portfolioItems } from "@/content/site";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Selected Work — Hotel Websites | MENOVO" },
      {
        name: "description",
        content:
          "Selected hotel website projects by MENOVO. Our first case studies and project films are coming soon.",
      },
      { property: "og:title", content: "Selected Work — Hotel Websites | MENOVO" },
      { property: "og:description", content: "Hotel website projects by MENOVO — coming soon." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://menovo.lovable.app/portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://menovo.lovable.app/portfolio" }],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected Work"
        title="A portfolio built one hotel at a time."
        subtitle="We publish work only once it is live and the property is happy to be shown."
      />

      <Section>
        {portfolioItems.length === 0 ? (
          <Reveal className="border border-border p-10 sm:p-16 text-center max-w-3xl mx-auto">
            <div className="eyebrow">Coming soon</div>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl">Our hotel projects are on their way.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Case studies, project films and live website previews will appear here as our current
              hotel projects go live.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="btn-primary px-9 py-4 text-sm tracking-wide">
                Get Started
              </Link>
              <Link to="/services" className="btn-outline px-9 py-4 text-sm tracking-wide">
                See Services
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2">
            {portfolioItems.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80} className="card-editorial overflow-hidden">
                {p.video ? (
                  <video
                    className="aspect-[16/10] w-full object-cover"
                    src={p.video}
                    poster={p.image}
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                ) : p.image ? (
                  <img src={p.image} alt={`${p.client} website by MENOVO`} className="aspect-[16/10] w-full object-cover" loading="lazy" />
                ) : null}
                <div className="p-8">
                  <div className="eyebrow">{p.category}</div>
                  <h2 className="mt-3 font-display text-2xl">{p.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-underline mt-5 inline-block text-sm text-foreground"
                    >
                      Visit website
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
