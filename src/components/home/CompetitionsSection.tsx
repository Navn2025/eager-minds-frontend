import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Trophy, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import api from "../../services/api";

interface Competition {
  id: string;
  title: string;
  description: string;
  image: string | null;
  eventDate: string;
  registrationLink: string | null;
}

export default function CompetitionsSection() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    api
      .get("/competitions?status=upcoming&limit=3")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.competitions || [];
        setCompetitions(data.slice(0, 3));
      })
      .catch(() => setCompetitions([]));
  }, []);

  if (competitions.length === 0) return null;

  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-accent mb-6"
            >
              <Trophy size={14} />
              <span>Global Events</span>
            </motion.div>
            <h2 className="section-title text-left mb-6">
              Upcoming <span className="text-gradient">Challenges.</span>
            </h2>
            <p className="text-text-secondary text-lg font-medium leading-relaxed max-w-xl uppercase tracking-wider">
              Showcase your talents and compete with the world's most bright
              young minds in our curated elite challenges.
            </p>
          </div>
          <Link to="/competitions">
            <Button
              variant="ghost"
              className="h-14 px-10 rounded-2xl border border-white/5 bg-white/[0.02] text-[9px] font-bold uppercase tracking-[0.3em] text-text-secondary hover:text-white hover:bg-accent/10 hover:border-accent/40 group transition-all glass"
            >
              Arena Hall
              <ArrowRight
                size={16}
                className="ml-3 group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {competitions.map((comp, index) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="glass-card flex flex-col h-full rounded-[3rem] group p-4 overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden rounded-[2.5rem] relative mb-6">
                  <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                  {comp.image ? (
                    <img
                      src={comp.image}
                      alt={comp.title}
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                      <Trophy size={48} className="text-white/10" />
                    </div>
                  )}
                  <div className="absolute top-6 right-6 z-20">
                    <div className="px-4 py-1.5 glass bg-black/40 text-white rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/10">
                      Challenge
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-3 text-accent text-[9px] font-bold uppercase tracking-[0.3em] mb-6">
                    <Calendar size={14} />
                    <span>
                      {new Date(comp.eventDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase group-hover:text-accent transition-colors leading-tight">
                    {comp.title}
                  </h3>

                  <p className="text-text-secondary text-sm font-medium leading-relaxed mb-10 flex-grow">
                    {comp.description}
                  </p>

                  {comp.registrationLink ? (
                    <Button
                      onClick={() =>
                        window.open(comp.registrationLink!, "_blank")
                      }
                      className="w-full h-14 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl active:scale-95 group/btn"
                    >
                      Register Arena
                      <Sparkles
                        size={14}
                        className="ml-2 group-hover/btn:animate-spin"
                      />
                    </Button>
                  ) : (
                    <div className="w-full h-14 rounded-[1.5rem] border border-dashed border-white/10 flex items-center justify-center">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
