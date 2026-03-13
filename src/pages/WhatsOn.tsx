import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { Calendar, Clock, ExternalLink, Sparkles, Box } from "lucide-react";
import { Card } from "../components/ui/Card";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  bookingLink: string | null;
}

export default function WhatsOn() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/events?upcoming=true")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-container pb-40 pt-40 md:pt-52">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24 mt-10 space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/20 bg-sky-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-sky-300/70">
          <Calendar size={12} className="text-sky-400" />
          <span>Event Timeline</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white">
          Upcoming <span className="text-gradient">Events.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-2xl leading-relaxed">
          The central schedule for workshops, academic sessions, and innovative
          workshops. Synchronize your intellectual calendar with our upcoming
          nodes.
        </p>
      </motion.header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-[3.5rem] bg-white/[0.01] border border-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full bg-white/[0.01] border-white/5 rounded-[3.5rem] p-4 group transition-all duration-700 hover:bg-white/[0.02] hover:border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:rotate-12 transition-transform duration-1000">
                  <Clock size={100} />
                </div>

                <div className="p-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_4px_12px_rgba(168,85,247,0.3)]">
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <h3 className="text-3xl font-black text-white tracking-tighter mb-6 group-hover:translate-x-1 transition-transform">
                    {event.title}
                  </h3>

                  <p className="text-white/40 font-medium leading-relaxed mb-12 flex-1">
                    {event.description}
                  </p>

                  <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                    {event.bookingLink ? (
                      <a
                        href={event.bookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-14 px-8 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black uppercase tracking-widest text-[10px] shadow-[0_4px_16px_rgba(168,85,247,0.30)] hover:scale-105 transition-all flex items-center gap-2 border-none"
                      >
                        Secure Entry
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/10 italic">
                        Consultation Pending
                      </div>
                    )}
                    <Sparkles
                      size={16}
                      className="text-white/5 group-hover:text-white/20 transition-colors"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-40 border border-dashed border-white/5 rounded-[4rem] bg-white/[0.01] text-center">
          <div className="relative mb-8">
            <Box size={64} className="text-white/5" />
            <Sparkles
              className="absolute -top-2 -right-2 text-white/20"
              size={24}
            />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            Schedule Empty
          </h1>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            No upcoming events identifyed in the current cycle.
          </p>
        </div>
      )}
    </div>
  );
}
