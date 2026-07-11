import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { PricingCard } from "@/components/site/PricingCard";
import { CTA } from "@/components/site/CTA";
import { Globe, QrCode, LayoutGrid } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — MENOVO" },
      { name: "description", content: "Websites, digital menus, and full digital packages for hotels, restaurants and cafés. Transparent pricing from $4." },
      { property: "og:title", content: "Services & Pricing — MENOVO" },
      { property: "og:description", content: "Websites, digital menus and complete packages for hospitality." },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <div className="pt-28">
      <Section eyebrow="Our Services" title={<>Three services. <span className="text-gradient-gold">Endless possibilities.</span></>} subtitle="Whether you need a single QR menu or a complete digital presence, MENOVO delivers with elegance and care.">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Globe, t: "Website", d: "A professional website that reflects the quality of your hospitality." },
            { icon: QrCode, t: "Digital Menu", d: "A luxurious QR menu your customers will love using." },
            { icon: LayoutGrid, t: "Website + Digital Menu", d: "One complete, cohesive digital experience." },
          ].map((s) => (
            <div key={s.t} className="card-luxe p-8">
              <div className="h-12 w-12 grid place-items-center rounded-xl bg-gold/10 text-gold">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-display font-semibold">{s.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Digital Menu" title="QR menus that feel like fine dining.">
        <div className="grid md:grid-cols-3 gap-6">
          <PricingCard name="Basic" price="$4" features={["QR code", "Text menu", "Basic categories", "No updates"]} />
          <PricingCard name="Standard" price="$10" highlight badge="Most Popular" features={["Professional QR", "QR poster", "Photo menu", "Organized categories", "30 days of updates"]} />
          <PricingCard name="Premium" price="$25" features={["Luxury QR menu", "Premium QR poster", "Luxury menu design", "Photos", "Featured categories", "Unlimited updates"]} />
        </div>
      </Section>

      <Section eyebrow="Website" title="Websites crafted with intention.">
        <div className="grid md:grid-cols-3 gap-6">
          <PricingCard name="Basic" price="$10" features={["Up to 3 pages", "Contact form", "Google Maps"]} />
          <PricingCard name="Standard" price="$25" highlight badge="Most Popular" features={["Up to 8 pages", "Premium design", "SEO optimization", "30 days of updates"]} />
          <PricingCard name="Premium" price="$39" features={["Unlimited pages", "Booking form", "Payment integration", "Security monitoring", "Unlimited updates"]} />
        </div>
      </Section>

      <Section eyebrow="Complete Package" title={<>Website + Digital Menu — <span className="text-gradient-gold">Best Value</span></>}>
        <div className="max-w-2xl mx-auto">
          <PricingCard
            name="Website + Digital Menu"
            price="$29"
            highlight
            badge="Best Value"
            features={[
              "Professional website",
              "Luxury QR menu",
              "Free QR poster",
              "30 days of free support",
              "Cohesive brand experience",
            ]}
          />
        </div>
      </Section>

      <CTA />
    </div>
  );
}
