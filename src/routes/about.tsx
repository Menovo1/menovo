import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { values } from "@/content/site";

export const Route = createFileRoute("/about")({
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
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="We build websites for hotels. Only hotels."
        subtitle="MENOVO is a premium web-development agency specialized in hotel website design and development, working with properties worldwide."
      />

      <Section eyebrow="Who we are">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="font-display text-2xl sm:text-3xl leading-[1.35]">
              Hospitality is a craft of details. A website should be too.
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              MENOVO began with a simple observation: too many exceptional hotels are represented
              online by websites that undersell them. Slow pages, dated layouts, unclear room
              information and booking journeys that lose the guest before the enquiry is ever sent.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              So we narrowed our focus entirely. Instead of building anything for anyone, we build
              one thing exceptionally well — premium websites for hotels.
            </p>
          </Reveal>
          <Reveal delay={120} className="border-l border-border pl-8">
            <div className="eyebrow">What we specialize in</div>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                "Hotel website design",
                "Hotel website development",
                "Rooms, suites & amenity presentation",
                "Enquiry and booking-request flows",
                "Mobile-first guest experience",
                "Ongoing website maintenance",
              ].map((i) => (
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
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To make every HOTEL digitally visible — with websites that are elegant, fast and
              effortless for guests to use.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-3xl sm:text-4xl">Vision</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              A future where no great HOTEL goes undiscovered, and where the global hotel industry
              is represented online with the same care it shows its guests.
            </p>
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
        <Reveal delay={200} className="mt-12">
          <Link to="/contact" className="btn-primary inline-block px-8 py-4 text-sm tracking-wide">
            Get Started
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
