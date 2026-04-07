import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import PDFViewer from "../components/ui/PDFViewer";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  Languages,
  Calculator,
  Brain,
  Lightbulb,
  Compass,
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

const subjectIcons: Record<string, any> = {
  maths: Calculator,
  english: Languages,
  "verbal-reasoning": Brain,
  "non-verbal-reasoning": Lightbulb,
};

export default function ElevenPlusPrep() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSubject = searchParams.get("subject");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSlug, setActiveSlug] = useState(initialSubject || "");
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentView, setContentView] = useState<"worksheets" | "answers">(
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

  const groupedAnswerSheets = worksheets
    .filter((ws) => Boolean(ws.answerPdfUrl))
    .reduce(
      (acc, ws) => {
        if (!acc[ws.topic.name]) {
          acc[ws.topic.name] = [];
        }
        acc[ws.topic.name].push(ws);
        return acc;
      },
      {} as Record<string, Worksheet[]>,
    );

  const isAnswerView = contentView === "answers";
  const visibleGroups = isAnswerView ? groupedAnswerSheets : groupedWorksheets;
  const visibleItemCount = isAnswerView
    ? worksheets.filter((ws) => Boolean(ws.answerPdfUrl)).length
    : worksheets.length;

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

  const handleViewWorksheet = (
    ws: Worksheet,
    section: "worksheets" | "answers",
  ) => {
    if (!isLoggedIn) {
      const backTo = activeSlug
        ? `/11-plus-prep?subject=${activeSlug}`
        : "/11-plus-prep";
      navigate(`/login?redirect=${encodeURIComponent(backTo)}`);
      return;
    }

    setViewingPdf({
      url: section === "answers" ? ws.answerPdfUrl! : ws.pdfUrl,
      title: section === "answers" ? `${ws.title} - Answers` : ws.title,
    });
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

      <div className="space-y-20">
        {loading ? (
          <div className="p-32 border border-dashed border-white/5 rounded-[4rem] text-center bg-white/[0.01] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-white/40 text-sm font-bold tracking-widest uppercase">
              Loading worksheets...
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-2 flex items-center w-full lg:w-fit">
              <button
                onClick={() => setContentView("worksheets")}
                className={cn(
                  "px-8 py-3 rounded-xl font-bold text-xs md:text-sm transition-all",
                  contentView === "worksheets"
                    ? "bg-white/[0.08] text-white shadow-lg"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]",
                )}
              >
                Worksheets
              </button>
              <button
                onClick={() => setContentView("answers")}
                className={cn(
                  "px-8 py-3 rounded-xl font-bold text-xs md:text-sm transition-all",
                  contentView === "answers"
                    ? "bg-white/[0.08] text-white shadow-lg"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]",
                )}
              >
                Worksheet Answers
              </button>
            </div>

            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                  {isAnswerView ? "Worksheet Answers" : "Worksheets"}
                </h2>
                <Badge className="bg-white/5 border border-purple-400/20 text-purple-300 text-[10px] lowercase py-1 px-3">
                  {visibleItemCount}{" "}
                  {isAnswerView ? "answer sheets" : "worksheets"}
                </Badge>
              </div>

              {Object.keys(visibleGroups).length > 0 ? (
                Object.entries(visibleGroups).map(
                  ([topicName, topicWorksheets]) => (
                    <div
                      key={`${contentView}-${topicName}`}
                      className="space-y-8"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                          <h3 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                            {topicName}
                          </h3>
                          <Badge className="bg-white/5 border border-purple-400/20 text-purple-300 text-[10px] lowercase py-1 px-3">
                            {topicWorksheets.length}{" "}
                            {isAnswerView ? "Answers" : "Worksheets"}
                          </Badge>
                        </div>
                        <p className="text-white/50 text-sm font-medium">
                          {isAnswerView
                            ? `Answer sheets for ${topicName} worksheets`
                            : `Worksheets for ${topicName} practice`}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {topicWorksheets.map((ws) => (
                          <Card
                            key={`${contentView}-${ws.id}`}
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
                                {isAnswerView
                                  ? `${ws.title} Answers - Sheet 1`
                                  : ws.title}
                              </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-3 mt-auto z-10">
                              <Button
                                variant="ghost"
                                className={cn(
                                  "h-10 border border-white/5 rounded-xl text-xs font-bold transition-all",
                                  isLoggedIn
                                    ? "bg-white/[0.03] hover:bg-white/10 text-white/80"
                                    : "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20",
                                )}
                                onClick={() =>
                                  handleViewWorksheet(
                                    ws,
                                    isAnswerView ? "answers" : "worksheets",
                                  )
                                }
                              >
                                <Compass
                                  size={14}
                                  className="mr-2 opacity-50"
                                />{" "}
                                {isLoggedIn ? "View" : "Login to View"}
                              </Button>
                            </div>
                            {!isLoggedIn && (
                              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-300/80 z-10 -mt-2">
                                Can be viewed only after login.
                              </p>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="p-16 border border-dashed border-white/5 rounded-[2rem] text-center bg-white/[0.01]">
                  <BookOpen size={40} className="mx-auto text-white/10 mb-5" />
                  <p className="text-white/40 text-sm font-bold tracking-widest uppercase">
                    {isAnswerView
                      ? "No Answer Sheets Available"
                      : "No Worksheets Available"}
                  </p>
                </div>
              )}
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
}
