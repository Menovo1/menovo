import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { HeroVideo } from "@/components/site/HeroVideo";
import { site } from "@/content/site";
import { cmsPairs, cmsText } from "@/content/cms";
import { siteDataQuery, useSite } from "@/lib/site-data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteDataQuery),
  head: () => ({
    meta: [
      { title: "MENOVO — Hotel Web Design & Development Agency" },
      {
        name: "description",
        content:
          "MENOVO is a premium web-development agency specialized exclusively in hotel websites. Elegant, mobile-first digital experiences for hotels worldwide.",
      },
      { property: "og:title", content: "MENOVO — Hotel Web Design & Development Agency" },
      {
        property: "og:description",
        content:
          "Premium websites designed and developed exclusively for hotels. From Table to Screen.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://menovo.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://menovo.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "MENOVO",
          description:
            "Premium web-development agency specialized exclusively in hotel websites.",
          url: "https://menovo.lovable.app",
          email: "info@menovo.agency",
          telephone: "+251946471234",
          areaServed: "Worldwide",
          serviceType: "Hotel website design and development",
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const data = useSite();
  const c = data.content;

  const problems = cmsPairs(c, "home", "problems");
  const solutions = cmsPairs(c, "home", "solutions");
  const values = cmsPairs(c, "home", "values");
  const why = cmsPairs(c, "home", "why");
  const tagline = cmsText(c, "identity", "tagline") || site.tagline;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92svh] flex items-end overflow-hidden">
        <HeroVideo
          src={cmsText(c, "backgrounds", "homeVideoUrl") || undefined}
          poster={pageBackground("home", cmsText(c, "backgrounds", "homePosterUrl"))}
        />
        <div className="relative w-full mx-auto max-w-6xl px-6 sm:px-8 pb-20 sm:pb-28 pt-40">
          <div
            className="text-[10px] uppercase tracking-[0.32em] text-white/80 animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            {cmsText(c, "home", "heroEyebrow")}
          </div>
          <h1 className="mt-6 font-display text-white text-[2.6rem] leading-[1.05] sm:text-6xl md:text-7xl max-w-4xl">
            <span className="block animate-fade-up" style={{ animationDelay: "0.3s" }}>
              {cmsText(c, "home", "heroLine1")}
            </span>
            <span className="block italic text-white/90 animate-fade-up" style={{ animationDelay: "0.5s" }}>
              {cmsText(c, "home", "heroLine2")}
            </span>
          </h1>
          <p
            className="mt-6 max-w-xl text-white/80 text-base sm:text-lg leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.7s" }}
          >
            {cmsText(c, "home", "heroSubtitle")}
          </p>
          <div
            className="mt-9 flex flex-wrap items-center gap-3 animate-fade-up"
            style={{ animationDelay: "0.9s" }}
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white text-navy px-9 py-4 text-sm tracking-wide transition-all duration-400 hover:bg-gold hover:-translate-y-px"
            >
              {cmsText(c, "home", "heroPrimaryLabel")}{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/services" className="btn-light px-9 py-4 text-sm tracking-wide">
              {cmsText(c, "home", "heroSecondaryLabel")}
            </Link>
          </div>
          <div
            className="mt-12 text-[10px] uppercase tracking-[0.34em] text-white/55 animate-fade-in"
            style={{ animationDelay: "1.2s" }}
          >
            {tagline}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <Section
        eyebrow={cmsText(c, "home", "problemEyebrow")}
        title={cmsText(c, "home", "problemTitle")}
        subtitle={cmsText(c, "home", "problemSubtitle")}
      >
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 border border-border">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 70} className="bg-background p-8">
              <div className="eyebrow">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-4 font-display text-2xl">{p.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* SOLUTION */}
      <Section
        className="bg-secondary"
        eyebrow={cmsText(c, "home", "solutionEyebrow")}
        title={cmsText(c, "home", "solutionTitle")}
        subtitle={cmsText(c, "home", "solutionSubtitle")}
      >
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <div className="rule-gold w-12" />
              <h3 className="mt-5 font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-12">
          <Link to="/services" className="link-underline text-sm tracking-wide text-foreground">
            Explore our services
          </Link>
        </Reveal>
      </Section>

      {/* FEATURED WORK */}
      {data.portfolio.length > 0 && (
        <Section eyebrow="Selected work" title="Recent projects">
          <div className="grid gap-10 sm:grid-cols-2">
            {data.portfolio.slice(0, 2).map((p, i) => (
              <Reveal key={p.id} delay={i * 80} className="card-editorial overflow-hidden">
                {p.cover_image_url && (
                  <img
                    src={p.cover_image_url}
                    alt={`${p.title} website by MENOVO`}
                    className="aspect-[16/10] w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-8">
                  {p.category && <div className="eyebrow">{p.category}</div>}
                  <h3 className="mt-3 font-display text-2xl">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={160} className="mt-10">
            <Link to="/portfolio" className="link-underline text-sm tracking-wide text-foreground">
              See all work
            </Link>
          </Reveal>
        </Section>
      )}

      {/* FINAL CTA */}
      <section className="relative bg-navy dark:bg-secondary text-white py-20 sm:py-28 border-y border-gold/20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <Reveal className="max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.28em] text-gold">
              {cmsText(c, "home", "ctaEyebrow")}
            </div>
            <h2 className="mt-5 font-display text-3xl sm:text-5xl leading-[1.1] text-white">
              {cmsText(c, "home", "ctaTitle")}
            </h2>
            <p className="mt-5 text-white/70 max-w-xl leading-relaxed">{cmsText(c, "home", "ctaBody")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="rounded-full bg-white text-navy px-9 py-4 text-sm tracking-wide transition-all duration-400 hover:bg-gold hover:-translate-y-px"
              >
                Get Started
              </Link>
              <Link to="/services" className="btn-light px-9 py-4 text-sm tracking-wide">
                See Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION / VISION */}
      <Section eyebrow="Mission & Vision">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl">{cmsText(c, "home", "missionTitle")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{cmsText(c, "home", "mission")}</p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-3xl sm:text-4xl">{cmsText(c, "home", "visionTitle")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{cmsText(c, "home", "vision")}</p>
          </Reveal>
        </div>
      </Section>

      {/* VALUES */}
      <Section className="bg-secondary" eyebrow="What we value" title={cmsText(c, "home", "valuesTitle")}>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="rule-gold w-10" />
              <h3 className="mt-4 font-display text-2xl">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* WHY MENOVO */}
      <Section eyebrow="Why MENOVO" title={cmsText(c, "home", "whyTitle")}>
        <div className="grid gap-px bg-border sm:grid-cols-2 border border-border">
          {why.map((w, i) => (
            <Reveal key={w.title} delay={i * 80} className="bg-background p-8 sm:p-10">
              <h3 className="font-display text-2xl">{w.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{w.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
