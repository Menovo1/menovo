import { createFileRoute } from "@tanstack/react-router";
import { CmsEditor } from "@/components/admin/CmsEditor";
import { AdminHeading } from "@/components/admin/ui";
import { CMS_GROUPS } from "@/content/cms";

export const Route = createFileRoute("/admin/website")({ component: Page });

function Page() {
  return (
    <div>
      <AdminHeading
        title="Website content"
        subtitle="Every field shows the text that is live on the website right now. Edit and save — the change appears immediately."
      />
      <CmsEditor groups={CMS_GROUPS} />
    </div>
  );
}
