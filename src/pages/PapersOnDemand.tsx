import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PDFViewer from "../components/ui/PDFViewer";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { 
  ShieldAlert, 
  FileText, 
  Check, 
  Lock, 
  ChevronDown,
  Compass,
  Sparkles,
  Archive,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

interface Paper {
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  fileUrl: string;
}

export default function PapersOnDemand() {
  const { user } = useAuth();
  const isPremium = user?.role === "premium" || user?.role === "admin";
  const [papers, setPapers] = useState<Paper[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [filter, setFilter] = useState({ subject: "", difficulty: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPremium) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.subject) params.set("subject", filter.subject);
    if (filter.difficulty) params.set("difficulty", filter.difficulty);
    api
      .get(`/papers?${params}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data.papers || []);
        setPapers(data);
        setLoading(false);
      })
      .catch(() => {
        setPapers([]);
        setLoading(false);
      });
  }, [isPremium, filter]);

  useEffect(() => {
    if (!isPremium) return;
    api
      .get("/prep/dashboard")
      .then((res) => {
        setCompleted(
          res.data.completions
            ?.filter((c: { itemType: string }) => c.itemType === "paper")
            .map((c: { itemId: string }) => c.itemId) || [],
        );
      })
      .catch(() => {});
  }, [isPremium]);

  const markDone = async (paperId: string) => {
    await api.post("/prep/complete", { itemId: paperId, itemType: "paper" });
    setCompleted((prev) => [...prev, paperId]);
  };

  const subjects = [...new Set(papers.map((p) => p.subject))];
  const difficulties = [...new Set(papers.map((p) => p.difficulty))];

  if (!user) {
    return (
      <div className="page-container min-h-[80vh] flex flex-col items-center justify-center pt-40 md:pt-52">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mb-10 relative"
        >
          <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse" />
          <Lock size={48} className="text-white/20 relative z-10" />
        </motion.div>
        <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Access Restricted</h1>
        <p className="text-white/40 text-lg font-medium mb-12 max-w-md text-center leading-relaxed">
          The Academic Vault is encrypted. Please authenticate to access our exclusive practice parameters.
        </p>
        <Link to="/login">
          <Button className="h-16 px-10 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[0_6px_30px_rgba(168,85,247,0.35)] border-none">
            Log In to Vault
          </Button>
        </Link>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="page-container min-h-[80vh] flex flex-col items-center justify-center pt-40 md:pt-52">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-40 h-40 bg-white/[0.02] border border-white/5 rounded-[3rem] flex items-center justify-center mb-10 relative overflow-hidden group"
        >
           <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <ShieldAlert size={64} className="text-white/20 group-hover:scale-110 transition-transform" />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 text-center">Elite Protocol <span className="text-gradient">Required.</span></h1>
        <p className="text-white/40 text-lg font-medium mb-16 max-w-xl text-center leading-relaxed">
          The 11+ Papers on Demand library is exclusive to our Upgraded Members. 
          Access over 500+ past paper nodes and detailed marking methodology.
        </p>
        <Button className="h-18 px-12 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-violet-600 text-white font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-[0_6px_30px_rgba(168,85,247,0.35)] border-none">
          Upgrade to Premium
        </Button>
      </div>
    );
  }

  return (
    <div className="page-container pb-40 pt-40 md:pt-52">
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24 space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-400/20 bg-purple-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-purple-300/70">
          <Compass size={12} className="text-purple-400" />
          <span>Academic Vault</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white">
          Papers <span className="text-gradient">on Demand.</span>
        </h1>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pt-8">
          <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed">
            Central repository for past examinations and technical practice modules. Engineered for definitive performance scaling.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="relative group">
              <select
                value={filter.subject}
                onChange={(e) => setFilter((f) => ({ ...f, subject: e.target.value }))}
                className="pl-8 pr-12 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white appearance-none focus:bg-white focus:text-black transition-all text-[10px] font-black uppercase tracking-widest min-w-[180px]"
              >
                <option value="" className="bg-black text-white">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s} value={s} className="bg-black text-white">{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="relative group">
              <select
                value={filter.difficulty}
                onChange={(e) => setFilter((f) => ({ ...f, difficulty: e.target.value }))}
                className="pl-8 pr-12 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white appearance-none focus:bg-white focus:text-black transition-all text-[10px] font-black uppercase tracking-widest min-w-[180px]"
              >
                <option value="" className="bg-black text-white">Difficulties</option>
                {difficulties.map((d) => (
                  <option key={d} value={d} className="bg-black text-white">{d}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
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
                url={viewingPdf} 
                onClose={() => setViewingPdf(null)} 
                className="w-full h-full shadow-[0_0_100px_rgba(255,255,255,0.1)] rounded-[3rem] overflow-hidden border border-white/10"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 rounded-[3rem] bg-white/[0.01] border border-white/5 animate-pulse" />
          ))
        ) : papers.map((paper, i) => {
          const isDone = completed.includes(paper.id);
          return (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={cn(
                  "group relative h-full flex flex-col overflow-hidden transition-all duration-700 rounded-[3rem] p-4",
                  isDone 
                    ? "bg-white/[0.03] border-white/20" 
                    : "bg-white/[0.01] border-white/5 hover:bg-white/[0.02] hover:border-white/10"
                )}
              >
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-10">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700",
                      isDone ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" : "bg-white/5 text-white/20 group-hover:bg-purple-500/20 group-hover:text-purple-300"
                    )}>
                      {isDone ? <Check size={24} strokeWidth={3} /> : <FileText size={24} />}
                    </div>
                    {isDone && (
                      <Badge className="bg-white text-black text-[8px] font-black uppercase tracking-widest px-3 py-1.5 opacity-60">
                        ARCHIVED
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-white tracking-tighter leading-tight mb-8 min-h-[4rem]">
                    {paper.title}
                  </h3>

                  <div className="flex gap-2 mb-10">
                    <div className="px-3 py-1 rounded-full border border-purple-400/20 bg-purple-500/5 text-[8px] font-black uppercase tracking-widest text-purple-300/60">
                      {paper.subject}
                    </div>
                    <div className="px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[8px] font-black uppercase tracking-widest text-white/30">
                      {paper.difficulty}
                    </div>
                  </div>

                  <div className="mt-auto space-y-3">
                    <Button 
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-[0_4px_16px_rgba(168,85,247,0.25)] border-none"
                      onClick={() => setViewingPdf(paper.fileUrl)}
                    >
                      Execute Review
                    </Button>
                    {!isDone && (
                      <button 
                        onClick={() => markDone(paper.id)}
                        className="w-full h-14 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all"
                      >
                         Finalize Action
                         <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {!loading && papers.length === 0 && (
        <div className="flex flex-col items-center justify-center p-32 border border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]">
          <div className="relative mb-8">
             <Archive size={64} className="text-white/5" />
             <Sparkles className="absolute -top-2 -right-2 text-white/20" size={24} />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight mb-2">Vault Empty</h1>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">No paper nodes identified for current query.</p>
        </div>
      )}
    </div>
  );
}
