import { CrudPanel } from "../../components/ui/CrudPanel";

export default function AdminCompetitions() {
  return (
    <div className="pb-20">
      <CrudPanel
        title="Competitions"
        endpoint="/competitions"
        fields={[
          "title",
          "description",
          "rules",
          "registrationLink",
          "eventDate",
        ]}
        dateFields={["eventDate"]}
        textareaFields={["description", "rules"]}
        imageField="image"
      />
    </div>
  );
}
