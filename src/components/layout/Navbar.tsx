import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/11-plus-prep", label: "11+ Prep" },
  { to: "/competitions", label: "Competitions" },
  { to: "/arts-craft", label: "Arts & Craft" },
  { to: "/activities", label: "Activities" },
  { to: "/blog", label: "Blog" },
  { to: "/magazines", label: "Magazines" },
  { to: "/papers-on-demand", label: "Papers" },
  { to: "/enquire", label: "Contact" },
];

export default function Navbar() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[95%] max-w-7xl z-50">
      <div className={cn(
        "flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500",
        scrolled 
          ? "bg-[#000d1a]/60 backdrop-blur-xl border border-blue-500/20 shadow-[0_8px_32px_0_rgba(0,13,26,0.8),0_0_15px_rgba(59,130,246,0.1)]" 
          : "bg-blue-500/5 backdrop-blur-md border border-white/5"
      )}>
        <Link 
          to="/" 
          className="text-xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-black rounded-full" />
          </div>
          <span className="hidden sm:inline">Eager Minds Club</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-[13px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all duration-300"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                 <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="h-9 rounded-full px-4 text-xs font-bold uppercase tracking-widest gap-2 bg-white/5 border border-white/5 hover:bg-white/10">
                    <LayoutDashboard size={14} />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="h-9 rounded-full px-4 text-xs font-bold uppercase tracking-widest border-white/20 hover:border-white">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={logout} 
                  className="w-9 h-9 rounded-full text-white/40 hover:bg-white/10 hover:text-white transition-all"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="h-9 rounded-full px-5 text-[11px] font-bold uppercase tracking-widest border-white/10 hover:border-white transition-all">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="h-9 rounded-full px-6 text-[11px] font-bold uppercase tracking-widest bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-[120%] left-0 right-0 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 flex flex-col gap-4 shadow-2xl"
          >
            <div className="grid grid-cols-1 gap-2">
               {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="h-px bg-white/5 my-2" />
            <div className="grid grid-cols-2 gap-3">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="col-span-2">
                    <Button className="w-full h-11 rounded-xl bg-white text-black font-bold uppercase tracking-widest">Dashboard</Button>
                  </Link>
                  <Button variant="outline" className="col-span-2 h-11 rounded-xl border-white/10 text-white/40 font-bold uppercase tracking-widest" onClick={() => { logout(); setMobileOpen(false); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full h-11 rounded-xl border-white/10 text-white font-bold uppercase tracking-widest">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full h-11 rounded-xl bg-white text-black font-bold uppercase tracking-widest">Join Now</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
