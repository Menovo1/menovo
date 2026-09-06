import { Link } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { navLinks, site, waDigits } from "@/content/site";
import { cmsList, cmsText } from "@/content/cms";
import { useSiteOptional } from "@/lib/site-data";
import { FALLBACK_LOGO } from "./Navbar";
import { SocialIcons } from "./SocialIcons";

export function Footer() {
  const data = useSiteOptional();
  const settings = data?.settings ?? null;

  const logo = cmsText(data?.content, "identity", "logoUrl") || FALLBACK_LOGO;
  const siteName = cmsText(data?.content, "identity", "siteName") || site.name;
  const tagline = cmsText(data?.content, "identity", "tagline") || site.tagline;
  const description = cmsText(data?.content, "footer", "description");
  const founderLabel = cmsText(data?.content, "footer", "founderLabel");
  const founderName = cmsText(data?.content, "footer", "founderName");
  const services = cmsList(data?.content, "footer", "services");

  const whatsapp = settings?.["whatsapp"] || site.whatsappNumber;
  const email = settings?.["email"] || site.email;
  const phone = settings?.["phone"] || "";

  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt={`${siteName} logo`} width={40} height={40} className="h-10 w-10 object-contain" />
            <span className="font-display text-xl tracking-[0.18em] font-semibold text-foreground">{siteName}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">{description}</p>
          <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-gold-deep">{tagline}</p>
          <SocialIcons links={data?.socials ?? []} surface="footer" className="mt-6" />
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
              <a
                href={`https://wa.me/${waDigits(whatsapp)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2 text-foreground/70 hover:text-gold-deep transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-gold" /> {whatsapp}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-foreground/70 hover:text-gold-deep transition-colors"
              >
                <Mail className="h-4 w-4 text-gold" /> {email}
              </a>
            </li>
            {phone && (
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-foreground/70 hover:text-gold-deep transition-colors"
                >
                  <Phone className="h-4 w-4 text-gold" /> {phone}
                </a>
              </li>
            )}
          </ul>
          {services.length > 0 && (
            <>
              <div className="eyebrow mt-8">Services</div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 py-8 text-center">
          <Link
            to="/asad-je"
            className="font-display text-2xl sm:text-3xl tracking-[0.06em] inline-block transition-colors hover:text-gold-deep"
          >
            {founderLabel} <span className="text-gold-deep">{founderName}</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <span>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </span>
          <span className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold-deep transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold-deep transition-colors">Terms of Service</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
