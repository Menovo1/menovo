import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/settings")({ component: Page });

function Page() {
  return (
    <CrudSection
      table="settings"
      title="Settings"
      subtitle="Contact details and social links used across the website."
      titleField="email"
      singleton
      fields={[
        { name: "email", label: "Email", type: "text" },
        { name: "phone", label: "Phone", type: "text" },
        { name: "whatsapp", label: "WhatsApp number", type: "text" },
        { name: "instagram", label: "Instagram", type: "url" },
        { name: "threads", label: "Threads", type: "url" },
        { name: "linkedin", label: "LinkedIn", type: "url" },
        { name: "twitter", label: "X / Twitter", type: "url" },
        { name: "facebook", label: "Facebook", type: "url" },
        { name: "github", label: "GitHub", type: "url" },
      ]}
    />
  );
}
