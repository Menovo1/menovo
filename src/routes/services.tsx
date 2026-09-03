import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { pageBackground } from "@/lib/page-backgrounds";
import { cmsText } from "@/content/cms";
import { siteDataQuery, useSite } from "@/lib/site-data";

export const Route = createFileRoute("/services")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteDataQuery),
  head: () => ({
    meta: [
      { title: "Services — Hotel Website Design & Development | MENOVO" },
      {
        name: "description",
        content:
          "Hotel website development, business websites and website maintenance. MENOVO designs premium, mobile-first hotel websites built to convert.",
      },
      { property: "og:title", content: "Services — Hotel Website Design & Development | MENOVO" },
      {
        property: "og:description",
        content: "Premium hotel website development, plus business websites and ongoing maintenance.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://menovo.lovable.app/services" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://menovo.lovable.app/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const data = useSite();
  const c = data.content;

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={cmsText(c, "services", "title")}
        subtitle={cmsText(c, "services", "subtitle")}
        image={pageBackground("services", cmsText(c, "backgrounds", "servicesImageUrl"))}
      />

      <Section>
        {data.services.length === 0 ? (
          <Reveal className="border border-border p-10 sm:p-16 text-center max-w-3xl mx-auto">
            <div className="eyebrow">Coming soon</div>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl">Our services are being published.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Tell us about your property and we'll outline exactly what your hotel needs online.
            </p>
          </Reveal>
        ) : (
          <div className="space-y-20 sm:space-y-28">
            {data.services.map((s, i) => (
              <Reveal key={s.id} className="grid gap-10 md:grid-cols-2 md:items-center">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="eyebrow">{String(i + 1).padStart(2, "0")}</div>
                  <h2 className="mt-4 font-display text-3xl sm:text-4xl leading-[1.1]">{s.title}</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{s.description}</p>
                  {s.features.length > 0 && (
                    <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                      {s.features.map((f) => (
                        <li key={f} className="border-b border-border pb-2">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link to="/contact" className="btn-primary mt-8 inline-block px-9 py-4 text-sm tracking-wide">
                    Get Started
                  </Link>
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  {s.image_url ? (
                    <img
                      src={s.image_url}
                      alt={s.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover border border-border"
                    />
                  ) : (
                    <div className="aspect-[4/3] w-full border border-border bg-secondary" aria-hidden />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <Section
        className="bg-secondary"
        align="center"
        title={cmsText(c, "services", "ctaTitle")}
        subtitle={cmsText(c, "services", "ctaBody")}
      >
        <Reveal className="flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="btn-primary px-9 py-4 text-sm tracking-wide">
            Get Started
          </Link>
          <Link to="/portfolio" className="btn-outline px-9 py-4 text-sm tracking-wide">
            See Our Work
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
