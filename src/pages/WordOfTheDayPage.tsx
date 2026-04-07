import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import api from "../services/api";
import { cn } from "../lib/utils";

interface WordData {
  id?: string;
  word: string;
  meaning: string;
  date?: string;
  pronunciation?: string;
  synonym?: string;
  antonym?: string;
  exampleSentence?: string;
  createdAt?: string;
}

export default function WordOfTheDayPage() {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [pastWords, setPastWords] = useState<WordData[]>([]);
  const [activeTab, setActiveTab] = useState<"today" | "archive">("today");
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/prep/word-of-the-day");
        if (res.data) setWordData(res.data);
      } catch {
        // fallback: show placeholder
        setWordData({
          word: "Perseverance",
          pronunciation: "pər-sev-ər-əns",
          meaning:
            "Continued effort to do or achieve something despite difficulty, failure, or opposition.",
          synonym: "Tenacity, Determination, Resilience",
          antonym: "Surrender, Laziness",
          exampleSentence:
            "Her perseverance in learning new skills every day made her stand out.",
        });
      }
      try {
        const archiveRes = await api.get("/prep/word-of-the-day/archive");
        if (Array.isArray(archiveRes.data)) setPastWords(archiveRes.data);
      } catch {
        // archive not available yet — no-op
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (
      !wordData?.word ||
      isMuted ||
      isSpeaking ||
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(wordData.word);
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.lang = "en-GB";

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    synth.speak(utterance);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (
        next &&
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      return next;
    });
  };

  const synonyms = wordData?.synonym
    ? wordData.synonym
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const antonyms = wordData?.antonym
    ? wordData.antonym
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-400/20 bg-purple-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-purple-300/70 mb-6">
            <Sparkles size={12} className="animate-pulse text-purple-400" />
            <span>Vocabulary Builder</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4">
            Word of the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400">
              Day
            </span>
          </h1>
          <p className="text-white/50 text-lg">
            Expand your vocabulary every day with our highlighted words.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-start mb-10">
          <div className="flex gap-2 bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl">
            {[
              { key: "today", label: "Today's Word", icon: Sparkles },
              { key: "archive", label: "Previous Words", icon: BookOpen },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as "today" | "archive")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  activeTab === key
                    ? "bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 text-white shadow-[0_4px_20px_rgba(168,85,247,0.3)]"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Today's Word */}
        {activeTab === "today" && wordData && (
          <motion.div
            key="today"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Word Card */}
            <div className="relative group mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20 rounded-[3rem] blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
              <div className="relative bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 md:p-14 text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Word + Speaker */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6 relative z-10">
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic">
                    {wordData.word}
                  </h2>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{
                        scale: isMuted || isSpeaking ? 1 : 1.1,
                        rotate: isMuted || isSpeaking ? 0 : 5,
                      }}
                      whileTap={{ scale: isMuted || isSpeaking ? 1 : 0.92 }}
                      onClick={handleSpeak}
                      disabled={isMuted || isSpeaking}
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center transition-all",
                        isMuted || isSpeaking
                          ? "bg-white/[0.08] text-white/40 cursor-not-allowed"
                          : "bg-gradient-to-br from-pink-500 to-purple-600 shadow-[0_4px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_6px_28px_rgba(236,72,153,0.5)]",
                      )}
                      title={
                        isMuted
                          ? "Unmute to hear pronunciation"
                          : isSpeaking
                            ? "Speaking..."
                            : "Hear pronunciation"
                      }
                    >
                      <Volume2 size={24} className="text-white" />
                    </motion.button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className={cn(
                        "w-12 h-12 rounded-xl border border-white/15 flex items-center justify-center transition-colors",
                        isMuted
                          ? "bg-white/10 text-white"
                          : "bg-white/[0.02] text-white/70 hover:text-white hover:bg-white/[0.08]",
                      )}
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  </div>
                </div>

                {/* Definition + Example Grid */}
                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-left hover:border-purple-400/30 hover:bg-purple-500/5 transition-all duration-500 group/card">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover/card:text-white/60 transition-colors">
                        Meaning
                      </span>
                    </div>
                    <p className="text-lg text-white/70 leading-relaxed font-medium group-hover/card:text-white/90 transition-colors">
                      {wordData.meaning}
                    </p>
                  </div>

                  {wordData.exampleSentence && (
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-left hover:border-sky-400/30 hover:bg-sky-500/5 transition-all duration-500 group/card">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover/card:text-white/60 transition-colors">
                          Example
                        </span>
                      </div>
                      <p className="text-lg text-white/70 leading-relaxed font-medium italic group-hover/card:text-white/90 transition-colors">
                        "{wordData.exampleSentence}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Synonyms / Antonyms */}
                {(synonyms.length > 0 || antonyms.length > 0) && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-4 relative z-10">
                    {synonyms.length > 0 && (
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                          Synonyms:
                        </span>
                        {synonyms.slice(0, 4).map((syn) => (
                          <span
                            key={syn}
                            className="px-4 py-1.5 rounded-lg bg-purple-500/10 border border-purple-400/20 text-[10px] font-bold uppercase tracking-widest text-purple-300"
                          >
                            {syn}
                          </span>
                        ))}
                      </div>
                    )}
                    {antonyms.length > 0 && (
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                          Antonyms:
                        </span>
                        {antonyms.slice(0, 3).map((ant) => (
                          <span
                            key={ant}
                            className="px-4 py-1.5 rounded-lg bg-pink-500/10 border border-pink-400/20 text-[10px] font-bold uppercase tracking-widest text-pink-300"
                          >
                            {ant}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Switch to archive nudge */}
            <div className="text-center">
              <button
                onClick={() => setActiveTab("archive")}
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors"
              >
                View previous words <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Archive tab */}
        {activeTab === "archive" && (
          <motion.div
            key="archive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {pastWords.length === 0 ? (
              <div className="text-left py-24">
                <BookOpen size={48} className="mx-auto text-white/10 mb-6" />
                <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em]">
                  Previous words will appear here as the archive grows.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastWords.map((pw, i) => (
                  <motion.div
                    key={pw.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-purple-400/30 hover:bg-purple-500/5 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-2xl font-black text-white uppercase italic group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 transition-all">
                        {pw.word}
                      </h3>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {pw.meaning}
                    </p>
                    {(pw.date || pw.createdAt) && (
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                        {new Date(
                          pw.date || pw.createdAt || "",
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
