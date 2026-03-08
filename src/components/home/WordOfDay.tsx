import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface WordOfDayProps {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
}

export default function WordOfDay({ word, pronunciation, partOfSpeech, definition, examples }: WordOfDayProps) {
  return (
    <section className="py-24 px-6 max-w-[1200px] mx-auto">
      <div className="relative p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 overflow-hidden group">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full" />
        
        {/* Floating Background Text */}
        <div className="absolute top-10 right-10 text-[12rem] font-black text-white/[0.02] leading-none select-none pointer-events-none group-hover:text-accent/[0.02] transition-colors duration-700">
          Word
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-center md:text-left">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-accent font-bold tracking-widest uppercase text-xs mb-8 bg-accent/10 px-4 py-2 rounded-full"
            >
              Word of the Day
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-7xl md:text-9xl font-serif italic tracking-tight text-white mb-6"
            >
              {word}
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center md:justify-start gap-4 text-text-secondary font-mono text-xl"
            >
              <span className="text-accent/50">[{partOfSpeech}]</span>
              <span>{pronunciation}</span>
            </motion.div>
          </div>

          <div className="flex-1 w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden"
            >
              <div className="text-accent/40 text-[10px] uppercase tracking-[0.3em] mb-6 font-black">Definition</div>
              <p className="text-2xl md:text-3xl text-white font-medium leading-tight mb-10">
                {definition}
              </p>
              
              {examples.length > 0 && (
                <div className="pt-8 border-t border-white/5 space-y-4">
                  <div className="flex items-start gap-4 text-text-secondary italic text-lg">
                    <Quote className="w-6 h-6 text-accent/30 shrink-0" />
                    <p>"{examples[0]}"</p>
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
