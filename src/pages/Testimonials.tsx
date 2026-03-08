import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { Quote, Star, Sparkles } from "lucide-react";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/utils";

interface Testimonial {
  id: string;
  parentName: string;
  content: string;
  rating: number;
  approved: boolean;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/testimonials")
      .then((res) => {
        setTestimonials(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-container pb-40 pt-40 md:pt-52">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24 mt-10 space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          <Quote size={12} className="text-white/60" />
          <span>Community Feedback</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white">
          Parental <span className="text-white/40">Insights.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-2xl leading-relaxed">
          Verified testimonials from our network of high-achieving parents.
          Documenting the cognitive evolution of the next generation.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-[3rem] bg-white/[0.01] border border-white/5 animate-pulse"
              />
            ))
          : testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full bg-white/[0.01] border-white/5 rounded-[3rem] p-4 group transition-all duration-700 hover:bg-white/[0.02] hover:border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <Star size={80} />
                  </div>

                  <div className="p-8 flex flex-col h-full">
                    <div className="flex gap-1 mb-8">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={14}
                          className={cn(
                            "transition-all duration-500",
                            idx < t.rating
                              ? "text-white fill-white"
                              : "text-white/10",
                          )}
                        />
                      ))}
                    </div>

                    <p className="text-xl font-medium text-white/60 leading-relaxed mb-10 italic flex-1">
                      "{t.content}"
                    </p>

                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">
                          Authenticated
                        </p>
                        <p className="text-sm font-black text-white">
                          {t.parentName}
                        </p>
                      </div>
                      <Sparkles
                        size={16}
                        className="text-white/10 group-hover:text-white transition-colors"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
      </div>

      {!loading && testimonials.length === 0 && (
        <div className="flex flex-col items-center justify-center p-32 border border-dashed border-white/5 rounded-[4rem] bg-white/[0.01] text-center">
          <div className="relative mb-8">
            <Quote size={64} className="text-white/5" />
            <Sparkles
              className="absolute -top-2 -right-2 text-white/20"
              size={24}
            />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            Registry Empty
          </h1>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            No validated testimonials identifyed.
          </p>
        </div>
      )}
    </div>
  );
}
