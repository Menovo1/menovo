import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { CMS_DEFAULTS } from "@/content/cms";
import { faqs as STATIC_FAQS } from "@/content/site";
import {
  SUPABASE_PROJECT_URL,
  SUPABASE_PROJECT_PUBLISHABLE_KEY,
} from "@/integrations/supabase/project-config";

function publicClient() {
  // Use the canonical public project so stale Vercel environment variables
  // cannot route SSR reads to a different Supabase project.
  const url = SUPABASE_PROJECT_URL;
  const key = SUPABASE_PROJECT_PUBLISHABLE_KEY;
  return createClient<Database>(url, key, {
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

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  enabled: boolean;
  show_footer: boolean;
  show_contact: boolean;
  sort_order: number;
};

/**
 * Convert Supabase storage URLs (including expiring signed URLs copied from the
 * admin media library) into the site's stable public media endpoint. External
 * image/video URLs are left untouched.
 */
export function publicMediaUrl(value: string | null | undefined): string | null | undefined {
  if (!value || typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  if (trimmed.startsWith("/api/public/media/")) return trimmed;

  try {
    const u = new URL(trimmed, "http://localhost");
    const match = u.pathname.match(/\/storage\/v1\/object\/(?:sign|public)\/media\/(.+)$/);
    if (match?.[1]) {
      return `/api/public/media/${match[1].split("?")[0].split("#")[0].split("/").map((part) => encodeURIComponent(decodeURIComponent(part))).join("/")}`;
    }
  } catch {
    // Keep malformed/external values unchanged so the CMS remains editable.
  }
  return value;
}

function normalizeMediaValue(value: unknown): unknown {
  if (typeof value === "string") return publicMediaUrl(value);
  if (Array.isArray(value)) return value.map(normalizeMediaValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizeMediaValue(v)]));
  }
  return value;
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
  socials: SocialLink[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, Record<string, any>>;
};

/** One public read for every CMS-managed block on the website. */
export function getFallbackSiteData(): SiteData {
  const defaults = CMS_DEFAULTS;

  return {
    settings: {
      email: "info@menovo.agency",
      whatsapp: "+251946471234",
    },
    founder: {
      id: "static-founder",
      name: "Asad JE",
      title: "CEO & Founder of MENOVO",
      bio: "",
      image_url: null,
      instagram: "https://www.instagram.com/the_asad_je/",
      whatsapp: "https://wa.me/251976367556",
      threads: "https://www.threads.com/@the_asad_je",
      facebook: null,
      twitter: null,
      linkedin: null,
      github: null,
      instagram_enabled: true,
      whatsapp_enabled: true,
      threads_enabled: true,
      facebook_enabled: false,
      twitter_enabled: false,
      linkedin_enabled: false,
      github_enabled: false,
    },
    services: [],
    portfolio: [],
    posts: [],
    faqs: STATIC_FAQS.map((faq, index) => ({
      id: `static-faq-${index + 1}`,
      question: faq.q,
      answer: faq.a,
    })),
    socials: [],
    content: defaults as Record<string, Record<string, any>>,
  };
}

/**
 * Public pages must remain available even when Supabase is not configured in
 * the hosting provider. Lovable keeps .env out of Git, so a GitHub/Vercel
 * deployment can otherwise fail during SSR before the page is rendered.
 *
 * Supabase is still used whenever the server has valid environment variables.
 * If it is unavailable, the site falls back to the built-in CMS defaults.
 */
export const getSiteData = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteData> => {
    try {
      const supabase = publicClient();

      const [settings, founder, services, portfolio, posts, faqs, socials, content] = await Promise.all([
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
        supabase
          .from("social_links")
          .select("id, platform, url, enabled, show_footer, show_contact, sort_order")
          .order("sort_order"),
        supabase.from("site_content").select("key, value"),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contentMap: Record<string, Record<string, any>> = {};
      for (const row of content.data ?? []) {
        contentMap[row.key] = (row.value ?? {}) as Record<string, never>;
      }

      return {
        settings: normalizeMediaValue(settings.data ?? null) as SiteData["settings"],
        founder: normalizeMediaValue(founder.data ?? null) as SiteData["founder"],
        services: normalizeMediaValue(services.data ?? []) as SiteData["services"],
        portfolio: normalizeMediaValue(portfolio.data ?? []) as SiteData["portfolio"],
        posts: normalizeMediaValue(posts.data ?? []) as SiteData["posts"],
        faqs: faqs.data ?? [],
        socials: normalizeMediaValue(socials.data ?? []) as SocialLink[],
        content: normalizeMediaValue(contentMap) as Record<string, Record<string, any>>,
      };
    } catch (error) {
      console.error("[MENOVO] Supabase is unavailable; using static site defaults.", error);
      return getFallbackSiteData();
    }
  },
);

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

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string | null;
  featured_image_url: string | null;
  author: string;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

/** Public read for a single published article. */
export const getPost = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }): Promise<BlogPost | null> => {
    try {
      const supabase = publicClient();
      const { data: row } = await supabase
        .from("blog_posts")
        .select(
          "id, title, slug, excerpt, content, category, featured_image_url, author, published_at, seo_title, seo_description",
        )
        .eq("slug", data.slug)
        .eq("published", true)
        .maybeSingle();
      return (row ?? null) as BlogPost | null;
    } catch (error) {
      console.error("[MENOVO] Could not load article.", error);
      return null;
    }
  });
