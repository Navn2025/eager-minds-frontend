import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Clock,
  Flame,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import api from "../../services/api";
import { cn } from "../../lib/utils";

interface ProgressData {
  streakDays: number;
  totalHours: number;
  worksheetsCompleted: number;
  averageScore: number;
  weeklyProgress: { day: string; hours: number; score: number }[];
  subjectProgress: { name: string; progress: number; color: string }[];
  recentActivity: { date: string; activity: string; score?: number }[];
}

export default function DashboardProgress() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/prep/progress")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        // Mock data for demo
        setData({
          streakDays: 12,
          totalHours: 48,
          worksheetsCompleted: 23,
          averageScore: 87,
          weeklyProgress: [
            { day: "Mon", hours: 2.5, score: 85 },
            { day: "Tue", hours: 1.5, score: 90 },
            { day: "Wed", hours: 3, score: 82 },
            { day: "Thu", hours: 2, score: 88 },
            { day: "Fri", hours: 2.5, score: 91 },
            { day: "Sat", hours: 4, score: 85 },
            { day: "Sun", hours: 1, score: 89 },
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
              score: 92,
            },
            {
              date: "Today",
              activity: "Started English Comprehension",
              score: undefined,
            },
            {
              date: "Yesterday",
              activity: "Completed Verbal Reasoning Quiz",
              score: 88,
            },
            {
              date: "Yesterday",
              activity: "Achieved 10-day streak badge",
              score: undefined,
            },
            {
              date: "2 days ago",
              activity: "Completed Non-Verbal Patterns",
              score: 95,
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

  const maxHours = Math.max(...data.weeklyProgress.map((d) => d.hours));

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            value: data.totalHours,
            icon: Clock,
            suffix: "hours",
            color: "text-blue-500",
          },
          {
            label: "Completed",
            value: data.worksheetsCompleted,
            icon: CheckCircle2,
            suffix: "sheets",
            color: "text-emerald-500",
          },
          {
            label: "Avg. Score",
            value: data.averageScore,
            icon: Target,
            suffix: "%",
            color: "text-purple-500",
            highlight: true,
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
                stat.highlight ? "bg-white" : "bg-white/[0.01]",
              )}
            >
              <CardContent className="p-8">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
                    stat.highlight ? "bg-black text-white" : "bg-white/5",
                  )}
                >
                  <stat.icon
                    size={22}
                    className={stat.highlight ? "" : stat.color}
                  />
                </div>
                <div
                  className={cn(
                    "text-4xl font-black tracking-tighter mb-1",
                    stat.highlight ? "text-black" : "text-white",
                  )}
                >
                  {stat.value}
                  <span className="text-lg ml-1">{stat.suffix}</span>
                </div>
                <p
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em]",
                    stat.highlight ? "text-black/40" : "text-white/40",
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
              {data.weeklyProgress.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.hours / maxHours) * 100}%` }}
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
              {data.recentActivity.map((activity, i) => (
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
                      activity.score
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-white/5 text-white/40",
                    )}
                  >
                    {activity.score ? (
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
                      {activity.score && (
                        <span className="text-[10px] font-bold text-emerald-500">
                          {activity.score}%
                        </span>
                      )}
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
            {data.subjectProgress.map((subject, i) => (
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

      {/* Achievement Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-white to-white/90 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
                <Award size={32} className="md:w-9 md:h-9" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-black mb-1">
                  Keep it up!
                </h3>
                <p className="text-black/60 font-medium text-sm md:text-base">
                  You're in the top 15% of learners this week
                </p>
              </div>
            </div>
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-black text-white rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-wider hover:scale-[1.02] transition-transform">
              View Achievements <ArrowUpRight size={16} />
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
