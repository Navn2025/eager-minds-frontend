import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";
import api from "../../services/api";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api
      .get("/testimonials")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.testimonials || [];
        setTestimonials(data);
      })
      .catch(() => setTestimonials([]));
  }, []);

  const next = useCallback(() => {
    if (testimonials.length > 0) {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }
  }, [testimonials.length]);

  const prev = useCallback(() => {
    if (testimonials.length > 0) {
      setCurrent(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length,
      );
    }
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length, next]);

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[current];

  return (
    <section className="py-32 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-start text-left mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-accent mb-6 px-4 py-1.5 border border-accent/20 bg-accent/5 rounded-full accent-glow"
          >
            <Sparkles size={10} />
            <span>Success Stories</span>
          </motion.div>
          <h2 className="section-title">
            Trusted by <span className="text-gradient">Elite Parents.</span>
          </h2>
          <p className="text-text-secondary text-lg font-medium leading-relaxed max-w-2xl uppercase tracking-wider">
            Discover how our methodology has helped hundreds of bright young
            learners achieve their full academic and creative potential.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative px-6 md:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.1, x: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="glass-card rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden"
            >
              <Quote
                size={120}
                className="absolute top-10 left-10 text-accent opacity-5 -z-10"
              />

              <div className="flex justify-center gap-1.5 mb-10">
                {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-accent text-accent accent-glow"
                  />
                ))}
              </div>

              <p className="text-2xl md:text-3xl font-black tracking-tight text-white leading-relaxed mb-12 italic uppercase">
                "{currentTestimonial.content}"
              </p>

              <div className="flex flex-col items-center">
                <h4 className="text-xl font-black uppercase tracking-[0.2em] text-white mb-2">
                  {currentTestimonial.name}
                </h4>
                <p className="text-accent text-[9px] font-bold uppercase tracking-[0.3em]">
                  {currentTestimonial.role || "Parent"}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-8 group">
            <button
              onClick={prev}
              className="w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-accent/40 hover:bg-accent/10 transition-all shadow-2xl group-hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-8 group">
            <button
              onClick={next}
              className="w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-accent/40 hover:bg-accent/10 transition-all shadow-2xl group-hover:scale-110 active:scale-95"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  current === i
                    ? "w-10 bg-accent accent-glow"
                    : "w-2 bg-white/10 hover:bg-white/20",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
