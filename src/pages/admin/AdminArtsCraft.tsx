import { CrudPanel } from "../../components/ui/CrudPanel";

export default function AdminArtsCraft() {
  return (
    <div className="pb-20 space-y-6">
      <div className="rounded-[1.4rem] border border-white/10 bg-white/2 p-5 md:p-6 matte-card">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/45">
          Arts & Craft Image Upload
        </p>
        <p className="text-sm md:text-base text-text-secondary mt-2 leading-relaxed max-w-3xl">
          Add one or multiple images while creating a project. When editing,
          newly uploaded images are added to the existing gallery.
        </p>
      </div>
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
