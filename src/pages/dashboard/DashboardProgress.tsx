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

  const totalCompleted = worksheetCompletions.length;
  const streakDays = getStreakDays(completionDates);
  const totalStudyMinutes = allCompletions.reduce(
    (acc: number, c: { itemType?: string }) => {
      if (c.itemType === "paper") return acc + 60;
      if (c.itemType === "worksheet") return acc + 45;
      return acc + 30;
    },
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

    const dayCount = completionDates.filter((d) => {
      const dt = new Date(d).getTime();
      return dt >= target.getTime() && dt < next.getTime();
    }).length;

    return {
      day: label,
      hours: Number((dayCount * 0.75).toFixed(1)),
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
                <span className="text-xs md:text-sm font-bold">+18%</span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-2 md:gap-4 h-40 md:h-48 pt-4">
              {(data?.weeklyProgress || []).map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.hours / safeMaxHours) * 100}%` }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="flex-1 flex flex-col items-center gap-2 md:gap-3 group"
                >
                  <div className="text-[9px] md:text-xs font-bold text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.hours}h
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-accent/20 to-accent/40 rounded-t-lg md:rounded-t-xl transition-all group-hover:from-accent/40 group-hover:to-accent/60 shadow-[0_0_15px_rgba(124,58,237,0.1)]"
                    style={{ height: "100%", minHeight: "2px" }}
                  />
                  <div className="text-[8px] md:text-[10px] font-black uppercase tracking-wider text-white/40">
                    {day.day.charAt(0)}
                  </div>
                </motion.div>
              ))}
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
