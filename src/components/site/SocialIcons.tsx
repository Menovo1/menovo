import { useEffect, useState } from "react";
import { platformDef } from "@/content/social-platforms";
import type { SocialLink } from "@/lib/public-content.functions";

export function SocialIcons({
  links,
  surface,
  className = "",
}: {
  links: SocialLink[];
  /** Which placement to render. */
  surface: "footer" | "contact" | "founder";
  className?: string;
}) {
  // Social links come from a client-cached query, so rendering them during SSR
  // can produce a hydration mismatch. Render after hydration only.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const visible = links
    .filter((l) => l.enabled && l.url.trim())
    .filter((l) =>
      surface === "footer" ? l.show_footer : surface === "contact" ? l.show_contact : l.show_founder !== false,
    );

  if (!hydrated || visible.length === 0) return null;

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
