/**
 * Central content configuration for MENOVO.
 * Update contact details, navigation, services, FAQ, portfolio and blog here.
 */

export const site = {
  name: "MENOVO",
  tagline: "From Table to Screen.",
  positioning: "A premium web-development agency specialized exclusively in hotel websites.",
  url: "https://menovo.lovable.app",
  email: "info@menovo.agency",
  whatsappNumber: "+251946471234",
  whatsappDigits: "251946471234",
  socialsComingSoon: true,
} as const;

export const whatsappLink = (message = "Hello MENOVO, I'd like to talk about a hotel website.") =>
  `https://wa.me/${site.whatsappDigits}?text=${encodeURIComponent(message)}`;

export const emailLink = (subject = "Hotel website enquiry") =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

/** Hero background media. Swap `src` for any production video host later. */
export const heroVideo = {
  src: "/hero.mp4",
  type: "video/mp4",
  poster: "/hero-poster.jpg",
  objectPosition: "center",
} as const;

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/portfolio", label: "Portfolio" },
] as const;

/** Digits only, for wa.me links. */
export const waDigits = (value?: string | null) =>
  (value ?? site.whatsappNumber).replace(/[^\d]/g, "");


export const values = [
  { title: "Elegance", body: "Restraint over decoration." },
  { title: "Clarity", body: "Guests find what they need, fast." },
  { title: "Care", body: "Every brand handled with attention." },
  { title: "Impact", body: "Design that lifts direct enquiries." },
];

export const problems = [
  { title: "Outdated design", body: "The site looks older than the property." },
  { title: "Poor on mobile", body: "Most guests arrive on a phone — and leave." },
  { title: "Hidden booking path", body: "Enquiries buried behind slow journeys." },
  { title: "Generic templates", body: "Nothing sets the hotel apart." },
  { title: "Weak first impression", body: "Photos never show the real experience." },
  { title: "Low visibility", body: "Search sends guests to third parties." },
];

export const solutions = [
  { title: "Hotel-first design", body: "Rooms, dining and amenities, the way guests browse." },
  { title: "Mobile-first build", body: "Designed for the phone, scaled up with intent." },
  { title: "Direct enquiries", body: "Forms and WhatsApp in one clear path." },
  { title: "Speed & SEO", body: "Fast, search-ready foundations." },
  { title: "Visual storytelling", body: "Galleries that show the property at its best." },
  { title: "Built to grow", body: "New pages and offers without a rebuild." },
];

export const whyMenovo = [
  { title: "Hotel specialization", body: "Hotels only — the patterns are already solved." },
  { title: "Luxury craftsmanship", body: "Editorial type, whitespace, considered motion." },
  { title: "Global service", body: "Independent hotels and groups worldwide." },
  { title: "Long-term partnership", body: "Support after launch, not a hand-off." },
];

export const processSteps = [
  { step: "01", title: "Discovery", body: "We learn your property, guests and goals." },
  { step: "02", title: "Design", body: "Editorial layouts drawn from your identity." },
  { step: "03", title: "Development", body: "Fast, responsive, SEO-ready build." },
  { step: "04", title: "Launch & support", body: "Careful go-live, then ongoing care." },
];

export const faqs = [
  { q: "What hotels do you work with?", a: "Independent hotels, boutiques, resorts, guest houses and small groups." },
  { q: "Do you only build hotel websites?", a: "Hotels are our specialization. We also build business websites as a secondary service." },
  { q: "Do you use templates?", a: "No. Every site is designed for your property." },
  { q: "Can you redesign an existing site?", a: "Yes — we keep what works and replace what doesn't." },
  { q: "Will it work on phones?", a: "Yes. We design mobile-first." },
  { q: "Can you add WhatsApp?", a: "Yes — one-tap enquiry buttons." },
  { q: "Can guests request bookings?", a: "Yes. We build enquiry flows and can link your booking engine." },
  { q: "Do you offer maintenance?", a: "Yes — updates, upkeep and performance." },
  { q: "Do you work internationally?", a: "Yes, worldwide, in English." },
  { q: "How long does it take?", a: "It depends on size and content readiness. We confirm a schedule up front." },
  { q: "How do I start?", a: "Message us on the contact page or WhatsApp." },
];

/** Add portfolio projects here — the page renders a coming-soon state while empty. */
export type PortfolioItem = {
  slug: string;
  title: string;
  client: string;
  category: string;
  description: string;
  image?: string;
  video?: string;
  url?: string;
};
export const portfolioItems: PortfolioItem[] = [];

/** Add blog posts here — the page renders a coming-soon state while empty. */
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image?: string;
};
export const blogPosts: BlogPost[] = [];
