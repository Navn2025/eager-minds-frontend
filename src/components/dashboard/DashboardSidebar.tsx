import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  LineChart, 
  BookOpen, 
  Trophy, 
  ShieldCheck, 
  Settings, 
  ChevronRight,
  LogOut,
  X
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: FileText, label: "Worksheets", to: "/dashboard/worksheets" },
  { icon: LineChart, label: "My Progress", to: "/dashboard/progress" },
  { icon: BookOpen, label: "Magazines", to: "/dashboard/magazines" },
  { icon: Trophy, label: "Competitions", to: "/dashboard/competitions" },
  { icon: ShieldCheck, label: "Premium Papers", to: "/dashboard/papers" },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const SidebarContent = (
    <aside className="w-80 border-r border-white/5 bg-surface flex flex-col h-full relative overflow-hidden shrink-0">
      {/* Brand */}
      <div className="p-10 flex items-center justify-between">
        <Link to="/" onClick={onClose} className="text-2xl font-black tracking-tighter text-white flex items-center gap-3 group">
          <img
            src="/whitethemelogo.svg"
            alt="Eager Minds Club logo"
            className="h-12 w-auto max-w-[190px] object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.24)] group-hover:scale-[1.03] transition-transform"
          />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/90 hidden sm:block">
            Eager Minds
          </span>
        </Link>
        <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-grow px-6 overflow-y-auto space-y-8 scrollbar-none">
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Main Menu</p>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-white/[0.03] text-white shadow-xl border border-white/5" 
                    : "text-text-secondary hover:text-white hover:bg-white/[0.01]"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-accent rounded-full shadow-[0_0_15px_var(--color-accent-glow)]" />
                )}
                <div className="flex items-center gap-4">
                  <item.icon size={20} className={cn(isActive ? "text-accent" : "text-white/20 group-hover:text-white/60 transition-colors")} />
                  <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-white/20" />}
              </Link>
            );
          })}
        </div>

        <div className="pt-8 border-t border-white/5 space-y-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">System</p>
          <Link
            to="/dashboard/settings"
            onClick={onClose}
            className={cn(
              "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group",
              location.pathname === "/dashboard/settings" ? "bg-white/[0.03] text-white" : "text-text-secondary hover:text-white"
            )}
          >
            <Settings size={20} className="text-white/20 group-hover:text-white/60" />
            <span className="text-sm font-bold uppercase tracking-widest">Settings</span>
          </Link>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group text-text-secondary hover:text-red-400 hover:bg-red-500/5"
          >
            <LogOut size={20} className="text-white/20 group-hover:text-red-400" />
            <span className="text-sm font-bold uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Membership Card */}
      <div className="p-8">
        <div className="matte-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Status</span>
              <span className="text-[9px] bg-accent/20 text-accent px-3 py-1 rounded-full font-black tracking-widest border border-accent/20">PREMIUM</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-4">Brilliant Mind Node</h4>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div className="bg-accent w-[65%] h-full shadow-[0_0_10px_var(--color-accent-glow)]" />
            </div>
            <p className="text-[9px] text-white/20 font-medium mt-3 uppercase tracking-widest italic">Syncing Progress...</p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full">
        {SidebarContent}
      </div>

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
