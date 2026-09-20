/**
 * CMS schema + defaults.
 *
 * Every editable string on the public website lives here with its current
 * wording as the default. The admin area (Admin → Website) renders this schema
 * and stores overrides in the `site_content` table. Public pages read
 * `cmsText(content, group, field)` so a value always exists.
 */

export type CmsFieldType = "text" | "textarea" | "list" | "pairs" | "url";

export type CmsField = {
  name: string;
  label: string;
  type?: CmsFieldType;
  help?: string;
};

export type CmsGroup = {
  key: string;
  label: string;
  description?: string;
  fields: CmsField[];
};

export type Pair = { title: string; body: string };

/** "Title | Body" per line <-> pair list */
export const pairsToText = (pairs: Pair[]) => pairs.map((p) => `${p.title} | ${p.body}`).join("\n");
export const textToPairs = (text: string): Pair[] =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [title, ...rest] = l.split("|");
      return { title: (title ?? "").trim(), body: rest.join("|").trim() };
    });

export const CMS_DEFAULTS: Record<string, Record<string, unknown>> = {
  identity: {
    siteName: "MENOVO",
    tagline: "From Idea to Impact.",
    logoUrl: "",
    faviconUrl: "",
    metaDescription:
      "MENOVO is a premium digital agency creating distinctive websites and digital experiences for modern businesses.",
  },
  backgrounds: {
    homeVideoUrl: "",
    homePosterUrl: "",
    aboutImageUrl: "",
    servicesImageUrl: "",
    portfolioImageUrl: "",
    blogImageUrl: "",
    faqImageUrl: "",
    contactImageUrl: "",
  },
  home: {
    heroEyebrow: "Digital Agency · Built for Growth",
    heroLine1: "Digital experiences,",
    heroLine2: "designed to move business forward.",
    heroSubtitle:
      "We design and develop premium websites and digital experiences for ambitious brands — from local businesses to growing organizations.",
    heroPrimaryLabel: "Get Started",
    heroSecondaryLabel: "See Services",
    problemEyebrow: "The problem",
    problemTitle: "Most business websites don't reflect the business behind them.",
    problemSubtitle:
      "People decide quickly whether to trust a brand. Your website should make that decision easy.",
    problems: [
      "Outdated design | Your digital presence no longer reflects your brand.",
      "Poor on mobile | A difficult mobile experience sends people elsewhere.",
      "Unclear customer journey | Important actions are buried behind unnecessary friction.",
      "Generic templates | Your brand deserves a digital presence with character.",
      "Weak first impression | Visitors should understand your value within seconds.",
      "Low visibility | Great businesses lose attention when they are hard to find online.",
    ],
    solutionEyebrow: "The solution",
    solutionTitle: "Premium digital experiences, built around your business.",
    solutionSubtitle:
      "Every project is designed around how your audience discovers, evaluates and chooses your brand — and how you want to be remembered.",
    solutions: [
      "Business-first design | Your products, services and value, presented with clarity and purpose.",
      "Mobile-first build | Designed for smaller screens first, then refined across every device.",
      "Clear conversion paths | Forms, WhatsApp, calls and appointments in one simple journey.",
      "Speed & SEO | Fast, search-ready foundations.",
      "Visual storytelling | Images, motion and layout that make your brand impossible to ignore.",
      "Built to grow | New pages and offers without a rebuild.",
    ],
    ctaEyebrow: "Start a project",
    ctaTitle: "Let's build a digital presence your business can be proud of.",
    ctaBody: "Tell us about your business. We'll come back with a clear, considered plan.",
    missionTitle: "Our Mission",
    mission:
      "To help ambitious businesses become more visible, credible and effective online — with digital experiences that are elegant, fast and effortless to use.",
    visionTitle: "Our Vision",
    vision:
      "A future where great businesses are impossible to overlook, with digital presences as distinctive as the brands behind them.",
    valuesTitle: "Values",
    values: [
      "Elegance | Restraint over decoration.",
      "Clarity | Customers find what they need, fast.",
      "Care | Every brand handled with attention.",
      "Impact | Design that lifts direct enquiries.",
    ],
    whyTitle: "Why businesses choose us",
    why: [
      "Industry-aware strategy | We adapt the digital experience to your market, audience and goals.",
      "Thoughtful craftsmanship | Editorial type, whitespace, considered motion.",
      "Global service | We work with businesses and organizations across markets and industries.",
      "Long-term partnership | Support after launch, not a hand-off.",
    ],
  },
  about: {
    title: "Digital experiences built for brands ready to move forward.",
    subtitle:
      "MENOVO is a premium digital agency creating modern websites and digital experiences for businesses and organizations worldwide.",
    lead: "Every business has a story. Your digital presence should tell it with clarity, character and purpose.",
    body: "MENOVO began with a simple observation: too many strong businesses are represented online by websites that undersell them. Slow pages, dated layouts, unclear messaging and complicated customer journeys can quietly cost attention and trust.",
    body2:
      "Our approach is simple: understand the business, clarify the message, design with intention, and build technology that supports real goals.",
    specialties: [
      "Business website design",
      "Business website development",
      "Products, services & key offerings",
      "Enquiry and appointment flows",
      "Mobile-first customer experience",
      "Ongoing website maintenance",
    ],
    mission:
      "To help ambitious businesses become more visible, credible and effective online — with digital experiences that are elegant, fast and effortless to use.",
    vision:
      "A future where great businesses are easier to discover, easier to trust, and impossible to overlook.",
    values: [
      "Elegance | Restraint over decoration.",
      "Clarity | Customers find what they need, fast.",
      "Care | Every brand handled with attention.",
      "Impact | Design that lifts direct enquiries.",
    ],
    founderButtonText: "Meet the Founder",
  },
  services: {
    title: "Digital work designed to move your business forward.",
    subtitle:
      "Strategy, design, development and ongoing care — everything your business needs online, handled end to end.",
    ctaTitle: "Tell us about your business.",
    ctaBody: "We'll reply with a clear plan and a realistic schedule.",
  },
  portfolio: {
    title: "Work with purpose.",
    subtitle: "A closer look at the businesses, brands and organizations we build for.",
    emptyTitle: "New work, publishing soon.",
    emptyBody:
      "We're preparing our first published case studies. In the meantime we're happy to walk you through recent projects directly.",
  },
  blog: {
    title: "Ideas for building better digital brands.",
    subtitle:
      "Practical perspectives on websites, digital strategy, SEO, branding and customer experience.",
    emptyTitle: "The journal opens shortly.",
    emptyBody:
      "We're preparing our first articles. In the meantime, we're happy to answer any question about your business's website directly.",
  },
  faq: {
    title: "Questions, answered.",
    subtitle: "Everything businesses usually ask before starting a digital project.",
  },
  contact: {
    title: "Let's build something that matters.",
    subtitle: "Pick a time that suits you and we'll meet on Zoom — the link is sent automatically.",
    calendlyUrl: "https://calendly.com/7menovo/30min",
    calendlyNote: "Choose a time on Calendly. Your Zoom meeting link is sent automatically by email.",
  },
  footer: {
    description:
      "Premium websites built for ambitious businesses — elegant, fast, and made to turn attention into action.",
    founderLabel: "Founded by",
    founderName: "ASAD JE",
    services: [
      "Business Website Development",
      "Website Development",
      "Website Maintenance",
    ],
    note: "",
  },
};

