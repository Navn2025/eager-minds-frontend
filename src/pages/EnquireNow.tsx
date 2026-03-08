import { useState } from "react";
import api from "../services/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  User,
  ExternalLink,
  Compass,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnquireNow() {
  const [form, setForm] = useState({
    parentName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/enquiries", form);
      setStatus("sent");
      setForm({ parentName: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="page-container pb-40 pt-40 md:pt-52">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24 mt-10 space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          <Compass size={12} className="text-white/60" />
          <span>Consultation Request</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white">
          Let's Discuss <span className="text-white/40">Your Future.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-2xl leading-relaxed">
          Initialize a dialogue with our academic consultants. We facilitate
          elite educational transitions with precision and strategic foresight.
        </p>
      </motion.header>

      <div className="flex flex-col lg:flex-row gap-20">
        <div className="lg:w-1/2 space-y-16">
          <div className="grid grid-cols-1 gap-6">
            {[
              {
                icon: Mail,
                label: "Direct Intelligence",
                value: "eagermindsclub@gmail.com",
                href: "mailto:eagermindsclub@gmail.com",
                desc: "Encrypted correspondence for formal inquiries.",
              },
              {
                icon: Phone,
                label: "Live Community",
                value: "WhatsApp Protocol",
                href: "https://chat.whatsapp.com/EqbfublcAWU2yt8nhskxqq",
                desc: "Real-time updates and peer synchronization.",
                external: true,
              },
            ].map((node, i) => (
              <motion.a
                key={node.label}
                href={node.href}
                target={node.external ? "_blank" : undefined}
                rel={node.external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="group p-10 bg-white/[0.01] border border-white/5 rounded-[2.5rem] hover:bg-white hover:text-black transition-all duration-700"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <node.icon size={24} />
                  </div>
                  {node.external && (
                    <ExternalLink
                      size={16}
                      className="opacity-20 group-hover:opacity-40"
                    />
                  )}
                </div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 group-hover:opacity-60 mb-2">
                  {node.label}
                </h2>
                <p className="text-2xl font-black tracking-tighter mb-4">
                  {node.value}
                </p>
                <p className="text-xs font-medium opacity-20 group-hover:opacity-60 leading-relaxed">
                  {node.desc}
                </p>
              </motion.a>
            ))}
          </div>

          <div className="p-10 rounded-[2.5rem] bg-white text-black overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-10 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              <ShieldCheck size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                Response Protocol
              </h3>
              <p className="text-xl font-bold tracking-tight">
                Our agents respond to all verified inquiries within a 24-hour
                window.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full"
              >
                <Card className="p-16 text-center h-full flex flex-col items-center justify-center bg-white/[0.02] border-white/10 rounded-[3.5rem] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
                  <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                    <CheckCircle2 size={48} strokeWidth={3} />
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tighter mb-6">
                    Transmission Confirmed.
                  </h2>
                  <p className="text-white/40 text-lg font-medium mb-12 leading-relaxed max-w-sm">
                    Your inquiry has been logged into our central repository. A
                    consultant will engage shortly.
                  </p>
                  <Button
                    onClick={() => setStatus("idle")}
                    className="h-14 px-10 rounded-2xl bg-white/5 text-white/40 border-white/5 hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-widest mt-auto shrink-0"
                  >
                    Repeat Transmission
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="relative overflow-hidden rounded-[3.5rem] p-4 bg-white/[0.01] border-white/5">
                  <div className="p-10 space-y-12">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-8 bg-white rounded-full" />
                      <h2 className="text-2xl font-black text-white tracking-tighter italic">
                        Inquiry Matrix
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">
                            Identity
                          </label>
                          <div className="relative group/input">
                            <User
                              className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-white transition-colors"
                              size={18}
                            />
                            <input
                              type="text"
                              value={form.parentName}
                              onChange={set("parentName")}
                              placeholder="Full Name"
                              required
                              className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] text-white placeholder:text-white/10 focus:bg-white focus:text-black transition-all text-sm font-bold outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">
                            Digital Node
                          </label>
                          <div className="relative group/input">
                            <Mail
                              className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-white transition-colors"
                              size={18}
                            />
                            <input
                              type="email"
                              value={form.email}
                              onChange={set("email")}
                              placeholder="parent@example.com"
                              required
                              className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] text-white placeholder:text-white/10 focus:bg-white focus:text-black transition-all text-sm font-bold outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">
                          Voice Protocol (Optional)
                        </label>
                        <div className="relative group/input">
                          <Phone
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-white transition-colors"
                            size={18}
                          />
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={set("phone")}
                            placeholder="+44 7XXX XXXXXX"
                            className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] text-white placeholder:text-white/10 focus:bg-white focus:text-black transition-all text-sm font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">
                          Core Objectives
                        </label>
                        <div className="relative group/input">
                          <MessageSquare
                            className="absolute left-5 top-5 text-white/20 group-focus-within/input:text-white transition-colors"
                            size={18}
                          />
                          <textarea
                            value={form.message}
                            onChange={set("message")}
                            placeholder="Describe your requirements..."
                            rows={5}
                            required
                            className="w-full pl-14 pr-6 py-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] text-white placeholder:text-white/10 focus:bg-white focus:text-black transition-all text-sm font-bold outline-none resize-none"
                          />
                        </div>
                      </div>

                      {status === "error" && (
                        <div className="flex items-center gap-2 justify-center py-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                          <ShieldAlert size={14} className="text-red-500" />
                          <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">
                            Transmission Failure
                          </p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full h-16 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-widest text-[11px] group shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-all"
                      >
                        {status === "sending"
                          ? "Encrypting..."
                          : "Execute Request"}
                        <Send
                          size={16}
                          className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </Button>
                    </form>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
