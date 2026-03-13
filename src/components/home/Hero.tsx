import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  headline: string;
  subheading: string;
  primaryCTA: {
    text: string;
    link: string;
  };
  secondaryCTA: {
    text: string;
    link: string;
  };
}

export default function Hero({ headline, subheading, primaryCTA, secondaryCTA }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Multi-colour aurora background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Pink — top right */}
        <div className="absolute top-[-10%] right-[-5%] w-[55%] h-[65%]
          bg-[radial-gradient(ellipse,rgba(236,72,153,0.18)_0%,transparent_70%)]" />
        {/* Purple — centre */}
        <div className="absolute top-[15%] left-[30%] w-[50%] h-[55%]
          bg-[radial-gradient(ellipse,rgba(168,85,247,0.14)_0%,transparent_65%)]" />
        {/* Blue — bottom left */}
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[50%]
          bg-[radial-gradient(ellipse,rgba(56,189,248,0.12)_0%,transparent_65%)]" />
        <div className="noise-overlay" />
      </div>

      <div className="relative z-10 max-w-[1200px] w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Headline — brand gradient */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] text-gradient">
            {headline}
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl font-medium leading-relaxed"
             style={{ color: "var(--color-text-secondary)" }}>
            {subheading}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
            {/* Primary — brand gradient pill */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to={primaryCTA.link}
                className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full font-bold text-lg text-white
                  bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600
                  shadow-[0_6px_28px_rgba(168,85,247,0.38)]
                  hover:shadow-[0_8px_36px_rgba(236,72,153,0.40)]
                  transition-shadow duration-300"
              >
                {primaryCTA.text}
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            {/* Secondary — glass with gradient border */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to={secondaryCTA.link}
                className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-lg text-white/80
                  bg-white/[0.04] backdrop-blur-sm
                  border border-purple-400/25
                  hover:bg-white/[0.08] hover:border-purple-400/45 hover:text-white
                  transition-all duration-300"
              >
                {secondaryCTA.text}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom glow blob — pink → purple blend */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px]
        bg-gradient-to-r from-pink-500/8 via-purple-500/12 to-sky-500/8
        blur-[100px] rounded-full pointer-events-none" />
    </section>
  );
}
