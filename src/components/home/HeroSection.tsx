import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroHeadline from "./HeroHeadline";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-10 accent-glow"
        >
          <Sparkles size={12} className="animate-pulse" />
          <span>The Future of Learning</span>
        </motion.div>
        
        {/* Headline */}
        <HeroHeadline 
          text="Where Curious Minds Become Brilliant Thinkers." 
          className="max-w-5xl mb-8"
        />
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-lg md:text-xl text-text-secondary mb-12 leading-relaxed max-w-2xl font-medium uppercase tracking-widest"
        >
          Explore worksheets, competitions, and creative learning designed for the next generation of problem solvers.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <Button size="lg" className="h-14 px-10 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.2)] group relative overflow-hidden">
            <span className="relative z-10">Start Learning</span>
            <div className="absolute inset-0 bg-accent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <ArrowRight size={20} className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="ghost" size="lg" className="h-14 px-10 rounded-2xl border border-white/10 text-white/60 font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all group glass">
            Explore Resources
          </Button>
        </motion.div>

        {/* Stats / Social Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-20 flex flex-col items-center gap-6"
        >
          <div className="flex -space-x-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-surface overflow-hidden glass accent-glow">
                <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
              </div>
            ))}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-secondary/60">
            Join <span className="text-white">5,000+</span> elite young minds
          </div>
        </motion.div>
      </div>

      {/* Decorative Ornaments with Interaction Nodes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-accent/5 rounded-full" 
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, delay: i }}
                className="absolute w-2 h-2 bg-accent rounded-full border border-white/20 accent-glow shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 90}deg) translate(450px) rotate(-${i * 90}deg)`
                }}
              />
            ))}
          </motion.div>

          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-accent/10 rounded-full" 
          >
             {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: i }}
                className="absolute w-1.5 h-1.5 bg-white rounded-full border border-accent/40 shadow-[0_0_10px_white]"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 120}deg) translate(325px) rotate(-${i * 120}deg)`
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
