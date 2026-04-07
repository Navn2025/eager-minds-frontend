import { CrudPanel } from "../../components/ui/CrudPanel";

export default function AdminFaqs() {
  return (
    <div className="pb-20">
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
