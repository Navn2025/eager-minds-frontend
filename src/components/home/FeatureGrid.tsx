import { motion } from "framer-motion";
import { 
  BookOpen, 
  Trophy, 
  Palette, 
  FileText, 
  LineChart, 
  MessageSquare,
  Sparkles
} from "lucide-react";

const features = [
  {
    title: "11+ Preparation",
    description: "Comprehensive resources for Maths, English, and Reasoning success with expert-led methodology.",
    icon: BookOpen,
  },
  {
    title: "Monthly Competitions",
    description: "Exciting monthly challenges to sharpen young minds and win prestigious achievement awards.",
    icon: Trophy,
  },
  {
    title: "Creative Activities",
    description: "Hands-on projects that blend advanced learning with high-end artistic expression.",
    icon: Palette,
  },
  {
    title: "Word of the Day",
    description: "Expand vocabulary with curated terms, etymology, and sophisticated usage examples.",
    icon: MessageSquare,
  },
  {
    title: "Premium Papers",
    description: "Exclusive mock tests and past papers for ultimate exam readiness and performance audits.",
    icon: FileText,
  },
  {
    title: "Progress Tracking",
    description: "Visual analytics to monitor growth and identify specific cognitive improvement areas.",
    icon: LineChart,
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[9px] font-bold uppercase tracking-[0.3em] text-accent mb-6 accent-glow"
          >
            <Sparkles size={10} />
            <span>Core Capabilities</span>
          </motion.div>
          <h2 className="section-title max-w-3xl">
            Educational <span className="text-gradient">Excellence</span> Redefined.
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl font-medium leading-relaxed uppercase tracking-wider">
            Our platform provides the elite tools and resources every young learner needs to excel academically and creatively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-10 rounded-[2.5rem] group relative overflow-hidden"
            >
              {/* Card Accent Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/15 transition-colors" />
              
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 text-accent flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-accent/10 group-hover:border-accent/40 transition-all duration-500 shadow-xl">
                <feature.icon size={30} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed font-medium text-sm">
                {feature.description}
              </p>
              
              <div className="mt-8 flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-accent opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <span>Discover More</span>
                <Sparkles size={10} className="ml-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
