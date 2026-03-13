import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesGridProps {
  features: Feature[];
}

const IconLoader = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <LucideIcons.HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

// Brand colour palette — cycles pink → purple → blue per card
const cardAccents = [
  { bg: "rgba(236,72,153,0.10)",  hover: "rgba(236,72,153,0.18)",  icon: "#EC4899", bar: "#EC4899" },
  { bg: "rgba(168,85,247,0.10)",  hover: "rgba(168,85,247,0.18)",  icon: "#A855F7", bar: "#A855F7" },
  { bg: "rgba(56,189,248,0.10)",  hover: "rgba(56,189,248,0.18)",  icon: "#38BDF8", bar: "#38BDF8" },
];

export default function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <section className="py-16 px-6 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const accent = cardAccents[index % cardAccents.length];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="matte-card p-8 flex flex-col items-start gap-5 group relative overflow-hidden"
            >
              {/* Top accent line — shows on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(to right, transparent, ${accent.bar}, transparent)` }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: accent.bg }}
              >
                <IconLoader
                  name={feature.icon}
                  className="w-7 h-7 transition-colors duration-300"
                  // @ts-ignore
                  style={{ color: accent.icon }}
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white/90 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium" style={{ color: "var(--color-text-secondary)" }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
