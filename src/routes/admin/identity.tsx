import { createFileRoute } from "@tanstack/react-router";
import { CmsEditor } from "@/components/admin/CmsEditor";
import { AdminHeading } from "@/components/admin/ui";
import { IDENTITY_GROUP } from "@/content/cms";

export const Route = createFileRoute("/admin/identity")({ component: Page });

function Page() {
  return (
    <div>
      <AdminHeading
        title="Identity"
        subtitle="Logo, favicon and site name. Upload files in Media, copy the link, then paste it here."
      />
      <CmsEditor groups={[IDENTITY_GROUP]} />
    </div>
  );
}
