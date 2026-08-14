/**
 * Central content configuration for MENOVO.
 * Update contact details, navigation, services, FAQ, portfolio and blog here.
 */

export const site = {
  name: "MENOVO",
  tagline: "From Table to Screen.",
  positioning: "A premium web-development agency specialized exclusively in hotel websites.",
  url: "https://menovo.lovable.app",
  email: "2MENOVO@gmail.com",
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
  { to: "/portfolio", label: "Portfolio" },
  { to: "/faq", label: "FAQ" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export const values = [
  { title: "Elegance", body: "Design restraint over decoration. Every detail earns its place." },
  { title: "Clarity", body: "Guests find rooms, rates and answers without friction." },
  { title: "Care", body: "We treat each hotel's brand with the attention it deserves." },
  { title: "Impact", body: "Beautiful work that measurably improves direct enquiries." },
];

export const problems = [
  { title: "Outdated design", body: "The website looks a decade older than the property itself." },
  { title: "Poor mobile experience", body: "Most guests arrive on a phone and leave within seconds." },
  { title: "Hidden booking path", body: "Enquiries get buried behind unclear, slow journeys." },
  { title: "Generic templates", body: "Nothing distinguishes the hotel from every other listing." },
  { title: "Weak first impression", body: "Photography and story fail to convey the real experience." },
  { title: "Low visibility", body: "Search and social send guests to third parties instead." },
];

export const solutions = [
  { title: "Hotel-first design", body: "Rooms, suites, amenities and dining presented the way guests actually browse." },
  { title: "Mobile-first build", body: "Layouts designed for the phone first, then scaled up with intent." },
  { title: "Direct enquiry flows", body: "Booking requests, forms and WhatsApp in one clear guest journey." },
  { title: "Performance & SEO", body: "Fast, semantic, search-ready structure built for long-term growth." },
  { title: "Visual storytelling", body: "Galleries and editorial layouts that show the property at its best." },
  { title: "Built to grow", body: "Maintenance, new pages and seasonal offers without a rebuild." },
];

export const whyMenovo = [
  { title: "Hotel specialization", body: "We build for hotels only — the patterns, questions and journeys are already solved." },
  { title: "Luxury craftsmanship", body: "Editorial typography, generous whitespace and considered motion." },
  { title: "Global service", body: "We work with independent hotels and groups worldwide, in English." },
  { title: "Long-term partnership", body: "Ongoing maintenance and updates after launch, not a hand-off." },
];

export const processSteps = [
  { step: "01", title: "Discovery", body: "We learn your property, guests, rooms, positioning and goals." },
  { step: "02", title: "Strategy", body: "Sitemap, content plan and guest journey mapped before design starts." },
  { step: "03", title: "Design", body: "Editorial layouts and a visual language drawn from your hotel's identity." },
  { step: "04", title: "Development", body: "Fast, responsive, SEO-ready build with enquiry and WhatsApp flows." },
  { step: "05", title: "Review", body: "You review on real devices; we refine content, imagery and details." },
  { step: "06", title: "Launch", body: "Domain, analytics-ready setup and a careful, checked go-live." },
  { step: "07", title: "Ongoing support", body: "Updates, maintenance and improvements as the hotel evolves." },
];

export const faqs = [
  { q: "What type of hotels do you work with?", a: "Independent hotels, boutique properties, resorts, guest houses and small hotel groups. Whether you have eight rooms or eighty, the process is the same." },
  { q: "Do you only work with hotels?", a: "Hotels are our specialization and the core of our work. We also build business websites as a secondary service, but hotel projects are where we focus." },
  { q: "Do you build hotel websites from scratch?", a: "Yes. Every project is designed and developed specifically for your property — no recycled templates." },
  { q: "Can you redesign an existing hotel website?", a: "Yes. We can rebuild an existing site, keeping the content and imagery that still work and replacing what doesn't." },
  { q: "Will the website work on phones?", a: "Yes. We design mobile-first, because most guests will discover your hotel on a phone." },
  { q: "Can you integrate WhatsApp?", a: "Yes. We can add WhatsApp enquiry buttons so guests reach your team in one tap." },
  { q: "Can the website support booking requests?", a: "Yes. We build enquiry and booking-request flows, and can link to an existing booking engine if you use one." },
  { q: "Do you provide website maintenance?", a: "Yes. Maintenance covers content updates, technical upkeep, performance and ongoing support." },
  { q: "Do you work with hotels internationally?", a: "Yes. We work with hotels worldwide and communicate in English." },
  { q: "How long does a hotel website project take?", a: "Timelines depend on the size of the property and how ready your content and photography are. We confirm a schedule during discovery." },
  { q: "Can MENOVO update the website after launch?", a: "Yes. Post-launch updates are part of our maintenance service." },
  { q: "How do I start a project?", a: "Send us a message through the contact page or WhatsApp. We'll arrange a short call to understand your hotel." },
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
