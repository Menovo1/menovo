import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/menovo-logo.png.asset.json";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0 group min-w-0">
          <img src={logoAsset.url} alt="MENOVO" width={40} height={40} className="h-10 w-10 rounded-full ring-1 ring-gold/40 group-hover:ring-gold transition shrink-0" />
          <div className="hidden sm:block leading-none">
            <div className="font-display font-bold text-lg tracking-wide text-gradient-gold">MENOVO</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">From Table to Screen</div>
          </div>
          <div className="sm:hidden leading-none min-w-0">
            <div className="font-display font-bold text-base tracking-wide text-gradient-gold truncate">MENOVO</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gold/80 truncate">
              {links.find((l) => l.to === location.pathname)?.label ?? "Menu"}
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                aria-current={active ? "page" : undefined}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active ? "text-gold bg-gold/10 ring-1 ring-gold/30" : "text-foreground/80 hover:text-gold"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <a href="https://wa.me/251777775911" target="_blank" rel="noreferrer noopener" className="px-4 py-2 rounded-full text-sm btn-ghost-gold">Book a Call</a>
          <Link to="/contact" className="px-5 py-2 rounded-full text-sm btn-gold">Get Started</Link>
        </div>

        <button className="md:hidden p-2 text-gold" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mx-4 mt-3 rounded-2xl glass p-4 animate-fade-up">
          <nav className="flex flex-col">
            {links.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  aria-current={active ? "page" : undefined}
                  className={`px-4 py-3 rounded-lg text-foreground/90 ${active ? "bg-gold/10 text-gold ring-1 ring-gold/30" : "hover:bg-white/5"}`}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href="https://wa.me/251777775911" target="_blank" rel="noreferrer noopener" className="text-center px-4 py-2 rounded-full btn-ghost-gold text-sm">Book a Call</a>
              <Link to="/contact" className="text-center px-4 py-2 rounded-full btn-gold text-sm">Get Started</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
