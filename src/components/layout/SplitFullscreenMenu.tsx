import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, LogOut, LayoutDashboard, LogIn, Shield } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

interface NavItem {
  id: string;
  label: string;
  path: string;
  description: string;
  previewImages: string[];
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    description: "Welcome to the future of learning and creativity.",
    previewImages: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "about",
    label: "About Us",
    path: "/about",
    description: "Learn about our vision, mission and what we offer.",
    previewImages: [
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "clubs",
    label: "Our Clubs",
    path: "/clubs",
    description: "Explore all the clubs we offer — arts, science, coding and more.",
    previewImages: [
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "workshops",
    label: "Workshops",
    path: "/workshops",
    description: "Upcoming and past workshop events and holiday clubs.",
    previewImages: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "gallery",
    label: "Gallery",
    path: "/gallery",
    description: "Photos and videos from our sessions and events.",
    previewImages: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "word-of-the-day",
    label: "Word of the Day",
    path: "/word-of-the-day",
    description: "Expand your vocabulary with daily word explorations.",
    previewImages: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "11-plus-prep",
    label: "11+ Prep",
    path: "/11-plus-prep",
    description: "Master the 11+ exams with our elite preparation programs.",
    previewImages: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "competitions",
    label: "Competitions",
    path: "/competitions",
    description: "Showcase your talent in national and international challenges.",
    previewImages: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "magazines",
    label: "Magazines",
    path: "/magazines",
    description: "Read our curated collection of educational magazines.",
    previewImages: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "blog",
    label: "Blog",
    path: "/blog",
    description: "Insights, stories, and updates from our community.",
    previewImages: [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "contact",
    label: "Contact Us",
    path: "/contact",
    description: "Get in touch with us — we'd love to hear from you.",
    previewImages: [
      "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "login",
    label: "Login",
    path: "/login",
    description: "Securely access your dashboard and continue your learning journey.",
    previewImages: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621245025737-5847e193fb67?q=80&w=800&auto=format&fit=crop",
    ],
  },
];

interface SplitFullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Static background layout replacing marquee
export default function SplitFullscreenMenu({
  isOpen,
  onClose,
}: SplitFullscreenMenuProps) {
  const [activeItem, setActiveItem] = useState<NavItem>(navItems[0]);
  const { isLoggedIn, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] h-[100dvh] bg-[#0b0b0b] overflow-hidden overscroll-none flex flex-col md:flex-row"
        >
          {/* Close Button Mobile Only */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-[210] md:hidden w-11 h-11 rounded-full border border-white/15 bg-black/35 text-white/65 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Left Panel - Navigation (40%) */}
          <div className="w-full md:w-[40%] xl:w-[35%] h-[100dvh] flex flex-col justify-start px-6 sm:px-8 lg:px-16 pt-12 lg:pt-20 pb-8 border-r border-white/5 bg-[#0b0b0b] overflow-y-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 lg:mb-8 hidden md:block shrink-0">
              Navigation
            </span>
            <nav className="flex flex-col gap-2 lg:gap-3 flex-1 w-full relative min-h-min">
              <div className="flex flex-col gap-2 lg:gap-3 pb-8">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05, duration: 0.5 }}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      onMouseEnter={() => setActiveItem(item)}
                      className={cn(
                        "group relative flex items-center gap-4 transition-all duration-300",
                        "text-[1.5rem] sm:text-[2rem] md:text-[2rem] lg:text-[2.25rem] leading-[1.05] font-bold tracking-tight uppercase",
                        activeItem.id === item.id
                          ? "text-white"
                          : "text-white/45",
                      )}
                    >
                      <motion.span
                        animate={
                          activeItem.id === item.id ? { x: 10 } : { x: 0 }
                        }
                        className={cn(
                          "transition-all duration-500",
                          activeItem.id === item.id
                            ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400"
                            : "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-sky-400",
                        )}
                      >
                        {item.label}
                      </motion.span>
                      {activeItem.id === item.id && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-2 h-2 rounded-full bg-white/80"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile preview block removed for clean aesthetic */}
              </div>

              {/* Auth Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="pt-6 mt-auto border-t border-white/10 flex flex-col gap-4 pb-6"
              >
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={onClose}
                      className="flex items-center gap-3 text-sm font-bold text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em]"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={onClose}
                        className="flex items-center gap-3 text-sm font-bold text-accent hover:text-white transition-colors uppercase tracking-[0.2em]"
                      >
                        <Shield size={18} />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="flex items-center gap-3 text-sm font-bold text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em]"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="flex items-center gap-3 text-sm font-bold text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em]"
                  >
                    <LogIn size={18} />
                    Login
                  </Link>
                )}
              </motion.div>
            </nav>
          </div>

          {/* Right Panel - Content (60%) */}
          <div className="hidden md:flex flex-col flex-1 h-full bg-[#0b0b0b] p-8 lg:p-20 overflow-hidden relative justify-center">
            <div className="w-full max-w-2xl mx-auto space-y-16">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 block">
                    Information
                  </span>
                  <p className="text-[13px] font-bold text-[#8a8a8a] leading-relaxed max-w-sm">
                    {activeItem.description}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 block">
                    Action
                  </span>
                  <Link
                    to={activeItem.path}
                    onClick={onClose}
                    className="text-[12px] font-black uppercase tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 hover:opacity-80 transition-opacity"
                  >
                    Visit {activeItem.label} Focus →
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 block">
                  Featured Content
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {activeItem.previewImages.slice(0, 2).map((img, idx) => (
                    <motion.div
                      key={`${activeItem.id}-${idx}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="relative aspect-[1.5] bg-white/5 border border-white/5 overflow-hidden group rounded-md"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Close Button Desktop */}
            <button
              onClick={onClose}
              className="absolute top-12 right-12 z-[210] text-[#8a8a8a] hover:text-white transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center border border-white/5 rounded-full hover:bg-white/5 transition-all">
                <X size={20} />
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
