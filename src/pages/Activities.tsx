import { useEffect, useState } from "react";
import api from "../services/api";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  Activity as ActivityIcon,
  ArrowRight,
  Sparkles,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  worksheetUrl: string | null;
  image: string | null;
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/activities")
      .then((res) => {
        setActivities(res.data.activities || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-container pb-40 pt-40 md:pt-52">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24 mt-10 space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          <Compass size={12} className="text-white/60" />
          <span>Interactive Protocol</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white">
          Club <span className="text-white/40">Activities.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-2xl leading-relaxed">
          Engaging methodological explorations. Elite extracurricular nodes
          designed to bridge the gap between theoretical learning and creative
          application.
        </p>
      </motion.header>

      <section>
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Active Nodes
          </h2>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {loading ? (
          <div className="py-40 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {activities.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group relative h-full flex flex-col overflow-hidden bg-white/[0.01] border-white/5 hover:bg-white/[0.02] transition-all duration-700 rounded-[3rem]">
                  <div className="relative aspect-[16/10] overflow-hidden p-4">
                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl">
                      {activity.image ? (
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                          <ActivityIcon size={48} className="text-white/5" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-20" />

                      <div className="absolute top-6 left-6">
                        <Badge className="bg-white/10 backdrop-blur-3xl border border-white/10 text-white font-black uppercase tracking-widest text-[8px] px-3 py-1.5 rounded-full">
                          PROTOCOL
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-10 pt-4 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tighter leading-tight group-hover:translate-x-1 transition-transform">
                      {activity.title}
                    </h3>

                    <p className="text-white/40 text-sm font-medium leading-relaxed mb-10 line-clamp-3">
                      {activity.description}
                    </p>

                    {activity.instructions && (
                      <div className="mb-10 p-6 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
                          <Sparkles size={40} />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">
                          Logic / Instructions
                        </p>
                        <p className="text-xs text-white/40 font-medium leading-relaxed italic line-clamp-3">
                          {activity.instructions}
                        </p>
                      </div>
                    )}

                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                      <Button className="h-14 px-8 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all">
                        Execute Activity
                        <ArrowRight
                          size={14}
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                        />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-32 border border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]">
            <div className="relative mb-8">
              <ActivityIcon size={64} className="text-white/5" />
              <Sparkles
                className="absolute -top-2 -right-2 text-white/20"
                size={24}
              />
            </div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight mb-2">
              Queue Exhausted
            </h1>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
              Next methodological sprint in preparation.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
