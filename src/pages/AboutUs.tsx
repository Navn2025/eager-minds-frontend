import { motion } from "framer-motion";
import {
  Compass,
  Target,
  Heart,
  Users,
  Mail,
  Instagram,
  Facebook,
  Sparkles,
} from "lucide-react";
import { Card } from "../components/ui/Card";

export default function AboutUs() {
  return (
    <div className="page-container pb-40 pt-40 md:pt-52">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24 mt-10 space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-400/20 bg-pink-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-pink-300/70">
          <Compass size={12} className="text-pink-400" />
          <span>The Manifesto</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white">
          About <span className="text-gradient">Us.</span>
        </h1>
        <p className="subtitle-editorial max-w-2xl">
          Architecting the future of elite education. We are a collective of
          researchers and designers dedicated to cognitive acceleration and
          creative mastery.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="matte-card h-full bg-gradient-to-br from-pink-500 via-purple-600 to-violet-700 text-white border-none p-12 relative overflow-hidden group shadow-[0_8px_40px_rgba(168,85,247,0.30)]">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:rotate-12 transition-transform duration-1000">
              <Target size={120} />
            </div>
            <div className="relative z-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-white/70">
                Our Vision
              </h2>
              <p className="text-3xl font-black tracking-tighter leading-tight">
                To cultivate an inclusive and inspiring environment where
                children can explore their creativity, ignite their curiosity,
                and develop a lifelong passion for learning.
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="matte-card h-full p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:-rotate-12 transition-transform duration-1000">
              <Heart size={120} />
            </div>
            <div className="relative z-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-white/40">
                Our Mission
              </h2>
              <p className="text-xl font-medium text-white/60 leading-relaxed">
                At Eager Minds Club, we ignite the sparks of imagination and
                curiosity in young learners, transforming the ordinary into the
                extraordinary. We empower each child to embrace their unique
                potential and become the architects of their own future.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <section className="space-y-12">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              The Team
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-pink-400/20 to-transparent" />
          </div>
          <div className="p-16 border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01] text-center">
            <Users size={48} className="mx-auto text-white/5 mb-6" />
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
              Querying human resources...
            </p>
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Network
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-400/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              {
                icon: Mail,
                label: "Email",
                value: "eagermindsclub@gmail.com",
                href: "mailto:eagermindsclub@gmail.com",
              },
              {
                icon: Instagram,
                label: "Instagram",
                value: "@eagermindsclub",
                href: "https://www.instagram.com/eagermindsclub",
              },
              {
                icon: Facebook,
                label: "Facebook",
                value: "Eager Minds Club",
                href: "https://www.facebook.com/share/1Hh1zoJ4r3/",
              },
            ].map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center justify-between p-8 bg-white/[0.01] border border-white/5 rounded-3xl group hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-600/10 hover:border-purple-400/30 transition-all duration-500"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                    <link.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 group-hover:opacity-60 mb-1">
                      {link.label}
                    </p>
                    <p className="text-sm font-black">{link.value}</p>
                  </div>
                </div>
                <Sparkles
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
