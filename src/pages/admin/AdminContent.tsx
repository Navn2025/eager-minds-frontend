import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
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
  faqs: "faqs",
  testimonials: "testimonials",
  enquiries: "enquiries",
};

export default function AdminContent() {
  const location = useLocation();
  const [tab, setTab] = useState<Tab>("subjects");

  // Sync tab with URL hash
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && HASH_TO_TAB[hash]) {
      setTab(HASH_TO_TAB[hash]);
    }
  }, [location.hash]);

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    // Update URL hash without triggering navigation
    window.history.replaceState(null, "", `#${newTab}`);
  };

  return (
    <div className="page admin-content">
      <h1 className="text-3xl font-bold text-white mb-6">Content Management</h1>

      <div className="flex flex-wrap gap-1 mb-6 border-b border-white/10 pb-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`px-3 py-1.5 rounded-t text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-white text-black"
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
