import { Link } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import logoAsset from "@/assets/menovo-logo.png.asset.json";
import { navLinks, site, whatsappLink, emailLink } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="MENOVO logo" width={40} height={40} className="h-10 w-10 rounded-full" />
            <span className="font-display text-xl tracking-[0.18em] font-semibold text-foreground">{site.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
            Premium websites built exclusively for hotels — elegant, fast, and made to turn
            visitors into guests.
          </p>
          <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-gold-deep">{site.tagline}</p>
        </div>

        <div>
          <div className="eyebrow">Navigation</div>
          <ul className="mt-5 space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-foreground/70 hover:text-gold-deep transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow">Contact</div>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 text-foreground/70 hover:text-gold-deep transition-colors">
                <MessageCircle className="h-4 w-4 text-gold" /> {site.whatsappNumber}
              </a>
            </li>
            <li>
              <a href={emailLink()} className="flex items-center gap-2 text-foreground/70 hover:text-gold-deep transition-colors">
                <Mail className="h-4 w-4 text-gold" /> {site.email}
              </a>
            </li>
          </ul>
          <div className="eyebrow mt-8">Services</div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Hotel Website Development</li>
            <li>Business Website Development</li>
            <li>Website Maintenance</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 py-8 text-center">
          <Link
            to="/asad-je"
            className="font-display text-2xl sm:text-3xl tracking-[0.06em] inline-block transition-colors hover:text-gold-deep"
          >
            Founded by <span className="text-gold-deep">ASAD JE</span>
          </Link>
        </div>
      </div>


      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} MENOVO. All rights reserved.</span>
          <span className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold-deep transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold-deep transition-colors">Terms of Service</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
