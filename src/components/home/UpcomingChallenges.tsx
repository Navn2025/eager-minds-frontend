import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import api from "../../services/api";

interface Competition {
  id: string;
  title: string;
  description: string;
  image: string | null;
  eventDate: string;
  registrationLink: string | null;
}

export default function UpcomingChallenges() {
  const [challenges, setChallenges] = useState<Competition[]>([]);

  useEffect(() => {
    api
      .get("/competitions?status=upcoming&limit=3")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.competitions || [];
        setChallenges(data.slice(0, 3));
      })
      .catch(() => setChallenges([]));
  }, []);

  if (challenges.length === 0) return null;

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
          >
            Upcoming Challenges
          </motion.h2>
          <p className="text-text-secondary text-lg">
            Push your boundaries with our curated academic competitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 border border-white/10">
                {challenge.image ? (
                  <img
                    src={challenge.image}
                    alt={challenge.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-white/[0.03] flex items-center justify-center">
                    <Trophy size={48} className="text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-white">
                    Challenge
                  </span>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="text-accent text-sm font-semibold mb-2">
                    {new Date(challenge.eventDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight mb-2">
                    {challenge.title}
                  </h3>
                </div>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed px-2 line-clamp-2">
                {challenge.description}
              </p>

              <div className="mt-4 px-2">
                {challenge.registrationLink ? (
                  <a
                    href={challenge.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm font-bold flex items-center gap-2 group/btn"
                  >
                    Register Now{" "}
                    <span className="group-hover/btn:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                ) : (
                  <Link
                    to="/competitions"
                    className="text-white text-sm font-bold flex items-center gap-2 group/btn"
                  >
                    View Details{" "}
                    <span className="group-hover/btn:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
