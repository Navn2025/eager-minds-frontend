import { CrudPanel } from "../../components/ui/CrudPanel";

export default function AdminActivities() {
  return (
    <div className="pb-20">
      <CrudPanel
        title="Activities"
        endpoint="/activities"
        fields={["title", "description", "instructions"]}
        textareaFields={["description", "instructions"]}
        imageField="image"
      />
    </div>
  );
}
