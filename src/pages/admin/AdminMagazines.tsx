import { CrudPanel } from "../../components/ui/CrudPanel";

export default function AdminMagazines() {
  return (
    <div className="p-8">
      <CrudPanel
        title="Magazines"
        endpoint="/magazines"
        fields={["title", "month", "year"]}
        numberFields={["month", "year"]}
        fileField="pdf"
      />
    </div>
  );
}
