import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { getPost } from "@/lib/public-content.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Article not found | MENOVO" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.post;
    const title = p.seo_title || `${p.title} | MENOVO Journal`;
    const description = p.seo_description || p.excerpt;
    const meta = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (p.featured_image_url?.startsWith("https://")) {
      meta.push(
        { property: "og:image", content: p.featured_image_url },
        { name: "twitter:image", content: p.featured_image_url },
      );
    }
    return { meta };
  },
  notFoundComponent: ArticleMissing,
  component: ArticlePage,
});

const fmt = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

function ArticleMissing() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-28 text-center">
      <h1 className="font-display text-4xl">Article unavailable</h1>
      <p className="mt-4 text-muted-foreground">This story may have been moved or unpublished.</p>
      <Link to="/blog" className="btn-primary mt-8 inline-block px-9 py-4 text-sm tracking-wide">
        Back to the Journal
      </Link>
    </div>
  );
}

function ArticlePage() {
  const { post } = Route.useLoaderData();

  return (
    <article className="mx-auto max-w-3xl px-6 sm:px-8 py-16 sm:py-24">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-gold-deep"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Journal
      </Link>

      <Reveal className="mt-8">
        <div className="eyebrow">{[post.category, fmt(post.published_at)].filter(Boolean).join(" · ")}</div>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl leading-tight">{post.title}</h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
        <div className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">By {post.author}</div>
      </Reveal>

      {post.featured_image_url && (
        <Reveal delay={80}>
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="mt-10 w-full rounded-3xl object-cover"
            loading="lazy"
          />
        </Reveal>
      )}

      <Reveal delay={120} className="glass-card mt-10 rounded-3xl p-8 sm:p-10">
        <div className="space-y-5 text-base leading-relaxed text-foreground/85">
          {post.content
            .split(/\n{2,}/)
            .filter((block) => block.trim())
            .map((block, i) => (
              <p key={i}>{block.trim()}</p>
            ))}
        </div>
      </Reveal>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link to="/contact" className="btn-primary px-9 py-4 text-sm tracking-wide">
          Get Started
        </Link>
        <Link to="/blog" className="btn-outline px-9 py-4 text-sm tracking-wide">
          More articles
        </Link>
      </div>
    </article>
  );
}
