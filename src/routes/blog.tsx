import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { blogPosts } from "@/content/site";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — Hotel Website Insights | MENOVO" },
      {
        name: "description",
        content:
          "Notes on hotel websites, direct bookings, hotel SEO and digital guest experience from MENOVO, a hotel web design agency.",
      },
      { property: "og:title", content: "Journal — Hotel Website Insights | MENOVO" },
      {
        property: "og:description",
        content: "Perspectives on hotel web design, direct bookings and guest experience.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://menovo.lovable.app/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://menovo.lovable.app/blog" }],
  }),
  component: BlogPage,
});

const topics = [
  "Hotel websites",
  "Direct bookings",
  "Hotel SEO",
  "Hospitality technology",
  "Website conversion",
  "Hotel branding online",
  "Guest experience",
  "Digital transformation",
];

function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Writing on hotels and the web."
        subtitle="Practical perspectives on hotel websites, direct bookings and digital guest experience."
      />

      {blogPosts.length === 0 ? (
        <Section>
          <Reveal className="border border-border p-10 sm:p-16 text-center max-w-3xl mx-auto">
            <div className="eyebrow">Coming soon</div>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl">The journal opens shortly.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              We're preparing our first articles. In the meantime, we're happy to answer any question
              about your hotel's website directly.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="btn-primary px-9 py-4 text-sm tracking-wide">
                Get Started
              </Link>
              <Link to="/faq" className="btn-outline px-9 py-4 text-sm tracking-wide">
                Read the FAQ
              </Link>
            </div>
          </Reveal>

          <div className="mt-16">
            <div className="eyebrow text-center">Topics we'll cover</div>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              {topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </Section>
      ) : (
        <Section>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80} className="card-editorial p-8">
                {p.image && (
                  <img src={p.image} alt={p.title} className="mb-6 aspect-[4/3] w-full object-cover" loading="lazy" />
                )}
                <div className="eyebrow">
                  {p.category} · {p.date}
                </div>
                <h2 className="mt-3 font-display text-2xl">{p.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
              </Reveal>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
