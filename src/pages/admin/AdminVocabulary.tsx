import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Book,
  Edit3,
  Languages,
  Search,
  Calendar,
  Quote,
  Zap,
} from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function AdminVocabulary() {
  const [words, setWords] = useState<any[]>([]);
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
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(() => {
    setLoading(true);
    api
      .get("/prep/vocabulary")
      .then((res) => {
        const data = res.data;
        setWords(Array.isArray(data) ? data : data.words || [data]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(fetchData, [fetchData]);

  const resetForm = () => {
    setForm({
      word: "",
      meaning: "",
      synonym: "",
      antonym: "",
      exampleSentence: "",
      pronunciation: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/prep/vocabulary/${editId}`, form);
    } else {
      await api.post("/prep/vocabulary", form);
    }
    resetForm();
    fetchData();
  };

  const startEdit = (word: any) => {
    setForm({
      word: word.word || "",
      meaning: word.meaning || "",
      synonym: word.synonym || "",
      antonym: word.antonym || "",
      exampleSentence: word.exampleSentence || "",
      pronunciation: word.pronunciation || "",
      date: word.date
        ? new Date(word.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setEditId(word.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, word: string) => {
    if (!confirm(`Redact "${word}" from the lexicon?`)) return;
    await api.delete(`/prep/vocabulary/${id}`);
    fetchData();
  };

  const filteredWords = words.filter(
    (w) =>
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 md:space-y-12 pb-20"
    >
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-accent">
            <Languages size={12} className="text-accent" />
            <span>Vocabulary Management</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9]">
            Word of the <br className="sm:hidden" />{" "}
            <span className="text-white/20">Day.</span>
          </h1>
          <p className="text-text-secondary text-base md:text-xl font-medium max-w-xl leading-relaxed">
            Expand the collective vocabulary and refine linguistic signatures
            across the grid.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="relative group w-full xl:w-80">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search linguistics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 md:h-16 pl-14 pr-8 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl text-white placeholder:text-white/20 outline-none focus:border-accent/40 transition-all font-medium"
            />
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="h-14 md:h-16 w-full sm:w-auto px-8 rounded-2xl md:rounded-3xl bg-accent text-white font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
          >
            {showForm ? "Cancel Entry" : "+ Expand Lexicon"}
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="matte-card p-6 md:p-10 space-y-8"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Zap size={20} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                  Entry Parameters
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">
                    Core Word
                  </label>
                  <input
                    value={form.word}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, word: e.target.value }))
                    }
                    placeholder="Enter lexicon node..."
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-white/20 outline-none focus:border-accent/40"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">
                    Phonetic Signature
                  </label>
                  <input
                    value={form.pronunciation}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, pronunciation: e.target.value }))
                    }
                    placeholder="/prəˌnʌnsiˈeɪʃən/"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-white/20 outline-none focus:border-accent/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">
                  Semantic Definition
                </label>
                <textarea
                  value={form.meaning}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, meaning: e.target.value }))
                  }
                  placeholder="Define the linguistic node..."
                  rows={3}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-medium placeholder:text-white/20 outline-none focus:border-accent/40 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">
                    Parallel Synonym
                  </label>
                  <input
                    value={form.synonym}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, synonym: e.target.value }))
                    }
                    placeholder="Similar signature..."
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-medium placeholder:text-white/20 outline-none focus:border-accent/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">
                    Inverse Antonym
                  </label>
                  <input
                    value={form.antonym}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, antonym: e.target.value }))
                    }
                    placeholder="Opposite node..."
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-medium placeholder:text-white/20 outline-none focus:border-accent/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">
                  Contextual Application
                </label>
                <input
                  value={form.exampleSentence}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, exampleSentence: e.target.value }))
                  }
                  placeholder="Use the word in a sentence..."
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-medium placeholder:text-white/20 outline-none focus:border-accent/40"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">
                    Transmission Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] outline-none focus:border-accent/40"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    className="w-full h-14 md:h-16 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all shadow-xl"
                  >
                    {editId ? "Update Word" : "Add Word"}
                  </Button>
                </div>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredWords.map((w, idx) => (
            <motion.div
              layout
              key={w.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="matte-card group overflow-hidden"
            >
              <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">
                      {w.word}
                    </h2>
                    {w.pronunciation && (
                      <span className="px-4 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                        {w.pronunciation}
                      </span>
                    )}
                    <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-widest text-accent">
                      <Calendar size={10} />
                      {new Date(w.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <p className="text-base md:text-lg text-white/60 font-medium leading-relaxed italic">
                    {w.meaning}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {w.synonym && (
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                          Synonym
                        </p>
                        <p className="text-sm font-bold text-white/80">
                          {w.synonym}
                        </p>
                      </div>
                    )}
                    {w.antonym && (
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                          Antonym
                        </p>
                        <p className="text-sm font-bold text-white/80">
                          {w.antonym}
                        </p>
                      </div>
                    )}
                  </div>

                  {w.exampleSentence && (
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 relative">
                      <Quote
                        className="absolute -left-2 -top-2 text-accent/20"
                        size={32}
                      />
                      <p className="text-sm text-text-secondary leading-relaxed font-medium pl-4">
                        {w.exampleSentence}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-3 justify-end md:justify-center border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                  <button
                    onClick={() => startEdit(w)}
                    className="flex-1 md:flex-none p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(w.id, w.word)}
                    className="flex-1 md:flex-none p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(124,58,237,0.4)]" />
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] animate-pulse">
              Scanning Lexicon...
            </p>
          </div>
        )}

        {!loading && filteredWords.length === 0 && (
          <div className="matte-card py-32 text-center space-y-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 text-white/10">
              <Book size={48} />
            </div>
            <div className="space-y-3">
              <p className="text-[12px] text-white/40 font-black uppercase tracking-[0.3em]">
                Lexicon Stream Empty
              </p>
              <p className="text-lg text-white/20 font-medium max-w-sm mx-auto">
                Awaiting linguistic expansion nodes.
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="px-8 border-white/5 text-white/40 hover:text-white"
            >
              Establish First Word
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
