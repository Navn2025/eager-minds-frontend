import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function PremiumHero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-violet-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase text-accent border border-accent/20 rounded-full bg-accent/5 backdrop-blur-sm">
            Elite Academic Excellence
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-gradient"
        >
          Training the Next Generation of <br className="hidden md:block" />
          <span className="text-white">Brilliant Thinkers</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Elite preparation for mathematics, reasoning, and academic competitions. 
          Developing high-level thinkers for the next generation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <span className="relative z-10 flex items-center gap-2">
              Start Learning <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button className="group px-8 py-4 bg-white/5 text-white font-semibold rounded-full border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 flex items-center gap-2">
            <Play className="w-4 h-4 fill-white" />
            Explore Resources
          </button>
        </motion.div>
      </div>

      {/* Floating UI Element (Subtle) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
        className="mt-20 w-full max-w-6xl mx-auto px-4"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-violet-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative aspect-[16/9] md:aspect-[21/9] bg-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Mock UI Content */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-background">
               <div className="flex flex-col items-center gap-4 opacity-40">
                  <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
                  <div className="w-48 h-4 rounded-full bg-white/10 animate-pulse" />
                  <div className="w-32 h-4 rounded-full bg-white/10 animate-pulse" />
               </div>
            </div>
            {/* Glass light sweep */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
