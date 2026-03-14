import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Zap,
  ArrowUpRight,
  User,
  Activity,
  Award,
  BookOpen,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  total: number;
  completed: number;
  percentage: number;
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    membershipStatus: string;
  };
  completions: {
    id: string;
    itemId: string;
    itemType: string;
    completedAt: string;
    item?: { title: string };
  }[];
  saved: { id: string; itemId: string; itemType: string }[];
  progress: SubjectProgress[];
}

function formatStudyTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/prep/dashboard")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const worksheetCount =
    data?.completions.filter((c) => c.itemType === "worksheet").length || 0;
  const paperCount =
    data?.completions.filter((c) => c.itemType === "paper").length || 0;
  const studyTimeMinutes = (data?.completions || []).reduce((acc, c) => {
    if (c.itemType === "paper") return acc + 60;
    if (c.itemType === "worksheet") return acc + 45;
    return acc + 30;
  }, 0);
  const studyTimeLabel = formatStudyTime(studyTimeMinutes);

  return (
    <div className="space-y-8 md:space-y-12 pb-32">
      {/* Sophisticated Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-10"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-accent shadow-[0_0_20px_var(--color-accent-glow)]">
            <User size={12} className="text-accent" />
            <span>Learning Node Active</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9]">
            Welcome back,{" "}
            <span className="text-white/20">
              {authUser?.name?.split(" ")[0] || "Explorer"}.
            </span>
          </h1>
          <p className="text-text-secondary text-base md:text-xl font-medium max-w-xl leading-relaxed">
            Your elite learning journey continues. Here is an overview of your
            academic mastery.
          </p>
        </div>
        <Button className="h-14 md:h-16 px-8 md:px-10 rounded-2xl md:rounded-3xl bg-accent text-white font-black uppercase tracking-widest hover:scale-[1.05] transition-all accent-glow group">
          Explore Courses{" "}
          <ArrowUpRight
            size={18}
            className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          />
        </Button>
      </motion.header>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          {
            label: "Worksheets",
            value: worksheetCount,
            icon: CheckCircle2,
            status: "completed",
            color: "accent",
          },
          {
            label: "Mock Papers",
            value: paperCount,
            icon: Zap,
            status: "synchronized",
            color: "blue",
          },
          {
            label: "Study Time",
            value: studyTimeLabel,
            icon: Clock,
            status: "this week",
            color: "violet",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <div className="matte-card p-6 md:p-10 h-full group hover:bg-white/[0.02] transition-all duration-500 rounded-[2rem]">
              <div
                className={cn(
                  "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-10 transition-transform group-hover:rotate-6 shadow-xl",
                  stat.color === "accent"
                    ? "bg-accent/20 text-accent border border-accent/20"
                    : "bg-white/5 text-white/40 border border-white/5",
                )}
              >
                <stat.icon
                  size={20}
                  strokeWidth={2.5}
                  className="md:w-7 md:h-7"
                />
              </div>
              <div>
                <div className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-2">
                  {stat.value}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                    {stat.label}
                  </p>
                  <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-accent italic">
                    {stat.status}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        {/* Advanced Progress Analytics */}
        <div className="lg:col-span-2 matte-card p-6 md:p-10 overflow-hidden rounded-[2rem]">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white">
              Subject Mastery
            </h3>
            <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-white/40 shrink-0">
              <Activity size={18} className="md:w-[20px]" />
            </div>
          </div>

          <div className="space-y-8 md:space-y-12">
            {data?.progress && data.progress.length > 0 ? (
              data.progress.map((p, i) => (
                <div key={p.subjectId} className="space-y-4 md:space-y-6 group">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent group-hover:animate-ping" />
                        <h4 className="text-lg md:text-xl font-bold text-white tracking-tight">
                          {p.subjectName}
                        </h4>
                      </div>
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] ml-5">
                        {p.completed} of {p.total} Modules Mastered
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                        {p.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-white/[0.02] rounded-full h-2 md:h-3 overflow-hidden p-0.5 border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.percentage}%` }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5 + i * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="bg-accent h-full rounded-full shadow-[0_0_20px_var(--color-accent-glow)]"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 md:py-24 text-center flex flex-col items-center gap-6 md:gap-8">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10">
                  <Zap size={32} className="md:w-12 md:h-12" />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] md:text-[12px] text-white/40 font-black uppercase tracking-[0.3em]">
                    Initialize Training
                  </p>
                  <p className="text-base md:text-lg text-white/20 font-medium max-w-sm px-4">
                    Complete your first worksheet to synchronize progress
                    metrics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sophisticated Activity Node */}
        <div className="matte-card p-6 md:p-10 overflow-hidden flex flex-col rounded-[2rem]">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white">
              Grid Stream
            </h3>
            <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-white/40 shrink-0">
              <Award size={18} className="md:w-[20px]" />
            </div>
          </div>

          <div className="flex-grow space-y-4">
            {data?.completions.slice(0, 6).map((completion, idx) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={idx}
                className="flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/5 group relative overflow-hidden"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-lg">
                  <BookOpen size={18} />
                </div>
                <div className="relative z-10 min-w-0">
                  <p className="text-xs md:text-sm font-bold text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform truncate">
                    {completion.itemType} Synchronized
                  </p>
                  <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mt-1">
                    {new Date(completion.completedAt).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}

            {(!data?.completions || data.completions.length === 0) && (
              <div className="py-12 md:py-24 text-center flex flex-col items-center gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10">
                  <Activity size={28} className="md:w-8 md:h-8" />
                </div>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] leading-relaxed">
                  System awaiting initial data sync.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 md:mt-12">
            <Button
              variant="ghost"
              className="w-full h-14 md:h-16 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              Full Node Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
