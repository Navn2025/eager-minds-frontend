import { CrudPanel } from "../../components/ui/CrudPanel";

export default function AdminMagazines() {
  return (
    <div className="pb-20">
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
