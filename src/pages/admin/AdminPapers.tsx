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
    <div className="space-y-8 pb-20">
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/2 text-[10px] font-black uppercase tracking-[0.3em] text-accent">
          <span>Practice Paper Control</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
          Practice Papers.
        </h1>
        <p className="text-text-secondary text-base md:text-lg font-medium max-w-2xl leading-relaxed">
          Upload papers, attach answer sheets, and keep the archive aligned with
          the admin theme.
        </p>
      </div>

      <button
        onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}
        className="inline-flex items-center justify-center h-14 md:h-16 px-6 md:px-8 rounded-2xl md:rounded-3xl bg-linear-to-r from-accent to-accent-pink text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all hover:scale-[1.02]"
      >
        {showForm ? "Cancel" : "+ Add Paper"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="matte-card p-6 md:p-8 space-y-6"
        >
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/30 ml-1">
              Paper Title *
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g., Math Practice Paper 2024"
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/25 outline-none focus:border-accent/40 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/30 ml-1">
                Subject *
              </label>
              <select
                value={form.subjectId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subjectId: e.target.value }))
                }
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white outline-none focus:border-accent/40 transition-all"
                required
                title="Select subject"
              >
                <option value="" className="bg-[#0a0713]">
                  Select subject...
                </option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#0a0713]">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/30 ml-1">
                Difficulty
              </label>
              <select
                value={form.difficulty}
                onChange={(e) =>
                  setForm((f) => ({ ...f, difficulty: e.target.value }))
                }
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white outline-none focus:border-accent/40 transition-all"
                title="Select difficulty"
              >
                <option value="easy" className="bg-[#0a0713]">
                  Easy
                </option>
                <option value="medium" className="bg-[#0a0713]">
                  Medium
                </option>
                <option value="hard" className="bg-[#0a0713]">
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
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-linear-to-r from-emerald-500 to-cyan-400 text-white text-[10px] font-black uppercase tracking-[0.22em] transition-all hover:scale-[1.01]"
          >
            Upload Paper
          </button>
        </form>
      )}

      <div className="space-y-3">
        {papers.map((paper) => (
          <div
            key={paper.id as string}
            className="flex justify-between items-center gap-4 matte-card px-5 py-4 hover:bg-white/3 transition-colors"
          >
            <div>
              <span className="font-black text-white uppercase tracking-tight">
                {paper.title as string}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-white/50 bg-white/10 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em]">
                  {(paper.subject as { name?: string })?.name || "No subject"}
                </span>
                <span
                  className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] ${
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
              className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
        {papers.length === 0 && (
          <p className="text-sm text-white/50 py-10 text-center rounded-[1.4rem] border border-dashed border-white/10 bg-white/2">
            No papers yet. Add your first paper above.
          </p>
        )}
      </div>
    </div>
  );
}
