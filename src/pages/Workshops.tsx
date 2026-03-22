import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,

  ArrowRight,
  Sparkles,
} from "lucide-react";

interface WorkshopFlyer {
  id: string;
  title: string;
  month: string; // e.g. "March 2025"
  description: string;
  flyerImage?: string;
  googleFormLink?: string;
  date?: string;
  time?: string;
  location?: string;
  isPast?: boolean;
}

// Sample data — swap with API / CMS in production
const workshops: WorkshopFlyer[] = [
  {
    id: "spring-2025",
    title: "Spring Creativity Workshop",
    month: "April 2025",
    description:
      "A fun-filled day of art, science and coding activities for children aged 6–12. Explore different creative mediums and go home with your own masterpiece!",
    flyerImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop",
    googleFormLink: "https://forms.google.com",
    date: "12 April 2025",
    time: "10:00 AM – 3:00 PM",
    location: "Eager Minds Hub, London",
    isPast: false,
  },
  {
    id: "easter-2025",
    title: "Easter Holiday Club",
    month: "March 2025",
    description:
      "Our popular Easter Holiday Club is back! Packed with themed activities, games, and creative workshops across the school holidays.",
    flyerImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop",
    date: "7–11 April 2025",
    time: "9:00 AM – 4:00 PM",
    location: "Eager Minds Hub, London",
    isPast: false,
  },
  {
    id: "winter-2024",
    title: "Winter STEM Challenge",
    month: "December 2024",
    description:
      "Children designed and built their own winter-themed STEM challenges including bridge building, paper rockets, and circuit art projects.",
    flyerImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
    isPast: true,
  },
  {
    id: "autumn-2024",
    title: "Autumn Arts Weekend",
    month: "October 2024",
    description:
      "A weekend celebration of all things creative — from watercolour painting to digital art and clay sculpting.",
    isPast: true,
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

function WorkshopCard({ workshop, index }: { workshop: WorkshopFlyer; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={0.15 + index * 0.07}
      className={`group relative bg-white/[0.02] border rounded-2xl overflow-hidden transition-all duration-300 ${
        workshop.isPast
          ? "border-white/5 opacity-70"
          : "border-purple-400/20 hover:border-purple-400/40"
      }`}
    >
      {!workshop.isPast && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_4px_12px_rgba(168,85,247,0.4)]">
            <Sparkles size={10} />
            Upcoming
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Flyer Image */}
        {workshop.flyerImage && (
          <div className="md:w-56 shrink-0 aspect-[3/2] md:aspect-auto overflow-hidden">
            <img
              src={workshop.flyerImage}
              alt={workshop.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                workshop.isPast ? "grayscale" : ""
              }`}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-7">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">
            {workshop.month}
          </p>
          <h3 className="text-xl font-black text-white mb-3">{workshop.title}</h3>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mb-4">
            {workshop.date && (
              <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                <CalendarDays size={13} className="text-purple-400" />
                {workshop.date}
              </div>
            )}
            {workshop.time && (
              <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                <Clock size={13} className="text-sky-400" />
                {workshop.time}
              </div>
            )}
          </div>

          <p className="text-sm text-white/50 leading-relaxed mb-4">{workshop.description}</p>

          <div className="flex flex-wrap items-center gap-3">
            {workshop.googleFormLink && !workshop.isPast && (
              <a
                href={workshop.googleFormLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-[0.15em] text-white
                  bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600
                  shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_6px_24px_rgba(236,72,153,0.4)]
                  transition-all duration-300"
              >
                Register Now <ExternalLink size={13} />
              </a>
            )}
            {!workshop.flyerImage && (
              <button
                onClick={() => setExpanded((p) => !p)}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 hover:text-white/70 transition-colors"
              >
                {expanded ? "Less" : "More info"}
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            )}
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className="pt-4 border-t border-white/5 text-sm text-white/40">
                  <p>Venue: {workshop.location || "TBC"}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function Workshops() {
  const upcoming = workshops.filter((w) => !w.isPast);
  const past = workshops.filter((w) => w.isPast);

  return (
    <div className="min-h-screen bg-[#0b0b0b] pt-28 pb-24">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-400/20 bg-purple-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-purple-300/70 mb-6">
            <CalendarDays size={12} className="text-purple-400" />
            <span>Workshops</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
            Workshops &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400">
              Events
            </span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Join our upcoming workshops and holiday clubs — hands-on, creative, and unforgettable.
          </p>
        </motion.div>

        {/* Upcoming */}
        <div className="mb-16">
          <div className="flex items-center gap-5 mb-8">
            <h2 className="text-lg font-black text-white uppercase tracking-tight">
              Upcoming Workshops
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-400/25 to-transparent" />
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
              <CalendarDays size={40} className="mx-auto text-white/10 mb-4" />
              <p className="text-white/25 text-[11px] font-black uppercase tracking-[0.3em]">
                No upcoming workshops — check back soon!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {upcoming.map((w, i) => (
                <WorkshopCard key={w.id} workshop={w} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Registration CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="mb-16 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-sky-500/10 border border-purple-400/20 rounded-2xl p-8 text-center"
        >
          <h3 className="text-xl font-black text-white mb-3">Want to Register for a Workshop?</h3>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            Fill in our registration form to express your interest and we'll reach out with availability.
          </p>
          <a
            href="https://forms.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white
              bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600
              shadow-[0_6px_28px_rgba(168,85,247,0.38)] hover:shadow-[0_8px_36px_rgba(236,72,153,0.40)]
              transition-all duration-300"
          >
            Register Interest <ArrowRight size={16} />
          </a>
        </motion.div>

        {/* Past Workshops */}
        {past.length > 0 && (
          <div>
            <div className="flex items-center gap-5 mb-8">
              <h2 className="text-lg font-black text-white/40 uppercase tracking-tight">
                Past Workshops
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="flex flex-col gap-5">
              {past.map((w, i) => (
                <WorkshopCard key={w.id} workshop={w} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
