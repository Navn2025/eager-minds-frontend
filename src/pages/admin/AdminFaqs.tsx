import { CrudPanel } from "../../components/ui/CrudPanel";

export default function AdminFaqs() {
  return (
    <div className="p-8">
      <CrudPanel
        title="FAQs"
        endpoint="/faqs"
        fields={["question", "answer", "category", "sortOrder"]}
        textareaFields={["answer"]}
        numberFields={["sortOrder"]}
      />
    </div>
  );
}
