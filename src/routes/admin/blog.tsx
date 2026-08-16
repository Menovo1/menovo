import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/blog")({ component: Page });

function Page() {
  return (
    <CrudSection
      table="blog_posts"
      title="Blog posts"
      subtitle="Write, edit and publish articles."
      titleField="title"
      subtitleField="excerpt"
      addLabel="New post"
      defaults={{ published: false, author: "MENOVO" }}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "slug", label: "Slug", type: "text", help: "Used in the URL, e.g. hotel-website-tips" },
        { name: "category", label: "Category", type: "text" },
        { name: "author", label: "Author", type: "text" },
        { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3 },
        { name: "content", label: "Content", type: "textarea", rows: 12 },
        { name: "featured_image_url", label: "Cover image URL", type: "url" },
        { name: "seo_title", label: "SEO title", type: "text" },
        { name: "seo_description", label: "SEO description", type: "text" },
        { name: "published_at", label: "Publish date", type: "date" },
        { name: "published", label: "Published", type: "bool" },
      ]}
    />
  );
}
