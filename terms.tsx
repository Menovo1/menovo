import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { site } from "@/content/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | MENOVO" },
      { name: "description", content: "Read the MENOVO terms of service covering website projects, deliverables, timelines, payments, maintenance and client agreements." },
      { property: "og:title", content: "Terms of Service — MENOVO" },
      { property: "og:description", content: "Terms covering MENOVO website projects, services and client engagements." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.menovo.agency/terms" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://www.menovo.agency/terms" }],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service" />
      <Section>
        <div className="max-w-3xl space-y-5 text-muted-foreground leading-relaxed">
          <p>
            By engaging MENOVO, you agree to honest, transparent collaboration. Deliverables,
            timelines and costs are confirmed in writing before work begins.
          </p>
          <p>
            All designs and code produced remain the property of the client upon full payment.
            MENOVO retains the right to display finished work in its portfolio unless otherwise
            agreed.
          </p>
          <p>
            Maintenance and support terms are defined per engagement. For any questions, contact{" "}
            <a className="text-gold-deep link-underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  ),
});
