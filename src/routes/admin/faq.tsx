import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/faq")({ component: Page });

function Page() {
  return (
    <CrudSection
      table="faqs"
      title="FAQ"
      subtitle="Questions and answers shown on the FAQ page."
      titleField="question"
      subtitleField="answer"
      addLabel="Add question"
      defaults={{ published: true, sort_order: 0 }}
      fields={[
        { name: "question", label: "Question", type: "text" },
        { name: "sort_order", label: "Order", type: "number" },
        { name: "answer", label: "Answer", type: "textarea" },
        { name: "published", label: "Published", type: "bool" },
      ]}
    />
  );
}
