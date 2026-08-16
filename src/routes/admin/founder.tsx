import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/founder")({ component: Page });

function Page() {
  return (
    <CrudSection
      table="founder_profile"
      title="Founder profile"
      subtitle="The Asad JE page, linked from the footer."
      titleField="name"
      singleton
      defaults={{ name: "Asad JE", title: "CEO & Founder of MENOVO", bio: "" }}
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "title", label: "Title", type: "text" },
        { name: "image_url", label: "Photo URL", type: "url" },
        { name: "bio", label: "Biography", type: "textarea", rows: 10 },
        { name: "instagram", label: "Instagram", type: "url" },
        { name: "whatsapp", label: "WhatsApp", type: "url" },
        { name: "threads", label: "Threads", type: "url" },
        { name: "linkedin", label: "LinkedIn", type: "url" },
        { name: "twitter", label: "X / Twitter", type: "url" },
        { name: "facebook", label: "Facebook", type: "url" },
        { name: "github", label: "GitHub", type: "url" },
      ]}
    />
  );
}
