import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Download,
  Eye,
  Calendar,
  Bookmark,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import api from "../../services/api";
import PDFViewer from "../../components/ui/PDFViewer";
import { cn } from "../../lib/utils";

interface Magazine {
  id: string;
  title: string;
  edition: string;
  coverImage: string;
  publishedAt: string;
  category: string;
  pageCount: number;
  pdfUrl?: string;
  isNew?: boolean;
  isSaved?: boolean;
}

export default function DashboardMagazines() {
  const navigate = useNavigate();
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  const getMockData = (): Magazine[] => [
    {
      id: "1",
      title: "Young Explorers Quarterly",
      edition: "Spring 2026",
      coverImage: "/placeholder.jpg",
      publishedAt: "2026-03-01",
      category: "Educational",
      pageCount: 48,
      pdfUrl: "",
      isNew: true,
    },
    {
      id: "2",
      title: "Science Adventures",
      edition: "March 2026",
      coverImage: "/placeholder.jpg",
      publishedAt: "2026-03-01",
      category: "Science",
      pageCount: 36,
      pdfUrl: "",
      isNew: true,
    },
    {
      id: "3",
      title: "Math Champions",
      edition: "Issue 24",
      coverImage: "/placeholder.jpg",
      publishedAt: "2026-02-15",
      category: "Mathematics",
      pageCount: 32,
      pdfUrl: "",
      isSaved: true,
    },
    {
      id: "4",
      title: "Creative Writing Journal",
      edition: "Winter Edition",
      coverImage: "/placeholder.jpg",
      publishedAt: "2026-01-20",
      category: "English",
      pageCount: 44,
      pdfUrl: "",
    },
    {
      id: "5",
      title: "History & Geography Explorer",
      edition: "Ancient Worlds",
      coverImage: "/placeholder.jpg",
      publishedAt: "2026-02-01",
      category: "History",
      pageCount: 52,
      pdfUrl: "",
      isSaved: true,
    },
    {
      id: "6",
      title: "Puzzle Masters",
      edition: "Brain Teasers Vol. 5",
      coverImage: "/placeholder.jpg",
      publishedAt: "2026-02-28",
      category: "Puzzles",
      pageCount: 28,
      pdfUrl: "",
    },
  ];

  useEffect(() => {
    api
      .get("/magazines")
      .then((res) => {
        const raw = Array.isArray(res.data)
          ? res.data
          : res.data?.magazines || [];
        const mapped = raw.map(
          (m: {
            id: string;
            title: string;
            pdfUrl?: string;
            coverUrl?: string;
            month?: number;
            year?: number;
            publishedAt?: string;
            edition?: string;
          }) => ({
            id: m.id,
            title: m.title,
            edition:
              m.edition ||
              (m.month && m.year
                ? `${new Date(m.year, m.month - 1, 1).toLocaleString("en-GB", {
                    month: "long",
                  })} ${m.year}`
                : "Latest Edition"),
            coverImage: m.coverUrl || "/placeholder-magazine.jpg",
            publishedAt:
              m.publishedAt ||
              (m.month && m.year
                ? new Date(m.year, m.month - 1, 1).toISOString()
                : new Date().toISOString()),
            category: "Educational",
            pageCount: 42,
            pdfUrl: m.pdfUrl || "",
            isNew: true,
          }),
        );
        setMagazines(mapped.length ? mapped : getMockData());
        setLoading(false);
      })
      .catch(() => {
        setMagazines(getMockData());
        setLoading(false);
      });
  }, []);

  const openMagazine = (magazine: Magazine) => {
    if (magazine.pdfUrl) {
      setViewingPdf(magazine.pdfUrl);
      setSelectedTitle(magazine.title);
      return;
    }

    navigate("/magazines");
  };

  const categories = ["all", ...new Set(magazines.map((m) => m.category))];

  const filteredMagazines = magazines.filter((m) => {
    const matchesCategory = category === "all" || m.category === category;
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
          <BookOpen size={12} className="text-white/60" />
          <span>Digital Library</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
          Magazines <span className="text-white/40">Collection.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed">
          Explore our curated collection of educational magazines and
          publications.
        </p>
      </motion.header>

      {/* Featured Magazine */}
      {magazines[0] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/5 rounded-[3rem] overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 aspect-[3/4] lg:aspect-auto bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <div className="w-48 h-64 bg-white/10 rounded-2xl flex items-center justify-center">
                    <BookOpen size={48} className="text-white/20" />
                  </div>
                </div>
                <div className="lg:w-2/3 p-10 lg:p-14 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                      <Sparkles size={10} className="inline mr-1" /> Featured
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest">
                      {magazines[0].category}
                    </span>
                  </div>
                  <h2 className="text-4xl font-black text-white mb-3">
                    {magazines[0].title}
                  </h2>
                  <p className="text-white/40 text-lg mb-2">
                    {magazines[0].edition}
                  </p>
                  <div className="flex items-center gap-4 text-white/40 text-sm mb-8">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />{" "}
                      {formatDate(magazines[0].publishedAt)}
                    </span>
                    <span>{magazines[0].pageCount} pages</span>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => openMagazine(magazines[0])}
                      className="h-14 px-8 rounded-xl bg-white text-black font-bold uppercase tracking-wider hover:scale-[1.02] transition-transform"
                    >
                      <Eye size={18} className="mr-2" /> Read Now
                    </Button>
                    <Button
                      onClick={() => {
                        if (magazines[0].pdfUrl) {
                          window.open(
                            magazines[0].pdfUrl,
                            "_blank",
                            "noopener,noreferrer",
                          );
                          return;
                        }
                        navigate("/magazines");
                      }}
                      className="h-14 px-6 rounded-xl bg-white/5 text-white border border-white/10 font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                      <Download size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                category === cat
                  ? "bg-white text-black"
                  : "bg-white/[0.02] text-white/40 border border-white/5 hover:text-white",
              )}
            >
              {cat}
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
            placeholder="Search magazines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-white placeholder:text-white/20 text-sm font-medium outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      {/* Magazines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMagazines.slice(1).map((magazine, i) => (
          <motion.div
            key={magazine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded-[2rem] overflow-hidden transition-all duration-300 group h-full">
              <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 relative flex items-center justify-center">
                <div className="w-24 h-32 bg-white/10 rounded-xl flex items-center justify-center">
                  <BookOpen size={32} className="text-white/20" />
                </div>
                {magazine.isNew && (
                  <span className="absolute top-4 left-4 px-2 py-1 rounded-lg bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest">
                    New
                  </span>
                )}
                {magazine.isSaved && (
                  <span className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Bookmark size={14} className="text-white fill-white" />
                  </span>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">
                    {magazine.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-white/90 transition-colors line-clamp-1">
                  {magazine.title}
                </h3>
                <p className="text-sm text-white/40 mb-4">{magazine.edition}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                    {magazine.pageCount} pages
                  </span>
                  <Button
                    onClick={() => openMagazine(magazine)}
                    className="h-10 px-4 rounded-xl bg-white/5 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
                  >
                    View <ChevronRight size={14} className="ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredMagazines.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <BookOpen size={32} className="text-white/20" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No magazines found
          </h3>
          <p className="text-white/40">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
