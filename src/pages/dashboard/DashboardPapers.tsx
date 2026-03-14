import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Download,
  FileText,
  Clock,
  Star,
  Lock,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  Crown,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import api from "../../services/api";
import PDFViewer from "../../components/ui/PDFViewer";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

interface Paper {
  id: string;
  title: string;
  subject: string;
  type: string;
  difficulty: string;
  duration: number;
  questionCount: number;
  year?: string;
  isPremium: boolean;
  completed?: boolean;
  score?: number;
  downloadCount?: number;
  pdfUrl?: string;
}

export default function DashboardPapers() {
  const navigate = useNavigate();
  const { isPremium } = useAuth();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "not-started">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  const getMockData = (): Paper[] => [
    {
      id: "1",
      title: "11+ Mathematics Mock Paper A",
      subject: "Mathematics",
      type: "Mock Exam",
      difficulty: "Hard",
      duration: 60,
      questionCount: 50,
      year: "2026",
      isPremium: true,
      completed: true,
      score: 92,
      downloadCount: 1250,
      pdfUrl: "",
    },
    {
      id: "2",
      title: "11+ English Comprehension",
      subject: "English",
      type: "Practice Paper",
      difficulty: "Medium",
      duration: 45,
      questionCount: 40,
      year: "2026",
      isPremium: true,
      completed: true,
      score: 88,
      downloadCount: 980,
      pdfUrl: "",
    },
    {
      id: "3",
      title: "Verbal Reasoning Challenge Set",
      subject: "Verbal Reasoning",
      type: "Challenge Paper",
      difficulty: "Hard",
      duration: 50,
      questionCount: 60,
      year: "2026",
      isPremium: true,
      downloadCount: 720,
      pdfUrl: "",
    },
    {
      id: "4",
      title: "Non-Verbal Patterns Advanced",
      subject: "Non-Verbal Reasoning",
      type: "Advanced Paper",
      difficulty: "Expert",
      duration: 55,
      questionCount: 45,
      year: "2025",
      isPremium: true,
      downloadCount: 560,
      pdfUrl: "",
    },
    {
      id: "5",
      title: "Mixed 11+ Practice Exam",
      subject: "Mixed",
      type: "Full Exam",
      difficulty: "Hard",
      duration: 90,
      questionCount: 100,
      year: "2026",
      isPremium: true,
      downloadCount: 1580,
      pdfUrl: "",
    },
    {
      id: "6",
      title: "Grammar School Entry Test",
      subject: "Mixed",
      type: "Entrance Exam",
      difficulty: "Hard",
      duration: 75,
      questionCount: 80,
      year: "2026",
      isPremium: false,
      downloadCount: 2100,
      pdfUrl: "",
    },
    {
      id: "7",
      title: "Mathematics Problem Solving",
      subject: "Mathematics",
      type: "Practice Paper",
      difficulty: "Medium",
      duration: 40,
      questionCount: 35,
      year: "2025",
      isPremium: false,
      completed: true,
      score: 85,
      downloadCount: 890,
      pdfUrl: "",
    },
    {
      id: "8",
      title: "Creative Writing Assessment",
      subject: "English",
      type: "Assessment",
      difficulty: "Medium",
      duration: 45,
      questionCount: 3,
      year: "2026",
      isPremium: true,
      downloadCount: 420,
      pdfUrl: "",
    },
  ];

  useEffect(() => {
    api
      .get("/papers")
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : res.data?.papers || [];
        const mapped = raw.map(
          (p: {
            id: string;
            title: string;
            subject?: string | { name?: string };
            type?: string;
            duration?: number;
            difficulty?: string;
            questionCount?: number;
            year?: string | number;
            score?: number;
            downloadCount?: number;
            completed?: boolean;
            pdfUrl?: string;
          }) => ({
            id: p.id,
            title: p.title,
            subject:
              typeof p.subject === "string"
                ? p.subject
                : p.subject?.name || "Mixed",
            type: p.type || "Practice Paper",
            duration: p.duration || 60,
            difficulty: p.difficulty || "Medium",
            questionCount: p.questionCount || 50,
            isPremium: true,
            year: p.year ? String(p.year) : "2026",
            score: p.score,
            completed: Boolean(p.completed),
            downloadCount: p.downloadCount,
            pdfUrl: p.pdfUrl || "",
          }),
        );
        setPapers(mapped.length ? mapped : getMockData());
        setLoading(false);
      })
      .catch(() => {
        setPapers(getMockData());
        setLoading(false);
      });
  }, []);

  const openPaper = (paper: Paper) => {
    if (paper.isPremium && !isPremium) {
      navigate("/papers-on-demand");
      return;
    }

    if (paper.pdfUrl) {
      setViewingPdf(paper.pdfUrl);
      setSelectedTitle(paper.title);
      return;
    }

    navigate("/papers-on-demand");
  };

  const subjects = ["all", ...new Set(papers.map((p) => p.subject))];

  const filteredPapers = papers.filter((p) => {
    const matchesStatus =
      filter === "all" ||
      (filter === "completed" && p.completed) ||
      (filter === "not-started" && !p.completed);
    const matchesSubject =
      subjectFilter === "all" || p.subject === subjectFilter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSubject && matchesSearch;
  });

  const completedCount = papers.filter((p) => p.completed).length;
  const avgScore =
    papers.filter((p) => p.score).reduce((acc, p) => acc + (p.score || 0), 0) /
    (papers.filter((p) => p.score).length || 1);
  const premiumCount = papers.filter((p) => p.isPremium).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/10 text-emerald-500";
      case "Medium":
        return "bg-amber-500/10 text-amber-500";
      case "Hard":
        return "bg-red-500/10 text-red-500";
      case "Expert":
        return "bg-purple-500/10 text-purple-500";
      default:
        return "bg-white/5 text-white/40";
    }
  };

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
          <PDFViewer
            url={viewingPdf}
            title={selectedTitle}
            onClose={() => {
              setViewingPdf(null);
              setSelectedTitle("");
            }}
          />,
          document.body,
        )}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          <ShieldCheck size={12} className="text-white/60" />
          <span>Premium Collection</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
          Premium <span className="text-white/40">Papers.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed">
          Access our exclusive collection of exam papers and practice materials.
        </p>
      </motion.header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Papers", value: papers.length, icon: FileText },
          { label: "Completed", value: completedCount, icon: CheckCircle2 },
          {
            label: "Avg. Score",
            value: `${Math.round(avgScore)}%`,
            icon: Star,
          },
          {
            label: "Premium",
            value: premiumCount,
            icon: Crown,
            highlight: true,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card
              className={cn(
                "border-white/5 rounded-[1.5rem] md:rounded-[2rem]",
                stat.highlight
                  ? "bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-amber-500/20"
                  : "bg-white/[0.01]",
              )}
            >
              <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                <div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0",
                    stat.highlight
                      ? "bg-amber-500 text-black"
                      : "bg-white/5 text-white/60",
                  )}
                >
                  <stat.icon size={18} className="md:w-5 md:h-5" />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black tracking-tighter text-white">
                    {stat.value}
                  </div>
                  <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Premium CTA (show if not premium) */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-black/20 flex items-center justify-center shrink-0">
                  <Crown size={32} className="md:w-9 md:h-9 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-black mb-1">
                    Upgrade to Premium
                  </h3>
                  <p className="text-black/70 font-medium text-sm md:text-base">
                    Unlock all premium papers and exclusive content
                  </p>
                </div>
              </div>
              <Button className="w-full md:w-auto h-12 md:h-14 px-8 rounded-xl bg-black text-white font-bold uppercase tracking-wider hover:scale-[1.02] transition-transform">
                Upgrade Now <ChevronRight size={16} className="ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {(["all", "completed", "not-started"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                filter === f
                  ? "bg-white text-black"
                  : "bg-white/[0.02] text-white/40 border border-white/5 hover:text-white",
              )}
            >
              {f.replace("-", " ")}
            </button>
          ))}
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            aria-label="Filter by subject"
            className="px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white text-sm font-medium outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer"
          >
            {subjects.map((s) => (
              <option key={s} value={s} className="bg-black text-white">
                {s === "all" ? "All Subjects" : s}
              </option>
            ))}
          </select>
          <div className="relative flex-grow lg:w-72">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
              size={18}
            />
            <input
              type="text"
              placeholder="Search papers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 text-sm font-medium outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid gap-4">
        {filteredPapers.map((paper, i) => (
          <motion.div
            key={paper.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}
          >
            <Card className="border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded-[2rem] transition-all duration-300 group">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                    <div
                      className={cn(
                        "w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative",
                        paper.completed
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-white/5 text-white/40",
                      )}
                    >
                      {paper.completed ? (
                        <CheckCircle2 size={24} className="md:w-7 md:h-7" />
                      ) : (
                        <FileText size={24} className="md:w-7 md:h-7" />
                      )}
                      {paper.isPremium && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-amber-500 flex items-center justify-center">
                          <Crown size={8} className="md:w-2.5 text-black" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest",
                            getDifficultyColor(paper.difficulty),
                          )}
                        >
                          {paper.difficulty}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-white/5 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40">
                          {paper.subject}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-white/5 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40">
                          {paper.type}
                        </span>
                        {paper.year && (
                          <span className="text-[8px] md:text-[9px] font-bold text-white/30">
                            {paper.year}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-white/90 transition-colors leading-tight">
                        {paper.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/30">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {paper.duration} min
                        </span>
                        <span>{paper.questionCount} Questions</span>
                        {paper.downloadCount && (
                          <span className="flex items-center gap-1">
                            <Download size={12} />{" "}
                            {paper.downloadCount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                    {paper.score && (
                      <div className="text-left md:text-right">
                        <div className="text-xl md:text-2xl font-black text-emerald-500">
                          {paper.score}%
                        </div>
                        <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40">
                          Score
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (paper.pdfUrl) {
                            window.open(
                              paper.pdfUrl,
                              "_blank",
                              "noopener,noreferrer",
                            );
                            return;
                          }
                          navigate("/papers-on-demand");
                        }}
                        className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
                      >
                        <Download size={16} className="md:w-[18px]" />
                      </Button>
                      <Button
                        onClick={() => openPaper(paper)}
                        className={cn(
                          "h-10 md:h-12 px-5 md:px-6 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider transition-all min-w-[90px] md:min-w-[100px]",
                          paper.isPremium && !isPremium
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : paper.completed
                              ? "bg-white/5 text-white hover:bg-white/10"
                              : "bg-white text-black hover:scale-[1.02]",
                        )}
                      >
                        {paper.isPremium && !isPremium ? (
                          <>
                            <Lock size={12} className="mr-1 md:w-3.5" /> Premium
                          </>
                        ) : paper.completed ? (
                          "Review"
                        ) : (
                          "Start"
                        )}
                        <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Filter size={32} className="text-white/20" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No papers found</h3>
          <p className="text-white/40">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
