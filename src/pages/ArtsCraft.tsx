import { useEffect, useState } from "react";
import api from "../services/api";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Play, Sparkles, Paintbrush } from "lucide-react";
import { motion } from "framer-motion";
import BlueprintModal from "../components/ui/BlueprintModal";
import VideoModal from "../components/ui/VideoModal";

interface Project {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  images: string[];
  videoUrl: string | null;
}

export default function ArtsCraft() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeBlueprint, setActiveBlueprint] = useState<Project | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/arts-craft")
      .then((res) => {
        setProjects(res.data.projects || []);
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-400/20 bg-pink-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-pink-300/70">
          <Paintbrush size={12} className="text-pink-400" />
          <span>Creative Architecture</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white">
          Arts & <span className="text-gradient">Studio.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-2xl leading-relaxed">
          The canvas for advanced creativity. Hands-on project nodes designed to
          inspire technical curiosity and aesthetic exploration through tactile
          learning.
        </p>
      </motion.header>

      <section>
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Project Matrix
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-pink-400/20 to-transparent" />
        </div>

        {loading ? (
          <div className="py-40 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group relative h-full flex flex-col overflow-hidden bg-white/[0.01] border-white/5 hover:bg-white/[0.02] transition-all duration-700 rounded-[3rem]">
                  <div className="relative aspect-[16/10] overflow-hidden p-4">
                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl">
                      {project.images[0] ? (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                          <Paintbrush size={48} className="text-white/5" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-20" />

                      <div className="absolute top-6 left-6">
                        <Badge className="bg-white/10 backdrop-blur-3xl border border-white/10 text-white font-black uppercase tracking-widest text-[8px] px-3 py-1.5 rounded-full">
                          PROJECT
                        </Badge>
                      </div>

                      {project.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div
                            onClick={() => setActiveVideoUrl(project.videoUrl)}
                            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-2xl"
                          >
                            <Play size={24} fill="currentColor" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-10 pt-4 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tighter leading-tight group-hover:translate-x-1 transition-transform">
                      {project.title}
                    </h3>

                    <p className="text-white/40 text-sm font-medium leading-relaxed mb-10 line-clamp-3">
                      {project.description}
                    </p>

                    {project.instructions && (
                      <div className="mb-10 p-6 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
                          <Sparkles size={40} />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">
                          Project Snippet
                        </p>
                        <p className="text-xs text-white/40 font-medium leading-relaxed italic line-clamp-3">
                          {project.instructions}
                        </p>
                      </div>
                    )}

                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center gap-4">
                      {project.videoUrl && (
                        <Button
                          variant="outline"
                          onClick={() => setActiveVideoUrl(project.videoUrl)}
                          className="h-14 font-black uppercase tracking-widest text-[10px] flex-1 rounded-2xl border-purple-400/20 bg-purple-500/5 text-white/80 hover:bg-purple-500/15 hover:border-purple-400/40 transition-all"
                        >
                          <Play size={14} className="mr-2" /> Tutorial
                        </Button>
                      )}
                      <Button 
                        onClick={() => setActiveBlueprint(project)}
                        className="h-14 font-black uppercase tracking-widest text-[10px] flex-1 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none hover:scale-[1.02] transition-all shadow-[0_4px_16px_rgba(168,85,247,0.25)]">
                        Full Blueprint
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
              <Paintbrush size={64} className="text-white/5" />
              <Sparkles
                className="absolute -top-2 -right-2 text-white/20"
                size={24}
              />
            </div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight mb-2">
              Workspace Clear
            </h1>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
              New creative project nodes incoming.
            </p>
          </div>
        )}
      </section>

      {/* Render Modals at the top level */}
      <VideoModal
        isOpen={!!activeVideoUrl}
        onClose={() => setActiveVideoUrl(null)}
        videoUrl={activeVideoUrl || ""}
      />

      <BlueprintModal
        isOpen={!!activeBlueprint}
        onClose={() => setActiveBlueprint(null)}
        project={activeBlueprint}
      />
    </div>
  );
}
