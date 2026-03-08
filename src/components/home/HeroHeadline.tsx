import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { cn } from "../../lib/utils";

interface HeroHeadlineProps {
  text?: string;
  className?: string;
}

export default function HeroHeadline({ 
  text = "Where Curious Minds Become Brilliant Thinkers.", 
  className 
}: HeroHeadlineProps) {
  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const charVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 10,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
  };

  return (
    <div className={cn("relative px-4 py-4", className)}>
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={cn(
          "relative z-10",
          "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
          "font-black tracking-tighter leading-[0.95]",
          "text-white text-center flex flex-wrap justify-center gap-x-[0.3em] gap-y-[0.1em]"
        )}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIndex) => (
              <motion.span
                key={charIndex}
                variants={charVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.h1>
    </div>
  );
}
