import { useState } from "react";
import type { Variants } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { Images, Play, X, ChevronLeft, ChevronRight, Grid3x3 } from "lucide-react";

interface MediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  caption?: string;
}

// Placeholder gallery items — replace with real API / CMS data
const galleryItems: MediaItem[] = [
  {
    id: "1",
    type: "image",
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop",
    caption: "Arts & Craft Session",
  },
  {
    id: "2",
    type: "image",
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
    caption: "Science Experiment Day",
  },
  {
    id: "3",
    type: "image",
    src: "https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?w=800&auto=format&fit=crop",
    caption: "Coding Workshop",
  },
  {
    id: "4",
    type: "image",
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
    caption: "Holiday Club Fun",
  },
  {
    id: "5",
    type: "image",
    src: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=800&auto=format&fit=crop",
    caption: "Group Activity",
  },
  {
    id: "6",
    type: "image",
    src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop",
    caption: "Creative Projects",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");

  const filtered = galleryItems.filter(
    (item) => filter === "all" || item.type === filter
  );

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const next = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));

  return (
    <div className="min-h-screen bg-[#0b0b0b] pt-28 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-400/20 bg-sky-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-sky-300/70 mb-6">
            <Grid3x3 size={12} className="text-sky-400" />
            <span>Gallery</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400">
              Gallery
            </span>
          </h1>
          <p className="text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
            A glimpse into the creativity, laughter and learning happening at Eager Minds Club.
          </p>
        </motion.div>

        {/* Filter buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="flex justify-center mb-10"
        >
          <div className="flex gap-2 bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl">
            {(["all", "image", "video"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 capitalize ${
                  filter === f
                    ? "bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 text-white shadow-[0_4px_20px_rgba(168,85,247,0.3)]"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {f === "image" ? <Images size={13} /> : f === "video" ? <Play size={13} /> : <Grid3x3 size={13} />}
                {f === "all" ? "All" : f === "image" ? "Photos" : "Videos"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.15 + i * 0.05}
              className="break-inside-avoid"
            >
              <button
                onClick={() => openLightbox(i)}
                className="w-full group relative overflow-hidden rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 block"
              >
                {item.type === "video" ? (
                  <div className="relative aspect-video bg-white/5">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.caption}
                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play size={28} className="text-white ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                )}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs font-bold text-white/80">{item.caption}</p>
                  </div>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <Images size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em]">
              No {filter} items yet — check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-11 h-11 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 md:left-8 w-11 h-11 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 md:right-8 w-11 h-11 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-4xl px-16 md:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].caption}
                className="w-full max-h-[75vh] object-contain rounded-2xl"
              />
              {filtered[lightboxIndex].caption && (
                <p className="text-center text-white/50 text-sm mt-4 font-medium">
                  {filtered[lightboxIndex].caption}
                </p>
              )}
            </motion.div>

            <div className="absolute bottom-6 text-white/30 text-[11px] font-bold uppercase tracking-[0.2em]">
              {lightboxIndex + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
