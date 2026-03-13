import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface Subject {
  icon: string;
  title: string;
  shortDescription: string;
}

interface SubjectsGridProps {
  subjects: Subject[];
}

const IconLoader = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <LucideIcons.BookOpen className={className} />;
  return <IconComponent className={className} />;
};

// 4-colour cycle: pink, purple, blue, cyan
const subjectAccents = [
  { bg: "rgba(236,72,153,0.12)",  icon: "#EC4899",  bar: "rgba(236,72,153,0.50)", hover: "rgba(236,72,153,0.25)" },
  { bg: "rgba(168,85,247,0.12)",  icon: "#A855F7",  bar: "rgba(168,85,247,0.50)", hover: "rgba(168,85,247,0.25)" },
  { bg: "rgba(56,189,248,0.12)",  icon: "#38BDF8",  bar: "rgba(56,189,248,0.50)",  hover: "rgba(56,189,248,0.25)"  },
  { bg: "rgba(34,211,238,0.12)",  icon: "#22D3EE",  bar: "rgba(34,211,238,0.50)",  hover: "rgba(34,211,238,0.25)"  },
];

export default function SubjectsGrid({ subjects }: SubjectsGridProps) {
  return (
    <section className="py-16 px-6 max-w-[1200px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {subjects.map((subject, index) => {
          const accent = subjectAccents[index % subjectAccents.length];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-3xl backdrop-blur-sm transition-all duration-300 group cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.018)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = accent.hover;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${accent.bar.replace("0.50", "0.10")}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                {/* Per-card coloured icon */}
                <div
                  className="p-2.5 rounded-xl transition-all duration-300"
                  style={{ backgroundColor: accent.bg }}
                >
                  <IconLoader
                    name={subject.icon}
                    className="w-5 h-5"
                    // @ts-ignore
                    style={{ color: accent.icon }}
                  />
                </div>
                {/* Coloured rule — matches icon */}
                <div className="h-[2px] w-8 rounded-full" style={{ backgroundColor: accent.bar }} />
              </div>

              <h3 className="text-lg font-bold text-white/90 mb-2 tracking-tight">
                {subject.title}
              </h3>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>
                {subject.shortDescription}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
