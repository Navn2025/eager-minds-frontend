import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Trash2,
  Star,
  Quote,
  Activity,
  User as UserIcon,
} from "lucide-react";

export default function AdminTestimonials() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    api
      .get("/testimonials?all=true")
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(fetchData, [fetchData]);

  const toggleApprove = async (id: string, current: boolean) => {
    await api.patch(`/testimonials/${id}`, { approved: !current });
    fetchData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently remove feedback from "${name}"?`)) return;
    await api.delete(`/testimonials/${id}`);
    fetchData();
  };

  const approved = items.filter((t) => t.approved);
  const pending = items.filter((t) => !t.approved);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 md:space-y-12 pb-20"
    >
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-accent">
          <Activity size={12} className="text-accent" />
          <span>Testimonials Management</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9]">
          Platform <br className="sm:hidden" />{" "}
          <span className="text-white/20">Sentiments.</span>
        </h1>
        <p className="text-text-secondary text-base md:text-xl font-medium max-w-xl leading-relaxed">
          Monitor and validate parent impressions to refine the Eager Minds
          resonance.
        </p>
      </header>

      {/* Pending Section */}
      <AnimatePresence>
        {pending.length > 0 && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400/80">
                Awaiting Validation ({pending.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {pending.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="matte-card p-6 md:p-8 border-yellow-500/10 bg-yellow-500/[0.02]"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                          <UserIcon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">
                            {t.parentName}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                className={
                                  i < (t.rating || 0)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-white/10"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 bg-white/5 px-3 py-1 rounded-full ml-auto md:ml-0">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="relative pt-2">
                        <Quote
                          className="absolute -left-2 -top-2 text-yellow-400/10"
                          size={32}
                        />
                        <p className="text-sm md:text-base text-white/70 italic font-medium leading-relaxed pl-4">
                          "{t.content}"
                        </p>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-3 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-white/5">
                      <button
                        onClick={() => toggleApprove(t.id, false)}
                        className="flex-1 md:flex-none h-12 md:px-6 rounded-xl bg-green-500 text-white font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-green-500/10 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.parentName)}
                        className="flex-1 md:flex-none h-12 md:px-6 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/60 font-black uppercase tracking-widest text-[10px] hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} /> Terminate
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Approved Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/40">
            Validated Resonance ({approved.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {approved.map((t, idx) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="matte-card p-6 md:p-8 group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-tight">
                          {t.parentName}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={
                                i < (t.rating || 0)
                                  ? "text-accent fill-accent"
                                  : "text-white/10"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-500/40 bg-green-500/5 px-3 py-1 rounded-full border border-green-500/10 ml-auto md:ml-0">
                        Active Presence
                      </span>
                    </div>

                    <div className="relative pt-2">
                      <Quote
                        className="absolute -left-1 -top-1 text-white/5"
                        size={24}
                      />
                      <p className="text-sm text-white/50 font-medium leading-relaxed pl-4">
                        "{t.content}"
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-3 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleApprove(t.id, true)}
                      className="flex-1 md:flex-none p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-yellow-500 hover:bg-yellow-500/5 hover:border-yellow-500/20 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                      <Clock size={14} /> Revert
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.parentName)}
                      className="flex-1 md:flex-none p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(124,58,237,0.4)]" />
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] animate-pulse">
                Scanning Resonance...
              </p>
            </div>
          ) : (
            approved.length === 0 &&
            pending.length === 0 && (
              <div className="matte-card py-32 text-center space-y-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 text-white/10">
                  <MessageSquare size={48} />
                </div>
                <div className="space-y-3">
                  <p className="text-[12px] text-white/40 font-black uppercase tracking-[0.3em]">
                    No Sentiment detected
                  </p>
                  <p className="text-lg text-white/20 font-medium max-w-sm mx-auto">
                    Database awaiting initial resonance signals.
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </motion.div>
  );
}
