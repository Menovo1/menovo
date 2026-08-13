import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { site } from "@/content/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MENOVO" },
      { name: "description", content: "How MENOVO collects, uses and protects your information." },
      { property: "og:title", content: "Privacy Policy — MENOVO" },
      { property: "og:description", content: "How MENOVO handles your information." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://menovo.lovable.app/privacy" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://menovo.lovable.app/privacy" }],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <Section>
        <div className="max-w-3xl space-y-5 text-muted-foreground leading-relaxed">
          <p>
            MENOVO respects your privacy. We only collect information you voluntarily provide — such
            as your name, hotel name, email address and message — in order to respond to your
            enquiry and deliver our services.
          </p>
          <p>
            We do not sell your data, and we do not share it with third parties except where
            necessary to operate our services. You may request deletion of your data at any time by
            contacting{" "}
            <a className="text-gold-deep link-underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
          <p>
            By using this website you agree to this policy. We may update it occasionally; any
            changes will appear on this page.
          </p>
        </div>
      </Section>
    </>
  ),
});
