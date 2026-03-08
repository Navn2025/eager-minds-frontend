import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import SplitFullscreenMenu from "./SplitFullscreenMenu";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";

export default function FullscreenNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 flex justify-center pointer-events-none">
        <div className={cn(
          "w-full max-w-7xl flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 pointer-events-auto",
          scrolled 
            ? "glass accent-glow" 
            : "bg-transparent"
        )}>
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-black tracking-tighter text-white flex items-center gap-3 group"
          >
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.6)] group-hover:scale-110 transition-transform">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <span className="uppercase tracking-[0.2em] text-[11px] font-bold hidden sm:block">Eager Minds Club</span>
          </Link>

          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: "Home", path: "/" },
              { label: "11+ Prep", path: "/11-plus-prep" },
              { label: "Competitions", path: "/competitions" },
              { label: "Arts & Craft", path: "/arts-craft" },
              { label: "Blog", path: "/blog" }
            ].map((link) => (
              <Link 
                key={link.label} 
                to={link.path}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/dashboard">
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors">
                    <LayoutDashboard size={14} />
                    Dashboard
                  </button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:text-white transition-colors">
                      Admin
                    </button>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors">
                  Login
                </button>
              </Link>
            )}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-accent/10 hover:border-accent/40 transition-all group"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Menu</span>
              <Menu size={16} className="text-accent group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      <SplitFullscreenMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
