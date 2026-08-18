import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/content/site";
import { cmsText } from "@/content/cms";
import { useSiteOptional } from "@/lib/site-data";
import { ThemeToggle } from "./ThemeToggle";

export const FALLBACK_LOGO = "/brand/menovo-logo.png";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const data = useSiteOptional();

  const logo = cmsText(data?.content, "identity", "logoUrl") || FALLBACK_LOGO;
  const siteName = cmsText(data?.content, "identity", "siteName") || site.name;
  const tagline = cmsText(data?.content, "identity", "tagline") || site.tagline;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const onHome = location.pathname === "/";
  const light = onHome && !scrolled && !open;
  const current = navLinks.find((l) => l.to === location.pathname);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-background/95 backdrop-blur-md border-b border-border py-3"
          : "py-5 border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0 min-w-0">
          <img
            src={logo}
            alt={`${siteName} — hotel web design agency`}
            width={40}
            height={40}
            className="h-10 w-10 object-contain shrink-0"
          />
          <span className="leading-none min-w-0">
            <span
              className={`block font-display text-xl tracking-[0.18em] font-semibold transition-colors ${
                light ? "text-white" : "text-foreground"
              }`}
            >
              {siteName}
            </span>
            <span
              className={`block mt-1 text-[9px] uppercase tracking-[0.22em] truncate transition-colors ${
                light ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              <span className="lg:hidden">{current ? current.label : tagline}</span>
              <span className="hidden lg:inline">{tagline}</span>
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                aria-current={active ? "page" : undefined}
                className={`link-underline text-[13px] tracking-wide transition-colors ${
                  light
                    ? active
                      ? "text-white"
                      : "text-white/75 hover:text-white"
                    : active
                      ? "text-gold-deep"
                      : "text-foreground/70 hover:text-foreground"
                } ${active ? "font-medium" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle light={light} />
          <Link
            to="/contact"
            className={`px-6 py-2.5 text-[13px] tracking-wide ${light ? "btn-light" : "btn-primary"}`}
          >
            Get Started
          </Link>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle light={light} />
          <button
            className={`p-2 ${light ? "text-white" : "text-foreground"}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ${
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-6 mt-4 mb-3 border-t border-border pt-3 flex flex-col">
          {navLinks.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                aria-current={active ? "page" : undefined}
                className={`py-3 border-b border-border/60 text-sm tracking-wide ${
                  active ? "text-gold-deep font-medium" : "text-foreground/80"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link to="/contact" className="mt-5 btn-primary px-6 py-3 text-center text-sm tracking-wide">
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
