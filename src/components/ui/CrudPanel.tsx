import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { ImageUpload, FileUpload } from "./ImageUpload";

interface CrudPanelProps {
  endpoint: string;
  fields: string[];
  textareaFields?: string[];
  dateFields?: string[];
  numberFields?: string[];
  fileField?: string;
  imageField?: string;
  multipleImages?: boolean;
  title?: string;
}

export function CrudPanel({
  endpoint,
  fields,
  textareaFields = [],
  dateFields = [],
  numberFields = [],
  fileField,
  imageField,
  multipleImages,
  title,
}: CrudPanelProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = useCallback(() => {
    api
      .get(endpoint)
      .then((res) => {
        const data = res.data;
        const items = Array.isArray(data)
          ? data
          : data.posts ||
            data.items ||
            data.magazines ||
            data.activities ||
            data.enquiries ||
            data.events ||
            data.papers ||
            data.faqs ||
            data.competitions ||
            data.projects ||
            [];
        setItems(items);
      })
      .catch(() => {});
  }, [endpoint]);

  useEffect(fetchData, [fetchData]);

  const resetForm = () => {
    setForm({});
    setFile(null);
    setImages(null);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hasFile =
        (fileField && file) ||
        (imageField && file) ||
        (multipleImages && images?.length);
      if (hasFile) {
        const fd = new FormData();
        fields.forEach((f) => {
          if (form[f]) fd.append(f, form[f]);
        });
        if (fileField && file) fd.append(fileField, file);
        if (imageField && file) fd.append(imageField, file);
        if (multipleImages && images) {
          Array.from(images).forEach((img) => fd.append("images", img));
        }
        if (editId) await api.put(`${endpoint}/${editId}`, fd);
        else await api.post(endpoint, fd);
      } else {
        const body: Record<string, unknown> = {};
        fields.forEach((f) => {
          if (numberFields.includes(f)) body[f] = Number(form[f]);
          else body[f] = form[f] || "";
        });
        if (editId) await api.put(`${endpoint}/${editId}`, body);
        else await api.post(endpoint, body);
      }
      resetForm();
      fetchData();
    } catch {
      alert("Failed to save. Check all required fields.");
    }
  };

  const startEdit = (item: Record<string, unknown>) => {
    const id = (item.id || item._id) as string;
    setEditId(id);
    const f: Record<string, string> = {};
    fields.forEach((field) => {
      const val = item[field];
      if (dateFields.includes(field) && val) {
        f[field] = new Date(val as string).toISOString().split("T")[0];
      } else {
        f[field] = val != null ? String(val) : "";
      }
    });
    setForm(f);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await api.delete(`${endpoint}/${id}`);
    fetchData();
  };

  const displayField = (item: Record<string, unknown>) => {
    const title = item.title || item.question || item.name;
    return title ? String(title) : (item.id as string)?.slice(0, 8);
  };

  return (
    <div className="space-y-6">
      {title && <h1 className="text-3xl font-bold text-white">{title}</h1>}

      <button
        onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
      >
        {showForm ? "Cancel" : "+ Add New"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
        >
          {fields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-white/70 mb-1 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              {textareaFields.includes(field) ? (
                <textarea
                  value={form[field] || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [field]: e.target.value }))
                  }
                  rows={4}
                  placeholder={field}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/30"
                />
              ) : (
                <input
                  type={
                    dateFields.includes(field)
                      ? "date"
                      : numberFields.includes(field)
                        ? "number"
                        : "text"
                  }
                  value={form[field] || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [field]: e.target.value }))
                  }
                  placeholder={field}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/30"
                />
              )}
            </div>
          ))}

          {fileField && (
            <FileUpload
              label="Upload PDF"
              accept=".pdf"
              onFileSelect={(f) => setFile(f)}
            />
          )}
          {imageField && (
            <ImageUpload
              label="Upload Image"
              onFileSelect={(f) => setFile(f)}
            />
          )}
          {multipleImages && (
            <ImageUpload
              label="Upload Images"
              multiple
              onFileSelect={() => {}}
              onFilesSelect={(files) => setImages(files)}
            />
          )}

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            {editId ? "Update" : "Create"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items.map((item) => {
          const id = (item.id || item._id) as string;
          const imageUrl =
            item.image ||
            item.featuredImage ||
            (Array.isArray(item.images) ? item.images[0] : null);

          return (
            <div
              key={id}
              className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex items-center gap-4">
                {imageUrl && (
                  <img
                    src={imageUrl as string}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <span className="text-sm text-white font-medium">
                  {displayField(item)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="px-3 py-1 text-sm text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="px-3 py-1 text-sm text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-sm text-white/50 py-8 text-center">
            No items yet.
          </p>
        )}
      </div>
    </div>
  );
}
