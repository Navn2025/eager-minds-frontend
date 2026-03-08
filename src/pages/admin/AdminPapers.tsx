import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { FileUpload } from "../../components/ui/ImageUpload";

export default function AdminPapers() {
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

  useEffect(fetchData, [fetchData]);

  const resetForm = () => {
    setForm({ title: "", subjectId: "", difficulty: "medium" });
    setFile(null);
    setAnswerFile(null);
    setShowForm(false);
  };

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
      resetForm();
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
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-white">Practice Papers</h1>

      <button
        onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        {showForm ? "Cancel" : "+ Add Paper"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Paper Title *
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g., Math Practice Paper 2024"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                Subject *
              </label>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                Difficulty
              </label>
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
            </div>
          </div>

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
            className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Upload Paper
          </button>
        </form>
      )}

      <div className="space-y-2">
        {papers.map((paper) => (
          <div
            key={paper.id as string}
            className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/[0.07] transition-colors"
          >
            <div>
              <span className="font-medium text-white">
                {paper.title as string}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                  {(paper.subject as { name?: string })?.name || "No subject"}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    paper.difficulty === "easy"
                      ? "bg-green-500/20 text-green-400"
                      : paper.difficulty === "hard"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {paper.difficulty as string}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(paper.id as string)}
              className="px-3 py-1 text-sm text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
        {papers.length === 0 && (
          <p className="text-sm text-white/50 py-8 text-center">
            No papers yet. Add your first paper above.
          </p>
        )}
      </div>
    </div>
  );
}
