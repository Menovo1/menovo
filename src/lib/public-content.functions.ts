import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type SiteData = {
  settings: Record<string, string | null> | null;
  founder: Record<string, string | null> | null;
  services: Array<{
    id: string;
    title: string;
    description: string;
    features: string[];
    image_url: string | null;
  }>;
  portfolio: Array<{
    id: string;
    title: string;
    company: string | null;
    description: string;
    cover_image_url: string | null;
    video_url: string | null;
    website_url: string | null;
    category: string | null;
    featured: boolean;
  }>;
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string | null;
    featured_image_url: string | null;
    author: string;
    published_at: string | null;
  }>;
  faqs: Array<{ id: string; question: string; answer: string }>;
  content: Record<string, Record<string, unknown>>;
};

/** One public read for every CMS-managed block on the website. */
export const getSiteData = createServerFn({ method: "GET" }).handler(async (): Promise<SiteData> => {
  const supabase = publicClient();

  const [settings, founder, services, portfolio, posts, faqs, content] = await Promise.all([
    supabase.from("settings").select("*").limit(1).maybeSingle(),
    supabase.from("founder_profile").select("*").limit(1).maybeSingle(),
    supabase
      .from("services")
      .select("id, title, description, features, image_url")
      .eq("published", true)
      .order("sort_order"),
    supabase
      .from("portfolio_projects")
      .select("id, title, company, description, cover_image_url, video_url, website_url, category, featured")
      .eq("published", true)
      .order("sort_order"),
    supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, category, featured_image_url, author, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false }),
    supabase.from("faqs").select("id, question, answer").eq("published", true).order("sort_order"),
    supabase.from("site_content").select("key, value"),
  ]);

  const contentMap: Record<string, Record<string, unknown>> = {};
  for (const row of content.data ?? []) {
    contentMap[row.key] = (row.value ?? {}) as Record<string, unknown>;
  }

  return {
    settings: (settings.data ?? null) as SiteData["settings"],
    founder: (founder.data ?? null) as SiteData["founder"],
    services: (services.data ?? []) as SiteData["services"],
    portfolio: (portfolio.data ?? []) as SiteData["portfolio"],
    posts: (posts.data ?? []) as SiteData["posts"],
    faqs: (faqs.data ?? []) as SiteData["faqs"],
    content: contentMap,
  };
});

const messageSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(2).max(3000),
});

export const submitMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => messageSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      message: data.message,
    });
    if (error) throw new Error("We could not send your message. Please try again.");
    return { ok: true };
  });
