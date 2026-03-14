import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import PDFViewer from "../components/ui/PDFViewer";
import { Card } from "../components/ui/Card";
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
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  slug: string;
  _count: { topics: number; worksheets: number };
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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSubject = searchParams.get("subject");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSlug, setActiveSlug] = useState(initialSubject || "");
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [wordOfDay, setWordOfDay] = useState<WordOfDay | null>(null);
  const [activeTab, setActiveTab] = useState<"worksheets" | "answers">(
    "worksheets",
  );
  const [viewingPdf, setViewingPdf] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const groupedWorksheets = worksheets.reduce(
    (acc, ws) => {
      if (!acc[ws.topic.name]) {
        acc[ws.topic.name] = [];
      }
      acc[ws.topic.name].push(ws);
      return acc;
    },
    {} as Record<string, Worksheet[]>,
  );

  useEffect(() => {
    api
      .get("/prep/subjects")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.subjects || [];
        setSubjects(data);
        if (data.length > 0 && !activeSlug) setActiveSlug(data[0].slug);
      })
      .catch(() => {
        setSubjects([]);
      });
    api
      .get("/prep/word-of-the-day")
      .then((res) => setWordOfDay(res.data))
      .catch(() => {});
  }, [activeSlug]);

  useEffect(() => {
    if (!activeSlug) return;
    setLoading(true);
    api
      .get(`/prep/subjects/${activeSlug}/worksheets`)
      .then((res) => setWorksheets(res.data.worksheets || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeSlug]);

  const handleSubjectChange = (slug: string) => {
    setActiveSlug(slug);
    setSearchParams({ subject: slug }, { replace: true });
  };

  return (
    <div className="page-container pb-40 pt-40 md:pt-52">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 mt-10 space-y-6"
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 blur-xl opacity-20 rounded-[2rem]" />
            <div className="relative w-20 h-20 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center p-5 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
              {subjects.length > 0 && subjectIcons[activeSlug] ? (
                (() => {
                  const ActiveIcon = subjectIcons[activeSlug];
                  return (
                    <ActiveIcon
                      size={38}
                      className="text-white backdrop-blur-sm"
                    />
                  );
                })()
              ) : (
                <BookOpen size={38} className="text-white/80" />
              )}
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400">
              {subjects.find((s) => s.slug === activeSlug)?.name ||
                "11+ Studio"}{" "}
              (11+ Practice)
            </h1>
            <p className="subtitle-editorial max-w-2xl mt-4 text-white/50 text-base md:text-lg">
              Master mathematics with topic-wise worksheets and practice.
            </p>
          </div>
        </div>
      </motion.header>

      {createPortal(
        <AnimatePresence>
          {viewingPdf && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-[#050505] backdrop-blur-3xl flex items-center justify-center p-0"
            >
              <div className="w-full h-full relative">
                <PDFViewer
                  url={viewingPdf.url}
                  title={viewingPdf.title}
                  onClose={() => setViewingPdf(null)}
                  className="w-full h-full overflow-hidden border-none rounded-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

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
              onClick={() => handleSubjectChange(s.slug)}
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
        <div className="lg:col-span-2 space-y-16">
          {/* Segemented Toggle */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-2 flex items-center mb-16 w-full lg:w-fit mx-auto lg:mx-0">
            <button
              onClick={() => setActiveTab("worksheets")}
              className={cn(
                "px-10 py-4 rounded-xl font-bold text-sm transition-all flex-1 lg:flex-none",
                activeTab === "worksheets"
                  ? "bg-white/[0.08] text-white shadow-lg"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]",
              )}
            >
              Worksheets
            </button>
            <button
              onClick={() => setActiveTab("answers")}
              className={cn(
                "px-10 py-4 rounded-xl font-bold text-sm transition-all flex-1 lg:flex-none",
                activeTab === "answers"
                  ? "bg-white/[0.08] text-white shadow-lg"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]",
              )}
            >
              Answer Sheets
            </button>
          </div>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-20"
          >
            {loading ? (
              <div className="p-32 border border-dashed border-white/5 rounded-[4rem] text-center bg-white/[0.01] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-white/40 text-sm font-bold tracking-widest uppercase">
                  Loading worksheets...
                </p>
              </div>
            ) : Object.keys(groupedWorksheets).length > 0 ? (
              Object.entries(groupedWorksheets).map(
                ([topicName, topicWorksheets]) => {
                  const items = topicWorksheets.filter(
                    (ws) =>
                      activeTab === "worksheets" ||
                      (activeTab === "answers" && ws.answerPdfUrl),
                  );

                  if (items.length === 0) return null;

                  return (
                    <div key={topicName} className="space-y-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                          <h2 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                            {topicName}
                          </h2>
                          <Badge className="bg-white/5 border border-purple-400/20 text-purple-300 text-[10px] lowercase py-1 px-3">
                            {activeTab === "worksheets"
                              ? `${items.length} Worksheets`
                              : `${items.length} Answers`}
                          </Badge>
                        </div>
                        <p className="text-white/50 text-sm font-medium">
                          {activeTab === "worksheets"
                            ? `Worksheets for ${topicName} practice`
                            : `Answer sheets for ${topicName} worksheets`}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {items.map((ws) => (
                          <Card
                            key={`${ws.id}-${activeTab}`}
                            className="border-none bg-[#0f0f13] hover:bg-[#13141a] transition-all p-6 rounded-[1.5rem] flex flex-col gap-8 group relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-start gap-4 z-10">
                              <div className="mt-1">
                                <BookOpen
                                  size={18}
                                  className="text-purple-400/80"
                                />
                              </div>
                              <h3 className="text-base font-bold text-white/90 leading-snug">
                                {activeTab === "answers"
                                  ? `${ws.title} Answers - Sheet 1`
                                  : ws.title}
                              </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-auto z-10">
                              <Button
                                variant="ghost"
                                className="h-10 bg-white/[0.03] border border-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all text-white/80"
                                onClick={() =>
                                  setViewingPdf({
                                    url:
                                      activeTab === "answers"
                                        ? ws.answerPdfUrl!
                                        : ws.pdfUrl,
                                    title:
                                      activeTab === "answers"
                                        ? `${ws.title} - Answers`
                                        : ws.title,
                                  })
                                }
                              >
                                <Compass
                                  size={14}
                                  className="mr-2 opacity-50"
                                />{" "}
                                View
                              </Button>
                              <a
                                href={
                                  activeTab === "answers"
                                    ? ws.answerPdfUrl!
                                    : ws.pdfUrl
                                }
                                download
                                className="h-10 bg-white/[0.03] border border-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all text-white/80 flex items-center justify-center"
                              >
                                <ShieldCheck
                                  size={14}
                                  className="mr-2 opacity-50"
                                />{" "}
                                Download
                              </a>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                },
              )
            ) : (
              <div className="p-32 border border-dashed border-white/5 rounded-[4rem] text-center bg-white/[0.01]">
                <BookOpen size={48} className="mx-auto text-white/10 mb-6" />
                <p className="text-white/40 text-sm font-bold tracking-widest uppercase">
                  No Content Available
                </p>
                <p className="text-white/20 mt-2 text-xs">
                  We are currently preparing more materials. Check back soon.
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
        </aside>
      </div>
    </div>
  );
}
