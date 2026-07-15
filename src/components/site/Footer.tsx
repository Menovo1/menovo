import { Link } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import logoAsset from "@/assets/menovo-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-gold/15">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 grid gap-6 sm:grid-cols-2 items-start">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="MENOVO" width={40} height={40} className="h-10 w-10 rounded-full ring-1 ring-gold/40" />
            <div className="font-display font-bold text-lg tracking-wide text-gradient-gold">MENOVO</div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground max-w-sm leading-relaxed">
            We help hotels, restaurants and cafés become digitally visible with beautiful websites and QR menus—fast, affordable, and effortlessly elegant.
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <li><Link to="/privacy" className="text-foreground/80 hover:text-gold">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-foreground/80 hover:text-gold">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="sm:text-right">
          <ul className="flex flex-col sm:items-end gap-2 text-xs">
            <li className="flex items-center gap-2 text-foreground/80"><MessageCircle className="h-3.5 w-3.5 text-gold" /> +251 777775911</li>
            <li className="flex items-center gap-2 text-foreground/80"><Mail className="h-3.5 w-3.5 text-gold" /> 2MENOVO@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          © 2026 MENOVO.PRO — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
