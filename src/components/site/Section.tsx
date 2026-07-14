import type { ReactNode } from "react";

export function Section({ id, eyebrow, title, subtitle, children, className = "" }: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {(eyebrow || title || subtitle) && (
          <div className="max-w-3xl mb-8">
            {eyebrow && (
              <div className="inline-flex items-center rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-gold">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="mt-4 font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight">{title}</h2>
            )}
            {subtitle && <p className="mt-3 text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
