import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

const sections = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "subjects", label: "Subjects" },
  { id: "competitions", label: "Competitions" },
  { id: "blog", label: "Blog" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

export default function SectionNavbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const isHome = location.pathname === "/";

  // Scroll Spy Logic
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionElements = sections.map((s) => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    
    if (!isHome) {
      navigate("/");
      // Wait for navigation and then scroll
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[95%] max-w-7xl z-50">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500",
          scrolled 
            ? "bg-[#000d1a]/60 backdrop-blur-2xl border border-blue-500/20 shadow-[0_8px_32px_0_rgba(0,13,26,0.8),0_0_15px_rgba(59,130,246,0.1)]" 
            : "bg-blue-500/5 backdrop-blur-md border border-white/5"
        )}
      >
        <Link 
          to="/" 
          onClick={() => scrollToSection("home")}
          className="text-xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <img
            src="/whitethemelogo.svg"
            alt="Eager Minds Club logo"
            className="h-12 w-auto max-w-[220px] object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.24)]"
          />
          <span className="hidden sm:inline text-sm font-semibold tracking-wide">Eager Minds Club</span>
        </Link>

        {/* Desktop Section Links */}
        <ul className="hidden lg:flex items-center gap-8">
          {sections.map((section) => (
            <li key={section.id} className="relative">
              <button
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 relative py-2",
                  activeSection === section.id 
                    ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                    : "text-white/30 hover:text-white/60 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                )}
              >
                {section.label}
                {activeSection === section.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
             {!isLoggedIn ? (
               <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="h-9 rounded-full px-5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="h-9 rounded-full px-6 text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                    Get Started
                  </Button>
                </Link>
               </>
             ) : (
               <Link to="/dashboard">
                  <Button size="sm" className="h-9 rounded-full px-6 text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                    Dashboard
                  </Button>
               </Link>
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
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-[120%] left-0 right-0 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-4 shadow-2xl"
          >
            <motion.div 
              variants={{
                show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                hide: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              initial="hide"
              animate="show"
              exit="hide"
              className="grid grid-cols-1 gap-2"
            >
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  variants={{
                    show: { opacity: 1, x: 0 },
                    hide: { opacity: 0, x: -10 }
                  }}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.3em] text-left px-6 py-4 rounded-2xl transition-all",
                    activeSection === section.id 
                      ? "bg-white text-black" 
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {section.label}
                </motion.button>
              ))}
            </motion.div>
            <div className="h-px bg-white/5 my-2" />
            <div className="grid grid-cols-1 gap-3">
              {isLoggedIn ? (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full h-12 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px]">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-white/10 text-white font-black uppercase tracking-widest text-[10px]">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full h-12 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px]">
                      Join Now
                    </Button>
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
