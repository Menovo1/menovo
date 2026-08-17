import { createFileRoute } from "@tanstack/react-router";
import { CmsEditor } from "@/components/admin/CmsEditor";
import { AdminHeading } from "@/components/admin/ui";
import { BACKGROUNDS_GROUP } from "@/content/cms";

export const Route = createFileRoute("/admin/backgrounds")({ component: Page });

function Page() {
  return (
    <div>
      <AdminHeading
        title="Backgrounds"
        subtitle="Give each page its own background image, or replace the home hero video."
      />
      <CmsEditor groups={[BACKGROUNDS_GROUP]} />
    </div>
  );
}
