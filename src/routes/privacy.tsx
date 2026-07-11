import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MENOVO" },
      { name: "description", content: "How MENOVO collects, uses and protects your information." },
    ],
  }),
  component: () => (
    <div className="pt-28">
      <Section eyebrow="Legal" title="Privacy Policy">
        <div className="prose prose-invert max-w-3xl text-foreground/85 space-y-4">
          <p>MENOVO respects your privacy. We only collect information you voluntarily provide—such as name, phone number, and service preferences—to respond to your inquiries and deliver our services.</p>
          <p>We do not sell your data. We do not share it with third parties except as required to operate our services (e.g. email delivery). You may request deletion of your data at any time by contacting <a className="text-gold" href="mailto:7menovo@gmail.com">7menovo@gmail.com</a>.</p>
          <p>By using this site, you agree to this policy. We may update it occasionally; changes will appear on this page.</p>
        </div>
      </Section>
    </div>
  ),
});
