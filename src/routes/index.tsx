import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { Hero } from "@/components/site/Hero";

import {
  Globe, QrCode, LayoutGrid, BadgeDollarSign, Zap, Sparkles, Smartphone, Workflow, LifeBuoy,
  ArrowRight, ChevronDown,
} from "lucide-react";

import aboutImg from "@/assets/about-menu.jpg";
import portfolioImg from "@/assets/portfolio-hotel.jpg";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MENOVO — From Table to Screen | Hospitality Websites & QR Menus" },
      { name: "description", content: "Premium websites and digital QR menus for hotels, restaurants and cafés. Honest pricing, luxury design, fast delivery." },
    ],
  }),
  component: Home,
});

const services = [
  { icon: Globe, title: "Website Design", desc: "Professional, elegant websites tailored for hotels, restaurants and cafés." },
  { icon: QrCode, title: "Digital Menus", desc: "Beautiful QR menus your customers will love—fast, mobile, effortless." },
  { icon: LayoutGrid, title: "Website + Digital Menu", desc: "The complete digital package—one cohesive experience end to end." },
];

const why = [
  { icon: BadgeDollarSign, t: "Affordable Pricing", d: "What you see is what you pay. No hidden fees." },
  { icon: Zap, t: "Fast Delivery", d: "Your time is valuable. We move quickly and precisely." },
  { icon: Sparkles, t: "Luxury Design", d: "Timeless aesthetics that reflect your hospitality." },
  { icon: Smartphone, t: "Mobile Friendly", d: "Beautiful on every screen, from pocket to desktop." },
  { icon: Workflow, t: "Simple Process", d: "No technical knowledge required. We handle everything." },
  { icon: LifeBuoy, t: "24/7 Support", d: "We are always here—whenever you need us." },
];

const steps: never[] = [];


const faqs = [
  { q: "How long does a project take?", a: "Most projects launch within 3–10 days depending on scope." },
  { q: "Can I upgrade later?", a: "Absolutely. Every package is designed to grow with you." },
  { q: "Do you redesign existing websites?", a: "Yes—we love giving tired sites a luxurious refresh." },
  { q: "Do I need technical knowledge?", a: "None at all. We handle the technical side completely." },
  { q: "How do payments work?", a: "Transparent, upfront pricing. What you see is what you pay." },
  { q: "Can you update my menu?", a: "Yes—updates are included with Standard and Premium plans." },
  { q: "Do you provide support?", a: "We're available 24/7 via WhatsApp and email." },
  { q: "How do I book a call?", a: "Use the Book a Call button or message us on WhatsApp." },
];

function Home() {
  return (
    <>
      <Hero />

      {/* About */}
      <Section id="about" eyebrow="About MENOVO" title={<>We put every hospitality brand on the <span className="text-gradient-gold">map.</span></>}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-foreground/85 leading-relaxed">
            <p>Too many great hotels, restaurants and cafeterias go unnoticed—not because their food is bad, but because nobody can find them online.</p>
            <p><span className="text-gold font-semibold">MENOVO exists to change that.</span> We make it simple and affordable for any restaurant, café, or hotel to have a professional digital presence.</p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="glass rounded-xl p-4">
                <div className="text-sm uppercase tracking-widest text-gold font-semibold">Mission</div>
                <p className="mt-2 text-sm text-muted-foreground">Make every HOTEL, RESTAURANT and CAFÉ digitally visible—simply and affordably.</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="text-sm uppercase tracking-widest text-gold font-semibold">Vision</div>
                <p className="mt-2 text-sm text-muted-foreground">A future where no great CAFÉ, RESTAURANT or HOTEL goes undiscovered.</p>
              </div>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-gold/20 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
            <img src={aboutImg} alt="Digital menu on a marble café table" width={1400} height={1400} loading="lazy" className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
          </div>
        </div>
      </Section>

      {/* What We Do */}
      <Section eyebrow="What We Do" title={<>Three services. One <span className="text-gradient-gold">seamless</span> experience.</>}>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="card-luxe p-8 group">
              <div className="h-12 w-12 grid place-items-center rounded-xl bg-gold/10 text-gold group-hover:bg-gold group-hover:text-navy transition">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-display font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <Link to="/services" className="mt-6 inline-flex items-center gap-1 text-sm text-gold hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section eyebrow="What We Believe" title={<>Values that guide every <span className="text-gradient-gold">project.</span></>}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { t: "Elegance", d: "Luxurious, timeless design." },
            { t: "Clarity", d: "Honest, simple communication." },
            { t: "Care", d: "Every brand treated as our own." },
            { t: "Impact", d: "Real results you can measure." },
          ].map((v) => (
            <div key={v.t} className="card-luxe p-6">
              <div className="text-xs uppercase tracking-widest text-gold">{v.t}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </Section>


      {/* Why Choose */}
      <Section eyebrow="Why MENOVO" title={<>Crafted for hospitality. Built for <span className="text-gradient-gold">results.</span></>}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {why.map((w) => (
            <div key={w.t} className="card-luxe p-6">
              <w.icon className="h-6 w-6 text-gold" />
              <h4 className="mt-4 font-semibold">{w.t}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{w.d}</p>
            </div>
          ))}
        </div>
      </Section>


      {/* Portfolio preview */}
      <Section eyebrow="Selected Work" title={<>A quiet showcase of <span className="text-gradient-gold">craft.</span></>}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="group relative overflow-hidden rounded-3xl border border-gold/15">
            <img src={portfolioImg} alt="Luxury hotel lobby" width={1400} height={1000} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="text-[10px] uppercase tracking-[0.22em] text-gold">Hospitality · Website</div>
              <h3 className="mt-2 text-2xl font-display font-semibold">Aurea Hotel & Suites</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">Complete digital presence with booking integration and multilingual menu.</p>
              <Link to="/portfolio" className="mt-4 inline-flex items-center gap-1 text-sm text-gold">View project <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="card-luxe p-8">
              <div className="text-[10px] uppercase tracking-[0.22em] text-gold">Coming Soon</div>
              <h3 className="mt-2 text-xl font-display font-semibold">More projects loading…</h3>
              <p className="mt-2 text-sm text-muted-foreground">We're currently onboarding new hospitality partners across cafés, bistros and boutique hotels.</p>
            </div>
            <div className="card-luxe p-8 flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-gold">Your brand next?</div>
                <h3 className="mt-2 text-xl font-display font-semibold">Let's put your business on the map.</h3>
              </div>
              <Link to="/contact" className="mt-6 rounded-full btn-gold px-5 py-3 text-sm text-center">Start your project</Link>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow="FAQ" title={<>Questions, <span className="text-gradient-gold">answered.</span></>}>
        <Faq />
      </Section>

    </>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <button
            key={f.q}
            onClick={() => setOpen(isOpen ? null : i)}
            className="w-full text-left card-luxe p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">{f.q}</span>
              <ChevronDown className={`h-5 w-5 text-gold transition ${isOpen ? "rotate-180" : ""}`} />
            </div>
            <div className={`grid transition-all duration-500 ${isOpen ? "grid-rows-[1fr] mt-3 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden text-sm text-muted-foreground">{f.a}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
