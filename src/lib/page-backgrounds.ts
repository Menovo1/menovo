import bgHome from "@/assets/bg-home.jpg";
import bgAbout from "@/assets/bg-about.jpg";
import bgServices from "@/assets/bg-services.jpg";
import bgPortfolio from "@/assets/bg-portfolio.jpg";
import bgBlog from "@/assets/bg-blog.jpg";
import bgFaq from "@/assets/bg-faq.jpg";
import bgContact from "@/assets/bg-contact.jpg";

export type PageKey =
  | "home"
  | "about"
  | "services"
  | "portfolio"
  | "blog"
  | "faq"
  | "contact";

/** Unique, bundled luxury-hospitality background per page. */
export const PAGE_BACKGROUNDS: Record<PageKey, string> = {
  home: bgHome,
  about: bgAbout,
  services: bgServices,
  portfolio: bgPortfolio,
  blog: bgBlog,
  faq: bgFaq,
  contact: bgContact,
};

/** CMS override wins; otherwise the page's own bundled background is used. */
export function pageBackground(page: PageKey, cmsUrl?: string | null) {
  return cmsUrl && cmsUrl.trim() ? cmsUrl : PAGE_BACKGROUNDS[page];
}