export const CMS_GROUPS: CmsGroup[] = [
  {
    key: "home",
    label: "Home page",
    fields: [
      { name: "heroEyebrow", label: "Hero eyebrow" },
      { name: "heroLine1", label: "Hero headline — line 1" },
      { name: "heroLine2", label: "Hero headline — line 2 (italic)" },
      { name: "heroSubtitle", label: "Hero paragraph", type: "textarea" },
      { name: "heroPrimaryLabel", label: "Hero main button" },
      { name: "heroSecondaryLabel", label: "Hero second button" },
      { name: "problemEyebrow", label: "Problem eyebrow" },
      { name: "problemTitle", label: "Problem title" },
      { name: "problemSubtitle", label: "Problem text", type: "textarea" },
      { name: "problems", label: "Problem cards", type: "pairs" },
      { name: "solutionEyebrow", label: "Solution eyebrow" },
      { name: "solutionTitle", label: "Solution title" },
      { name: "solutionSubtitle", label: "Solution text", type: "textarea" },
      { name: "solutions", label: "Solution cards", type: "pairs" },
      { name: "ctaEyebrow", label: "CTA eyebrow" },
      { name: "ctaTitle", label: "CTA title" },
      { name: "ctaBody", label: "CTA text", type: "textarea" },
      { name: "missionTitle", label: "Mission title" },
      { name: "mission", label: "Mission", type: "textarea" },
      { name: "visionTitle", label: "Vision title" },
      { name: "vision", label: "Vision", type: "textarea" },
      { name: "valuesTitle", label: "Values title" },
      { name: "values", label: "Values", type: "pairs" },
      { name: "whyTitle", label: "Why MENOVO title" },
      { name: "why", label: "Why MENOVO cards", type: "pairs" },
    ],
  },
  {
    key: "about",
    label: "About page",
    fields: [
      { name: "title", label: "Page title" },
      { name: "subtitle", label: "Page subtitle", type: "textarea" },
      { name: "lead", label: "Lead sentence", type: "textarea" },
      { name: "body", label: "Paragraph 1", type: "textarea" },
      { name: "body2", label: "Paragraph 2", type: "textarea" },
      { name: "specialties", label: "What we do", type: "list" },
      { name: "mission", label: "Mission", type: "textarea" },
      { name: "vision", label: "Vision", type: "textarea" },
      { name: "values", label: "Values", type: "pairs" },
      { name: "founderButtonText", label: "Founder button text" },
    ],
  },
  {
    key: "services",
    label: "Services page",
    description: "The service cards themselves are managed in Admin → Services.",
    fields: [
      { name: "title", label: "Page title" },
      { name: "subtitle", label: "Page subtitle", type: "textarea" },
      { name: "ctaTitle", label: "CTA title" },
      { name: "ctaBody", label: "CTA text", type: "textarea" },
    ],
  },
  {
    key: "portfolio",
    label: "Portfolio page",
    description: "Projects are managed in Admin → Portfolio.",
    fields: [
      { name: "title", label: "Page title" },
      { name: "subtitle", label: "Page subtitle", type: "textarea" },
      { name: "emptyTitle", label: "Empty state title" },
      { name: "emptyBody", label: "Empty state text", type: "textarea" },
    ],
  },
  {
    key: "blog",
    label: "Blog page",
    description: "Posts are managed in Admin → Blog.",
    fields: [
      { name: "title", label: "Page title" },
      { name: "subtitle", label: "Page subtitle", type: "textarea" },
      { name: "emptyTitle", label: "Empty state title" },
      { name: "emptyBody", label: "Empty state text", type: "textarea" },
    ],
  },
  {
    key: "faq",
    label: "FAQ page",
    description: "Questions are managed in Admin → FAQ.",
    fields: [
      { name: "title", label: "Page title" },
      { name: "subtitle", label: "Page subtitle", type: "textarea" },
    ],
  },
  {
    key: "contact",
    label: "Contact page",
    fields: [
      { name: "title", label: "Page title" },
      { name: "subtitle", label: "Page subtitle", type: "textarea" },
      { name: "calendlyUrl", label: "Calendly link", type: "url", help: "e.g. https://calendly.com/7menovo/30min" },
      { name: "calendlyNote", label: "Note under the calendar", type: "textarea" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    fields: [
      { name: "description", label: "Description", type: "textarea" },
      { name: "founderLabel", label: "Founder label" },
      { name: "founderName", label: "Founder name" },
      { name: "services", label: "Services list", type: "list" },
      { name: "note", label: "Small note" },
    ],
  },
];

export const IDENTITY_GROUP: CmsGroup = {
  key: "identity",
  label: "Website identity",
  fields: [
    { name: "siteName", label: "Site name" },
    { name: "tagline", label: "Tagline" },
    { name: "logoUrl", label: "Logo URL", type: "url", help: "Upload in Media, then paste the link. Use a transparent PNG." },
    { name: "faviconUrl", label: "Favicon URL", type: "url" },
    { name: "metaDescription", label: "Default meta description", type: "textarea" },
  ],
};

export const BACKGROUNDS_GROUP: CmsGroup = {
  key: "backgrounds",
  label: "Page backgrounds",
  description: "Replace any page background with an uploaded Media Library file or any public image URL. Leave empty to keep the built-in background.",
  fields: [
    { name: "homeVideoUrl", label: "Home hero video URL", type: "url" },
    { name: "homePosterUrl", label: "Home hero poster image", type: "url", help: "Paste a public image URL or a link copied from Admin → Media." },
    { name: "aboutImageUrl", label: "About header image", type: "url", help: "Paste a public image URL or a link copied from Admin → Media." },
    { name: "servicesImageUrl", label: "Services header image", type: "url", help: "Paste a public image URL or a link copied from Admin → Media." },
    { name: "portfolioImageUrl", label: "Portfolio header image", type: "url", help: "Paste a public image URL or a link copied from Admin → Media." },
    { name: "blogImageUrl", label: "Blog header image", type: "url", help: "Paste a public image URL or a link copied from Admin → Media." },
    { name: "faqImageUrl", label: "FAQ header image", type: "url", help: "Paste a public image URL or a link copied from Admin → Media." },
    { name: "contactImageUrl", label: "Contact header image", type: "url", help: "Paste a public image URL or a link copied from Admin → Media." },
  ],
};

export const ALL_CMS_GROUPS = [IDENTITY_GROUP, BACKGROUNDS_GROUP, ...CMS_GROUPS];

type ContentMap = Record<string, Record<string, unknown>> | undefined;

function raw(content: ContentMap, group: string, field: string): unknown {
  const value = content?.[group]?.[field];
  if (value === undefined || value === null || value === "") {
    return CMS_DEFAULTS[group]?.[field];
  }
  if (Array.isArray(value) && value.length === 0) return CMS_DEFAULTS[group]?.[field];
  return value;
}

export function cmsText(content: ContentMap, group: string, field: string): string {
  const v = raw(content, group, field);
  return typeof v === "string" ? v : "";
}

export function cmsList(content: ContentMap, group: string, field: string): string[] {
  const v = raw(content, group, field);
  return Array.isArray(v) ? (v as string[]) : [];
}

export function cmsPairs(content: ContentMap, group: string, field: string): Pair[] {
  return textToPairs(cmsList(content, group, field).join("\n"));
}
