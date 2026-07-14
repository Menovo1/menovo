import { createFileRoute } from "@tanstack/react-router";

import { Check, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import heroRestaurant from "@/assets/hero-restaurant.jpg";
import aboutMenu from "@/assets/about-menu.jpg";
import portfolioHotel from "@/assets/portfolio-hotel.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — MENOVO" },
      { name: "description", content: "Website design, digital QR menus and complete bundles for hotels, restaurants and cafés. Transparent pricing starting at $4." },
      { property: "og:title", content: "Services & Pricing — MENOVO" },
      { property: "og:description", content: "Everything your hospitality business needs online — beautifully priced." },
    ],
  }),
  component: Services,
});

type Plan = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  popular?: boolean;
  waMsg: string;
};

const menuPlans: Plan[] = [
  {
    name: "Basic",
    price: "$4",
    desc: "Perfect for getting started with a simple digital presence.",
    features: ["QR Code", "Text Menu", "Basic Categories", "No Updates"],
    waMsg: "the Basic Digital Menu plan",
  },
  {
    name: "Standard",
    price: "$10",
    popular: true,
    desc: "The most popular choice for growing restaurants and cafés.",
    features: ["Professional QR Code", "QR Poster Included", "Photo Menu", "Organized Categories", "30 Days Updates"],
    waMsg: "the Standard Digital Menu plan",
  },
  {
    name: "Premium",
    price: "$25",
    desc: "Luxury presentation for discerning establishments.",
    features: ["Luxury QR Menu", "Premium QR Poster", "Luxury Menu Design", "Photos Included", "Featured Categories", "Unlimited Updates"],
    waMsg: "the Premium Digital Menu plan",
  },
];

const websitePlans: Plan[] = [
  {
    name: "Basic",
    price: "$10",
    desc: "A clean starter site to get your business found online.",
    features: ["Up to 3 pages", "Contact form", "Google Maps embed", "Mobile responsive"],
    waMsg: "the Basic Website plan",
  },
  {
    name: "Standard",
    price: "$25",
    popular: true,
    desc: "A refined website with SEO and ongoing polish.",
    features: ["Up to 8 pages", "Premium design", "SEO optimization", "Analytics setup", "30 days of updates"],
    waMsg: "the Standard Website plan",
  },
  {
    name: "Premium",
    price: "$39",
    desc: "A complete website with bookings, payments and support.",
    features: ["Unlimited pages", "Booking form", "Payment integration", "Security monitoring", "Unlimited updates"],
    waMsg: "the Premium Website plan",
  },
];

const bundlePlans: Plan[] = [
  {
    name: "Bundle Deal",
    price: "$29",
    popular: true,
    desc: "Everything you need — website and digital menu, together.",
    features: ["Professional Website", "Digital QR Menu", "Free QR Poster", "30 Days Free Support"],
    waMsg: "the Website + Digital Menu Bundle Deal",
  },
];

const tabs = [
  { key: "menu", label: "Digital Menu", plans: menuPlans },
  { key: "web", label: "Website", plans: websitePlans },
  { key: "bundle", label: "Website + Digital Menu", plans: bundlePlans },
] as const;


function wa(msg: string) {
  return `https://wa.me/251946471234?text=${encodeURIComponent(`Hello MENOVO,\n\nI'm interested in ${msg}.`)}`;
}

