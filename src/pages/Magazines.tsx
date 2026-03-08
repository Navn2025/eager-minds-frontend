import { useEffect, useState } from "react";
import api from "../services/api";
import PDFViewer from "../components/ui/PDFViewer";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { BookOpen, Calendar, ArrowRight, Sparkles, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Magazine {
  id: string;
  title: string;
  coverImage: string | null;
  fileUrl: string;
  month: number;
  year: number;
}

export default function Magazines() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/magazines")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.magazines || [];
        setMagazines(data);
        setLoading(false);
      })
      .catch(() => {
        setMagazines([]);
        setLoading(false);
      });
  }, []);

  const grouped = (Array.isArray(magazines) ? magazines : []).reduce<
    Record<number, Magazine[]>
  >((acc, m) => {
    (acc[m.year] ||= []).push(m);
    return acc;
  }, {});

  const monthName = (m: number) =>
    new Date(2000, m - 1).toLocaleString("default", { month: "long" });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container pb-32 pt-40 md:pt-52">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col mt-10 md:flex-row md:items-center justify-between gap-10 mb-20"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            <Sparkles size={12} className="text-white/60" />
            <span>Monthly Publication</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            Learning <span className="text-white/40">Vault.</span>
          </h1>
          <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed">
            Exclusive editorial content for the curious mind. Delve into our
            curated collection of academic deep-dives and puzzles.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="h-16 px-8 rounded-2xl border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all"
          >
            <Filter size={18} className="mr-2" /> Filter Archive
          </Button>
        </div>
      </motion.header>

      <AnimatePresence>
        {viewingPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-3xl"
          >
            <PDFViewer
              url={viewingPdf}
              title={selectedTitle || "Secure Magazine Viewer"}
              onClose={() => {
                setViewingPdf(null);
                setSelectedTitle(null);
              }}
              className="w-full max-w-7xl h-full shadow-[0_0_100px_rgba(255,255,255,0.05)] rounded-[3rem] border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-32">
        {Object.keys(grouped)
          .sort((a, b) => Number(b) - Number(a))
          .map((year, sectionIdx) => (
            <section key={year} className="relative">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                    Yearly Archive
                  </span>
                  <h2 className="text-6xl font-black text-white tracking-tighter leading-none">
                    {year}
                  </h2>
                </div>
                <div className="hidden md:block flex-1 h-px bg-white/5 mx-10 mb-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 whitespace-nowrap">
                  {grouped[Number(year)].length} Issues Published
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {grouped[Number(year)]
                  .sort((a, b) => b.month - a.month)
                  .map((mag, i) => (
                    <motion.div
                      key={mag.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sectionIdx * 0.1 + i * 0.05 }}
                    >
                      <Card
                        className="group relative overflow-hidden bg-white/[0.01] border-white/5 hover:bg-white/[0.02] transition-all duration-700 rounded-[2.5rem] h-full flex flex-col cursor-pointer"
                        onClick={() => {
                          setViewingPdf(mag.fileUrl);
                          setSelectedTitle(mag.title);
                        }}
                      >
                        <div className="relative aspect-[4/5] overflow-hidden p-4">
                          <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden shadow-2xl">
                            {mag.coverImage ? (
                              <img
                                src={mag.coverImage}
                                alt={mag.title}
                                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                              />
                            ) : (
                              <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                                <BookOpen size={48} className="text-white/5" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-20 transition-all duration-700" />
                          </div>

                          <div className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500 shadow-2xl z-20">
                            <ArrowRight size={20} />
                          </div>
                        </div>

                        <CardContent className="p-8 pt-2 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 group-hover:text-white/40 transition-colors">
                            <Calendar size={12} strokeWidth={3} />
                            {monthName(mag.month)}
                          </div>
                          <h3 className="font-black text-white text-2xl tracking-tight leading-tight group-hover:translate-x-1 transition-transform">
                            {mag.title}
                          </h3>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </section>
          ))}
      </div>

      {magazines.length === 0 && (
        <div className="flex flex-col items-center justify-center p-32 border border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-8">
            <BookOpen size={40} />
          </div>
          <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            The Archive is Quiet
          </h4>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            Synching with the latest publications...
          </p>
        </div>
      )}
    </div>
  );
}
