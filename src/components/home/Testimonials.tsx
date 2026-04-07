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
    <section className="py-20 px-6 max-w-[1200px] mx-auto overflow-hidden">
      <div className="relative glass-card p-10 md:p-20 rounded-[2.5rem] text-center">
        {/* Subtle top band */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent rounded-t-[2.5rem]" />

        {/* Decorative Quote Icon */}
        <Quote className="absolute top-8 left-8 w-16 h-16 text-purple-400/[0.06]" />

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.06 }}
              transition={{ duration: 0.45 }}
              className="space-y-8"
            >
              {/* Gold star rating */}
              <div className="flex justify-center gap-1">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-2xl md:text-4xl font-medium text-white/90 italic leading-tight max-w-4xl mx-auto">
                "{testimonials[currentIndex].quote}"
              </p>

              {/* Author */}
              <div className="pt-6">
                <h4 className="text-lg font-bold text-white">{testimonials[currentIndex].author}</h4>
                <p className="text-sm font-medium mt-1" style={{ color: "var(--color-text-secondary)" }}>
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-12">
            {/* Prev button */}
            <button
              onClick={prev}
              className="p-3.5 rounded-full border border-white/10
                hover:border-purple-400/45 hover:bg-purple-500/10
                transition-all duration-300 text-white/70 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2 items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`rounded-full transition-all duration-400 ${
                    i === currentIndex ? "w-7 h-2" : "w-2 h-2 bg-white/20 hover:bg-white/35"
                  }`}
                  style={
                    i === currentIndex
                      ? { background: "linear-gradient(to right, #EC4899, #A855F7)" }
                      : undefined
                  }
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={next}
              className="p-3.5 rounded-full border border-white/10
                hover:border-purple-400/45 hover:bg-purple-500/10
                transition-all duration-300 text-white/70 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
