import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  rating: number;
  quote: string;
  author: string;
  role: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (!testimonials.length) return null;

  return (
    <section className="py-24 px-6 max-w-[1200px] mx-auto overflow-hidden">
      <div className="relative glass-card p-12 md:p-24 rounded-[3rem] text-center">
        {/* Decorative Quote Icon */}
        <Quote className="absolute top-10 left-10 w-20 h-20 text-white/[0.03] -z-0" />
        
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {/* Rating */}
              <div className="flex justify-center gap-1">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-3xl md:text-5xl font-medium text-white italic leading-tight max-w-4xl mx-auto">
                "{testimonials[currentIndex].quote}"
              </p>

              {/* Author */}
              <div className="pt-8">
                <h4 className="text-xl font-bold text-white">{testimonials[currentIndex].author}</h4>
                <p className="text-text-secondary font-medium">{testimonials[currentIndex].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8 mt-16">
            <button
              onClick={prev}
              className="p-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-8 bg-accent" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
