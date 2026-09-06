import { platformDef } from "@/content/social-platforms";
import type { SocialLink } from "@/lib/public-content.functions";

export function SocialIcons({
  links,
  surface,
  className = "",
}: {
  links: SocialLink[];
  /** Which placement to render. */
  surface: "footer" | "contact";
  className?: string;
}) {
  const visible = links
    .filter((l) => l.enabled && l.url.trim())
    .filter((l) => (surface === "footer" ? l.show_footer : l.show_contact));

  if (visible.length === 0) return null;

  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {visible.map((link) => {
        const def = platformDef(link.platform);
        return (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={def.label}
              title={def.label}
              className="glass grid h-11 w-11 place-items-center rounded-full text-foreground/75 transition-all duration-300 hover:-translate-y-0.5 hover:text-gold-deep"
            >
              {def.icon}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
