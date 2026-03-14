import { motion, type Variants } from "framer-motion";
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

// Keep the first two words visually distinct from the remaining headline.
function splitHeadline(headline: string): [string, string] {
  const words = headline.trim().split(/\s+/).filter(Boolean);
  const lead = words.slice(0, 2).join(" ");
  const rest = words.slice(2).join(" ");
  return [lead || headline, rest];
}

const heroEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: heroEase },
  }),
};

export default function Hero({
  headline,
  subheading,
  primaryCTA,
  secondaryCTA,
}: HeroProps) {
  const [line1, line2] = splitHeadline(headline);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      <div className="relative z-10 max-w-[1200px] w-full text-center">
        {/* ── Headline — two-line staggered slide-up ── */}
        <div className="overflow-hidden mb-3">
          <motion.h1
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] text-white"
          >
            {line1}
          </motion.h1>
        </div>
        {line2 && (
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
        )}

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
    </section>
  );
}
