import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import api from "../../services/api";
import { cn } from "../../lib/utils";
import PDFViewer from "../../components/ui/PDFViewer";

interface Worksheet {
  id: string;
  title: string;
  subjectName: string;
  difficulty: string;
  questionCount: number;
  duration: number;
  pdfUrl?: string;
  answerPdfUrl?: string;
  completed?: boolean;
}

export default function DashboardWorksheets() {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentView, setContentView] = useState<"worksheets" | "answers">(
    "worksheets",
  );
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [search, setSearch] = useState("");
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  useEffect(() => {
    Promise.allSettled([
      api.get("/prep/worksheets"),
      api.get("/prep/dashboard"),
    ])
      .then(([worksheetsRes, dashboardRes]) => {
        if (worksheetsRes.status !== "fulfilled") {
          throw new Error("Failed to load worksheets");
        }

        const worksheetData = worksheetsRes.value.data;
        const raw = Array.isArray(worksheetData)
          ? worksheetData
          : worksheetData?.worksheets || [];

        const completedWorksheetIds =
          dashboardRes.status === "fulfilled"
            ? new Set(
                (dashboardRes.value.data?.completions || [])
                  .filter(
                    (c: { itemType?: string; itemId?: string }) =>
                      c.itemType === "worksheet",
                  )
                  .map((c: { itemId?: string }) => c.itemId)
                  .filter(Boolean),
              )
            : new Set<string>();

        const mapped = raw.map(
          (w: {
            id: string;
            title: string;
            difficulty?: string;
            pdfUrl?: string;
            answerPdfUrl?: string;
            subject?: { name?: string };
            topic?: { name?: string };
            completed?: boolean;
          }) => ({
            id: w.id,
            title: w.title,
            subjectName: w.subject?.name || w.topic?.name || "General",
            difficulty:
              w.difficulty?.charAt(0).toUpperCase() +
                (w.difficulty?.slice(1) || "") || "Medium",
            questionCount: 0,
            duration: 0,
            pdfUrl: w.pdfUrl || "",
            answerPdfUrl: w.answerPdfUrl || "",
            completed: completedWorksheetIds.has(w.id) || Boolean(w.completed),
          }),
        );

        setWorksheets(mapped);
        setLoading(false);
      })
      .catch(() => {
        setWorksheets([
          {
            id: "1",
            title: "Mathematics Practice Set A",
            subjectName: "Mathematics",
            difficulty: "Medium",
            questionCount: 25,
            duration: 45,
            pdfUrl: "",
            answerPdfUrl: "",
            completed: true,
          },
          {
            id: "2",
            title: "English Comprehension",
            subjectName: "English",
            difficulty: "Easy",
            questionCount: 20,
            duration: 30,
            pdfUrl: "",
            answerPdfUrl: "",
            completed: true,
          },
          {
            id: "3",
            title: "Verbal Reasoning Challenge",
            subjectName: "Verbal Reasoning",
            difficulty: "Hard",
            questionCount: 30,
            duration: 60,
            pdfUrl: "",
            answerPdfUrl: "",
            completed: false,
          },
          {
            id: "4",
            title: "Non-Verbal Patterns",
            subjectName: "Non-Verbal Reasoning",
            difficulty: "Medium",
            questionCount: 25,
            duration: 40,
            pdfUrl: "",
            answerPdfUrl: "",
            completed: false,
          },
        ]);
        setLoading(false);
      });
  }, []);

  const openWorksheet = (
    worksheet: Worksheet,
    section: "worksheets" | "answers",
  ): boolean => {
    const targetUrl =
      section === "answers"
        ? worksheet.answerPdfUrl
        : worksheet.completed
          ? worksheet.answerPdfUrl || worksheet.pdfUrl
          : worksheet.pdfUrl;

    if (!targetUrl) {
      alert(
        section === "answers"
          ? "This worksheet does not have an answer sheet linked yet."
          : "This worksheet does not have a PDF file linked yet.",
      );
      return false;
    }

    setViewingPdf(targetUrl);
    setSelectedTitle(
      section === "answers"
        ? `${worksheet.title} - Answers`
        : worksheet.completed
          ? `${worksheet.title} - Review`
          : `${worksheet.title} - Practice`,
    );
    return true;
  };

  const markComplete = async (worksheet: Worksheet) => {
    if (worksheet.completed) {
      return;
    }

    try {
      await api.patch(`/prep/worksheets/${worksheet.id}/complete`);
      setWorksheets((prev) =>
        prev.map((w) =>
          w.id === worksheet.id
            ? {
                ...w,
                completed: true,
              }
            : w,
        ),
      );
    } catch (error) {
      console.error("Failed to mark worksheet complete", error);
    }
  };

  const visibleWorksheets = worksheets.filter((w) =>
    contentView === "answers" ? Boolean(w.answerPdfUrl) : true,
  );

  const filteredWorksheets = visibleWorksheets.filter((w) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && w.completed) ||
      (filter === "pending" && !w.completed);
    const matchesSearch =
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.subjectName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const completedCount = visibleWorksheets.filter((w) => w.completed).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32 pt-10">
      {viewingPdf &&
        selectedTitle &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-[#050505] backdrop-blur-3xl flex items-center justify-center p-0">
            <PDFViewer
              url={viewingPdf}
              title={selectedTitle}
              onClose={() => {
                setViewingPdf(null);
                setSelectedTitle("");
              }}
              className="w-full h-full border-none rounded-none"
            />
          </div>,
          document.body,
        )}

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          <FileText size={12} className="text-white/60" />
          <span>Practice Zone</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
          Worksheets <span className="text-white/40">Library.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed">
          Access your collection of practice materials. Track completion and
          master every subject.
        </p>
      </motion.header>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-2 flex items-center w-full md:w-fit">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            label:
              contentView === "answers"
                ? "Total Answer Sheets"
                : "Total Worksheets",
            value: visibleWorksheets.length,
            icon: BookOpen,
          },
          { label: "Completed", value: completedCount, icon: CheckCircle2 },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="border-white/5 bg-white/[0.01] rounded-[2rem]">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center">
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-3xl font-black tracking-tighter text-white">
                    {stat.value}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2">
          {(["all", "completed", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                filter === f
                  ? "bg-white text-black"
                  : "bg-white/[0.02] text-white/40 border border-white/5 hover:text-white",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
            size={18}
          />
          <input
            type="text"
            placeholder={
              contentView === "answers"
                ? "Search answer sheets..."
                : "Search worksheets..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-white placeholder:text-white/20 text-sm font-medium outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredWorksheets.map((worksheet, i) => (
          <motion.div
            key={`${contentView}-${worksheet.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded-[2rem] transition-all duration-300 group">
              <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105",
                      worksheet.completed
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-white/5 text-white/40",
                    )}
                  >
                    {worksheet.completed ? (
                      <CheckCircle2 size={28} />
                    ) : (
                      <FileText size={28} />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors">
                      {contentView === "answers"
                        ? `${worksheet.title} - Answers`
                        : worksheet.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
                      <span className="px-2 py-1 rounded-lg bg-white/5">
                        {worksheet.subjectName}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-lg",
                          worksheet.difficulty === "Easy" &&
                            "bg-emerald-500/10 text-emerald-500",
                          worksheet.difficulty === "Medium" &&
                            "bg-amber-500/10 text-amber-500",
                          worksheet.difficulty === "Hard" &&
                            "bg-red-500/10 text-red-500",
                        )}
                      >
                        {worksheet.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {worksheet.duration} min
                      </span>
                      <span>
                        {worksheet.questionCount > 0
                          ? `${worksheet.questionCount} Questions`
                          : "Practice Set"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={async () => {
                      const opened = openWorksheet(worksheet, contentView);
                      if (opened && contentView === "worksheets") {
                        await markComplete(worksheet);
                      }
                    }}
                    className={cn(
                      "h-14 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all",
                      contentView === "answers"
                        ? "bg-white/5 text-white hover:bg-white/10"
                        : worksheet.completed
                          ? "bg-white/5 text-white hover:bg-white/10"
                          : "bg-white text-black hover:scale-[1.02]",
                    )}
                  >
                    {contentView === "answers"
                      ? "Open Answers"
                      : worksheet.completed
                        ? "Review"
                        : "Start"}{" "}
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredWorksheets.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Filter size={32} className="text-white/20" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {contentView === "answers"
              ? "No answer sheets found"
              : "No worksheets found"}
          </h3>
          <p className="text-white/40">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
