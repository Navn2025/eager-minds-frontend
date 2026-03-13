import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import PDFViewer from "../components/ui/PDFViewer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Languages,
  Calculator,
  Brain,
  Lightbulb,
  Sparkles,
  Compass,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  slug: string;
  _count: { topics: number; worksheets: number };
}

interface Topic {
  id: string;
  name: string;
  slug: string;
  _count: { worksheets: number };
}

interface Worksheet {
  id: string;
  title: string;
  pdfUrl: string;
  answerPdfUrl: string | null;
  difficulty: string;
  topic: { name: string; slug: string };
}

interface WordOfDay {
  word: string;
  meaning: string;
  synonym: string;
  antonym: string;
  exampleSentence: string;
  pronunciation: string;
}

const subjectIcons: Record<string, any> = {
  maths: Calculator,
  english: Languages,
  "verbal-reasoning": Brain,
  "non-verbal-reasoning": Lightbulb,
};

export default function ElevenPlusPrep() {
  const { isLoggedIn } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSlug, setActiveSlug] = useState("maths");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [wordOfDay, setWordOfDay] = useState<WordOfDay | null>(null);
  const [viewingPdf, setViewingPdf] = useState<{
    url: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    api
      .get("/prep/subjects")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.subjects || [];
        setSubjects(data);
        if (data.length > 0) setActiveSlug(data[0].slug);
      })
      .catch(() => {
        setSubjects([]);
      });
    api
      .get("/prep/word-of-the-day")
      .then((res) => setWordOfDay(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    api
      .get(`/prep/subjects/${activeSlug}/topics`)
      .then((res) => setTopics(res.data))
      .catch(() => {});
    api
      .get(`/prep/subjects/${activeSlug}/worksheets`)
      .then((res) => setWorksheets(res.data.worksheets || []))
      .catch(() => {});
  }, [activeSlug]);

  const markComplete = async (ws: Worksheet) => {
    if (!isLoggedIn) return;
    await api.patch(`/prep/worksheets/${ws.id}/complete`);
  };

  return (
    <div className="page-container pb-40 pt-40 md:pt-52">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 mt-10 space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-400/20 bg-purple-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-purple-300/70">
          <Compass size={12} className="text-purple-400" />
          <span>Academic Navigation</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white">
          11+ <span className="text-gradient">Studio.</span>
        </h1>
        <p className="subtitle-editorial max-w-2xl">
          The ultimate protocol for examination mastery. Advanced study
          architecture, interactive methodology, and daily cognitive boosters.
        </p>
      </motion.header>

      <AnimatePresence>
        {viewingPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10"
          >
            <div className="w-full max-w-7xl h-full relative">
              <PDFViewer
                url={viewingPdf.url}
                title={viewingPdf.title}
                onClose={() => setViewingPdf(null)}
                className="w-full h-full shadow-[0_0_100px_rgba(255,255,255,0.1)] rounded-[3rem] overflow-hidden border border-white/10"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subject Tabs */}
      <div className="flex flex-wrap gap-4 mb-24">
        {subjects.map((s, i) => {
          const Icon = subjectIcons[s.slug] || BookOpen;
          const isActive = activeSlug === s.slug;
          return (
            <motion.button
              key={s.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveSlug(s.slug)}
              className={cn(
                "group relative flex items-center gap-4 px-8 py-6 rounded-3xl border transition-all duration-700 overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-pink-500 via-purple-600 to-violet-600 text-white border-transparent shadow-[0_0_30px_rgba(168,85,247,0.35)]"
                  : "bg-white/[0.02] text-white/40 border-white/8 hover:border-purple-400/30 hover:text-white",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  isActive
                    ? "bg-white/10"
                    : "bg-white/5 group-hover:bg-white/10",
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className="font-black uppercase tracking-widest text-[10px]">
                {s.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-24">
          {/* Topics Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                Core Curriculum
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-400/20 to-transparent" />
            </div>
            {topics.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {topics.map((t) => (
                  <div
                    key={t.id}
                    className="px-6 py-3 bg-white/[0.01] border border-white/5 rounded-2xl text-white/40 text-[10px] font-black uppercase tracking-widest hover:border-white/20 hover:text-white transition-all cursor-default"
                  >
                    {t.name}{" "}
                    <span className="ml-2 text-white/10">
                      {t._count.worksheets}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 border border-dashed border-white/5 rounded-[2rem] text-center">
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                  Querying topic nodes...
                </p>
              </div>
            )}
          </motion.section>

          {/* Worksheets Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                Technical Assets
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-400/20 to-transparent" />
            </div>
            {worksheets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {worksheets.map((ws, i) => (
                  <motion.div
                    key={ws.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="matte-card group relative h-full flex flex-col pt-10">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex justify-between items-start mb-6">
                          <div className="px-3 py-1 rounded-full border border-purple-400/20 bg-purple-500/5 text-[9px] font-black uppercase tracking-widest text-purple-300/60">
                            {ws.difficulty}
                          </div>
                          <Badge className="bg-white/5 border border-white/5 text-white/40 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {ws.topic.name}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl font-black text-white tracking-tighter leading-tight group-hover:translate-x-1 transition-transform">
                          {ws.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 pt-4 flex-1 flex flex-col justify-between gap-10">
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white shadow-[0_4px_16px_rgba(168,85,247,0.3)]"
                            onClick={() =>
                              setViewingPdf({ url: ws.pdfUrl, title: ws.title })
                            }
                          >
                            Execute Master
                          </Button>
                          {ws.answerPdfUrl && (
                            <Button
                              variant="outline"
                              className="h-14 rounded-2xl border-purple-400/20 bg-purple-500/5 text-white/80 font-black uppercase tracking-widest text-[10px] hover:bg-purple-500/15 hover:border-purple-400/40 transition-all"
                              onClick={() =>
                                setViewingPdf({
                                  url: ws.answerPdfUrl!,
                                  title: `${ws.title} - Answers`,
                                })
                              }
                            >
                              Answers
                            </Button>
                          )}
                        </div>

                        {isLoggedIn && (
                          <button
                            onClick={() => markComplete(ws)}
                            className="flex items-center justify-center gap-3 py-6 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-purple-300 transition-all group/btn"
                          >
                            <ShieldCheck
                              size={16}
                              className="group-hover/btn:scale-110 transition-transform"
                            />
                            Finalize Status
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-32 border border-dashed border-white/5 rounded-[4rem] text-center bg-white/[0.01]">
                <BookOpen size={48} className="mx-auto text-white/5 mb-6" />
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
                  Asset sequence pending for {activeSlug}.
                </p>
              </div>
            )}
          </motion.section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-12">
          {/* Word of the Day */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                Cognitive Booster
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-400/20 to-transparent" />
            </div>
            {wordOfDay ? (
              <Card className="p-10 relative overflow-hidden bg-white/[0.02] border-white/5 rounded-[3.5rem] group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-all duration-1000" />
                <div className="relative space-y-10">
                  <div>
                    <p className="text-5xl font-black text-white tracking-tighter mb-2">
                      {wordOfDay.word}
                    </p>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                      {wordOfDay.pronunciation}
                    </p>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">
                        Logic / Meaning
                      </p>
                      <p className="subtitle-editorial text-white/60">
                        {wordOfDay.meaning}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">
                          Synonym
                        </p>
                        <p className="text-sm text-white font-black tracking-tight">
                          {wordOfDay.synonym}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">
                          Antonym
                        </p>
                        <p className="text-sm text-white font-black tracking-tight">
                          {wordOfDay.antonym}
                        </p>
                      </div>
                    </div>

                    <div className="pt-10 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">
                        Application
                      </p>
                      <p className="text-sm text-white/40 italic font-medium leading-relaxed">
                        "{wordOfDay.exampleSentence}"
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center border-dashed border-white/5 bg-white/[0.01] rounded-[3rem]">
                <Sparkles
                  size={32}
                  className="mx-auto text-white/5 animate-pulse mb-6"
                />
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                  Compiling vocabulary matrix...
                </p>
              </Card>
            )}
          </motion.section>

          {/* Quick Tip / Promo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-10 bg-gradient-to-br from-pink-500 via-purple-600 to-violet-700 text-white border-none rounded-[3.5rem] shadow-[0_8px_40px_rgba(168,85,247,0.30)] relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                <Lightbulb size={120} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-white/70">
                Execution Tip
              </h3>
              <p className="text-lg font-black leading-tight tracking-tighter mb-10">
                Cognitive iteration on verbal reasoning builds neural efficiency
                required for the 11+ protocol.
              </p>
              <Button
                variant="ghost"
                className="h-16 w-full rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 group transition-all"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Access Protocol
                </span>
                <ChevronRight
                  className="ml-2 group-hover:translate-x-1 transition-all"
                  size={16}
                />
              </Button>
            </Card>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
