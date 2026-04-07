import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { ImageUpload, FileUpload } from "../../components/ui/ImageUpload";

type Tab =
  | "subjects"
  | "vocabulary"
  | "competitions"
  | "artsCraft"
  | "activities"
  | "events"
  | "blog"
  | "magazines"
  | "siteImages"
  | "papers"
  | "faqs"
  | "testimonials"
  | "enquiries";

const TABS: { key: Tab; label: string }[] = [
  { key: "subjects", label: "Subjects & Worksheets" },
  { key: "vocabulary", label: "Vocabulary" },
  { key: "competitions", label: "Competitions" },
  { key: "artsCraft", label: "Arts & Craft" },
  { key: "activities", label: "Activities" },
  { key: "events", label: "Events" },
  { key: "blog", label: "Blog" },
  { key: "magazines", label: "Magazines" },
  { key: "siteImages", label: "Site Images" },
  { key: "papers", label: "Papers" },
  { key: "faqs", label: "FAQs" },
  { key: "testimonials", label: "Testimonials" },
  { key: "enquiries", label: "Enquiries" },
];

// Map URL hash fragments to tab keys
const HASH_TO_TAB: Record<string, Tab> = {
  subjects: "subjects",
  worksheets: "subjects", // worksheets are under subjects
  vocabulary: "vocabulary",
  competitions: "competitions",
  artsCraft: "artsCraft",
  activities: "activities",
  events: "events",
  blog: "blog",
  magazines: "magazines",
  papers: "papers",
  siteImages: "siteImages",
  faqs: "faqs",
  testimonials: "testimonials",
  enquiries: "enquiries",
};

function getTabFromHash(): Tab {
  const hash = window.location.hash.replace("#", "");
  return HASH_TO_TAB[hash] || "subjects";
}

type ImageEntityType =
  | "blog"
  | "competition"
  | "activity"
  | "magazine"
  | "artsCraft"
  | "navbarMenu";

interface SingleImageRecord {
  id: string;
  title: string;
  image: string | null;
  updatedAt: string;
}

interface MagazineImageRecord {
  id: string;
  title: string;
  coverUrl: string | null;
  updatedAt: string;
}

interface ArtsCraftImageRecord {
  id: string;
  title: string;
  images: string[];
  updatedAt: string;
}

interface NavbarMenuImageRecord {
  id: string;
  title: string;
  images: Array<string | null>;
  updatedAt: string;
}

interface SiteImagesResponse {
  blog: SingleImageRecord[];
  competitions: SingleImageRecord[];
  activities: SingleImageRecord[];
  magazines: MagazineImageRecord[];
  artsCraft: ArtsCraftImageRecord[];
  navbarMenu: NavbarMenuImageRecord[];
}

