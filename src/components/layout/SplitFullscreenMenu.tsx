import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, ArrowRight, LogOut, LayoutDashboard, LogIn, Shield } from "lucide-react";
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
    previewImages: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop"]
  },
  { 
    id: "11-plus-prep", 
    label: "11+ Prep", 
    path: "/11-plus-prep", 
    description: "Master the 11+ exams with our elite preparation programs.",
    previewImages: ["https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop"]
  },
  { 
    id: "competitions", 
    label: "Competitions", 
    path: "/competitions", 
    description: "Showcase your talent in national and international challenges.",
    previewImages: ["https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop"]
  },
  { 
    id: "arts-craft", 
    label: "Arts & Craft", 
    path: "/arts-craft", 
    description: "Explore the bounds of your imagination through art.",
    previewImages: ["https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=800&auto=format&fit=crop"]
  },
  { 
    id: "activities", 
    label: "Activities", 
    path: "/activities", 
    description: "Discover a world of engaging and educational activities.",
    previewImages: ["https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop"]
  },
  { 
    id: "blog", 
    label: "Blog", 
    path: "/blog", 
    description: "Insights, stories, and updates from our community.",
    previewImages: ["https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=800&auto=format&fit=crop"]
  },
  { 
    id: "magazines", 
    label: "Magazines", 
    path: "/magazines", 
    description: "Read our curated collection of educational magazines.",
    previewImages: ["https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop"]
  },
  { 
    id: "contact", 
    label: "Contact", 
    path: "/enquire", 
    description: "Get in touch with us for more information.",
    previewImages: ["https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=800&auto=format&fit=crop"]
  },
];

interface SplitFullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarqueeColumn = ({ images, reverse = false }: { images: string[], reverse?: boolean }) => {
  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center">
      <motion.div
        animate={{
          y: reverse ? [0, -1000] : [-1000, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col gap-4 py-4"
      >
        {[...images, ...images, ...images].map((img, idx) => (
          <div 
            key={idx} 
            className="w-full aspect-[3/4] rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-white/10"
          >
            <img src={img} alt="Preview" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function SplitFullscreenMenu({ isOpen, onClose }: SplitFullscreenMenuProps) {
  const [activeItem, setActiveItem] = useState<NavItem>(navItems[0]);
  const { isLoggedIn, isAdmin, logout } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-black flex flex-col md:flex-row"
        >
          {/* Close Button Mobile Only */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-[210] md:hidden p-2 text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Left Panel - Navigation (40%) */}
          <div className="w-full md:w-[40%] h-full flex flex-col justify-center px-8 md:px-16 border-r border-blue-900/30 bg-[#000510]">
            <nav className="flex flex-col gap-4 md:gap-6 mt-20 md:mt-0">
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
                      "group relative flex items-center gap-4 transition-all duration-500",
                      "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight uppercase",
                      activeItem.id === item.id ? "text-white" : "text-[#8A8A8A] hover:text-white"
                    )}
                  >
                    <motion.span
                      animate={activeItem.id === item.id ? { x: 10 } : { x: 0 }}
                      className="transition-transform duration-500"
                    >
                      {item.label}
                    </motion.span>
                    {activeItem.id === item.id && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* Auth Section - Mobile */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4"
              >
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={onClose}
                      className="flex items-center gap-3 text-lg font-bold text-white/60 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      <LayoutDashboard size={20} />
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={onClose}
                        className="flex items-center gap-3 text-lg font-bold text-accent hover:text-white transition-colors uppercase tracking-widest"
                      >
                        <Shield size={20} />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="flex items-center gap-3 text-lg font-bold text-white/60 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="flex items-center gap-3 text-lg font-bold text-white/60 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    <LogIn size={20} />
                    Login
                  </Link>
                )}
              </motion.div>
            </nav>
          </div>

          {/* Right Panel - Preview (60%) */}
          <div className="hidden md:flex w-[60%] h-full bg-[#00081a] relative overflow-hidden">
            {/* Background Marquee */}
            <div className="absolute inset-0 grid grid-cols-3 gap-6 px-12 opacity-20 hover:opacity-40 transition-opacity duration-1000 pointer-events-none">
              <MarqueeColumn images={activeItem.previewImages} />
              <MarqueeColumn images={activeItem.previewImages} reverse />
              <MarqueeColumn images={activeItem.previewImages} />
            </div>

            {/* Content Overlay */}
            <motion.div 
              key={activeItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 w-full h-full flex flex-col justify-end p-16 md:p-24"
            >
              <div className="max-w-xl">
                <span className="text-white/40 text-sm font-bold uppercase tracking-[0.3em] mb-4 block">
                  Exploring
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
                  {activeItem.label}
                </h2>
                <p className="text-[#8A8A8A] text-lg md:text-xl max-w-md leading-relaxed mb-8">
                  {activeItem.description}
                </p>
                <Link
                  to={activeItem.path}
                  onClick={onClose}
                  className="inline-flex items-center gap-4 text-white hover:gap-6 transition-all duration-300 font-bold uppercase tracking-widest text-sm"
                >
                  Discover More <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

            {/* Close Button Desktop */}
            <button 
              onClick={onClose}
              className="absolute top-12 right-12 z-[210] group flex items-center gap-4 text-white/60 hover:text-white transition-all"
            >
              <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <X size={20} />
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
