import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Calendar, Trophy, ArrowRight, Sparkles, History } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface Competition {
  id: string;
  title: string;
  description: string;
  rules: string | null;
  image: string | null;
  registrationLink: string | null;
  eventDate: string;
}

export default function Competitions() {
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState<Competition[]>([]);
  const [past, setPast] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/competitions?status=upcoming"),
      api.get("/competitions?status=past"),
    ])
      .then(([upcomingRes, pastRes]) => {
        setUpcoming(
          Array.isArray(upcomingRes.data)
            ? upcomingRes.data
            : upcomingRes.data.competitions || [],
        );
        setPast(
          Array.isArray(pastRes.data)
            ? pastRes.data
            : pastRes.data.competitions || [],
        );
        setLoading(false);
      })
      .catch(() => {
        setUpcoming([]);
        setPast([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const CompCard = ({
    comp,
    isPast = false,
    idx = 0,
  }: {
    comp: Competition;
    isPast?: boolean;
    idx?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
    >
      <Card
        className={cn(
          "matte-card group relative h-full flex flex-col pt-6 md:pt-10 px-2 md:px-4",
          isPast && "grayscale opacity-60",
        )}
      >
        <div className="relative aspect-video overflow-hidden p-3 md:p-4">
          <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl">
            {comp.image ? (
              <img
                src={comp.image}
                alt={comp.title}
                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
              />
            ) : (
              <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                <Trophy size={48} className="text-white/5" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute top-4 md:top-6 left-4 md:left-6">
              <Badge className="bg-white text-black font-black uppercase tracking-widest text-[8px] md:text-[9px] px-2 md:px-3 py-1 md:py-1.5 rounded-full border-none shadow-xl">
                {new Date(comp.eventDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-6 md:p-10 pt-4 flex flex-col flex-grow">
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight break-words mb-4 group-hover:translate-x-1 transition-transform uppercase">
            {comp.title}
          </h3>
          <p className="text-white/40 text-sm font-medium leading-relaxed mb-8 flex-grow">
            {comp.description}
          </p>

          <div className="space-y-6">
            {comp.rules && (
              <div className="p-5 md:p-6 bg-white/[0.02] rounded-2xl md:rounded-3xl border border-white/5 group-hover:border-white/10 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 block">
                  Governance & Protocol
                </span>
                <p className="text-xs text-white/60 font-medium line-clamp-3 leading-relaxed italic">
                  "{comp.rules}"
                </p>
              </div>
            )}

            {!isPast ? (
              <Button
                className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_4px_20px_rgba(168,85,247,0.3)] group/btn border-none"
                onClick={() => navigate("/dashboard")}
              >
                Access Portal
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                />
              </Button>
            ) : (
              <div className="h-14 md:h-16 flex items-center justify-center border border-dashed border-white/10 rounded-xl md:rounded-2xl bg-white/[0.01]">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                  Challenge Terminal Inactive
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="page-container pb-32 pt-40 md:pt-52">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex mt-10 flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 md:mb-32"
      >
        <div className="space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/20 bg-purple-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-purple-300/70">
            <Trophy size={12} className="text-purple-400" />
            <span>High Performance Protocol</span>
          </div>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-tight">
            Grand <br className="sm:hidden" />{" "}
            <span className="text-gradient">Competitions.</span>
          </h1>
          <p className="subtitle-editorial max-w-2xl text-lg md:text-2xl">
            Push industrial boundaries and showcase elite performance in our
            curated academic challenges.
          </p>
        </div>
        <div className="hidden lg:flex gap-4 pb-4">
          <Trophy size={120} className="text-white/5 rotate-12" />
        </div>
      </motion.header>

      <section className="mb-40">
        <div className="flex items-center gap-6 mb-16">
          <Sparkles className="text-pink-400/60" size={24} />
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            Active Challenges
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-pink-400/20 to-transparent" />
        </div>

        {upcoming.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {upcoming.map((comp, i) => (
              <CompCard key={comp.id} comp={comp} idx={i} />
            ))}
          </div>
        ) : (
          <div className="p-32 border border-dashed border-white/5 rounded-[4rem] text-center bg-white/[0.01] flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/10">
              <Calendar size={32} />
            </div>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
              Archives synchronizing. No active nodes found.
            </p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-6 mb-16">
          <History className="text-purple-400/60" size={24} />
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            Hall of Fame
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-400/20 to-transparent" />
        </div>

        {past.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {past.map((comp, i) => (
              <CompCard key={comp.id} comp={comp} isPast idx={i} />
            ))}
          </div>
        ) : (
          <div className="p-20 border border-white/5 rounded-[3rem] text-center bg-white/[0.01]">
            <p className="text-white/10 italic font-black uppercase tracking-[0.2em] text-[10px]">
              The Hall of Fame is awaiting its first titans.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