export default function AdminContent() {
  const [tab, setTab] = useState<Tab>(getTabFromHash);

  useEffect(() => {
    const onHashChange = () => {
      setTab(getTabFromHash());
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    // Update URL hash without triggering navigation
    window.history.replaceState(null, "", `#${newTab}`);
  };

  return (
    <div className="page admin-content space-y-8 pb-20">
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/2 text-[10px] font-black uppercase tracking-[0.3em] text-accent">
          <span>Content Hub</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
          Content Management.
        </h1>
        <p className="text-text-secondary text-base md:text-lg font-medium max-w-3xl leading-relaxed">
          Use these tabs to create and update blog posts, magazines, workshops,
          competitions, and other site content from one place.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-[1.4rem] border border-white/10 bg-white/2 p-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
              tab === t.key
                ? "bg-white text-black shadow-[0_10px_25px_rgba(0,0,0,0.2)]"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "subjects" && <SubjectsPanel />}
      {tab === "vocabulary" && <VocabularyPanel />}
      {tab === "competitions" && (
        <CrudPanel
          endpoint="/competitions"
          fields={[
            "title",
            "description",
            "rules",
            "registrationLink",
            "eventDate",
          ]}
          dateFields={["eventDate"]}
          imageField="image"
        />
      )}
      {tab === "artsCraft" && (
        <CrudPanel
          endpoint="/arts-craft"
          fields={["title", "description", "instructions", "videoUrl"]}
          textareaFields={["description", "instructions"]}
          multipleImages
        />
      )}
      {tab === "activities" && (
        <CrudPanel
          endpoint="/activities"
          fields={["title", "description", "instructions"]}
          textareaFields={["description", "instructions"]}
          imageField="image"
        />
      )}
      {tab === "events" && (
        <CrudPanel
          endpoint="/events"
          fields={["title", "description", "date", "bookingLink"]}
          dateFields={["date"]}
          textareaFields={["description"]}
        />
      )}
      {tab === "blog" && (
        <CrudPanel
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
      )}
      {tab === "magazines" && (
        <CrudPanel
          endpoint="/magazines"
          fields={["title", "month", "year"]}
          numberFields={["month", "year"]}
          fileField="pdf"
        />
      )}
      {tab === "siteImages" && <SiteImagesPanel />}
      {tab === "papers" && <PapersPanel />}
      {tab === "faqs" && (
        <CrudPanel
          endpoint="/faqs"
          fields={["question", "answer", "category", "sortOrder"]}
          textareaFields={["answer"]}
          numberFields={["sortOrder"]}
        />
      )}
      {tab === "testimonials" && <TestimonialsPanel />}
      {tab === "enquiries" && <EnquiriesPanel />}
    </div>
  );
}

/* ------ Generic CRUD Panel ------ */
interface CrudPanelProps {
  endpoint: string;
  fields: string[];
  textareaFields?: string[];
  dateFields?: string[];
  numberFields?: string[];
  fileField?: string;
  imageField?: string;
  multipleImages?: boolean;
}

function CrudPanel({
  endpoint,
  fields,
  textareaFields = [],
  dateFields = [],
  numberFields = [],
  fileField,
  imageField,
  multipleImages,
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

  const fetch = useCallback(() => {
    api
      .get(endpoint)
      .then((res) => {
        const data = res.data;
        // Handle various paginated response formats
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
            [];
        setItems(items);
      })
      .catch(() => {});
  }, [endpoint]);

  useEffect(fetch, [fetch]);

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
      fetch();
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
    fetch();
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
    <div>
      <button
        onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
      >
        {showForm ? "Cancel" : "+ Add New"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 space-y-3"
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
            <div className="space-y-3">
              {currentFileUrl && (
                <div className="rounded-2xl border border-white/10 bg-white/3 p-3">
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
                <div className="rounded-2xl border border-white/10 bg-white/3 p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35 mb-3">
                    Current image
                  </p>
                  <img
                    src={currentImageUrl}
                    alt="Current upload"
                    className="w-full max-h-56 rounded-xl object-cover"
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
                <div className="rounded-2xl border border-white/10 bg-white/3 p-3 space-y-3">
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            {editId ? "Update" : "Create"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items.map((item) => {
          const id = (item.id || item._id) as string;
          return (
            <div
              key={id}
              className="flex justify-between items-center bg-white/5 border border-white/10 rounded-lg px-4 py-3"
            >
              <span className="text-sm text-white font-medium">
                {displayField(item)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="text-sm text-indigo-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="text-sm text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-sm text-white/50">No items yet.</p>
        )}
      </div>
    </div>
  );
}

/* ------ Subjects Panel (nested: topics + worksheets) ------ */
function SubjectsPanel() {
  const [subjects, setSubjects] = useState<Record<string, unknown>[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState<Record<string, string>>({});
  const [worksheetFile, setWorksheetFile] = useState<{
    topicId: string;
    file: File;
  } | null>(null);
  const [worksheetTitle, setWorksheetTitle] = useState<Record<string, string>>(
    {},
  );

  const fetch = useCallback(() => {
    api
      .get("/prep/subjects")
      .then((res) => setSubjects(res.data))
      .catch(() => {});
  }, []);

  useEffect(fetch, [fetch]);

  const addSubject = async () => {
    if (!newSubject.trim()) return;
    await api.post("/prep/subjects", { name: newSubject });
    setNewSubject("");
    fetch();
  };

  const addTopic = async (subjectId: string) => {
    const name = newTopic[subjectId];
    if (!name?.trim()) return;
    await api.post("/prep/topics", { name, subjectId });
    setNewTopic((p) => ({ ...p, [subjectId]: "" }));
    fetch();
  };

  const uploadWorksheet = async (topicId: string) => {
    if (!worksheetFile || worksheetFile.topicId !== topicId) return;
    const fd = new FormData();
    fd.append("title", worksheetTitle[topicId] || worksheetFile.file.name);
    fd.append("topicId", topicId);
    fd.append("file", worksheetFile.file);
    await api.post("/prep/worksheets", fd);
    setWorksheetFile(null);
    setWorksheetTitle((p) => ({ ...p, [topicId]: "" }));
    fetch();
  };

  const deleteWorksheet = async (id: string) => {
    if (!confirm("Delete this worksheet?")) return;
    await api.delete(`/prep/worksheets/${id}`);
    fetch();
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <input
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="New subject name"
          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40 flex-1"
        />
        <button
          onClick={addSubject}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
        >
          Add Subject
        </button>
      </div>

      {subjects.map((subject) => {
        const sId = subject.id as string;
        const topics = (subject.topics as Record<string, unknown>[]) || [];
        return (
          <div
            key={sId}
            className="mb-6 border border-white/10 rounded-lg p-4 bg-white/5"
          >
            <h3 className="text-lg font-semibold text-white mb-3">
              {subject.name as string}
            </h3>

            {topics.map((topic) => {
              const tId = topic.id as string;
              const worksheets =
                (topic.worksheets as Record<string, unknown>[]) || [];
              return (
                <div
                  key={tId}
                  className="ml-4 mb-3 border-l-2 border-indigo-500/50 pl-4"
                >
                  <h4 className="text-sm font-medium text-white/80 mb-1">
                    {topic.name as string}
                  </h4>
                  <ul className="space-y-1 mb-2">
                    {worksheets.map((ws) => (
                      <li
                        key={ws.id as string}
                        className="flex justify-between items-center text-sm text-white/60"
                      >
                        <span>{ws.title as string}</span>
                        <button
                          onClick={() => deleteWorksheet(ws.id as string)}
                          className="text-red-400 text-xs hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 items-center flex-wrap">
                    <input
                      value={worksheetTitle[tId] || ""}
                      onChange={(e) =>
                        setWorksheetTitle((p) => ({
                          ...p,
                          [tId]: e.target.value,
                        }))
                      }
                      placeholder="Worksheet title"
                      className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white placeholder:text-white/40 flex-1 min-w-30"
                    />
                    <input
                      type="file"
                      accept=".pdf"
                      title="Upload PDF worksheet"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        setWorksheetFile({
                          topicId: tId,
                          file: e.target.files[0],
                        })
                      }
                      className="text-xs text-white/60"
                    />
                    <button
                      onClick={() => uploadWorksheet(tId)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-2 mt-3">
              <input
                value={newTopic[sId] || ""}
                onChange={(e) =>
                  setNewTopic((p) => ({ ...p, [sId]: e.target.value }))
                }
                placeholder="New topic name"
                className="px-2 py-1 bg-white/10 border border-white/20 rounded text-sm text-white placeholder:text-white/40 flex-1"
              />
              <button
                onClick={() => addTopic(sId)}
                className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
              >
                Add Topic
              </button>
            </div>
          </div>
        );
      })}

      {subjects.length === 0 && (
        <p className="text-sm text-white/50">No subjects yet.</p>
      )}
    </div>
  );
}

/* ------ Vocabulary Panel ------ */
function VocabularyPanel() {
  const [words, setWords] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState({
    word: "",
    meaning: "",
    synonym: "",
    antonym: "",
    exampleSentence: "",
    pronunciation: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [showForm, setShowForm] = useState(false);

  const fetch = useCallback(() => {
    api
      .get("/prep/vocabulary")
      .then((res) => {
        const data = res.data;
        // Handle both single word and paginated response
        setWords(Array.isArray(data) ? data : data.words || [data]);
      })
      .catch(() => {});
  }, []);

  useEffect(fetch, [fetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/prep/vocabulary", form);
    setForm({
      word: "",
      meaning: "",
      synonym: "",
      antonym: "",
      exampleSentence: "",
      pronunciation: "",
      date: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this word?")) return;
    await api.delete(`/prep/vocabulary/${id}`);
    fetch();
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
      >
        {showForm ? "Cancel" : "+ Add Word"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 space-y-3"
        >
          <input
            value={form.word}
            onChange={(e) => setForm((f) => ({ ...f, word: e.target.value }))}
            placeholder="Word"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40"
            required
          />
          <input
            value={form.meaning}
            onChange={(e) =>
              setForm((f) => ({ ...f, meaning: e.target.value }))
            }
            placeholder="Meaning"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={form.synonym}
              onChange={(e) =>
                setForm((f) => ({ ...f, synonym: e.target.value }))
              }
              placeholder="Synonym"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40"
            />
            <input
              value={form.antonym}
              onChange={(e) =>
                setForm((f) => ({ ...f, antonym: e.target.value }))
              }
              placeholder="Antonym"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40"
            />
          </div>
          <input
            value={form.exampleSentence}
            onChange={(e) =>
              setForm((f) => ({ ...f, exampleSentence: e.target.value }))
            }
            placeholder="Example sentence"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={form.pronunciation}
              onChange={(e) =>
                setForm((f) => ({ ...f, pronunciation: e.target.value }))
              }
              placeholder="Pronunciation"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              title="Select word date"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            Add
          </button>
        </form>
      )}

      <div className="space-y-2">
        {words.map((w) => (
          <div
            key={w.id as string}
            className="flex justify-between items-center bg-white/5 border border-white/10 rounded-lg px-4 py-3"
          >
            <div>
              <span className="font-medium text-white">{w.word as string}</span>
              <span className="text-sm text-white/50 ml-2">
                — {w.meaning as string}
              </span>
            </div>
            <button
              onClick={() => handleDelete(w.id as string)}
              className="text-sm text-red-400 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
        {words.length === 0 && (
          <p className="text-sm text-white/50">No vocabulary words yet.</p>
        )}
      </div>
    </div>
  );
}

/* ------ Papers Panel (requires subject selection) ------ */
function PapersPanel() {
  const [papers, setPapers] = useState<Record<string, unknown>[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    title: "",
    subjectId: "",
    difficulty: "medium",
  });
  const [file, setFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = useCallback(() => {
    Promise.all([api.get("/papers/admin/all"), api.get("/prep/subjects")])
      .then(([papersRes, subjectsRes]) => {
        const papersData = papersRes.data.papers || papersRes.data;
        setPapers(Array.isArray(papersData) ? papersData : []);
        setSubjects(subjectsRes.data || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("subjectId", form.subjectId);
      fd.append("difficulty", form.difficulty);
      fd.append("pdf", file);
      if (answerFile) fd.append("answer", answerFile);

      await api.post("/papers", fd);
      setForm({ title: "", subjectId: "", difficulty: "medium" });
      setFile(null);
      setAnswerFile(null);
      setShowForm(false);
      fetchData();
    } catch {
      alert("Failed to upload paper");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this paper?")) return;
    await api.delete(`/papers/${id}`);
    fetchData();
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
      >
        {showForm ? "Cancel" : "+ Add Paper"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 space-y-3"
        >
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Paper title"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40"
            required
          />
          <select
            value={form.subjectId}
            onChange={(e) =>
              setForm((f) => ({ ...f, subjectId: e.target.value }))
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white"
            required
            title="Select subject"
          >
            <option value="" className="bg-gray-900">
              Select subject...
            </option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id} className="bg-gray-900">
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm((f) => ({ ...f, difficulty: e.target.value }))
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white"
            title="Select difficulty"
          >
            <option value="easy" className="bg-gray-900">
              Easy
            </option>
            <option value="medium" className="bg-gray-900">
              Medium
            </option>
            <option value="hard" className="bg-gray-900">
              Hard
            </option>
          </select>
          <FileUpload
            label="Paper PDF *"
            accept=".pdf"
            onFileSelect={(f) => setFile(f)}
          />
          <FileUpload
            label="Answer PDF (optional)"
            accept=".pdf"
            onFileSelect={(f) => setAnswerFile(f)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            Upload Paper
          </button>
        </form>
      )}

      <div className="space-y-2">
        {papers.map((paper) => (
          <div
            key={paper.id as string}
            className="flex justify-between items-center bg-white/5 border border-white/10 rounded-lg px-4 py-3"
          >
            <div>
              <span className="font-medium text-white">
                {paper.title as string}
              </span>
              <span className="text-sm text-white/50 ml-2">
                ({(paper.subject as { name?: string })?.name || "No subject"} •{" "}
                {paper.difficulty as string})
              </span>
            </div>
            <button
              onClick={() => handleDelete(paper.id as string)}
              className="text-sm text-red-400 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
        {papers.length === 0 && (
          <p className="text-sm text-white/50">No papers yet.</p>
        )}
      </div>
    </div>
  );
}

/* ------ Testimonials Panel (with approve toggle) ------ */
function TestimonialsPanel() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);

  const fetch = useCallback(() => {
    api
      .get("/testimonials?all=true")
      .then((res) => setItems(res.data))
      .catch(() => {});
  }, []);

  useEffect(fetch, [fetch]);

  const toggleApprove = async (id: string, current: boolean) => {
    await api.patch(`/testimonials/${id}`, { approved: !current });
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await api.delete(`/testimonials/${id}`);
    fetch();
  };

  return (
    <div>
      <div className="space-y-2">
        {items.map((t) => (
          <div
            key={t.id as string}
            className="flex justify-between items-center bg-white/5 border border-white/10 rounded-lg px-4 py-3"
          >
            <div>
              <span className="font-medium text-white">
                {t.parentName as string}
              </span>
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${t.approved ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
              >
                {t.approved ? "Approved" : "Pending"}
              </span>
              <p className="text-sm text-white/60 mt-1">
                "{(t.content as string)?.slice(0, 80)}..."
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleApprove(t.id as string, !!t.approved)}
                className="text-sm text-indigo-400 hover:underline"
              >
                {t.approved ? "Unapprove" : "Approve"}
              </button>
              <button
                onClick={() => handleDelete(t.id as string)}
                className="text-sm text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-white/50">No testimonials yet.</p>
        )}
      </div>
    </div>
  );
}

/* ------ Site Images Panel (global image manager) ------ */
function SiteImagesPanel() {
  const [data, setData] = useState<SiteImagesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/images");
      setData(res.data as SiteImagesResponse);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const uploadImage = async (
    entityType: ImageEntityType,
    entityId: string,
    file: File,
    index?: number,
    sectionId?: string,
  ) => {
    const opKey = `${entityType}:${entityId}:${sectionId ?? "none"}:${index ?? "new"}`;
    setBusyKey(opKey);
    try {
      const fd = new FormData();
      fd.append("entityType", entityType);
      fd.append("entityId", entityId);
      if (index !== undefined) fd.append("index", String(index));
      if (sectionId) fd.append("sectionId", sectionId);
      fd.append("image", file);
      await api.post("/admin/images/upload", fd);
      await fetch();
    } catch {
      alert("Image upload failed");
    } finally {
      setBusyKey(null);
    }
  };

  const removeImage = async (
    entityType: ImageEntityType,
    entityId: string,
    index?: number,
    sectionId?: string,
  ) => {
    if (!confirm("Remove this image?")) return;
    const opKey = `${entityType}:${entityId}:${sectionId ?? "none"}:${index ?? "remove"}`;
    setBusyKey(opKey);
    try {
      await api.delete("/admin/images", {
        data: { entityType, entityId, index, sectionId },
      });
      await fetch();
    } catch {
      alert("Image removal failed");
    } finally {
      setBusyKey(null);
    }
  };

  const singleSection = (
    title: string,
    records: SingleImageRecord[],
    entityType: ImageEntityType,
  ) => (
    <section className="space-y-3">
      <h3 className="text-base font-black uppercase tracking-[0.16em] text-white/80">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {records.map((record) => (
          <div
            key={`${entityType}-${record.id}`}
            className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-3"
          >
            <p className="text-sm font-semibold text-white truncate">
              {record.title}
            </p>
            {record.image ? (
              <img
                src={record.image}
                alt={record.title}
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-40 rounded-lg border border-dashed border-white/20 bg-white/2 flex items-center justify-center text-xs text-white/40 uppercase tracking-widest">
                No Image
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              <label className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded cursor-pointer hover:bg-indigo-700">
                {record.image ? "Replace" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(entityType, record.id, file);
                  }}
                />
              </label>
              <button
                onClick={() => removeImage(entityType, record.id)}
                disabled={!record.image}
                className="px-3 py-1.5 bg-red-600/80 disabled:bg-white/10 disabled:text-white/30 text-white text-xs rounded hover:bg-red-600"
              >
                Remove
              </button>
              {busyKey?.startsWith(`${entityType}:${record.id}`) && (
                <span className="text-xs text-white/50 self-center">
                  Saving...
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {records.length === 0 && (
        <p className="text-sm text-white/45">No records found.</p>
      )}
    </section>
  );

  if (loading && !data) {
    return <p className="text-sm text-white/60">Loading image library...</p>;
  }

  if (!data) {
    return (
      <p className="text-sm text-red-300">
        Could not load site images. Please try again.
      </p>
    );
  }

  const magazineRecords: SingleImageRecord[] = data.magazines.map((m) => ({
    id: m.id,
    title: m.title,
    image: m.coverUrl,
    updatedAt: m.updatedAt,
  }));

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-white/10 bg-white/4 p-4">
        <h2 className="text-lg font-black text-white mb-1">
          Global Image Manager
        </h2>
        <p className="text-sm text-white/60">
          Upload, replace, and remove images used across key public sections.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-base font-black uppercase tracking-[0.16em] text-white/80">
          Main Navbar Featured Images
        </h3>
        <p className="text-xs text-white/50">
          Set the two preview images used for each section in the fullscreen
          navbar menu.
        </p>
        <div className="space-y-4">
          {data.navbarMenu.map((section) => (
            <div
              key={`navbar-menu-${section.id}`}
              className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
            >
              <p className="text-sm font-semibold text-white truncate">
                {section.title}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[0, 1].map((slotIndex) => {
                  const imageUrl = section.images?.[slotIndex] || null;
                  const opPrefix = `navbarMenu:menu:${section.id}:${slotIndex}`;

                  return (
                    <div
                      key={`${section.id}-${slotIndex}`}
                      className="rounded-xl border border-white/10 bg-white/3 p-3 space-y-3"
                    >
                      <p className="text-xs font-semibold text-white/80 truncate uppercase tracking-wider">
                        Slot {slotIndex + 1}
                      </p>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${section.title} slot ${slotIndex + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-40 rounded-lg border border-dashed border-white/20 bg-white/2 flex items-center justify-center text-xs text-white/40 uppercase tracking-widest">
                          No Image
                        </div>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        <label className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded cursor-pointer hover:bg-indigo-700">
                          {imageUrl ? "Replace" : "Upload"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                uploadImage(
                                  "navbarMenu",
                                  "menu",
                                  file,
                                  slotIndex,
                                  section.id,
                                );
                              }
                            }}
                          />
                        </label>
                        <button
                          onClick={() =>
                            removeImage(
                              "navbarMenu",
                              "menu",
                              slotIndex,
                              section.id,
                            )
                          }
                          disabled={!imageUrl}
                          className="px-3 py-1.5 bg-red-600/80 disabled:bg-white/10 disabled:text-white/30 text-white text-xs rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                        {busyKey?.startsWith(opPrefix) && (
                          <span className="text-xs text-white/50 self-center">
                            Saving...
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {singleSection("Blog", data.blog, "blog")}
      {singleSection("Competitions", data.competitions, "competition")}
      {singleSection("Activities", data.activities, "activity")}
      {singleSection("Magazines (Cover Images)", magazineRecords, "magazine")}

      <section className="space-y-3">
        <h3 className="text-base font-black uppercase tracking-[0.16em] text-white/80">
          Arts & Craft Projects
        </h3>
        <div className="space-y-4">
          {data.artsCraft.map((project) => (
            <div
              key={`artsCraft-${project.id}`}
              className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
            >
              <p className="text-sm font-semibold text-white">
                {project.title}
              </p>

              {project.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {project.images.map((imageUrl, index) => (
                    <div key={`${project.id}-${index}`} className="space-y-2">
                      <img
                        src={imageUrl}
                        alt={`${project.title} ${index + 1}`}
                        className="w-full h-28 rounded-lg object-cover"
                      />
                      <div className="flex gap-1">
                        <label className="flex-1 px-2 py-1 bg-indigo-600 text-white text-[10px] rounded text-center cursor-pointer hover:bg-indigo-700">
                          Replace
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                uploadImage(
                                  "artsCraft",
                                  project.id,
                                  file,
                                  index,
                                );
                              }
                            }}
                          />
                        </label>
                        <button
                          onClick={() =>
                            removeImage("artsCraft", project.id, index)
                          }
                          className="flex-1 px-2 py-1 bg-red-600/80 text-white text-[10px] rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/45">No images yet.</p>
              )}

              <div>
                <label className="inline-flex px-3 py-1.5 bg-green-600 text-white text-xs rounded cursor-pointer hover:bg-green-700">
                  Add Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage("artsCraft", project.id, file);
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
        {data.artsCraft.length === 0 && (
          <p className="text-sm text-white/45">No projects found.</p>
        )}
      </section>
    </div>
  );
}

/* ------ Enquiries Panel (read-only + delete) ------ */
function EnquiriesPanel() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);

  const fetch = useCallback(() => {
    api
      .get("/enquiries")
      .then((res) => setItems(res.data.enquiries || []))
      .catch(() => {});
  }, []);

  useEffect(fetch, [fetch]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    await api.delete(`/enquiries/${id}`);
    fetch();
  };

  return (
    <div>
      <div className="space-y-3">
        {items.map((enq) => (
          <div
            key={enq.id as string}
            className="bg-white/5 border border-white/10 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-white">
                  {enq.parentName as string}
                </p>
                <p className="text-xs text-white/50">
                  {enq.email as string} {enq.phone ? `· ${enq.phone}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/40">
                  {new Date(enq.createdAt as string).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(enq.id as string)}
                  className="text-sm text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-white/60 mt-2">
              {enq.message as string}
            </p>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-white/50">No enquiries yet.</p>
        )}
      </div>
    </div>
  );
}
