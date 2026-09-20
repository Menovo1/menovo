import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { pageBackground } from "@/lib/page-backgrounds";
import { cmsText } from "@/content/cms";
import { useSite } from "@/lib/site-data";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Digital Agency Portfolio | MENOVO" },
      {
        name: "description",
        content:
          "Explore business website design and development projects by MENOVO, including premium business websites built to look exceptional and convert visitors into customers.",
      },
      { business: "og:title", content: "Selected Work — Digital Experiences | MENOVO" },
      { business: "og:description", content: "See selected business website design and business web development work by MENOVO." },
      { business: "og:type", content: "website" },
      { business: "og:url", content: "https://www.menovo.agency/portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.menovo.agency/portfolio" }],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const data = useSite();
  const c = data.content;

  return (
    <>
      <PageHeader
        eyebrow="Selected Work"
        title={cmsText(c, "portfolio", "title")}
        subtitle={cmsText(c, "portfolio", "subtitle")}
        image={pageBackground("portfolio", cmsText(c, "backgrounds", "portfolioImageUrl"))}
      />

      <Section>
        {data.portfolio.length === 0 ? (
          <Reveal className="border border-border p-10 sm:p-16 text-center max-w-3xl mx-auto">
            <div className="eyebrow">Coming soon</div>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl">{cmsText(c, "portfolio", "emptyTitle")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {cmsText(c, "portfolio", "emptyBody")}
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
            {data.portfolio.map((p, i) => (
              <Reveal key={p.id} delay={i * 80} className="card-editorial overflow-hidden">
                {p.video_url ? (
                  <video
                    className="aspect-[16/10] w-full object-cover"
                    src={p.video_url}
                    poster={p.cover_image_url ?? undefined}
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                ) : p.cover_image_url ? (
                  <img
                    src={p.cover_image_url}
                    alt={`${p.title} website by MENOVO`}
                    className="aspect-[16/10] w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
                <div className="p-8">
                  {p.category && <div className="eyebrow">{p.category}</div>}
                  <h2 className="mt-3 font-display text-2xl">{p.title}</h2>
                  {p.company && <div className="mt-1 text-sm text-muted-foreground">{p.company}</div>}
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                  {p.website_url && (
                    <a
                      href={p.website_url}
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
