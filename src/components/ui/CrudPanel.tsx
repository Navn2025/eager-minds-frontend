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
  const [editingItem, setEditingItem] = useState<Record<
    string,
    unknown
  > | null>(null);
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
    setEditingItem(null);
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
    setEditingItem(item);
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

  const currentImageUrl =
    editingItem && imageField
      ? (editingItem[imageField] as string | undefined) ||
        (editingItem.image as string | undefined) ||
        (editingItem.featuredImage as string | undefined)
      : null;
  const currentFileUrl =
    editingItem && fileField
      ? (editingItem[fileField] as string | undefined) ||
        (editingItem.pdfUrl as string | undefined) ||
        (editingItem.fileUrl as string | undefined)
      : null;
  const currentImages =
    editingItem && multipleImages && Array.isArray(editingItem.images)
      ? (editingItem.images as string[]).filter(Boolean)
      : [];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/2 text-[10px] font-black uppercase tracking-[0.3em] text-accent">
            <span>Admin Content</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
            {title || "Content"}
          </h1>
          <p className="text-text-secondary text-base md:text-lg font-medium max-w-2xl leading-relaxed">
            Create, update, and publish records from the themed control panel.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="inline-flex items-center justify-center h-14 md:h-16 px-6 md:px-8 rounded-2xl md:rounded-3xl bg-linear-to-r from-accent to-accent-pink text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all hover:scale-[1.02]"
        >
          {showForm ? "Close Editor" : "+ Add New"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="matte-card p-6 md:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {fields.map((field) => (
              <div
                key={field}
                className={
                  textareaFields.includes(field)
                    ? "md:col-span-2 space-y-2"
                    : "space-y-2"
                }
              >
                <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/30 ml-1">
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
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/25 outline-none focus:border-accent/40 transition-all resize-none"
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
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/25 outline-none focus:border-accent/40 transition-all"
                  />
                )}
              </div>
            ))}
          </div>

          {fileField && (
            <div className="space-y-3">
              {currentFileUrl && (
                <div className="rounded-[1.4rem] border border-white/10 bg-white/2 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35 mb-3">
                    Current file
                  </p>
                  <a
                    href={currentFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-accent hover:text-white transition-colors break-all"
                  >
                    Open existing file
                  </a>
                </div>
              )}
              <FileUpload
                label={currentFileUrl ? "Replace PDF" : "Upload PDF"}
                accept=".pdf"
                onFileSelect={(f) => setFile(f)}
              />
            </div>
          )}
          {imageField && (
            <div className="space-y-3">
              {currentImageUrl && (
                <div className="rounded-[1.4rem] border border-white/10 bg-white/2 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35 mb-3">
                    Current image
                  </p>
                  <img
                    src={currentImageUrl}
                    alt="Current upload"
                    className="w-full max-h-56 rounded-[1.1rem] object-cover"
                  />
                </div>
              )}
              <ImageUpload
                label={currentImageUrl ? "Replace Image" : "Upload Image"}
                onFileSelect={(f) => setFile(f)}
              />
            </div>
          )}
          {multipleImages && (
            <div className="space-y-3">
              {currentImages.length > 0 && (
                <div className="rounded-[1.4rem] border border-white/10 bg-white/2 p-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
                    Current images
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {currentImages.map((imageUrl, index) => (
                      <img
                        key={`${imageUrl}-${index}`}
                        src={imageUrl}
                        alt={`Current ${index + 1}`}
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
              <ImageUpload
                label={
                  currentImages.length > 0 ? "Add More Images" : "Upload Images"
                }
                multiple
                onFileSelect={() => {}}
                onFilesSelect={(files) => setImages(files)}
              />
            </div>
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-linear-to-r from-emerald-500 to-cyan-400 text-white text-[10px] font-black uppercase tracking-[0.22em] transition-all hover:scale-[1.01]"
          >
            {editId ? "Update" : "Create"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {items.map((item) => {
          const id = (item.id || item._id) as string;
          const imageUrl =
            item.image ||
            item.featuredImage ||
            (Array.isArray(item.images) ? item.images[0] : null);

          return (
            <div
              key={id}
              className="flex justify-between items-center gap-4 matte-card px-5 py-4 hover:bg-white/3 transition-colors"
            >
              <div className="flex items-center gap-4">
                {imageUrl && (
                  <img
                    src={imageUrl as string}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                )}
                <span className="text-sm md:text-base text-white font-black uppercase tracking-tight">
                  {displayField(item)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:bg-accent/10 rounded-full transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-sm text-white/50 py-10 text-center rounded-[1.4rem] border border-dashed border-white/10 bg-white/2">
            No items yet.
          </p>
        )}
      </div>
    </div>
  );
}
