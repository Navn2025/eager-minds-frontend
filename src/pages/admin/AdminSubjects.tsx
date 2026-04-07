import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, BookOpen, FileUp, X, Layers } from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState<Record<string, string>>({});
  const [worksheetFile, setWorksheetFile] = useState<{
    topicId: string;
    file: File;
  } | null>(null);
  const [answerFile, setAnswerFile] = useState<{
    topicId: string;
    file: File;
  } | null>(null);
  const [worksheetTitle, setWorksheetTitle] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [uploadingTopicId, setUploadingTopicId] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    api
      .get("/prep/subjects?include=full")
      .then((res) => {
        setSubjects(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(fetchData, [fetchData]);

  const addSubject = async () => {
    if (!newSubject.trim()) return;
    await api.post("/prep/subjects", { name: newSubject });
    setNewSubject("");
    fetchData();
  };

  const addTopic = async (subjectId: string) => {
    const name = newTopic[subjectId];
    if (!name?.trim()) return;
    await api.post("/prep/topics", { name, subjectId });
    setNewTopic((p) => ({ ...p, [subjectId]: "" }));
    fetchData();
  };

  const uploadWorksheet = async (topicId: string, subjectId: string) => {
    if (!worksheetFile || worksheetFile.topicId !== topicId) return;
    setUploadingTopicId(topicId);
    try {
      const fd = new FormData();
      fd.append("title", worksheetTitle[topicId] || worksheetFile.file.name);
      fd.append("subjectId", subjectId);
      fd.append("topicId", topicId);
      fd.append("pdf", worksheetFile.file);
      if (answerFile && answerFile.topicId === topicId) {
        fd.append("answer", answerFile.file);
      }
      await api.post("/prep/worksheets", fd);
      alert("PDF(s) uploaded successfully!");
      setWorksheetFile(null);
      setAnswerFile(null);
      setWorksheetTitle((p) => ({ ...p, [topicId]: "" }));
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to upload PDF");
    } finally {
      setUploadingTopicId(null);
    }
  };

  const deleteWorksheet = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await api.delete(`/prep/worksheets/${id}`);
    fetchData();
  };

  const deleteSubject = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" and all its topics?`)) return;
    await api.delete(`/prep/subjects/${id}`);
    fetchData();
  };

  const deleteTopic = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" and all its worksheets?`)) return;
    await api.delete(`/prep/topics/${id}`);
    fetchData();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 md:space-y-12 pb-20"
    >
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-accent">
          <Layers size={12} className="text-accent" />
          <span>Curriculum Architect</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
          Subjects <span className="text-white/20">&</span>{" "}
          <br className="sm:hidden" /> Topics.
        </h1>
      </header>

      {/* Initialize Subject */}
      <section className="matte-card p-6 md:p-10 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">
          Initialize New Subject
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Neural node name (e.g. Mathematics)"
            className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl text-white placeholder:text-white/20 flex-1 outline-none focus:border-accent/40 transition-all font-medium"
          />
          <Button
            onClick={addSubject}
            className="h-14 md:h-16 px-8 rounded-2xl md:rounded-3xl bg-accent text-white font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
          >
            <Plus size={18} className="mr-2" /> Add Subject
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 md:gap-12">
        <AnimatePresence mode="popLayout">
          {subjects.map((subject, idx) => {
            const sId = subject.id;
            const topics = subject.topics || [];
            return (
              <motion.div
                key={sId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="matte-card overflow-hidden"
              >
                <div className="p-6 md:p-10 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-accent border border-white/5">
                      <BookOpen size={20} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">
                      {subject.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => deleteSubject(sId, subject.name)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/10"
                  >
                    <Trash2 size={12} /> Terminate Subject
                  </button>
                </div>

                <div className="p-6 md:p-10 space-y-8">
                  {topics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {topics.map((topic: any) => {
                        const tId = topic.id;
                        const worksheets = topic.worksheets || [];
                        return (
                          <div
                            key={tId}
                            className="space-y-4 p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative group"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="text-lg md:text-xl font-black text-white tracking-tight uppercase">
                                {topic.name}
                              </h4>
                              <button
                                onClick={() => deleteTopic(tId, topic.name)}
                                className="p-2 text-white/10 hover:text-red-500 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>

                            {/* Worksheets list */}
                            <div className="space-y-2">
                              {worksheets.map((ws: any) => (
                                <div
                                  key={ws.id}
                                  className="flex items-center justify-between text-xs py-2 px-4 rounded-xl bg-white/[0.03] border border-white/5 text-white/40 group/ws"
                                >
                                  <span className="truncate pr-4 italic">
                                    "{ws.title}"
                                  </span>
                                  <button
                                    onClick={() =>
                                      deleteWorksheet(ws.id, ws.title)
                                    }
                                    className="opacity-0 group-hover/ws:opacity-100 text-red-500/50 hover:text-red-500 transition-all"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                              <input
                                value={worksheetTitle[tId] || ""}
                                onChange={(e) =>
                                  setWorksheetTitle((p) => ({
                                    ...p,
                                    [tId]: e.target.value,
                                  }))
                                }
                                placeholder="Worksheet Signature"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white font-bold uppercase tracking-widest outline-none focus:border-accent/40"
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-center">
                                <label className="cursor-pointer">
                                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors flex items-center justify-center gap-2">
                                    <FileUp size={14} />{" "}
                                    {worksheetFile?.topicId === tId
                                      ? "Worksheet Ready"
                                      : "Worksheet PDF"}
                                  </div>
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) =>
                                      e.target.files?.[0] &&
                                      setWorksheetFile({
                                        topicId: tId,
                                        file: e.target.files[0],
                                      })
                                    }
                                  />
                                </label>

                                <label className="cursor-pointer">
                                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors flex items-center justify-center gap-2">
                                    <FileUp size={14} />{" "}
                                    {answerFile?.topicId === tId
                                      ? "Answer Ready"
                                      : "Answer PDF"}
                                  </div>
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) =>
                                      e.target.files?.[0] &&
                                      setAnswerFile({
                                        topicId: tId,
                                        file: e.target.files[0],
                                      })
                                    }
                                  />
                                </label>

                                <button
                                  onClick={() => uploadWorksheet(tId, sId)}
                                  disabled={uploadingTopicId === tId}
                                  className={`w-12 h-12 bg-accent/20 border border-accent/20 rounded-xl flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all shadow-lg ${uploadingTopicId === tId ? "opacity-50 cursor-wait" : ""}`}
                                >
                                  {uploadingTopicId === tId ? (
                                    <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Plus size={20} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-white/10 italic text-sm border-2 border-dashed border-white/5 rounded-3xl">
                      No neural pathways mapped for this subject yet.
                    </div>
                  )}

                  {/* Add Topic Control */}
                  <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                    <input
                      value={newTopic[sId] || ""}
                      onChange={(e) =>
                        setNewTopic((p) => ({ ...p, [sId]: e.target.value }))
                      }
                      placeholder="New Synaptic Topic"
                      className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/20 flex-1 outline-none focus:border-accent/40"
                    />
                    <Button
                      onClick={() => addTopic(sId)}
                      variant="ghost"
                      className="h-14 md:h-16 px-8 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
                    >
                      Establish Topic
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && subjects.length === 0 && (
          <div className="matte-card py-32 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 text-white/10">
              <Layers size={40} />
            </div>
            <p className="text-white/20 font-medium uppercase tracking-[0.3em] text-xs px-10">
              No subjects yet. Add your first subject to get started.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
