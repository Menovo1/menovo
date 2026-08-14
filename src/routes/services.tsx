import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Hotel Website Design & Development | MENOVO" },
      {
        name: "description",
        content:
          "Hotel website development, business websites and website maintenance. MENOVO designs premium, mobile-first hotel websites built to convert.",
      },
      { property: "og:title", content: "Services — Hotel Website Design & Development | MENOVO" },
      {
        property: "og:description",
        content: "Premium hotel website development, plus business websites and ongoing maintenance.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://menovo.lovable.app/services" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://menovo.lovable.app/services" }],
  }),
  component: ServicesPage,
});

const hotelCapabilities = [
  ["Premium homepage", "A cinematic first impression that reflects the property."],
  ["Rooms & suites", "Room types, details, photography and clear comparison."],
  ["Amenities & services", "Spa, pool, business facilities, transfers and more."],
  ["Restaurant & dining", "Menus, hours and atmosphere presented beautifully."],
  ["Gallery", "Editorial galleries built for high-quality hotel photography."],
  ["Offers & packages", "Seasonal offers and packages you can update anytime."],
  ["About the hotel", "The story, location and character of the property."],
  ["Location & map", "Directions, nearby landmarks and travel information."],
  ["Contact & WhatsApp", "One-tap guest contact from any page or device."],
  ["Booking & enquiry flows", "Request forms, or a link to your booking engine."],
  ["Mobile optimization", "Designed phone-first, refined for every screen."],
  ["SEO-ready structure", "Semantic markup, metadata and clean URLs."],
  ["Performance", "Optimized media and fast loading on slower connections."],
  ["Analytics-ready", "Prepared for the analytics tools you choose."],
  ["Custom sections", "Anything specific to your property, built for you."],
  ["Conversion-focused", "Every page guides the guest toward an enquiry."],
];

function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything a hotel needs online, built with care."
        subtitle="Our work centres on one specialization: premium hotel website design and development."
      />

      {/* PRIMARY */}
      <Section eyebrow="Primary service" title="Hotel Website Development">
        <Reveal className="max-w-2xl -mt-6 mb-12">
          <p className="text-muted-foreground leading-relaxed">
            We design and develop complete, premium websites specifically for hotels — from the first
            impression to the final enquiry. Every project is built around your rooms, your services
            and your guests.
          </p>
        </Reveal>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4 border border-border">
          {hotelCapabilities.map(([t, b], i) => (
            <Reveal key={t} delay={Math.min(i, 8) * 50} className="bg-background p-6">
              <h3 className="font-display text-xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={150} className="mt-10">
          <Link to="/contact" className="btn-primary inline-block px-9 py-4 text-sm tracking-wide">
            Get Started
          </Link>
        </Reveal>
      </Section>

      {/* SECONDARY + MAINTENANCE */}
      <Section className="bg-secondary" eyebrow="Also available">
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal className="bg-background border border-border p-8 sm:p-10">
            <div className="eyebrow">Secondary service</div>
            <h2 className="mt-4 font-display text-3xl">Business Website Development</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Beyond hotels, we occasionally build websites for other businesses that value the same
              standard of design and performance. The craft is identical — hotels simply remain our
              specialization.
            </p>
          </Reveal>
          <Reveal delay={120} className="bg-background border border-border p-8 sm:p-10">
            <div className="eyebrow">Ongoing</div>
            <h2 className="mt-4 font-display text-3xl">Website Maintenance</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {[
                "Content and seasonal updates",
                "Technical maintenance and upkeep",
                "Performance improvements",
                "Security-related maintenance",
                "Minor design and content changes",
                "Ongoing support and troubleshooting",
              ].map((x) => (
                <li key={x} className="border-b border-border pb-2">
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section align="center" title="Let's talk about your hotel." subtitle="Share your property and goals — we'll outline the right approach.">
        <Reveal className="flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="btn-primary px-9 py-4 text-sm tracking-wide">
            Get Started
          </Link>
          <Link to="/portfolio" className="btn-outline px-9 py-4 text-sm tracking-wide">
            See Our Work
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
