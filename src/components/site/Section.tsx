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
  image,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Optional CMS-managed background image for this page header. */
  image?: string | undefined;
}) {
  const hasImage = Boolean(image);

  return (
    <header
      className={`relative overflow-hidden pt-36 sm:pt-44 pb-10 sm:pb-16 border-b ${
        hasImage ? "border-transparent" : "border-border"
      }`}
    >
      {hasImage && (
        <>
          <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-navy/70" aria-hidden />
        </>
      )}
      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <div className={`eyebrow animate-fade-up ${hasImage ? "text-gold" : ""}`}>{eyebrow}</div>
        <h1
          className={`mt-5 font-display text-4xl sm:text-6xl md:text-7xl leading-[1.02] max-w-4xl animate-fade-up ${
            hasImage ? "text-white" : ""
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`mt-6 max-w-2xl text-base sm:text-lg leading-relaxed animate-fade-up ${
              hasImage ? "text-white/80" : "text-muted-foreground"
            }`}
            style={{ animationDelay: "0.2s" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
