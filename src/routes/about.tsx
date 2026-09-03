import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { pageBackground } from "@/lib/page-backgrounds";
import { cmsList, cmsPairs, cmsText } from "@/content/cms";
import { siteDataQuery, useSite } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteDataQuery),
  head: () => ({
    meta: [
      { title: "About MENOVO — Hotel Website Specialists" },
      {
        name: "description",
        content:
          "MENOVO exists to design and develop websites for hotels. Learn our story, philosophy, mission, vision and values as a hotel web design agency.",
      },
      { property: "og:title", content: "About MENOVO — Hotel Website Specialists" },
      {
        property: "og:description",
        content: "A premium web-development agency built exclusively around hotels.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://menovo.lovable.app/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://menovo.lovable.app/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const c = useSite().content;
  const values = cmsPairs(c, "about", "values");

  return (
    <>
      <PageHeader
        eyebrow="About"
        title={cmsText(c, "about", "title")}
        subtitle={cmsText(c, "about", "subtitle")}
        image={pageBackground("about", cmsText(c, "backgrounds", "aboutImageUrl"))}
      />

      <Section eyebrow="Who we are">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="font-display text-2xl sm:text-3xl leading-[1.35]">{cmsText(c, "about", "lead")}</p>
            <p className="mt-6 text-muted-foreground leading-relaxed">{cmsText(c, "about", "body")}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">{cmsText(c, "about", "body2")}</p>
          </Reveal>
          <Reveal delay={120} className="border-l border-border pl-8">
            <div className="eyebrow">What we specialize in</div>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {cmsList(c, "about", "specialties").map((i) => (
                <li key={i} className="border-b border-border pb-3">
                  {i}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-secondary" eyebrow="Why hotels" title="Specialization beats generalization.">
        <div className="grid gap-10 sm:grid-cols-3">
          {[
            {
              t: "We know the journey",
              b: "Guests compare, hesitate and decide on their phone. We design for exactly that behaviour.",
            },
            {
              t: "We know the content",
              b: "Rooms, rates, amenities, dining, location, policies — structured the way guests look for them.",
            },
            {
              t: "We know the standard",
              b: "A hotel's digital presence should feel as considered as its lobby.",
            },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 90}>
              <div className="rule-gold w-10" />
              <h3 className="mt-4 font-display text-2xl">{x.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{x.b}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Mission & Vision">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl">Mission</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{cmsText(c, "about", "mission")}</p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-3xl sm:text-4xl">Vision</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{cmsText(c, "about", "vision")}</p>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-secondary" eyebrow="What we value" title="Values">
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

      <Section eyebrow="Our philosophy" title="How our approach is different">
        <div className="grid gap-px bg-border sm:grid-cols-2 border border-border">
          {[
            { t: "Editorial, not template", b: "Layouts are composed for your property, not dropped into a theme." },
            { t: "Restraint over decoration", b: "Whitespace, typography and photography carry the design." },
            { t: "Performance is design", b: "A slow beautiful site is not a beautiful site." },
            { t: "Partnership after launch", b: "We stay on to maintain, update and improve." },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 80} className="bg-background p-8 sm:p-10">
              <h3 className="font-display text-2xl">{x.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{x.b}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-12 flex flex-wrap gap-4">
          <Link to="/contact" className="btn-primary inline-block px-9 py-4 text-sm tracking-wide">
            Get Started
          </Link>
          <Link to="/asad-je" className="btn-outline inline-block px-9 py-4 text-sm tracking-wide">
            {cmsText(c, "about", "founderButtonText")}
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
