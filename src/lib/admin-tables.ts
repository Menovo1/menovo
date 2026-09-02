/** Tables the generic admin CRUD endpoints are allowed to touch. */
export const ADMIN_TABLES = [
  "messages",
  "services",
  "portfolio_projects",
  "blog_posts",
  "faqs",
  "founder_profile",
  "settings",
  "site_content",
  "social_links",
] as const;

export type AdminTable = (typeof ADMIN_TABLES)[number];

export const TABLE_ORDER: Record<AdminTable, { column: string; ascending: boolean }> = {
  messages: { column: "created_at", ascending: false },
  services: { column: "sort_order", ascending: true },
  portfolio_projects: { column: "sort_order", ascending: true },
  blog_posts: { column: "created_at", ascending: false },
  faqs: { column: "sort_order", ascending: true },
  founder_profile: { column: "created_at", ascending: true },
  settings: { column: "created_at", ascending: true },
  site_content: { column: "key", ascending: true },
  social_links: { column: "sort_order", ascending: true },
};

/** site_content / settings / founder_profile are keyed differently from the id tables. */
export const TABLE_PK: Record<AdminTable, string> = {
  messages: "id",
  services: "id",
  portfolio_projects: "id",
  blog_posts: "id",
  faqs: "id",
  founder_profile: "id",
  settings: "id",
  site_content: "key",
  social_links: "id",
};

export function isAdminTable(value: string): value is AdminTable {
  return (ADMIN_TABLES as readonly string[]).includes(value);
}
