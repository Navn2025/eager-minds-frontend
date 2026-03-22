import { useState } from "react";
import type { FormEvent } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Mail,
  Instagram,
  Facebook,
  Send,
  MapPin,
  CheckCircle,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const socialLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "eagermindsclub@gmail.com",
    href: "mailto:eagermindsclub@gmail.com",
    color: "from-pink-500 to-rose-500",
    glow: "rgba(236,72,153,0.25)",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@eagermindsclub",
    href: "https://www.instagram.com/eagermindsclub",
    color: "from-purple-500 to-violet-600",
    glow: "rgba(139,92,246,0.25)",
  },
  {
    icon: Facebook,
    label: "Facebook",
    value: "Eager Minds Club",
    href: "https://www.facebook.com/share/1Hh1zoJ4r3/",
    color: "from-sky-500 to-blue-600",
    glow: "rgba(14,165,233,0.25)",
  },
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      // Using a simple mailto fallback if no backend endpoint
      const mailtoLink = `mailto:eagermindsclub@gmail.com?subject=Message from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`)}`;
      window.location.href = mailtoLink;
      setSent(true);
    } catch {
      setError("Something went wrong. Please try emailing us directly.");
    } finally {
      setSending(false);
    }
  };

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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-400/20 bg-pink-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-pink-300/70 mb-6">
            <Mail size={12} className="text-pink-400" />
            <span>Get In Touch</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400">
              Us
            </span>
          </h1>
          <p className="text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
            We'd love to hear from you! Whether you have a question, want to join, or just want to say hello.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Social Links */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="space-y-5"
          >
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-6">
              Find Us Online
            </h2>

            {socialLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.2 + i * 0.07}
                className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-2xl group
                  hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shrink-0
                    shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  style={{ boxShadow: `0 4px 20px ${link.glow}` }}
                >
                  <link.icon size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-0.5">
                    {link.label}
                  </p>
                  <p className="text-sm font-bold text-white/80 truncate group-hover:text-white transition-colors">
                    {link.value}
                  </p>
                </div>
              </motion.a>
            ))}

            {/* Location card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.44}
              className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-2xl"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg">
                <MapPin size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-0.5">
                  Location
                </p>
                <p className="text-sm font-bold text-white/80">London, United Kingdom</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Contact Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-sky-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-white/[0.02] border border-white/10 rounded-[2rem] p-8">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-8">
                  Send a Message
                </h2>

                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle size={48} className="text-emerald-400 mb-4" />
                    <h3 className="text-xl font-black text-white mb-2">Message Sent!</h3>
                    <p className="text-white/50 text-sm">
                      Thank you for reaching out. Your email client should have opened — we'll
                      get back to you shortly.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                      className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">
                        Your Name
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Jane Smith"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/20
                          focus:outline-none focus:border-purple-400/50 focus:bg-white/[0.05] transition-all duration-300"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">
                        Email Address
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="e.g. jane@example.com"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/20
                          focus:outline-none focus:border-purple-400/50 focus:bg-white/[0.05] transition-all duration-300"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="What would you like to know?"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/20 resize-none
                          focus:outline-none focus:border-purple-400/50 focus:bg-white/[0.05] transition-all duration-300"
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-xs font-bold">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-white
                        bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600
                        shadow-[0_6px_28px_rgba(168,85,247,0.38)] hover:shadow-[0_8px_36px_rgba(236,72,153,0.40)]
                        disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {sending ? "Opening email..." : "Send Message"}
                      <Send size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
