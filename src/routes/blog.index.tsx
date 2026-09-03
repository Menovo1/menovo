import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { pageBackground } from "@/lib/page-backgrounds";
import { cmsText } from "@/content/cms";
import { siteDataQuery, useSite } from "@/lib/site-data";

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteDataQuery),
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

const fmt = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

function BlogPage() {
  const data = useSite();
  const c = data.content;

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title={cmsText(c, "blog", "title")}
        subtitle={cmsText(c, "blog", "subtitle")}
        image={pageBackground("blog", cmsText(c, "backgrounds", "blogImageUrl"))}
      />

      <Section>
        {data.posts.length === 0 ? (
          <Reveal className="border border-border p-10 sm:p-16 text-center max-w-3xl mx-auto">
            <div className="eyebrow">Coming soon</div>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl">{cmsText(c, "blog", "emptyTitle")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {cmsText(c, "blog", "emptyBody")}
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
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {data.posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="glass-card group block h-full overflow-hidden rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1"
                >
                {p.featured_image_url && (
                  <img
                    src={p.featured_image_url}
                    alt={p.title}
                    className="mb-6 aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="eyebrow">
                  {[p.category, fmt(p.published_at)].filter(Boolean).join(" · ")}
                </div>
                <h2 className="mt-3 font-display text-2xl">{p.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
                <div className="mt-4 text-xs text-muted-foreground">{p.author}</div>
                <span className="mt-5 inline-block text-xs uppercase tracking-[0.24em] text-gold-deep">
                  Read article
                </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
