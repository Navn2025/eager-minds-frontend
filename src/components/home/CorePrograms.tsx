import { motion } from "framer-motion";
import { Calculator, BookOpen, MessageCircle, Puzzle } from "lucide-react";

const programs = [
  {
    title: "Mathematics",
    description: "Master complex problem-solving and mathematical logic.",
    icon: Calculator,
    color: "from-blue-500/10 to-blue-500/5",
    accent: "bg-blue-500",
  },
  {
    title: "English",
    description:
      "Advanced literacy, comprehension, and analytical writing skills.",
    icon: BookOpen,
    color: "from-violet-500/10 to-violet-500/5",
    accent: "bg-violet-500",
  },
  {
    title: "Verbal Reasoning",
    description:
      "Developing linguistic insight and logical deduction abilities.",
    icon: MessageCircle,
    color: "from-emerald-500/10 to-emerald-500/5",
    accent: "bg-emerald-500",
  },
  {
    title: "Non-Verbal Reasoning",
    description: "Enhancing spatial awareness and visual-spatial reasoning.",
    icon: Puzzle,
    color: "from-amber-500/10 to-amber-500/5",
    accent: "bg-amber-500",
  },
];

export default function CorePrograms() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
          >
            Master the Essentials
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-2xl"
          >
            Comprehensive preparation across four core disciplines designed for
            academic success.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-3xl bg-card border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden"
            >
              {/* Subtle background glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-2xl ${program.accent}/10 flex items-center justify-center mb-6 border border-${program.accent}/20`}
                >
                  <program.icon className={`w-6 h-6 text-white`} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                  {program.title}
                </h3>

                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  {program.description}
                </p>

                <div className="flex items-center text-xs font-semibold text-white/40 group-hover:text-white transition-colors">
                  EXPLORE PROGRAM{" "}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${program.color} blur-3xl opacity-50`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
