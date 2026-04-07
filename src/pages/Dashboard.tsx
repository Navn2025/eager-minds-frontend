import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Zap,
  User,
  Activity,
  Award,
  BookOpen,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import BadgeMedalSvg from "../components/dashboard/BadgeMedalSvg";

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

interface QuizSummary {
  totalXp: number;
  totalCoins: number;
  currentBadge: string;
  freePaperUnlocks: number;
  nextUnlockXp: number | null;
  streakDays: number;
}

interface WordOfDay {
  word: string;
  meaning: string;
  pronunciation: string;
  synonym: string;
  antonym: string;
  exampleSentence: string;
}

interface WeeklyActivityPoint {
  day: string;
  hours: number;
}

const XP_BADGE_TIERS: Array<{ minXp: number; badge: string }> = [
  { minXp: 0, badge: "Rising Learner" },
  { minXp: 200, badge: "Bronze Explorer" },
  { minXp: 500, badge: "Silver Scholar" },
  { minXp: 900, badge: "Gold Genius" },
  { minXp: 1400, badge: "Platinum Prodigy" },
  { minXp: 2000, badge: "Legendary Master" },
];

function formatStudyTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function dayKeyFromTimestamp(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getDailyStudyMinutesFromCompletions(
  completions: { completedAt: string }[],
): Map<string, number> {
  const byDay = new Map<string, number[]>();

  for (const c of completions) {
    const ts = new Date(c.completedAt).getTime();
    if (Number.isNaN(ts)) continue;
    const key = dayKeyFromTimestamp(ts);
    const bucket = byDay.get(key) || [];
    bucket.push(ts);
    byDay.set(key, bucket);
  }

  const dayMinutes = new Map<string, number>();

  byDay.forEach((times) => {
    const sortedTimes = [...times].sort((a, b) => a - b);

    if (sortedTimes.length === 1) {
      dayMinutes.set(dayKeyFromTimestamp(sortedTimes[0]), 20);
      return;
    }

    let total = 0;
    for (let i = 1; i < sortedTimes.length; i += 1) {
      const gap = Math.round((sortedTimes[i] - sortedTimes[i - 1]) / 60000);
      if (gap > 0) {
        total += Math.min(gap, 120);
      }
    }

    dayMinutes.set(dayKeyFromTimestamp(sortedTimes[0]), Math.max(total, 20));
  });

  return dayMinutes;
}

function getStudyMinutesFromCompletions(
  completions: { completedAt: string }[],
): number {
  const dayMinutes = getDailyStudyMinutesFromCompletions(completions);
  return Array.from(dayMinutes.values()).reduce((acc, value) => acc + value, 0);
}

function getWeeklyActivity(
  completions: { completedAt: string }[],
): WeeklyActivityPoint[] {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayMinutes = getDailyStudyMinutesFromCompletions(completions);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mondayOffset = (today.getDay() + 6) % 7;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - mondayOffset);

  return labels.map((label, index) => {
    const targetDay = new Date(weekStart);
    targetDay.setDate(weekStart.getDate() + index);

    const key = dayKeyFromTimestamp(targetDay.getTime());
    const minutes = dayMinutes.get(key) || 0;

    return {
      day: label,
      hours: Number((minutes / 60).toFixed(1)),
    };
  });
}

