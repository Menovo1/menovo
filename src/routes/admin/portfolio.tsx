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
      defaults={{ published: true, featured: false, sort_order: 0, category: "Hotels & Hospitality" }}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "company", label: "Client / business", type: "text" },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: [
            { value: "Hotels & Hospitality", label: "Hotels & Hospitality" },
            { value: "Tailoring & Fashion", label: "Tailoring & Fashion" },
            { value: "Businesses & Companies", label: "Businesses & Companies" },
            { value: "Real Estate", label: "Real Estate" },
            { value: "Education", label: "Education" },
            { value: "Healthcare", label: "Healthcare" },
            { value: "Restaurants & Cafés", label: "Restaurants & Cafés" },
            { value: "Other", label: "Other" },
          ],
          help: "Pick a category instead of typing one manually.",
        },
        {
          name: "sort_order",
          label: "Priority",
          type: "select",
          options: Array.from({ length: 20 }, (_, index) => ({
            value: String(index),
            label: index === 0 ? "1 — First" : index === 1 ? "2 — Second" : `${index + 1} — Position ${index + 1}`,
          })),
          help: "Choose 1 for the first project, 2 for the second, and so on.",
        },
        { name: "description", label: "Description", type: "textarea" },
        { name: "cover_image_url", label: "Cover image", type: "image", help: "Upload a cover image or paste a direct image URL." },
        { name: "video_url", label: "Video URL", type: "url" },
        { name: "website_url", label: "Live website URL", type: "url" },
        { name: "featured", label: "Featured on home", type: "bool" },
        { name: "published", label: "Published", type: "bool" },
      ]}
    />
  );
}