function Services() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("menu");
  const active = tabs.find((t) => t.key === tab)!;

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-28 pb-8 sm:pt-36 sm:pb-12 overflow-hidden" style={{ background: "var(--gradient-navy)" }}>
        <div className="absolute inset-0 grid-gold opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[40rem] rounded-full bg-gold/15 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 text-center">
          <div className="inline-flex items-center rounded-full glass px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-gold">
            Our Services
          </div>
          <h1 className="mt-4 font-display font-bold text-4xl sm:text-6xl md:text-7xl leading-[1.02]">
            Everything your business
            <br />
            <span className="text-gradient-gold">needs online</span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg leading-relaxed">
            Choose from our carefully crafted service packages — designed specifically for hotels, restaurants, and cafés of every size and budget.
          </p>
        </div>
      </section>


      {/* Service block 1: Digital QR Menus */}
      <ServiceBlock
        image={aboutMenu}
        eyebrow="Menus customers love to use"
        title="Digital QR Menus"
        desc="Replace printed menus with a beautiful digital experience. Customers scan your QR code and instantly see your full menu with photos, categories, and prices — all on their own phone. Update anytime without reprinting."
        features={[
          "No more printing costs or outdated menus",
          "Update prices and items in real-time",
          "Beautiful photo presentation",
          "Works on any smartphone",
          "Includes professional QR code and poster",
        ]}
        cta="Get Digital QR Menus"
        href={wa("Digital QR Menus")}
      />

      {/* Service block 2: Website Design (reversed) */}
      <ServiceBlock
        reverse
        image={heroRestaurant}
        eyebrow="Your business, beautifully online"
        title="Website Design"
        desc="A professional website is the foundation of your digital presence. We design and build fast, beautiful, mobile-first websites that help hotels, restaurants, and cafés get found on Google and convert visitors into customers."
        features={[
          "Rank higher on Google with built-in SEO",
          "Customers can find your location instantly",
          "Accept reservations and inquiries online",
          "Works perfectly on every device",
          "Fast loading — under 2 seconds",
        ]}
        cta="Get Website Design"
        href={wa("Website Design")}
      />

      {/* Service block 3: Bundle */}
      <ServiceBlock
        image={portfolioHotel}
        eyebrow="One cohesive brand experience"
        title="Website + Digital Menu"
        desc="Get the complete digital package — a stunning website and a luxurious QR menu that share the same brand identity. One team, one vision, one seamless experience from table to screen."
        features={[
          "Matching brand design across web and menu",
          "Single point of contact and support",
          "Best value — save vs. buying separately",
          "Free QR poster included",
          "30 days of free support",
        ]}
        cta="Get the Bundle"
        href={wa("the Website + Digital Menu bundle")}
      />


      {/* Pricing */}
      <section id="pricing" className="relative py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-gold">
              Pricing
            </div>
            <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl leading-tight">
              Transparent pricing, <span className="text-gradient-gold">zero surprises</span>
            </h2>
            <p className="mt-2 text-muted-foreground text-base sm:text-lg">
              One-time payments. No subscriptions. No hidden fees.
            </p>
          </div>

          {/* Category tabs */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {tabs.map((t) => {
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "bg-gold text-navy shadow-gold"
                      : "glass text-foreground/80 hover:text-gold"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>


          {/* Plan cards — horizontally scrollable */}
          <div className="mt-8 -mx-5 sm:-mx-8 px-5 sm:px-8 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:thin]">
            <div className="flex gap-6 pb-4 md:justify-center">
              {active.plans.map((p) => (
                <div
                  key={p.name}
                  className={`relative card-luxe p-8 flex flex-col shrink-0 snap-center w-[85vw] sm:w-[360px] ${
                    p.popular ? "ring-1 ring-gold/60" : ""
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full btn-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1">
                      <Star className="h-3 w-3" /> Recommended
                    </div>
                  )}
                  <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{p.name}</div>
                  <p className="mt-3 text-sm text-muted-foreground min-h-[3rem]">{p.desc}</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-5xl font-display font-bold text-gradient-gold">{p.price}</span>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">one-time</span>
                  </div>
                  <ul className="mt-8 space-y-3 text-sm flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={wa(p.waMsg)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`mt-8 text-center rounded-full py-3 text-sm ${
                      p.popular ? "btn-gold" : "btn-ghost-gold"
                    }`}
                  >
                    Get {p.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>

  );
}

function ServiceBlock({
  image,
  eyebrow,
  title,
  desc,
  features,
  cta,
  href,
  reverse,
}: {
  image: string;
  eyebrow: string;
  title: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  reverse?: boolean;
}) {
  return (
    <section className="relative py-4 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className={`grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8 items-center ${reverse ? "[&>*:first-child]:order-2" : ""}`}>

          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-gold/20 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]">
            <img src={image} alt={title} loading="lazy" className="w-full h-full object-cover aspect-[4/3]" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
          </div>
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-full glass px-2 py-0.5 text-[9px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.24em] text-gold">
              {eyebrow}
            </div>
            <h2 className="mt-2 font-display font-bold text-lg sm:text-3xl md:text-4xl lg:text-5xl leading-tight">{title}</h2>
            <p className="mt-2 hidden sm:block text-muted-foreground text-sm sm:text-base leading-relaxed">{desc}</p>
            <ul className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full grid place-items-center bg-gold/15 text-gold shrink-0">
                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </span>
                  <span className="text-xs sm:text-sm text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 sm:mt-5 inline-flex items-center gap-2 rounded-full btn-gold px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm group"
            >
              {cta}
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

