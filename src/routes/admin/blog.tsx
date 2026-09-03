import { createFileRoute } from "@tanstack/react-router";
import { BlogAdminManager } from "@/components/admin/BlogAdminManager";

export const Route = createFileRoute("/admin/blog")({ component: BlogAdminManager });
