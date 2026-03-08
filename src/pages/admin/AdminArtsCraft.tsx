import { CrudPanel } from "../../components/ui/CrudPanel";

export default function AdminArtsCraft() {
  return (
    <div className="p-8">
      <CrudPanel
        title="Arts & Craft Projects"
        endpoint="/arts-craft"
        fields={["title", "description", "instructions", "videoUrl"]}
        textareaFields={["description", "instructions"]}
        multipleImages
      />
    </div>
  );
}
