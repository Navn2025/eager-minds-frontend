import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Palette,
  FlaskConical,
  Code2,
  Brain,
  Trophy,
  BookOpen,
  Music,
  Globe,
  ArrowRight,
  Layers,
} from "lucide-react";

const clubs = [
  {
    id: "arts-craft",
    icon: Palette,
    name: "Arts & Craft Club",
    tagline: "Creative expression through colour, texture and imagination.",
    color: "from-pink-500 to-rose-500",
    glow: "rgba(236,72,153,0.3)",
    path: "/clubs/arts-craft",
  },
  {
    id: "science",
    icon: FlaskConical,
    name: "Science Explorers Club",
    tagline: "Hands-on experiments that make science come alive.",
    color: "from-sky-500 to-blue-600",
    glow: "rgba(14,165,233,0.3)",
    path: "/clubs/science",
  },
  {
    id: "coding",
    icon: Code2,
    name: "Coding Club",
    tagline: "Build, create and problem-solve through beginner-friendly coding.",
    color: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.3)",
    path: "/clubs/coding",
  },
  {
    id: "11plus",
    icon: Brain,
    name: "11+ Prep Club",
    tagline: "Expert preparation for selective school entrance exams.",
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.3)",
    path: "/11-plus-prep",
  },
  {
    id: "competitions",
    icon: Trophy,
    name: "Competitions Club",
    tagline: "Participate in local and national challenges to shine.",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.3)",
    path: "/competitions",
  },
  {
    id: "reading",
    icon: BookOpen,
    name: "Reading & Writing Club",
    tagline: "Discover the joy of stories, poetry and creative writing.",
    color: "from-fuchsia-500 to-pink-600",
    glow: "rgba(217,70,239,0.3)",
    path: "/clubs/reading",
  },
  {
    id: "music",
    icon: Music,
    name: "Music & Drama Club",
    tagline: "Express yourself through performance, rhythm and storytelling.",
    color: "from-red-500 to-orange-600",
    glow: "rgba(239,68,68,0.3)",
    path: "/clubs/music",
  },
  {
    id: "geography",
    icon: Globe,
    name: "Global Explorers Club",
    tagline: "Discover cultures, geography and the amazing world around us.",
    color: "from-cyan-500 to-teal-500",
    glow: "rgba(6,182,212,0.3)",
    path: "/clubs/global",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function OurClubs() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] pt-28 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-400/20 bg-purple-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-purple-300/70 mb-6">
            <Layers size={12} className="text-purple-400" />
            <span>Our Clubs</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
            Explore Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400">
              Clubs
            </span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            From arts to coding, science to storytelling — there's a club for every curious mind.
            Choose your adventure and start exploring!
          </p>
        </motion.div>

        {/* Club Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {clubs.map((club, i) => (
            <motion.div
              key={club.id}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1 + i * 0.06}
            >
              <Link to={club.path} className="block group h-full">
                <div
                  className="relative h-full bg-white/[0.02] border border-white/5 rounded-2xl p-7 overflow-hidden
                    hover:border-white/15 hover:-translate-y-1 transition-all duration-400"
                >
                  {/* Glow hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${club.glow}, transparent 65%)`,
                    }}
                  />
                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${club.color} flex items-center justify-center mb-5
                        shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      style={{ boxShadow: `0 4px 20px ${club.glow}` }}
                    >
                      <club.icon size={22} className="text-white" />
                    </div>
                    <h3 className="text-base font-black text-white mb-2 leading-snug">
                      {club.name}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-5">
                      {club.tagline}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/30 group-hover:text-white/60 transition-colors">
                      Learn more <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA bottom */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.7}
          className="text-center mt-16"
        >
          <p className="text-white/40 text-sm mb-6">
            Can't find what you're looking for? Get in touch and we'll help you find the right fit.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white
              bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600
              shadow-[0_6px_28px_rgba(168,85,247,0.38)] hover:shadow-[0_8px_36px_rgba(236,72,153,0.40)]
              transition-shadow duration-300"
          >
            Contact Us <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
