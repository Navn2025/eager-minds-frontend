import { CrudPanel } from "../../components/ui/CrudPanel";

export default function AdminBlog() {
  return (
    <div className="p-8">
      <CrudPanel
        title="Blog Posts"
        endpoint="/blog"
        fields={[
          "title",
          "slug",
          "excerpt",
          "content",
          "author",
          "publishDate",
          "status",
        ]}
        textareaFields={["content", "excerpt"]}
        dateFields={["publishDate"]}
        imageField="image"
      />
    </div>
  );
}
