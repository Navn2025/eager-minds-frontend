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
  Image,
  House,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

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
      { icon: Image, label: "Site Images", to: "/admin/content#siteImages" },
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

  const isNavItemActive = (to: string) => {
    const [toPath, hashFragment] = to.split("#");
    const toHash = hashFragment ? `#${hashFragment}` : "";

    if (toPath === "/admin") {
      if (location.pathname !== "/admin") return false;
      return toHash ? location.hash === toHash : true;
    }

    if (!location.pathname.startsWith(toPath)) return false;
    if (toHash) return location.hash === toHash;

    // Keep generic content item inactive when Site Images tab is explicitly selected.
    if (toPath === "/admin/content" && location.hash === "#siteImages") {
      return false;
    }

    return true;
  };

  const SidebarContent = (
    <aside className="w-80 border-r border-white/10 bg-[#0a0713]/95 backdrop-blur-2xl flex flex-col h-full relative overflow-hidden shrink-0">
      {/* Admin Brand */}
      <div className="p-8 flex items-center justify-between">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-4 group"
        >
          <img
            src={logo}
            alt="Eager Minds Club logo"
            className="h-12 w-auto max-w-47.5 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.24)] group-hover:scale-[1.03] transition-transform"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.26em] text-white/80 hidden sm:block">
            Admin Panel
          </span>
        </Link>
        <button
          onClick={onClose}
          title="Close sidebar"
          className="lg:hidden text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Grouped Navigation */}
      <nav className="grow px-5 overflow-y-auto space-y-10 scrollbar-none">
        {navigation.map((group) => (
          <div key={group.title} className="space-y-3">
            <p className="px-5 text-[9px] font-black uppercase tracking-[0.4em] text-white/25">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = isNavItemActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-5 py-4 rounded-[1.4rem] transition-all duration-300 group relative border",
                      isActive
                        ? "bg-white/5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)] border-white/10"
                        : "text-text-secondary border-transparent hover:text-white hover:bg-white/2 hover:border-white/5",
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
      <div className="p-7 border-t border-white/10">
        <div className="space-y-2">
          <Link
            to="/"
            onClick={onClose}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.4rem] transition-all duration-300 group text-text-secondary hover:text-white hover:bg-white/2"
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
            className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.4rem] transition-all duration-300 group text-text-secondary hover:text-red-400 hover:bg-red-500/5"
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

        <div className="mt-8 bg-white/2 border border-white/5 rounded-[1.4rem] p-5 group hover:bg-white/4 transition-all">
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
