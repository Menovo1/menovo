import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, AtSign, Instagram, MessageCircle } from "lucide-react";
import { PageHeader, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

/** Only real, provided links are shown. Add Facebook / X / LinkedIn / GitHub here when available. */
const socials = [
  { label: "Instagram", href: "https://www.instagram.com/the_asad_je/", icon: Instagram },
  { label: "WhatsApp", href: "https://wa.me/251976367556", icon: MessageCircle },
  { label: "Threads", href: "https://www.threads.com/@the_asad_je", icon: AtSign },
];


export const Route = createFileRoute("/asad-je")({
  head: () => ({
    meta: [
      { title: "Asad JE — CEO & Founder of MENOVO" },
      {
        name: "description",
        content:
          "Asad JE, CEO and Founder of MENOVO — web developer, entrepreneur and digital creator building professional websites and digital solutions.",
      },
      { property: "og:title", content: "Asad JE — CEO & Founder of MENOVO" },
      {
        property: "og:description",
        content:
          "Web developer, entrepreneur and digital creator. Founder of MENOVO — building digital experiences that help businesses move forward.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AsadProfile,
});

const sections: { eyebrow: string; lines: string[] }[] = [
  {
    eyebrow: "Profile",
    lines: [
      "I'm a professional web developer, entrepreneur, and digital creator.",
      "I'm the CEO and Founder of MENOVO, a modern digital agency focused on helping businesses build their online presence.",
      "Through MENOVO, I create professional websites and digital solutions designed around real business needs.",
    ],
  },
  {
    eyebrow: "Approach",
    lines: [
      "My work combines clean design, modern technology, and practical business strategy.",
      "I believe a website should be more than something that simply looks good.",
      "It should help a business build trust, reach more customers, and grow in the digital world.",
      "I specialize in creating modern, responsive, and user-friendly web experiences.",
      "My approach is focused on making technology simple, useful, and accessible for businesses.",
    ],
  },
  {
    eyebrow: "Independent work",
    lines: [
      "I'm also passionate about entrepreneurship and building products that solve real-world problems.",
      "Alongside my work with MENOVO, I've built and worked on independent projects that are separate from the agency.",
      "One example that I just finished is BILAAL.SHOP, a web project I developed independently to create a professional digital presence for a tailoring business.",
      "These independent projects allow me to experiment with new ideas, technologies, designs, and approaches outside of my agency work.",
    ],
  },
  {
    eyebrow: "Curiosity",
    lines: [
      "I continuously explore new technologies, AI tools, web development techniques, and digital trends.",
      "My journey is driven by curiosity, creativity, and a strong desire to keep learning.",
      "I believe consistent improvement is more valuable than trying to become perfect overnight.",
    ],
  },
  {
    eyebrow: "Vision",
    lines: [
      "Beyond development, I'm interested in branding, digital business, and the future of technology.",
      "My goal is to help businesses transition into the modern digital environment through practical and professional digital solutions.",
      "Through my projects, I work to turn ideas into functional, useful, and memorable digital experiences.",
      "Today, I continue to grow MENOVO, work on independent projects, and develop my personal brand as Asad JE.",
    ],
  },
];

function AsadProfile() {
  return (
    <div>
      <PageHeader
        eyebrow="Founder"
        title="Asad JE — CEO & Founder of MENOVO"
        subtitle="Web developer, entrepreneur and digital creator."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <Reveal className="lg:sticky lg:top-32 self-start">
            <p className="font-display text-2xl sm:text-3xl leading-snug">
              Building digital experiences that help businesses{" "}
              <span className="text-gold-deep">move forward.</span>
            </p>
          </Reveal>

          <div className="space-y-12">
            {sections.map((s, i) => (
              <Reveal key={s.eyebrow} delay={i * 60}>
                <div className="eyebrow">{s.eyebrow}</div>
                <div className="mt-4 space-y-4">
                  {s.lines.map((line) => (
                    <p key={line} className="text-base sm:text-lg leading-relaxed text-foreground/80">
                      {line}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-16 border-t border-border pt-10">
          <div className="eyebrow text-center">Connect</div>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-outline px-6 py-3 text-sm tracking-wide"
              >
                <s.icon className="h-4 w-4 text-gold" /> {s.label}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-12 border-t border-border pt-10 text-center">
          <p className="font-display text-2xl sm:text-3xl tracking-[0.04em]">
            Founded by <span className="text-gold-deep">ASAD JE</span>
          </p>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            Building digital experiences that help businesses move forward.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full btn-gold px-7 py-3 text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back to MENOVO
          </Link>
        </Reveal>

      </Section>
    </div>
  );
}
