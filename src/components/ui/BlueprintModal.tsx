import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Image as ImageIcon } from "lucide-react";
import { Badge } from "./Badge";

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    instructions: string | null;
    images: string[];
  } | null;
}

export default function BlueprintModal({
  isOpen,
  onClose,
  project,
}: BlueprintModalProps) {
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

  if (!project) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[99999] bg-black flex items-center justify-center p-0 md:p-8 overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: -10 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-full md:h-auto md:max-h-[92vh] md:max-w-5xl bg-[#0b0b0b] md:rounded-[2.5rem] overflow-hidden border border-white/5 relative shadow-[0_30px_100px_rgba(236,72,153,0.15)] flex flex-col"
          >
            {/* Header image (if any) */}
            <div className="relative h-56 md:h-80 w-full overflow-hidden bg-white/5 shrink-0">
              {project.images[0] ? (
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon size={64} className="text-white/10" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/50 to-transparent" />

              <button
                onClick={onClose}
                aria-label="Close blueprint preview"
                className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all z-20 group"
              >
                <X
                  size={20}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </div>

            {/* Content Body */}
            <div className="px-6 md:px-12 py-6 md:py-10 overflow-y-auto">
              <Badge className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-pink-300 border border-pink-400/30 font-black uppercase tracking-[0.2em] mb-5 shadow-xl">
                Full Blueprint
              </Badge>

              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
                {project.title}
              </h2>

              <p className="text-white/60 text-base md:text-lg font-medium leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Instructions Box */}
              {project.instructions && (
                <div className="relative p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.02] border border-white/5 overflow-hidden group">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Sparkles size={180} />
                  </div>

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Sparkles size={22} className="text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-black uppercase tracking-[0.28em] text-white/40">
                      Step-by-Step Instructions
                    </span>
                  </div>

                  <p className="text-white/80 leading-relaxed font-medium whitespace-pre-line relative z-10 text-sm md:text-base">
                    {project.instructions}
                  </p>
                </div>
              )}

              {/* Extra Images Gallery */}
              {project.images.length > 1 && (
                <div className="mt-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-5 block">
                    Gallery
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.images.slice(1).map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/5"
                      >
                        <img
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
