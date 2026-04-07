import { motion } from "framer-motion";
import { Trophy, Palette, FileText, Activity } from "lucide-react";

const features = [
  {
    title: "Monthly Competitions",
    description: "Compete with the brightest minds in global academic challenges.",
    icon: Trophy
  },
  {
    title: "Creative Activities",
    description: "Art and design challenges to foster holistic thinking.",
    icon: Palette
  },
  {
    title: "Premium Papers",
    description: "Curated academic resources and hallmark practice materials.",
    icon: FileText
  },
  {
    title: "Progress Tracking",
    description: "Real-time insights into cognitive growth and development.",
    icon: Activity
  }
];

export default function PlatformFeatures() {
  return (
    <section className="py-24 px-6 border-y border-white/5 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
            >
              Built for Serious Learners
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary text-lg"
            >
              Our platform combines traditional academic rigor with modern cognitive tools.
            </motion.p>
          </div>
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="hidden md:block"
          >
            <button className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-semibold">
              View All Features
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="flex gap-4 p-2">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-accent/10 group-hover:border-accent/20 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed max-w-[240px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
