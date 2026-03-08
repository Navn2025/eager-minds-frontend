import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function PremiumTestimonial() {
  return (
    <section className="py-24 px-6 bg-surface/20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="mb-12"
        >
          <Quote className="w-12 h-12 text-accent/20 mx-auto" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white/40 text-sm font-bold uppercase tracking-[0.2em] mb-12"
        >
          Trusted by Elite Parents
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <blockquote className="text-3xl md:text-5xl font-serif italic text-white leading-tight mb-12">
            "The level of academic rigor combined with the focus on creative thinking is something we haven't found anywhere else. Truly transformative for our son's development."
          </blockquote>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-violet-500 p-[1px] mb-4">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" 
                  alt="Parent"
                  className="w-full h-full object-cover grayscale opacity-80"
                />
              </div>
            </div>
            <cite className="not-italic">
              <span className="block text-white font-bold text-lg mb-1">Victoria Sterling</span>
              <span className="block text-text-secondary text-sm uppercase tracking-widest">Global Investment Partner</span>
            </cite>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
