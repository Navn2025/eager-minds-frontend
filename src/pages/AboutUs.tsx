import { motion } from "framer-motion";
import {
  Target,
  Heart,
  Sparkles,
  Palette,
  FlaskConical,
  Code2,
  Star,
  Brain,
  Lightbulb,
  Users,
  Trophy,
  BookOpen,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

const offerings = [
  {
    icon: Palette,
    title: "Arts & Craft",
    color: "from-pink-500 to-rose-500",
    glow: "rgba(236,72,153,0.25)",
    desc: "Hands-on creative projects that nurture self-expression and artistic confidence.",
  },
  {
    icon: FlaskConical,
    title: "Science Projects",
    color: "from-sky-500 to-blue-600",
    glow: "rgba(14,165,233,0.25)",
    desc: "Fun experiments and STEM activities that spark a love for discovery and inquiry.",
  },
  {
    icon: Code2,
    title: "Coding",
    color: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.25)",
    desc: "Age-appropriate coding sessions that build logical thinking and digital skills.",
  },
  {
    icon: Brain,
    title: "11+ Preparation",
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.25)",
    desc: "Expert-guided preparation across Maths, English, Verbal & Non-Verbal Reasoning.",
  },
  {
    icon: Trophy,
    title: "Competitions",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.25)",
    desc: "Local and national competitions to showcase talent and build confidence.",
  },
  {
    icon: BookOpen,
    title: "Magazines & Reading",
    color: "from-fuchsia-500 to-pink-600",
    glow: "rgba(217,70,239,0.25)",
    desc: "Curated educational magazines to cultivate a life-long love for reading.",
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] pt-28 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* ── Page Header ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-400/20 bg-pink-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-pink-300/70 mb-6">
            <Sparkles size={12} className="text-pink-400" />
            <span>Who We Are</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400">
              Us
            </span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            A creative learning club designed to inspire curiosity, creativity, and confidence
            in children through arts, science projects, coding and skill-based activities.
          </p>
        </motion.div>

        {/* ── Vision & Mission ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Vision */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.15}
          >
            <div className="relative h-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-pink-500 via-purple-600 to-violet-700 rounded-[2.5rem] blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative h-full bg-gradient-to-br from-pink-500 via-purple-600 to-violet-700 rounded-[2.5rem] p-10 overflow-hidden">
                <div className="absolute top-0 right-0 opacity-5 scale-150 -rotate-12">
                  <Target size={140} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Target size={20} className="text-white" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">
                      Our Vision
                    </span>
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-white leading-snug tracking-tight">
                    To cultivate an inclusive and inspiring environment where children can explore
                    their creativity, ignite their curiosity, and develop a lifelong passion for
                    learning.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.25}
          >
            <div className="h-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 overflow-hidden relative group hover:border-purple-400/30 transition-all duration-500">
              <div className="absolute top-0 right-0 opacity-5 scale-150 rotate-12 group-hover:rotate-6 transition-transform duration-1000">
                <Heart size={140} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Heart size={20} className="text-purple-300" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">
                    Our Mission
                  </span>
                </div>
                <p className="text-lg md:text-xl font-medium text-white/60 leading-relaxed">
                  At Eager Minds Club, we ignite the sparks of imagination and curiosity
                  in young learners, transforming the ordinary into the extraordinary.
                  We empower each child to embrace their unique potential — through hands-on
                  activities, creative challenges, and a nurturing community — and become
                  the architects of their own future.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── What We Offer ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mb-20"
        >
          <div className="flex items-center gap-6 mb-10">
            <div className="flex items-center gap-3">
              <Star size={16} className="text-pink-400" />
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                What We Offer
              </h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-pink-400/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.35 + i * 0.07}
              >
                <div
                  className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-7
                    hover:border-white/15 transition-all duration-500 overflow-hidden cursor-default"
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(circle at top right, ${item.glow}, transparent 70%)`,
                    }}
                  />
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    style={{ boxShadow: `0 4px 20px ${item.glow}` }}
                  >
                    <item.icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Our Values ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
        >
          <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.005] border border-white/8 rounded-[2.5rem] p-10 md:p-14">
            <div className="flex items-center gap-3 mb-10">
              <Lightbulb size={18} className="text-amber-400" />
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Our Values
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-amber-400/20 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  label: "Creativity",
                  desc: "We believe every child is inherently creative. We nurture that spark.",
                  color: "text-pink-400",
                },
                {
                  icon: Users,
                  label: "Community",
                  desc: "Learning is better together. We foster a supportive, inclusive environment.",
                  color: "text-sky-400",
                },
                {
                  icon: Trophy,
                  label: "Confidence",
                  desc: "We celebrate every win, big or small, building resilient young minds.",
                  color: "text-amber-400",
                },
              ].map(({ icon: Icon, label, desc, color }) => (
                <div key={label} className="text-center">
                  <Icon size={32} className={`mx-auto mb-4 ${color}`} />
                  <h4 className="text-base font-black text-white mb-2 uppercase tracking-widest">
                    {label}
                  </h4>
                  <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
