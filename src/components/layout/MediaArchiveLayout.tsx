import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MediaCard } from "../ui/MediaCard";
import { cn } from "../../lib/utils";
import FullscreenNavbar from "./FullscreenNavbar";

const categories = [
  "All",
  "Documentaries",
  "Feature films",
  "Media",
  "History",
  "Current affairs",
  "Religion",
  "Arts"
];

const mockMetadata = {
  location: ["Argentina", "Australia", "Belgium", "Germany", "France", "Italy", "Japan", "Mexico", "Netherlands", "Austria", "Russia", "Switzerland", "Spain", "USA"],
  decade: ["1990", "2010", "2000", "2020"]
};

const mockItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop",
    title: '"The Line": Saudi Arabia\'s City of the Future in NEOM',
    subtitle: "Architecture",
    tags: ["ARCHITECTURE", "DOCUMENTARIES", "FEATURE FILMS"]
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    title: "Path of Blood",
    subtitle: "Documentaries",
    tags: ["DOCUMENTARIES"]
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2184&auto=format&fit=crop",
    title: "The Great Archive",
    subtitle: "History",
    tags: ["HISTORY", "MEDIA"]
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
    title: "Urban Rhythms",
    subtitle: "Arts",
    tags: ["ARTS", "CURRENT AFFAIRS"]
  }
];

export default function MediaArchiveLayout() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Top Navbar */}
      <FullscreenNavbar />

      {/* Main Split Content */}
      <div className="flex flex-col lg:flex-row h-full min-h-screen pt-24 lg:pt-32">
        {/* Left Side: Navigation (40%) */}
        <div className="lg:w-[40%] xl:w-[35%] px-8 lg:px-16 py-12 lg:pt-20 border-r border-white/5">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-12 block">
            Genre
          </span>
          <div className="flex flex-col gap-4 lg:gap-6">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "group relative flex items-center gap-4 transition-all duration-500",
                  "text-[2rem] leading-[0.95] sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight uppercase",
                  activeCategory === cat
                    ? "text-white"
                    : "text-white/45 hover:text-white/85",
                )}
              >
                <motion.span
                  animate={activeCategory === cat ? { x: 10 } : { x: 0 }}
                  className="transition-transform duration-500 text-left"
                >
                  {cat}
                </motion.span>
                {activeCategory === cat && (
                  <motion.div
                    layoutId="categoryIndicator"
                    className="w-2 h-2 rounded-full bg-white/80"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Side: Content (60%) */}
        <div className="lg:flex-1 p-8 lg:p-20 overflow-y-auto">
          {/* Metadata Section */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24 mb-24">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-8 block">
                Location
              </span>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {mockMetadata.location.map(loc => (
                  <span key={loc} className="text-[11px] font-bold text-[#8a8a8a] hover:text-white cursor-pointer transition-colors">
                    {loc}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              {/* Spacer or extra metadata */}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-8 block">
                Decade
              </span>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {mockMetadata.decade.map(dec => (
                  <span key={dec} className="text-[11px] font-bold text-[#8a8a8a] hover:text-white cursor-pointer transition-colors">
                    {dec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Media Grid */}
          <div className="space-y-12">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 block">
                Featured
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <AnimatePresence mode="wait">
                  {mockItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                    >
                      <MediaCard 
                        image={item.image}
                        title={item.title}
                        subtitle={item.subtitle}
                        tags={item.tags}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
