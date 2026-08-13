import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
  align = "left",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <section id={id} className={`relative py-16 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {(eyebrow || title || subtitle) && (
          <Reveal className={align === "center" ? "max-w-2xl mx-auto text-center mb-12" : "max-w-2xl mb-12"}>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {title && (
              <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl leading-[1.1]">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">{subtitle}</p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="pt-36 sm:pt-44 pb-10 sm:pb-16 border-b border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="eyebrow animate-fade-up">{eyebrow}</div>
        <h1
          className="mt-5 font-display text-4xl sm:text-6xl md:text-7xl leading-[1.02] max-w-4xl animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-6 max-w-2xl text-muted-foreground text-base sm:text-lg leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
