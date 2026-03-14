import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  BookOpen,
  FileText,
  Trophy,
  Calendar,
  MessageSquare,
  Mail,
  Star,
  Book,
  House,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  {
    title: "Overview",
    items: [
      { icon: BarChart3, label: "Analytics", to: "/admin" },
      { icon: FileText, label: "Content", to: "/admin/content" },
      { icon: Users, label: "Users", to: "/admin/users" },
      { icon: Mail, label: "Enquiries", to: "/admin/enquiries" },
    ],
  },
  {
    title: "11+ Prep",
    items: [
      { icon: BookOpen, label: "Subjects", to: "/admin/subjects" },
      { icon: FileText, label: "Papers", to: "/admin/papers" },
      { icon: Book, label: "Vocabulary", to: "/admin/vocabulary" },
    ],
  },
  {
    title: "Main Site Features",
    items: [
      { icon: Trophy, label: "Competitions", to: "/admin/competitions" },
      { icon: Star, label: "Arts & Craft", to: "/admin/arts-craft" },
      { icon: Calendar, label: "Activities", to: "/admin/activities" },
      { icon: Calendar, label: "Events", to: "/admin/events" },
      { icon: MessageSquare, label: "Blog", to: "/admin/blog" },
      { icon: BookOpen, label: "Magazines", to: "/admin/magazines" },
      { icon: MessageSquare, label: "FAQs", to: "/admin/faqs" },
      { icon: Star, label: "Testimonials", to: "/admin/testimonials" },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const SidebarContent = (
    <aside className="w-80 border-r border-white/5 bg-surface flex flex-col h-full relative overflow-hidden shrink-0">
      {/* Admin Brand */}
      <div className="p-10 flex items-center justify-between">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-4 group"
        >
          <img
            src="/whitethemelogo.svg"
            alt="Eager Minds Club logo"
            className="h-12 w-auto max-w-[190px] object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.24)] group-hover:scale-[1.03] transition-transform"
          />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/90 hidden sm:block">
            Admin Panel
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Grouped Navigation */}
      <nav className="flex-grow px-6 overflow-y-auto space-y-10 scrollbar-none">
        {navigation.map((group) => (
          <div key={group.title} className="space-y-3">
            <p className="px-5 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  item.to === "/admin"
                    ? location.pathname === "/admin"
                    : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group relative",
                      isActive
                        ? "bg-white/[0.04] text-white shadow-xl border border-white/5"
                        : "text-text-secondary hover:text-white hover:bg-white/[0.01]",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon
                        size={18}
                        className={cn(
                          isActive
                            ? "text-accent"
                            : "text-white/20 group-hover:text-white/60",
                        )}
                      />
                      <span className="text-[11px] font-black uppercase tracking-widest">
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <ChevronRight size={14} className="text-white/20" />
                    )}
                    {isActive && (
                      <div className="absolute left-0 w-1 h-5 bg-accent rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* System Actions */}
      <div className="p-8 border-t border-white/5">
        <div className="space-y-2">
          <Link
            to="/"
            onClick={onClose}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group text-text-secondary hover:text-white hover:bg-white/[0.01]"
          >
            <House
              size={18}
              className="text-white/20 group-hover:text-white/60"
            />
            <span className="text-[11px] font-black uppercase tracking-widest">
              Main Site
            </span>
          </Link>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group text-text-secondary hover:text-red-400 hover:bg-red-500/5"
          >
            <LogOut
              size={18}
              className="text-white/20 group-hover:text-red-400"
            />
            <span className="text-[11px] font-black uppercase tracking-widest">
              Terminate Sync
            </span>
          </button>
        </div>

        <div className="mt-8 bg-white/[0.02] border border-white/5 rounded-2xl p-5 group hover:bg-white/[0.04] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
              Neural Link
            </span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-white uppercase tracking-widest">
            Active • v4.2.0
          </p>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full">{SidebarContent}</div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden w-80"
            >
              {SidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
