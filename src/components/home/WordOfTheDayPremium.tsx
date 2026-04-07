import { motion } from "framer-motion";

export default function WordOfTheDayPremium() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 overflow-hidden">
          {/* Decorative background text */}
          <div className="absolute top-0 right-0 text-[15rem] font-bold text-white/[0.02] leading-none select-none pointer-events-none translate-x-1/4 -translate-y-1/4">
            Words
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <div className="flex-1 text-center md:text-left">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-accent font-semibold tracking-widest uppercase text-sm mb-6"
              >
                Word of the Day
              </motion.span>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-serif italic tracking-tight text-white mb-4"
              >
                Mellifluous
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-text-secondary font-mono text-lg mb-8"
              >
                /adjective/
              </motion.div>
            </div>

            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm shadow-2xl"
              >
                <div className="text-white/40 text-xs uppercase tracking-widest mb-4 font-bold">Definition</div>
                <p className="text-2xl md:text-3xl text-white font-medium leading-tight mb-6">
                  (of a voice or words) sweet or musical; pleasant to hear.
                </p>
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-sm text-text-secondary italic">"the mellifluous voice of the cello"</span>
                  <button className="text-accent hover:text-white transition-colors">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
