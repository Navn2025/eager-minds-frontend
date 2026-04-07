import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Type,
  BrainCircuit,
  Shapes,
  ArrowRight,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import api from "../../services/api";

interface Subject {
  id: string;
  name: string;
  slug: string;
  _count?: { topics: number; worksheets: number };
}

const subjectIcons: Record<string, React.ElementType> = {
  maths: Plus,
  english: Type,
  "verbal-reasoning": BrainCircuit,
  "non-verbal-reasoning": Shapes,
};

const subjectDescriptions: Record<string, string> = {
  maths:
    "Master advanced arithmetic, complex geometry, and logical problem-solving techniques.",
  english:
    "Enhance analytical comprehension, advanced grammar, and premium creative writing skills.",
  "verbal-reasoning":
    "Develop high-level logical thinking and sophisticated word relationship analysis.",
  "non-verbal-reasoning":
    "Solve complex visual puzzles and recognize abstract patterns in spatial reasoning.",
};

export default function SubjectGrid() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    api
      .get("/prep/subjects")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.subjects || [];
        setSubjects(data);
      })
      .catch(() => setSubjects([]));
  }, []);

  if (subjects.length === 0) return null;

  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-start text-left mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-accent mb-6 px-4 py-1.5 border border-accent/20 bg-accent/5 rounded-full accent-glow"
          >
            <Sparkles size={10} />
            <span>Curriculum</span>
          </motion.div>
          <h2 className="section-title">
            Master the <span className="text-gradient">Essentials.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl font-medium leading-relaxed uppercase tracking-wider">
            Targeted preparation for the core 11+ subjects with elite,
            expert-curated content designed for academic mastery.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject, index) => {
            const Icon = subjectIcons[subject.slug] || BookOpen;
            const description =
              subjectDescriptions[subject.slug] ||
              `Explore ${subject.name} resources and worksheets.`;

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1,
                }}
                className="glass-card h-full p-8 rounded-[3rem] flex flex-col group relative overflow-hidden"
              >
                {/* Card Spotlight Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-16 h-16 rounded-2xl bg-surface/50 border border-white/10 text-white flex items-center justify-center mb-10 group-hover:bg-accent/10 group-hover:border-accent/30 group-hover:text-accent transition-all duration-500 shadow-xl relative z-10">
                  <Icon size={28} strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase relative z-10">
                  {subject.name}
                </h3>

                <p className="text-text-secondary text-sm leading-relaxed font-medium mb-10 flex-grow relative z-10">
                  {description}
                </p>

                <Link to="/11-plus-prep">
                  <Button
                    variant="ghost"
                    className="w-full h-14 rounded-2xl text-[9px] font-bold uppercase tracking-[0.3em] border border-white/5 bg-white/[0.02] hover:bg-accent/10 hover:border-accent/40 hover:text-white transition-all group/btn relative z-10"
                  >
                    Explore Path
                    <ArrowRight
                      size={14}
                      className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                    />
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
