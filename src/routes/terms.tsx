import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — MENOVO" },
      { name: "description", content: "The terms that govern your use of MENOVO services." },
    ],
  }),
  component: () => (
    <div className="pt-28">
      <Section eyebrow="Legal" title="Terms of Service">
        <div className="prose prose-invert max-w-3xl text-foreground/85 space-y-4">
          <p>By engaging MENOVO for services, you agree to honest, transparent collaboration. Deliverables, timelines, and pricing are confirmed in writing before work begins.</p>
          <p>All designs and code produced remain the property of the client upon full payment. MENOVO retains the right to display finished work in its portfolio unless otherwise agreed.</p>
          <p>Support windows are defined per package. Extended support is available on request. For any questions, contact <a className="text-gold" href="mailto:7menovo@gmail.com">7menovo@gmail.com</a>.</p>
        </div>
      </Section>
    </div>
  ),
});
