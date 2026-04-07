import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  TrendingUp,
  Calendar,
  Clock,
  Flame,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import api from "../../services/api";
import { cn } from "../../lib/utils";

interface ProgressData {
  streakDays: number;
  totalStudyMinutes: number;
  studyTimeLabel: string;
  worksheetsCompleted: number;
  weeklyProgress: { day: string; hours: number }[];
  subjectProgress: { name: string; progress: number; color: string }[];
  recentActivity: { date: string; activity: string; itemType: string }[];
}

const progressPalette = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-cyan-500",
];

function getStreakDays(dateStrings: string[]): number {
  const uniqueDays = Array.from(
    new Set(dateStrings.map((d) => new Date(d).toDateString())),
  );

  const daySet = new Set(uniqueDays);
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (daySet.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function formatStudyTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function dayKeyFromDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDailyStudyMinutes(
  completions: { completedAt?: string }[],
): Map<string, number> {
  const byDay = new Map<string, number[]>();

  for (const c of completions) {
    const ts = c.completedAt ? new Date(c.completedAt).getTime() : NaN;
    if (Number.isNaN(ts)) continue;
    const key = dayKeyFromDate(new Date(ts));
    const bucket = byDay.get(key) || [];
    bucket.push(ts);
    byDay.set(key, bucket);
  }

  const dayMinutes = new Map<string, number>();

  byDay.forEach((times, key) => {
    times.sort((a, b) => a - b);

    if (times.length === 1) {
      dayMinutes.set(key, 20);
      return;
    }

    let total = 0;
    for (let i = 1; i < times.length; i += 1) {
      const gap = Math.round((times[i] - times[i - 1]) / 60000);
      if (gap > 0) {
        total += Math.min(gap, 120);
      }
    }

    dayMinutes.set(key, Math.max(total, 20));
  });

  return dayMinutes;
}

function normalizeProgressData(raw: any): ProgressData {
  const allCompletions = Array.isArray(raw?.completions) ? raw.completions : [];
  const worksheetCompletions = Array.isArray(raw?.completions)
    ? raw.completions.filter(
        (c: { itemType?: string }) => c.itemType === "worksheet",
      )
    : [];

  const completionDates = worksheetCompletions
    .map((c: { completedAt?: string }) => c.completedAt)
    .filter(Boolean) as string[];

  const dailyStudyMinutes = getDailyStudyMinutes(allCompletions);

  const totalCompleted = worksheetCompletions.length;
  const streakDays = getStreakDays(completionDates);
  const totalStudyMinutes = Array.from(dailyStudyMinutes.values()).reduce(
    (acc, mins) => acc + mins,
    0,
  );
  const studyTimeLabel = formatStudyTime(totalStudyMinutes);

  const progressList = Array.isArray(raw?.progress) ? raw.progress : [];

  const subjectProgress = progressList.map(
    (p: { subjectName?: string; percentage?: number }, i: number) => ({
      name: p.subjectName || `Subject ${i + 1}`,
      progress: p.percentage || 0,
      color: progressPalette[i % progressPalette.length],
    }),
  );

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const now = new Date();
  const weeklyProgress = dayLabels.map((label, offset) => {
    const target = new Date(now);
    target.setDate(now.getDate() - (6 - offset));
    target.setHours(0, 0, 0, 0);

    const next = new Date(target);
    next.setDate(target.getDate() + 1);

    const key = dayKeyFromDate(target);
    const dayMinutes = dailyStudyMinutes.get(key) || 0;

    return {
      day: label,
      hours: Number((dayMinutes / 60).toFixed(1)),
    };
  });

  const recentActivity = worksheetCompletions
    .slice(0, 8)
    .map((c: { completedAt?: string; itemId?: string; itemType?: string }) => {
      const when = c.completedAt ? new Date(c.completedAt) : new Date();
      const dayText = when.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
      return {
        date: dayText,
        activity: `Completed worksheet ${c.itemId?.slice(0, 8) || ""}`,
        itemType: c.itemType || "worksheet",
      };
    });

  return {
    streakDays,
    totalStudyMinutes,
    studyTimeLabel,
    worksheetsCompleted: totalCompleted,
    weeklyProgress,
    subjectProgress,
    recentActivity,
  };
}

export default function DashboardProgress() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/prep/dashboard")
      .then((res) => {
        setData(normalizeProgressData(res.data));
        setLoading(false);
      })
      .catch(() => {
        // Mock data for demo
        setData({
          streakDays: 12,
          totalStudyMinutes: 48 * 60,
          studyTimeLabel: "48h",
          worksheetsCompleted: 23,
          weeklyProgress: [
            { day: "Mon", hours: 2.5 },
            { day: "Tue", hours: 1.5 },
            { day: "Wed", hours: 3 },
            { day: "Thu", hours: 2 },
            { day: "Fri", hours: 2.5 },
            { day: "Sat", hours: 4 },
            { day: "Sun", hours: 1 },
          ],
          subjectProgress: [
            { name: "Mathematics", progress: 78, color: "bg-blue-500" },
            { name: "English", progress: 92, color: "bg-emerald-500" },
            { name: "Verbal Reasoning", progress: 65, color: "bg-amber-500" },
            {
              name: "Non-Verbal Reasoning",
              progress: 84,
              color: "bg-purple-500",
            },
          ],
          recentActivity: [
            {
              date: "Today",
              activity: "Completed Mathematics Paper A",
              itemType: "worksheet",
            },
            {
              date: "Today",
              activity: "Started English Comprehension",
              itemType: "worksheet",
            },
            {
              date: "Yesterday",
              activity: "Completed Verbal Reasoning Quiz",
              itemType: "worksheet",
            },
            {
              date: "Yesterday",
              activity: "Achieved 10-day streak badge",
              itemType: "worksheet",
            },
            {
              date: "2 days ago",
              activity: "Completed Non-Verbal Patterns",
              itemType: "worksheet",
            },
          ],
        });
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const maxHours =
    data && data.weeklyProgress
      ? Math.max(...(data?.weeklyProgress || []).map((d) => d.hours))
      : 0;
  const safeMaxHours = Math.max(maxHours, 1);
  const weeklyHoursTotal = data.weeklyProgress.reduce(
    (acc, day) => acc + day.hours,
    0,
  );
  const activeDays = data.weeklyProgress.filter((day) => day.hours > 0).length;

  return (
    <div className="space-y-12 pb-32 pt-10">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          <LineChart size={12} className="text-white/60" />
          <span>Analytics</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
          Your <span className="text-white/40">Progress.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed">
          Track your learning journey with detailed analytics and insights.
        </p>
      </motion.header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            label: "Day Streak",
            value: data.streakDays,
            icon: Flame,
            suffix: "days",
            color: "text-orange-500",
          },
          {
            label: "Study Time",
            value: data.studyTimeLabel,
            icon: Clock,
            suffix: "",
            color: "text-blue-500",
          },
          {
            label: "Completed",
            value: data.worksheetsCompleted,
            icon: CheckCircle2,
            suffix: "sheets",
            color: "text-emerald-500",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card
              className={cn(
                "border-white/5 rounded-[2rem] h-full transition-all",
                "bg-white/[0.01]",
              )}
            >
              <CardContent className="p-8">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
                    "bg-white/5",
                  )}
                >
                  <stat.icon size={22} className={stat.color} />
                </div>
                <div
                  className={cn(
                    "text-4xl font-black tracking-tighter mb-1",
                    "text-white",
                  )}
                >
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-lg ml-1">{stat.suffix}</span>
                  )}
                </div>
                <p
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em]",
                    "text-white/40",
                  )}
                >
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <Card className="lg:col-span-2 border-white/5 bg-white/[0.01] rounded-[2rem] md:rounded-[2.5rem]">
          <CardContent className="p-6 md:p-10">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                  Weekly Activity
                </h3>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Hours studied per day
                </p>
              </div>
              <div className="flex items-center gap-1 md:gap-2 text-emerald-500">
                <TrendingUp size={16} className="md:w-[18px]" />
                <span className="text-xs md:text-sm font-bold">
                  {weeklyHoursTotal.toFixed(1)}h total
                </span>
              </div>
            </div>
            <div className="mb-4 text-[10px] uppercase tracking-[0.2em] text-white/35 font-black">
              Active days: {activeDays}/7
            </div>

            <div className="relative h-56 rounded-2xl border border-white/5 bg-black/20 p-4 md:p-6">
              <div className="absolute left-4 right-4 md:left-6 md:right-6 border-t border-white/10 bottom-1/4" />
              <div className="absolute left-4 right-4 md:left-6 md:right-6 border-t border-white/10 bottom-1/2" />
              <div className="absolute left-4 right-4 md:left-6 md:right-6 border-t border-white/10 bottom-3/4" />
              <div className="absolute left-4 right-4 md:left-6 md:right-6 border-t border-white/10 top-6" />

              <div className="absolute left-4 md:left-6 top-6 bottom-12 md:bottom-14 flex flex-col justify-between text-[10px] text-white/35 font-bold">
                <span>{safeMaxHours.toFixed(1)}h</span>
                <span>{(safeMaxHours * 0.5).toFixed(1)}h</span>
                <span>0h</span>
              </div>

              <div className="absolute left-14 right-4 md:left-20 md:right-6 top-6 bottom-12 md:bottom-14 flex items-end justify-between gap-2 md:gap-4">
                {data.weeklyProgress.map((day, i) => {
                  const heightPct = Math.max(
                    0,
                    Math.round((day.hours / safeMaxHours) * 100),
                  );

                  return (
                    <div
                      key={day.day}
                      className="h-full flex-1 flex flex-col items-center justify-end gap-2"
                    >
                      <div className="text-[10px] text-white/60 font-bold">
                        {day.hours > 0 ? `${day.hours}h` : "-"}
                      </div>
                      <div className="relative w-full max-w-10 h-full flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPct}%` }}
                          transition={{ delay: 0.08 * i, duration: 0.55 }}
                          className="w-full rounded-t-xl bg-gradient-to-t from-accent/40 via-accent/70 to-cyan-300/80 shadow-[0_0_18px_rgba(124,58,237,0.35)]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute left-14 right-4 md:left-20 md:right-6 bottom-4 flex justify-between gap-2 md:gap-4">
                {data.weeklyProgress.map((day) => (
                  <div
                    key={`${day.day}-label`}
                    className="flex-1 text-center text-[10px] font-black uppercase tracking-widest text-white/45"
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-white/5 bg-white/[0.01] rounded-[2rem] md:rounded-[2.5rem]">
          <CardContent className="p-6 md:p-10">
            <h3 className="text-xl font-black text-white mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {(data?.recentActivity || []).map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      activity.itemType === "worksheet"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-white/5 text-white/40",
                    )}
                  >
                    {activity.itemType === "worksheet" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Calendar size={18} />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {activity.activity}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase text-white/40">
                        {activity.date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Mastery */}
      <Card className="border-white/5 bg-white/[0.01] rounded-[2rem] md:rounded-[2.5rem]">
        <CardContent className="p-6 md:p-10">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                Subject Mastery
              </h3>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">
                Overall progress across all subjects
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white text-black flex items-center justify-center">
              <BookOpen size={20} className="md:w-[22px]" />
            </div>
          </div>
          <div className="space-y-8">
            {(data?.subjectProgress || []).map((subject, i) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">
                    {subject.name}
                  </span>
                  <span className="text-sm font-black text-white">
                    {subject.progress}%
                  </span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ delay: 0.2 + 0.1 * i, duration: 0.8 }}
                    className={cn("h-full rounded-full", subject.color)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
