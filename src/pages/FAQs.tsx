import { useEffect, useState } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "../lib/utils";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params =
      activeCategory !== "all" ? `?category=${activeCategory}` : "";
    api
      .get(`/faqs${params}`)
      .then((res) => {
        setFaqs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  const categories = [
    "all",
    "membership",
    "pricing",
    "timings",
    "technical",
    "resources",
  ];

  return (
    <div className="page-container pb-40 pt-40 md:pt-52 max-w-5xl mx-auto">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24 mt-10 space-y-6 text-center md:text-left"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          <HelpCircle size={12} className="text-white/60" />
          <span>Support Protocol</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white">
          Common <span className="text-white/40">Questions.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-2xl leading-relaxed">
          Comprehensive intelligence on platform operations, membership
          archetypes, and technical specifications.
        </p>
      </motion.header>

      <div className="flex flex-wrap gap-3 mb-16 justify-center md:justify-start">
        {categories.map((cat, i) => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border",
              activeCategory === cat
                ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                : "bg-white/[0.02] text-white/40 border-white/5 hover:border-white/20 hover:text-white",
            )}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <div className="space-y-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-3xl bg-white/[0.01] border border-white/5 animate-pulse"
              />
            ))
          : faqs.map((faq, i) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "group rounded-[2.5rem] border transition-all duration-700 overflow-hidden",
                    isOpen
                      ? "bg-white/[0.03] border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                      : "bg-white/[0.01] border-white/5 hover:border-white/10",
                  )}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full text-left px-10 py-8 flex justify-between items-center group/btn"
                  >
                    <span
                      className={cn(
                        "text-xl font-black tracking-tighter transition-all duration-500",
                        isOpen
                          ? "text-white"
                          : "text-white/40 group-hover:text-white group-hover:translate-x-1",
                      )}
                    >
                      {faq.question}
                    </span>
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border",
                        isOpen
                          ? "bg-white text-black border-white rotate-180"
                          : "bg-white/[0.02] text-white/20 border-white/5 group-hover:border-white/10 group-hover:text-white",
                      )}
                    >
                      <ChevronDown size={18} strokeWidth={3} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-10 pb-10">
                          <div className="h-px bg-white/5 mb-8" />
                          <div className="relative">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
                              <MessageSquare size={40} />
                            </div>
                            <p className="text-lg text-white/60 font-medium leading-relaxed whitespace-pre-wrap max-w-3xl">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
      </div>

      {!loading && faqs.length === 0 && (
        <div className="flex flex-col items-center justify-center p-32 border border-dashed border-white/5 rounded-[4rem] bg-white/[0.01] text-center">
          <div className="relative mb-8">
            <HelpCircle size={64} className="text-white/5" />
            <Sparkles
              className="absolute -top-2 -right-2 text-white/20"
              size={24}
            />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            Protocol Exhausted
          </h1>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            No FAQ clusters identified for current query.
          </p>
        </div>
      )}
    </div>
  );
}
