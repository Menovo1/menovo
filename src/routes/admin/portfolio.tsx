import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/portfolio")({ component: Page });

function Page() {
  return (
    <CrudSection
      table="portfolio_projects"
      title="Portfolio"
      subtitle="Projects shown on the Portfolio page and home page."
      titleField="title"
      subtitleField="description"
      addLabel="Add project"
      defaults={{ published: true, featured: false, sort_order: 0 }}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "company", label: "Client / hotel", type: "text" },
        { name: "category", label: "Category", type: "text" },
        { name: "sort_order", label: "Order", type: "number" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "cover_image_url", label: "Cover image URL", type: "url" },
        { name: "video_url", label: "Video URL", type: "url" },
        { name: "website_url", label: "Live website URL", type: "url" },
        { name: "featured", label: "Featured on home", type: "bool" },
        { name: "published", label: "Published", type: "bool" },
      ]}
    />
  );
}
