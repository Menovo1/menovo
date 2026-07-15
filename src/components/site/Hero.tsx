import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { Counter } from "./Counter";

export function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16"
      style={{
        background:
          "radial-gradient(600px circle at var(--mx,50%) var(--my,30%), oklch(0.76 0.14 75 / 0.18), transparent 55%), var(--gradient-navy)",
      }}
    >
      {/* grid overlay */}
      <div className="absolute inset-0 grid-gold opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      {/* glow orbs */}
      <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-accent/25 blur-3xl animate-glow-pulse" />

      {/* particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-gold/60 animate-float"
          style={{
            top: `${(i * 53) % 100}%`,
            left: `${(i * 37) % 100}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${6 + (i % 5)}s`,
          }}
        />
      ))}

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold animate-fade-up">
          <Sparkles className="h-3.5 w-3.5" /> Hospitality · Digital · Elegant
        </div>

        <h1 className="mt-8 font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <span className="text-gradient-gold">From Table</span>
          <br />
          <span className="text-foreground">to Screen.</span>
        </h1>

        <p className="mt-8 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Welcome to <span className="text-gold font-semibold">MENOVO</span>. Where exceptional hospitality meets timeless digital elegance—helping every table reach every screen with style, simplicity and purpose.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full btn-gold px-7 py-3.5 text-sm">
            Get Started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Link>
          <a href="https://wa.me/251777775911" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full btn-ghost-gold px-7 py-3.5 text-sm">
            Book a Call
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
          {[
            { n: 50, suffix: "+", v: "Projects" },
            { n: 24, suffix: "/7", v: "Support" },
            { n: 100, suffix: "%", v: "Passion" },
          ].map((s) => (
            <div key={s.v} className="glass rounded-2xl px-4 py-3">
              <div className="text-xl sm:text-2xl font-display font-bold text-gradient-gold">
                <Counter end={s.n} suffix={s.suffix} />
              </div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/70 hover:text-gold transition">
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}
