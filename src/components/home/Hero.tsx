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

// Split "Where Creativity Meets Curiosity" into two balanced lines
function splitHeadline(headline: string): [string, string] {
  const words = headline.split(" ");
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero({ headline, subheading, primaryCTA, secondaryCTA }: HeroProps) {
  const [line1, line2] = splitHeadline(headline);

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
        {/* ── Headline — two-line staggered slide-up ── */}
        <div className="overflow-hidden mb-3">
          <motion.h1
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] text-gradient"
          >
            {line1}
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8">
          <motion.h1
            custom={0.18}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] text-gradient"
          >
            {line2}
          </motion.h1>
        </div>

        {/* ── Subheading ── */}
        <motion.p
          custom={0.38}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto text-xl md:text-2xl font-medium leading-relaxed mb-10"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {subheading}
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          custom={0.52}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
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
        </motion.div>
      </div>

      {/* Bottom glow blob — pink → purple blend */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px]
        bg-gradient-to-r from-pink-500/8 via-purple-500/12 to-sky-500/8
        blur-[100px] rounded-full pointer-events-none" />
    </section>
  );
}
