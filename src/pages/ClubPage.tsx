import { motion } from "framer-motion";
import { Palette } from "lucide-react";

export default function ClubPage({ name = "This Club" }: { name?: string }) {
  return (
    <div className="min-h-screen bg-[#0b0b0b] pt-28 pb-24 flex flex-col items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-8 shadow-[0_8px_40px_rgba(168,85,247,0.4)]">
          <Palette size={36} className="text-white" />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4"
        >
          {name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-white/50 text-lg leading-relaxed"
        >
          Detailed information for this club is coming soon. Check back shortly or{" "}
          <a href="/contact" className="text-purple-400 hover:text-pink-400 transition-colors font-bold">
            get in touch
          </a>{" "}
          to learn more.
        </motion.p>
      </div>
    </div>
  );
}
