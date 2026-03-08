import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, Sparkles } from "lucide-react";
import api from "../../services/api";

interface WordData {
  word: string;
  meaning: string;
  pronunciation: string;
  synonym: string;
  antonym: string;
  exampleSentence: string;
}

export default function WordOfTheDay() {
  const [wordData, setWordData] = useState<WordData | null>(null);

  useEffect(() => {
    api
      .get("/prep/word-of-the-day")
      .then((res) => setWordData(res.data))
      .catch(() => setWordData(null));
  }, []);

  if (!wordData) return null;

  const synonyms = wordData.synonym
    ? wordData.synonym
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative group">
            {/* Glowing Ring Outer */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-transparent rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

            <div className="glass-card relative overflow-hidden rounded-[4rem] p-8 md:p-16 text-center">
              {/* Card Spotlight */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-[9px] font-bold uppercase tracking-[0.3em] text-accent mb-12 accent-glow">
                <Sparkles size={12} className="animate-pulse" />
                <span>Word of the Day</span>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic">
                  {wordData.word}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:bg-accent hover:text-white group"
                >
                  <Volume2
                    size={28}
                    strokeWidth={1.5}
                    className="group-hover:scale-110 transition-transform"
                  />
                </motion.button>
              </div>

              <div className="inline-block px-8 py-3 glass rounded-2xl border border-white/10 mb-16">
                <p className="text-xl text-text-secondary font-bold uppercase tracking-[0.4em]">
                  {wordData.pronunciation}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 w-full">
                <div className="glass bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 group/item hover:bg-accent/5 hover:border-accent/20 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 bg-accent rounded-full accent-glow" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">
                      Meaning
                    </h4>
                  </div>
                  <p className="text-xl text-text-secondary leading-relaxed font-medium group-hover/item:text-white transition-colors">
                    {wordData.meaning}
                  </p>
                </div>

                <div className="glass bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 group/item hover:bg-accent/5 hover:border-accent/20 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 bg-accent rounded-full accent-glow" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">
                      Usage
                    </h4>
                  </div>
                  <p className="text-xl text-text-secondary leading-relaxed font-medium group-hover/item:text-white transition-colors italic">
                    "{wordData.exampleSentence}"
                  </p>
                </div>
              </div>

              {synonyms.length > 0 && (
                <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40 mr-2">
                    Synonyms
                  </span>
                  {synonyms.slice(0, 3).map((syn) => (
                    <span
                      key={syn}
                      className="px-6 py-2.5 rounded-xl glass border border-white/5 text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:border-accent/40 hover:text-white transition-all cursor-default"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
