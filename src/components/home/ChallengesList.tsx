import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Challenge {
  image: string;
  title: string;
  description: string;
  registrationLink: string;
}

interface ChallengesListProps {
  challenges: Challenge[];
}

export default function ChallengesList({ challenges }: ChallengesListProps) {
  return (
    <section className="py-24 px-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-12">
        {challenges.map((challenge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            className={`flex flex-col ${
              index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            } gap-12 items-center matte-card p-1 pb-1 md:pr-10 md:pb-1 overflow-hidden`}
          >
            {/* Image Section */}
            <div className="w-full md:w-2/5 aspect-[4/3] rounded-[2.2rem] overflow-hidden relative">
              <img
                src={challenge.image}
                alt={challenge.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-3/5 space-y-6 pb-10 md:pb-0 px-8 md:px-0">
              <div className="space-y-4">
                <h3 className="text-4xl font-bold text-white tracking-tight">
                  {challenge.title}
                </h3>
                <p className="text-xl text-text-secondary leading-relaxed font-medium">
                  {challenge.description}
                </p>
              </div>

              <div className="pt-4">
                <motion.a
                  href={challenge.registrationLink}
                  whileHover={{ x: 10 }}
                  className="inline-flex items-center gap-2 text-accent font-bold text-lg group"
                >
                  Register Now
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
