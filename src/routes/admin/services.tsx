import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/services")({ component: Page });

function Page() {
  return (
    <CrudSection
      table="services"
      title="Services"
      subtitle="What appears on the public Services page."
      titleField="title"
      subtitleField="description"
      addLabel="Add service"
      defaults={{ published: true, sort_order: 0, features: [] }}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "sort_order", label: "Order", type: "number" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "features", label: "Features", type: "list" },
        { name: "image_url", label: "Image URL", type: "url" },
        { name: "published", label: "Published", type: "bool" },
      ]}
    />
  );
}