function getBadgeTierProgress(totalXp: number) {
  return XP_BADGE_TIERS.map((tier, index) => {
    const nextTier = XP_BADGE_TIERS[index + 1];
    return {
      ...tier,
      unlocked: totalXp >= tier.minXp,
      nextThreshold: nextTier?.minXp || null,
    };
  });
}

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [quizSummary, setQuizSummary] = useState<QuizSummary | null>(null);
  const [wordOfDay, setWordOfDay] = useState<WordOfDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/prep/dashboard")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    api
      .get<QuizSummary>("/quiz/summary")
      .then((res) => setQuizSummary(res.data))
      .catch(() => setQuizSummary(null));

    api
      .get<WordOfDay>("/prep/word-of-the-day")
      .then((res) => setWordOfDay(res.data))
      .catch(() => setWordOfDay(null));
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
  const studyTimeMinutes = getStudyMinutesFromCompletions(
    (data?.completions || []).map((c) => ({ completedAt: c.completedAt })),
  );
  const studyTimeLabel = formatStudyTime(studyTimeMinutes);
  const weeklyActivity = getWeeklyActivity(
    (data?.completions || []).map((c) => ({ completedAt: c.completedAt })),
  );
  const maxWeeklyHours = Math.max(
    1,
    ...weeklyActivity.map((point) => point.hours),
  );
  const weeklyTotalHours = weeklyActivity.reduce(
    (total, point) => total + point.hours,
    0,
  );
  const badgeProgress = getBadgeTierProgress(quizSummary?.totalXp || 0);
  const topBadge = quizSummary?.currentBadge || "Rising Learner";
  const topXp = quizSummary?.totalXp ?? 0;

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
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-2 py-2 rounded-full border border-amber-300/35 bg-amber-500/10">
              <BadgeMedalSvg badgeName={topBadge} size={26} />
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-amber-300/35 bg-amber-500/10 text-[10px] font-black uppercase tracking-[0.15em] text-amber-100">
              {topBadge}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-cyan-300/35 bg-cyan-500/10 text-[10px] font-black uppercase tracking-[0.15em] text-cyan-100">
              XP: {topXp}
            </span>
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

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="matte-card p-6 md:p-10 rounded-[2rem] border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Weekly Activity
              </h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black mt-1">
                Hours studied this week
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 px-4 py-2 bg-emerald-500/10 text-emerald-200">
              <TrendingUp size={14} />
              <span className="text-xs font-black uppercase tracking-wider">
                Total {weeklyTotalHours.toFixed(1)}h
              </span>
            </div>
          </div>

          <div className="relative h-64 rounded-2xl border border-white/5 bg-black/20 p-4 md:p-6">
            <div className="absolute left-4 right-4 md:left-6 md:right-6 border-t border-white/10 bottom-1/4" />
            <div className="absolute left-4 right-4 md:left-6 md:right-6 border-t border-white/10 bottom-1/2" />
            <div className="absolute left-4 right-4 md:left-6 md:right-6 border-t border-white/10 bottom-3/4" />
            <div className="absolute left-4 right-4 md:left-6 md:right-6 border-t border-white/10 top-6" />

            <div className="absolute left-4 md:left-6 top-6 bottom-12 md:bottom-14 flex flex-col justify-between text-[10px] text-white/35 font-bold">
              <span>{maxWeeklyHours.toFixed(1)}h</span>
              <span>{(maxWeeklyHours * 0.5).toFixed(1)}h</span>
              <span>0h</span>
            </div>

            <div className="absolute left-14 right-4 md:left-20 md:right-6 top-6 bottom-12 md:bottom-14 flex items-end justify-between gap-2 md:gap-4">
              {weeklyActivity.map((point, index) => {
                const barHeight = Math.max(
                  0,
                  Math.round((point.hours / maxWeeklyHours) * 100),
                );

                return (
                  <div
                    key={point.day}
                    className="h-full flex-1 flex flex-col items-center justify-end gap-2"
                  >
                    <div className="text-[10px] text-white/60 font-bold">
                      {point.hours > 0 ? `${point.hours}h` : "-"}
                    </div>
                    <div className="relative w-full max-w-10 h-full flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${barHeight}%` }}
                        transition={{ delay: 0.08 * index, duration: 0.55 }}
                        className="w-full rounded-t-xl bg-gradient-to-t from-cyan-500/80 via-blue-400/80 to-indigo-300/80 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute left-14 right-4 md:left-20 md:right-6 bottom-4 flex justify-between gap-2 md:gap-4">
              {weeklyActivity.map((point) => (
                <div
                  key={`${point.day}-label`}
                  className="flex-1 text-center text-[10px] font-black uppercase tracking-widest text-white/45"
                >
                  {point.day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="matte-card p-6 md:p-8 rounded-[2rem] border border-white/10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
              New Section
            </p>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              AI Quiz Section
            </h3>
            <p className="text-white/50 mt-2 max-w-2xl">
              Generate topic-based 11+ GL style quizzes with instant
              explanations and unique quiz numbers.
            </p>
          </div>
          <Link
            to="/dashboard/quiz"
            className="inline-flex h-12 px-6 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold whitespace-nowrap"
          >
            Open Quiz Section
          </Link>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <div className="matte-card p-6 md:p-10 rounded-[2rem] border border-white/10 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-300/20 text-pink-300 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black">
                  Word of the Day
                </p>
                <p className="text-xs text-white/50">Boost your vocabulary</p>
              </div>
            </div>

            {wordOfDay ? (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                    {wordOfDay.word}
                  </h3>
                  <p className="text-sm text-cyan-200/90 font-medium">
                    {wordOfDay.pronunciation}
                  </p>
                </div>
                <p className="text-white/80 text-lg leading-relaxed">
                  {wordOfDay.meaning}
                </p>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-white/70 italic">
                  "{wordOfDay.exampleSentence}"
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full border border-emerald-300/30 bg-emerald-500/10 text-emerald-200 text-xs font-bold">
                    Synonym: {wordOfDay.synonym}
                  </span>
                  <span className="px-3 py-1 rounded-full border border-rose-300/30 bg-rose-500/10 text-rose-200 text-xs font-bold">
                    Antonym: {wordOfDay.antonym}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-white/50">
                Word of the day is loading. It will appear here shortly.
              </p>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="matte-card p-6 md:p-8 rounded-[2rem] border border-amber-300/25 bg-amber-500/10 h-full">
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200/70 mb-3 font-black">
              Badge Progression
            </p>
            <div className="flex items-center gap-4 mb-4">
              <BadgeMedalSvg
                badgeName={quizSummary?.currentBadge || "Rising Learner"}
                size={72}
              />
              <div>
                <p className="text-sm text-amber-100/70 font-bold uppercase tracking-wider">
                  Current Badge
                </p>
                <p className="text-lg font-black text-amber-50">
                  {quizSummary?.currentBadge || "Rising Learner"}
                </p>
                <p className="text-xs text-amber-100/80 mt-1">
                  Total XP: {quizSummary?.totalXp ?? 0}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {badgeProgress.map((tier) => (
                <div
                  key={tier.badge}
                  className={cn(
                    "rounded-xl border px-3 py-2 flex items-center justify-between gap-3",
                    tier.unlocked
                      ? "border-amber-300/35 bg-amber-500/10"
                      : "border-white/10 bg-black/20",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <BadgeMedalSvg
                      badgeName={tier.badge}
                      unlocked={tier.unlocked}
                      size={40}
                    />
                    <div>
                      <p className="text-sm font-bold text-white">
                        {tier.badge}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-white/50">
                        Unlocks at {tier.minXp} XP
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full border",
                      tier.unlocked
                        ? "text-emerald-200 border-emerald-300/40"
                        : "text-white/50 border-white/20",
                    )}
                  >
                    {tier.unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
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
