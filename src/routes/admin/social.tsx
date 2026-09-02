import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";
import { SOCIAL_PLATFORMS } from "@/content/social-platforms";

export const Route = createFileRoute("/admin/social")({ component: Page });

function Page() {
  return (
    <CrudSection
      table="social_links"
      title="Social media"
      subtitle="Add, remove and reorder the social platforms shown in the footer and on the contact page."
      titleField="platform"
      subtitleField="url"
      addLabel="Add platform"
      defaults={{ enabled: true, show_footer: true, show_contact: true, sort_order: 0, url: "" }}
      fields={[
        {
          name: "platform",
          label: "Platform",
          type: "text",
          help: `Use one of: ${SOCIAL_PLATFORMS.map((p) => p.id).join(", ")}`,
        },
        { name: "url", label: "Profile link", type: "url" },
        { name: "sort_order", label: "Order", type: "number" },
        { name: "enabled", label: "Enabled", type: "bool" },
        { name: "show_footer", label: "Show in footer", type: "bool" },
        { name: "show_contact", label: "Show on contact page", type: "bool" },
      ]}
    />
  );
}
