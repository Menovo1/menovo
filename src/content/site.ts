/**
 * Central content configuration for MENOVO.
 * Update contact details, navigation, services, FAQ, portfolio and blog here.
 */

export const site = {
  name: "MENOVO",
  tagline: "From Idea to Impact.",
  positioning: "A premium digital agency creating distinctive websites and digital experiences for modern businesses.",
  url: "https://menovo.lovable.app",
  email: "info@menovo.agency",
  whatsappNumber: "+251946471234",
  whatsappDigits: "251946471234",
  socialsComingSoon: true,
} as const;

export const whatsappLink = (message = "Hello MENOVO, I'd like to talk about a website for my business.") =>
  `https://wa.me/${site.whatsappDigits}?text=${encodeURIComponent(message)}`;

export const emailLink = (subject = "Website enquiry") =>
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
  { title: "Clarity", body: "Customers find what they need, fast." },
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
  { title: "Business-first design", body: "Products, services and key offerings, presented the way customers choose." },
  { title: "Mobile-first build", body: "Designed for the phone, scaled up with intent." },
  { title: "Direct enquiries", body: "Forms and WhatsApp in one clear path." },
  { title: "Speed & SEO", body: "Fast, search-ready foundations." },
  { title: "Visual storytelling", body: "Galleries that show the property at its best." },
  { title: "Built to grow", body: "New pages and offers without a rebuild." },
];

export const whyMenovo = [
  { title: "Hotel specialization", body: "Business-focused thinking — strategy, design and technology aligned to your goals." },
  { title: "Luxury craftsmanship", body: "Editorial type, whitespace, considered motion." },
  { title: "Global service", body: "Businesses and organizations worldwide." },
  { title: "Long-term partnership", body: "Support after launch, not a hand-off." },
];

export const processSteps = [
  { step: "01", title: "Discovery", body: "We learn your business, audience and goals." },
  { step: "02", title: "Design", body: "Editorial layouts drawn from your identity." },
  { step: "03", title: "Development", body: "Fast, responsive, SEO-ready build." },
  { step: "04", title: "Launch & support", body: "Careful go-live, then ongoing care." },
];

export const faqs = [
  { q: "What kinds of businesses do you work with?", a: "Businesses, organizations, startups, professional firms and growing brands." },
  { q: "What industries do you work with?", a: "We work across industries — including hospitality, fashion, real estate, education, healthcare, restaurants, professional services and more." },
  { q: "Do you use templates?", a: "No. Every site is designed around your brand, audience and goals." },
  { q: "Can you redesign an existing site?", a: "Yes — we keep what works and replace what doesn't." },
  { q: "Will it work on phones?", a: "Yes. We design mobile-first." },
  { q: "Can you add WhatsApp?", a: "Yes — one-tap enquiry buttons." },
  { q: "Can customers request appointments or enquiries?", a: "Yes. We build clear enquiry, appointment and conversion flows around the tools your business already uses." },
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
