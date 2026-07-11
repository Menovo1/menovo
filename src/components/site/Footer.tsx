import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/menovo-logo.png.asset.json";
import { Mail, MessageCircle, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-gold/15">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="MENOVO" width={44} height={44} className="h-11 w-11 rounded-full ring-1 ring-gold/40" />
            <div>
              <div className="font-display font-bold text-xl text-gradient-gold">MENOVO</div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">From Table to Screen</div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm text-muted-foreground leading-relaxed">
            We help hotels, restaurants and cafés become digitally visible with beautiful websites and QR menus—fast, affordable, and effortlessly elegant.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gold uppercase tracking-widest">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/services" className="text-foreground/80 hover:text-gold">Services</Link></li>
            <li><Link to="/portfolio" className="text-foreground/80 hover:text-gold">Portfolio</Link></li>
            <li><Link to="/contact" className="text-foreground/80 hover:text-gold">Contact</Link></li>
            <li><Link to="/privacy" className="text-foreground/80 hover:text-gold">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-foreground/80 hover:text-gold">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gold uppercase tracking-widest">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2 text-foreground/80"><MessageCircle className="h-4 w-4 text-gold" /> +251 946 471 234</li>
            <li className="flex items-center gap-2 text-foreground/80"><Mail className="h-4 w-4 text-gold" /> 7menovo@gmail.com</li>
            <li className="flex items-center gap-2 text-foreground/80"><Clock className="h-4 w-4 text-gold" /> Available 24/7</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© 2026 MENOVO.PRO — All Rights Reserved.</div>
          <div className="tracking-widest uppercase text-[10px]">Crafted with elegance · From Table to Screen</div>
        </div>
      </div>
    </footer>
  );
}
