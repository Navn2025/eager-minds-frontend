import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface WordOfDayProps {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
}

export default function WordOfDay({
  word,
  pronunciation,
  partOfSpeech,
  definition,
  examples,
}: WordOfDayProps) {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 max-w-[1200px] mx-auto">
      <div className="relative p-6 sm:p-8 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 overflow-hidden group">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full" />

        {/* Floating Background Text */}
        <div className="hidden sm:block absolute top-8 right-6 md:top-10 md:right-10 text-[7rem] md:text-[10rem] lg:text-[12rem] font-black text-white/[0.02] leading-none select-none pointer-events-none group-hover:text-accent/[0.02] transition-colors duration-700">
          Word
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
          <div className="flex-1 w-full text-left md:text-left">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-accent font-bold tracking-widest uppercase text-[11px] mb-6 md:mb-8 bg-accent/10 px-4 py-2 rounded-full"
            >
              Word of the Day
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(3.1rem,17vw,6.5rem)] md:text-[clamp(5rem,10vw,8rem)] font-serif italic tracking-tight leading-[0.95] text-white mb-4 md:mb-6 break-words [overflow-wrap:anywhere]"
            >
              {word}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-start gap-y-2 sm:gap-x-6 text-text-secondary font-mono text-lg sm:text-xl max-w-full"
            >
              <span className="text-accent/50">[{partOfSpeech}]</span>
              <span className="leading-snug break-words [overflow-wrap:anywhere]">
                {pronunciation}
              </span>
            </motion.div>
          </div>

          <div className="flex-1 w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 sm:p-8 md:p-10 rounded-[1.75rem] md:rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden"
            >
              <div className="text-accent/40 text-[10px] uppercase tracking-[0.3em] mb-4 sm:mb-6 font-black">
                Definition
              </div>
              <p className="text-[1.95rem] sm:text-3xl md:text-4xl text-white font-medium leading-[1.15] mb-8 sm:mb-10 break-words [overflow-wrap:anywhere]">
                {definition}
              </p>

              {examples.length > 0 && (
                <div className="pt-6 sm:pt-8 border-t border-white/5 space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4 text-text-secondary italic text-base sm:text-lg leading-relaxed">
                    <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-accent/30 shrink-0" />
                    <p className="break-words [overflow-wrap:anywhere]">
                      "{examples[0]}"
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
