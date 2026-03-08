import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import {
  Users,
  User,
  BookOpen,
  Trophy,
  Mail,
  Plus,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Calendar,
  FileText,
  Shield,
  Cpu,
  Globe,
} from "lucide-react";
import { Button } from "../../components/ui/Button";

interface Stats {
  users: number;
  subjects: number;
  worksheets: number;
  competitions: number;
  events: number;
  blogPosts: number;
  magazines: number;
  papers: number;
  enquiries: number;
  faqs: number;
  testimonials: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentEnquiries, setRecentEnquiries] = useState<
    {
      id: string;
      parentName: string;
      email: string;
      message: string;
      createdAt: string;
    }[]
  >([]);

  useEffect(() => {
    Promise.all([
      api.get("/auth/users"),
      api.get("/prep/subjects"),
      api.get("/competitions"),
      api.get("/events"),
      api.get("/blog?limit=1"),
      api.get("/magazines"),
      api.get("/papers"),
      api.get("/enquiries"),
      api.get("/faqs"),
      api.get("/testimonials?all=true"),
    ])
      .then(
        ([
          users,
          subjects,
          comps,
          events,
          blog,
          mags,
          papers,
          enq,
          faqs,
          test,
        ]) => {
          const usersData = users.data.users || users.data;
          const subjectsData = subjects.data;
          const compsData = comps.data;
          const eventsData = events.data;
          const magsData = mags.data.magazines || mags.data;
          const papersData = papers.data.papers || papers.data;
          const enqData = enq.data.enquiries || enq.data;
          const faqsData = faqs.data;
          const testData = test.data;

          setStats({
            users: users.data.total || usersData.length || 0,
            subjects: subjectsData.length || 0,
            worksheets: (Array.isArray(subjectsData)
              ? subjectsData
              : []
            ).reduce(
              (sum: number, s: { topics?: { worksheets?: unknown[] }[] }) =>
                sum +
                (s.topics?.reduce(
                  (t: number, tp: { worksheets?: unknown[] }) =>
                    t + (tp.worksheets?.length || 0),
                  0,
                ) || 0),
              0,
            ),
            competitions: compsData.length || 0,
            events: eventsData.length || 0,
            blogPosts: blog.data.total || blog.data.posts?.length || 0,
            magazines: mags.data.total || magsData.length || 0,
            papers: papers.data.total || papersData.length || 0,
            enquiries: enq.data.total || enqData.length || 0,
            faqs: faqsData.length || 0,
            testimonials: testData.length || 0,
          });
          setRecentEnquiries((enqData || []).slice(0, 5));
          setLoading(false);
        },
      )
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Neural Nodes",
      count: stats?.users || 0,
      icon: Users,
      color: "accent",
    },
    {
      label: "Active Subjects",
      count: stats?.subjects || 0,
      icon: BookOpen,
      color: "blue",
    },
    {
      label: "Data Sheets",
      count: stats?.worksheets || 0,
      icon: FileText,
      color: "violet",
    },
    {
      label: "Global Contests",
      count: stats?.competitions || 0,
      icon: Trophy,
      color: "emerald",
    },
    {
      label: "Epoch Events",
      count: stats?.events || 0,
      icon: Calendar,
      color: "amber",
    },
    {
      label: "Sync Requests",
      count: stats?.enquiries || 0,
      icon: Mail,
      color: "rose",
    },
  ];

  return (
    <div className="space-y-12 pb-32">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col xl:flex-row xl:items-center justify-between gap-10"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-accent">
            <Shield size={12} className="text-accent" />
            <span>Root Authority Active</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9]">
            System <span className="text-white/20">Control.</span>
          </h1>
          <p className="text-text-secondary text-base md:text-xl font-medium max-w-xl leading-relaxed">
            Manage the Eager Minds Club growth metrics and platform health from
            the control center.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="ghost"
            className="h-14 md:h-16 px-6 md:px-8 rounded-2xl md:rounded-3xl border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all"
          >
            <Plus size={18} className="mr-3" /> Initialize Node
          </Button>
          <Button className="h-14 md:h-16 px-8 md:px-10 rounded-2xl md:rounded-3xl bg-accent text-white font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-[0_0_40px_rgba(124,58,237,0.3)] group">
            <BarChart3 size={18} className="mr-3" /> Core Analytics
          </Button>
        </div>
      </motion.header>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
          >
            <div className="matte-card p-6 md:p-8 flex flex-col items-center text-center group hover:bg-white/[0.02] transition-all">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white/20 mb-6 md:mb-8 border border-white/5 group-hover:scale-110 group-hover:text-accent group-hover:border-accent/40 transition-all">
                <card.icon size={20} strokeWidth={2.5} />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter group-hover:scale-105 transition-transform">
                {card.count}
              </div>
              <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-black leading-tight">
                {card.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        {/* Enquiries Matrix */}
        <div className="lg:col-span-2 matte-card p-0 overflow-hidden">
          <div className="p-6 md:p-10 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 gap-4">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
              Neural Requests
            </h3>
            <Link
              to="/admin/enquiries"
              className="text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:text-white flex items-center gap-2 group transition-all"
            >
              Full Stream{" "}
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          <div className="p-2 md:p-4">
            <div className="overflow-x-auto w-full scrollbar-thin">
              <table className="w-full text-left border-separate border-spacing-y-2 md:border-spacing-y-4 min-w-[600px]">
                <tbody>
                  {recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="group cursor-pointer">
                      <td className="py-4 md:py-6 px-4 md:px-8 bg-white/[0.01] border-y border-l border-white/5 rounded-l-2xl md:rounded-l-3xl group-hover:bg-white/[0.03] transition-all">
                        <div className="flex items-center gap-4 md:gap-6">
                          <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                            <User size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-white uppercase tracking-tight truncate">
                              {enq.parentName}
                            </p>
                            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1 truncate">
                              {enq.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 md:py-6 px-4 md:px-8 bg-white/[0.01] border-y border-white/5 group-hover:bg-white/[0.03] transition-all">
                        <p className="text-xs text-white/40 font-medium truncate max-w-[200px] md:max-w-[300px] italic">
                          "{enq.message}"
                        </p>
                      </td>
                      <td className="py-4 md:py-6 px-4 md:px-8 bg-white/[0.01] border-y border-r border-white/5 rounded-r-2xl md:rounded-r-3xl text-right group-hover:bg-white/[0.03] transition-all">
                        <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/[0.05] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-accent group-hover:border-accent transition-all shadow-xl ml-auto">
                          <ExternalLink size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {recentEnquiries.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-32 text-center flex flex-col items-center gap-8"
                      >
                        <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10">
                          <Mail size={48} />
                        </div>
                        <p className="text-[12px] text-white/20 font-black uppercase tracking-[0.3em]">
                          No active stream detected.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Health & Node Actions */}
        <div className="space-y-10 flex flex-col h-full">
          <div className="matte-card p-10 flex-grow">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white">
                Node Actions
              </h3>
              <Cpu size={24} className="text-accent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "User Node",
                  icon: Users,
                  path: "/admin/users?action=new",
                },
                {
                  label: "Core Subject",
                  icon: BookOpen,
                  path: "/admin/subjects",
                },
                {
                  label: "Asset Upload",
                  icon: Plus,
                  path: "/admin/content#blog",
                },
                { label: "Contest", icon: Trophy, path: "/admin/competitions" },
              ].map((action, i) => (
                <Link key={i} to={action.path} className="group">
                  <div className="flex flex-col gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-accent group transition-all duration-500 relative overflow-hidden h-full">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-black/20 text-white/40 group-hover:text-white transition-all">
                      <action.icon size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white/80">
                      {action.label}
                    </span>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="matte-card overflow-hidden">
            <div className="px-10 py-8 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white">
                  Grid Status: NOMINAL
                </span>
              </div>
              <Globe size={18} className="text-white/20" />
            </div>
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 tracking-widest">
                    Backup Sync
                  </span>
                  <p className="text-sm font-mono text-white/80">
                    {new Date().toISOString().split("T")[0]}
                  </p>
                </div>
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 tracking-widest">
                    Node Load
                  </span>
                  <p className="text-sm font-mono text-white/80 decoration-accent underline underline-offset-4">
                    0.44 ms
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em]">
                  <span className="text-white/40">Core Utilization</span>
                  <span className="text-white/80">68%</span>
                </div>
                <div className="w-full bg-white/[0.02] rounded-full h-3 overflow-hidden border border-white/5 p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "68%" }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="bg-accent h-full rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
