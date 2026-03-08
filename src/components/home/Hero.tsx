import { motion } from "framer-motion";

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
      {/* Background Texture & Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.15)_0%,rgba(0,0,0,0)_70%)]" />
        <div className="noise-overlay" />
      </div>

      <div className="relative z-10 max-w-[1200px] w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] text-gradient">
            {headline}
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-text-secondary font-medium leading-relaxed">
            {subheading}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <motion.a
              href={primaryCTA.link}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-accent text-white rounded-full font-bold text-lg accent-glow hover:bg-accent/90 transition-all flex items-center gap-2"
            >
              {primaryCTA.text}
            </motion.a>
            
            <motion.a
              href={secondaryCTA.link}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/[0.05] border border-white/[0.1] text-white rounded-full font-bold text-lg hover:bg-white/[0.1] transition-all"
            >
              {secondaryCTA.text}
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Subtle particle effect placeholder or extra glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 blur-[120px] rounded-full" />
    </section>
  );
}
