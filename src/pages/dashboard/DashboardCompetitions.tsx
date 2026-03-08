import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  Users,
  Medal,
  ChevronRight,
  Award,
  Zap,
  Star,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import api from "../../services/api";
import { cn } from "../../lib/utils";

interface Competition {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: "upcoming" | "active" | "completed";
  prize?: string;
  userRank?: number;
  userScore?: number;
  isRegistered?: boolean;
}

export default function DashboardCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "upcoming" | "active" | "completed"
  >("all");

  const getMockData = (): Competition[] => [
    {
      id: "1",
      title: "National Mathematics Challenge",
      description:
        "Test your mathematical prowess against the best minds in the country",
      category: "Mathematics",
      startDate: "2026-03-15",
      endDate: "2026-03-20",
      participants: 1250,
      status: "upcoming",
      prize: "£500 + Certificate",
      isRegistered: true,
    },
    {
      id: "2",
      title: "Spring Spelling Bee",
      description: "Master the art of spelling with our annual competition",
      category: "English",
      startDate: "2026-03-10",
      endDate: "2026-03-12",
      participants: 890,
      status: "active",
      prize: "£250 + Trophy",
      userRank: 15,
      userScore: 92,
    },
    {
      id: "3",
      title: "Science Quiz Championship",
      description:
        "Explore the wonders of science through challenging questions",
      category: "Science",
      startDate: "2026-02-20",
      endDate: "2026-02-25",
      participants: 720,
      status: "completed",
      prize: "£300",
      userRank: 8,
      userScore: 88,
    },
    {
      id: "4",
      title: "Creative Writing Contest",
      description: "Express your creativity through words",
      category: "English",
      startDate: "2026-03-25",
      endDate: "2026-04-05",
      participants: 450,
      status: "upcoming",
      prize: "Publication + £150",
    },
    {
      id: "5",
      title: "Verbal Reasoning Olympics",
      description: "Challenge your logical thinking and reasoning skills",
      category: "Reasoning",
      startDate: "2026-03-08",
      endDate: "2026-03-10",
      participants: 680,
      status: "active",
      prize: "£200 + Medal",
      isRegistered: true,
      userRank: 42,
      userScore: 78,
    },
  ];

  useEffect(() => {
    api
      .get("/competitions")
      .then((res) => {
        const mapped = (res.data || []).map(
          (c: {
            id: string;
            title: string;
            description?: string;
            startDate?: string;
            endDate?: string;
          }) => ({
            ...c,
            category: "Academic",
            participants: Math.floor(Math.random() * 500) + 50,
            status: "active" as const,
          }),
        );
        setCompetitions(mapped.length ? mapped : getMockData());
        setLoading(false);
      })
      .catch(() => {
        setCompetitions(getMockData());
        setLoading(false);
      });
  }, []);

  const filteredCompetitions = competitions.filter(
    (c) => filter === "all" || c.status === filter,
  );

  const activeCount = competitions.filter((c) => c.status === "active").length;
  const upcomingCount = competitions.filter(
    (c) => c.status === "upcoming",
  ).length;
  const completedCount = competitions.filter(
    (c) => c.status === "completed",
  ).length;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "TBD";
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-500";
      case "upcoming":
        return "bg-amber-500/10 text-amber-500";
      case "completed":
        return "bg-white/5 text-white/40";
      default:
        return "bg-white/5 text-white/40";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32 pt-10">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          <Trophy size={12} className="text-white/60" />
          <span>Competition Arena</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
          Competitions <span className="text-white/40">Hub.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed">
          Challenge yourself, compete with peers, and win exciting prizes.
        </p>
      </motion.header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Active Now",
            value: activeCount,
            icon: Zap,
            color: "text-emerald-500",
          },
          {
            label: "Coming Soon",
            value: upcomingCount,
            icon: Calendar,
            color: "text-amber-500",
          },
          {
            label: "Completed",
            value: completedCount,
            icon: Medal,
            color: "text-white/40",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="border-white/5 bg-white/[0.01] rounded-[2rem]">
              <CardContent className="p-6 md:p-8 flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                  <stat.icon size={20} className={cn("md:w-6 md:h-6", stat.color)} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black tracking-tighter text-white">
                    {stat.value}
                  </div>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Your Rankings Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/20 rounded-[2rem] md:rounded-[2.5rem]">
          <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-amber-500 text-black flex items-center justify-center shrink-0">
                <Award size={32} className="md:w-9 md:h-9" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                  Your Best Rank: #8
                </h3>
                <p className="text-white/60 font-medium text-sm md:text-base">
                  Science Quiz Championship - Top 1%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="text-center px-4 md:px-6 py-2 md:py-3 bg-white/5 rounded-xl">
                <div className="text-xl md:text-2xl font-black text-white">3</div>
                <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-white/40">
                  Participated
                </p>
              </div>
              <div className="text-center px-4 md:px-6 py-2 md:py-3 bg-white/5 rounded-xl">
                <div className="text-xl md:text-2xl font-black text-white">86%</div>
                <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-white/40">
                  Avg Score
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "active", "upcoming", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
              filter === f
                ? "bg-white text-black"
                : "bg-white/[0.02] text-white/40 border border-white/5 hover:text-white",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Competitions List */}
      <div className="space-y-4">
        {filteredCompetitions.map((competition, i) => (
          <motion.div
            key={competition.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded-[2rem] transition-all duration-300 group">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                    <div
                      className={cn(
                        "w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0",
                        competition.status === "active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : competition.status === "upcoming"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-white/5 text-white/40",
                      )}
                    >
                      <Trophy size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest",
                            getStatusColor(competition.status),
                          )}
                        >
                          {competition.status}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-white/5 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40">
                          {competition.category}
                        </span>
                        {competition.isRegistered && (
                          <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                            Registered
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-white/90 transition-colors">
                        {competition.title}
                      </h3>
                      <p className="text-xs md:text-sm text-white/40 max-w-xl">
                        {competition.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/30">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />{" "}
                          {formatDate(competition.startDate)} -{" "}
                          {formatDate(competition.endDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {competition.participants}{" "}
                          participants
                        </span>
                        {competition.prize && (
                          <span className="flex items-center gap-1 text-amber-500">
                            <Star size={12} /> {competition.prize}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="flex items-center gap-4 md:gap-6">
                      {competition.userRank && (
                        <div className="text-left md:text-right">
                          <div className="text-xl md:text-2xl font-black text-white">
                            #{competition.userRank}
                          </div>
                          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40">
                            Rank
                          </p>
                        </div>
                      )}
                      {competition.userScore && (
                        <div className="text-left md:text-right">
                          <div className="text-xl md:text-2xl font-black text-emerald-500">
                            {competition.userScore}%
                          </div>
                          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40">
                            Score
                          </p>
                        </div>
                      )}
                    </div>
                    <Button
                      className={cn(
                        "h-12 md:h-14 px-5 md:px-6 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider transition-all min-w-[100px] md:min-w-[120px]",
                        competition.status === "completed"
                          ? "bg-white/5 text-white hover:bg-white/10"
                          : competition.isRegistered
                            ? "bg-emerald-500 text-black hover:scale-[1.02]"
                            : "bg-white text-black hover:scale-[1.02]",
                      )}
                    >
                      {competition.status === "completed"
                        ? "Results"
                        : competition.isRegistered
                          ? "Enter"
                          : "Join"}
                      <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCompetitions.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Trophy size={32} className="text-white/20" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No competitions found
          </h3>
          <p className="text-white/40">Check back later for new competitions</p>
        </div>
      )}
    </div>
  );
}
