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
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-5 flex justify-center pointer-events-none">
        <div
          className={cn(
            "w-full max-w-7xl flex items-center justify-between px-5 py-2.5 rounded-2xl transition-all duration-500 pointer-events-auto",
            scrolled
              ? "bg-[#07050F]/75 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(168,85,247,0.12)]"
              : "bg-transparent",
          )}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div
              className="flex items-center justify-center rounded-full w-14 h-14
              bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-sky-500/20
              border-2 border-purple-400/30
              shadow-[0_4px_20px_rgba(168,85,247,0.25),0_0_0_4px_rgba(168,85,247,0.05)]
              group-hover:border-pink-400/50 group-hover:shadow-[0_4px_28px_rgba(236,72,153,0.32),0_0_0_6px_rgba(236,72,153,0.07)]
              transition-all duration-300 overflow-hidden"
            >
              <img
                src="/whitethemelogo.svg"
                alt="Eager Minds Club logo"
                className="h-9 w-9 object-contain
                  drop-shadow-[0_0_10px_rgba(168,85,247,0.55)]
                  group-hover:scale-[1.08] transition-transform duration-300"
              />
            </div>
            <span className="hidden sm:block text-[12px] md:text-[13px] font-extrabold uppercase tracking-[0.18em] text-white/90 leading-none pt-[1px]">
              Eager Minds Club
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-6">
            {[
              { label: "Home", path: "/" },
              { label: "About Us", path: "/about" },
              { label: "Our Clubs", path: "/clubs" },
              { label: "Workshops", path: "/workshops" },
              { label: "Gallery", path: "/gallery" },
              { label: "11+ Prep", path: "/11-plus-prep" },
              { label: "Blog", path: "/blog" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 hover:text-white/90 transition-colors duration-200 relative group"
              >
                {link.label}
                {/* gradient underline on hover */}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-[1.5px] rounded-full
                  bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400
                  transition-all duration-300 group-hover:w-full"
                />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/dashboard">
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 hover:text-white/90 transition-colors">
                    <LayoutDashboard size={14} />
                    Dashboard
                  </button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <button className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-400 hover:text-white transition-colors">
                      Admin
                    </button>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 hover:text-white/90 transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <button className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 hover:text-white/90 transition-colors">
                  Login
                </button>
              </Link>
            )}

            {/* Menu button — brand gradient on hover */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl
                bg-white/[0.04] border border-white/10
                hover:bg-gradient-to-r hover:from-pink-500/15 hover:to-purple-500/15
                hover:border-purple-400/35
                transition-all duration-300 group"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                Menu
              </span>
              <Menu
                size={15}
                className="text-purple-400 group-hover:text-pink-400 group-hover:rotate-90 transition-all duration-300"
              />
            </button>
          </div>
        </div>
      </nav>

      <SplitFullscreenMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
