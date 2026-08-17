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
    tagline: "From Table to Screen.",
    logoUrl: "",
    faviconUrl: "",
    metaDescription:
      "MENOVO is a premium web-development agency specialized exclusively in hotel websites.",
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
    heroEyebrow: "Hotel Web Design Agency · Worldwide",
    heroLine1: "Hotel websites,",
    heroLine2: "designed differently.",
    heroSubtitle:
      "We design and develop premium digital experiences for hotels — and nothing else.",
    heroPrimaryLabel: "Get Started",
    heroSecondaryLabel: "See Services",
    problemEyebrow: "The problem",
    problemTitle: "Most hotel websites don't match the hotel.",
    problemSubtitle:
      "Guests judge a property in seconds. Too often the website is the weakest part of the experience.",
    problems: [
      "Outdated design | The site looks older than the property.",
      "Poor on mobile | Most guests arrive on a phone — and leave.",
      "Hidden booking path | Enquiries buried behind slow journeys.",
      "Generic templates | Nothing sets the hotel apart.",
      "Weak first impression | Photos never show the real experience.",
      "Low visibility | Search sends guests to third parties.",
    ],
    solutionEyebrow: "The solution",
    solutionTitle: "Premium websites, built exclusively for hotels.",
    solutionSubtitle:
      "Every project is designed around how guests choose a hotel — and how a hotel wants to be remembered.",
    solutions: [
      "Hotel-first design | Rooms, dining and amenities, the way guests browse.",
      "Mobile-first build | Designed for the phone, scaled up with intent.",
      "Direct enquiries | Forms and WhatsApp in one clear path.",
      "Speed & SEO | Fast, search-ready foundations.",
      "Visual storytelling | Galleries that show the property at its best.",
      "Built to grow | New pages and offers without a rebuild.",
    ],
    ctaEyebrow: "Start a project",
    ctaTitle: "Let's give your hotel a website worthy of the stay.",
    ctaBody: "Tell us about your property. We'll come back with a clear, considered plan.",
    missionTitle: "Our Mission",
    mission:
      "To make every HOTEL digitally visible — with websites that are elegant, fast and effortless for guests to use.",
    visionTitle: "Our Vision",
    vision:
      "A future where no great HOTEL goes undiscovered, and where every property has a digital presence as considered as its hospitality.",
    valuesTitle: "Values",
    values: [
      "Elegance | Restraint over decoration.",
      "Clarity | Guests find what they need, fast.",
      "Care | Every brand handled with attention.",
      "Impact | Design that lifts direct enquiries.",
    ],
    whyTitle: "Why hotels choose us",
    why: [
      "Hotel specialization | Hotels only — the patterns are already solved.",
      "Luxury craftsmanship | Editorial type, whitespace, considered motion.",
      "Global service | Independent hotels and groups worldwide.",
      "Long-term partnership | Support after launch, not a hand-off.",
    ],
  },
  about: {
    title: "We build websites for hotels. Only hotels.",
    subtitle:
      "MENOVO is a premium web-development agency specialized in hotel website design and development, working with properties worldwide.",
    lead: "Hospitality is a craft of details. A website should be too.",
    body: "MENOVO began with a simple observation: too many exceptional hotels are represented online by websites that undersell them. Slow pages, dated layouts, unclear room information and booking journeys that lose the guest before the enquiry is ever sent.",
    body2:
      "So we narrowed our focus entirely. Instead of building anything for anyone, we build one thing exceptionally well — premium websites for hotels.",
    specialties: [
      "Hotel website design",
      "Hotel website development",
      "Rooms, suites & amenity presentation",
      "Enquiry and booking-request flows",
      "Mobile-first guest experience",
      "Ongoing website maintenance",
    ],
    mission:
      "To make every HOTEL digitally visible — with websites that are elegant, fast and effortless for guests to use.",
    vision:
      "A future where no great HOTEL goes undiscovered, and where the global hotel industry is represented online with the same care it shows its guests.",
    values: [
      "Elegance | Restraint over decoration.",
      "Clarity | Guests find what they need, fast.",
      "Care | Every brand handled with attention.",
      "Impact | Design that lifts direct enquiries.",
    ],
    founderButtonText: "Meet the Founder",
  },
  services: {
    title: "Websites designed for hotels.",
    subtitle:
      "Design, development and care — everything a hotel needs online, handled end to end.",
    ctaTitle: "Tell us about your property.",
    ctaBody: "We'll reply with a clear plan and a realistic schedule.",
  },
  portfolio: {
    title: "Selected work.",
    subtitle: "A closer look at the hotels and hospitality brands we build for.",
    emptyTitle: "New work, publishing soon.",
    emptyBody:
      "We're preparing our first published case studies. In the meantime we're happy to walk you through recent projects directly.",
  },
  blog: {
    title: "Writing on hotels and the web.",
    subtitle:
      "Practical perspectives on hotel websites, direct bookings and digital guest experience.",
    emptyTitle: "The journal opens shortly.",
    emptyBody:
      "We're preparing our first articles. In the meantime, we're happy to answer any question about your hotel's website directly.",
  },
  faq: {
    title: "Questions, answered.",
    subtitle: "Everything hotels usually ask before starting a website project.",
  },
  contact: {
    title: "Book an appointment.",
    subtitle: "Pick a time that suits you and we'll meet on Zoom — the link is sent automatically.",
    calendlyUrl: "https://calendly.com/7menovo/30min",
    calendlyNote: "Meetings are hosted on Zoom. You'll receive the link by email instantly.",
  },
  footer: {
    description:
      "Premium websites built exclusively for hotels — elegant, fast, and made to turn visitors into guests.",
    founderLabel: "Founded by",
    founderName: "ASAD JE",
    services: [
      "Hotel Website Development",
      "Business Website Development",
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
      { name: "specialties", label: "What we specialize in", type: "list" },
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
  description: "Leave empty to keep the built-in background.",
  fields: [
    { name: "homeVideoUrl", label: "Home hero video URL", type: "url" },
    { name: "homePosterUrl", label: "Home hero poster image", type: "url" },
    { name: "aboutImageUrl", label: "About header image", type: "url" },
    { name: "servicesImageUrl", label: "Services header image", type: "url" },
    { name: "portfolioImageUrl", label: "Portfolio header image", type: "url" },
    { name: "blogImageUrl", label: "Blog header image", type: "url" },
    { name: "faqImageUrl", label: "FAQ header image", type: "url" },
    { name: "contactImageUrl", label: "Contact header image", type: "url" },
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
