import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";

import portfolioImg from "@/assets/portfolio-hotel.jpg";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — MENOVO" },
      { name: "description", content: "Selected projects by MENOVO — websites and digital menus for hotels, restaurants and cafés." },
      { property: "og:title", content: "Portfolio — MENOVO" },
      { property: "og:description", content: "A quiet showcase of hospitality-first digital craft." },
      { property: "og:image", content: portfolioImg },
      { name: "twitter:image", content: portfolioImg },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  return (
    <div className="pt-28">
      <Section eyebrow="Portfolio" title={<>A quiet showcase of <span className="text-gradient-gold">craft.</span></>} subtitle="Each project is an invitation to discover a hospitality brand in its fullest expression online.">
        <div className="grid md:grid-cols-2 gap-6">
          <article className="group relative overflow-hidden rounded-3xl border border-gold/15">
            <img src={portfolioImg} alt="Aurea Hotel & Suites" width={1400} height={1000} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-gold px-2 py-1 rounded-full border border-gold/40">Hotel</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-gold/80 px-2 py-1 rounded-full border border-gold/20">Website</span>
              </div>
              <h3 className="mt-3 text-2xl font-display font-semibold">Aurea Hotel & Suites</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                A complete digital presence for a boutique hotel—booking integration, multilingual menu, and a brand story that feels as warm as the lobby.
              </p>
              <Link to="/contact" className="mt-5 inline-flex items-center gap-1 text-sm text-gold hover:gap-2 transition-all">
                View project <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>

          <div className="grid gap-6">
            {["Cafés", "Restaurants", "Boutique Hotels"].map((t) => (
              <div key={t} className="card-luxe p-8">
                <div className="text-[10px] uppercase tracking-[0.22em] text-gold">Coming soon</div>
                <h3 className="mt-2 text-xl font-display font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">New MENOVO projects launching soon. Want yours featured next?</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>

  );
}
