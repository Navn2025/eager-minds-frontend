import { CrudPanel } from "../../components/ui/CrudPanel";

export default function AdminEvents() {
  return (
    <div className="pb-20">
      <CrudPanel
        title="Events"
        endpoint="/events"
        fields={["title", "description", "date", "bookingLink"]}
        dateFields={["date"]}
        textareaFields={["description"]}
      />
    </div>
  );
}
