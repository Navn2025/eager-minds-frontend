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

export default function SubjectsGrid({ subjects }: SubjectsGridProps) {
  return (
    <section className="py-24 px-6 max-w-[1200px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map((subject, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, borderColor: "rgba(124, 58, 237, 0.3)" }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all duration-300"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="p-3 rounded-xl bg-accent/10 text-accent">
                <IconLoader name={subject.icon} className="w-6 h-6" />
              </div>
              <div className="w-8 h-[2px] bg-white/10" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">
              {subject.title}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
              {subject.shortDescription}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
