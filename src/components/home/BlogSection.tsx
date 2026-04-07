import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import api from "../../services/api";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  category: string | null;
  createdAt: string;
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    api
      .get("/blog?limit=3")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.posts || [];
        setPosts(data.slice(0, 3));
      })
      .catch(() => setPosts([]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-accent mb-6"
            >
              <BookOpen size={14} />
              <span>Elite Insights</span>
            </motion.div>
            <h2 className="section-title text-left mb-6">
              Latest <span className="text-gradient">Insights.</span>
            </h2>
            <p className="text-text-secondary text-lg font-medium leading-relaxed max-w-xl uppercase tracking-wider">
              Explore our platform for the latest educational tips, club
              updates, and premium success stories.
            </p>
          </div>
          <Link to="/blog">
            <Button
              variant="ghost"
              className="h-14 px-10 rounded-2xl border border-white/5 bg-white/[0.02] text-[9px] font-bold uppercase tracking-[0.3em] text-text-secondary hover:text-white hover:bg-accent/10 hover:border-accent/40 group transition-all glass"
            >
              Journal Archive
              <ArrowRight
                size={16}
                className="ml-3 group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col h-full group cursor-pointer"
            >
              <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
                <div className="aspect-[16/10] overflow-hidden rounded-[2.5rem] mb-8 relative glass border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                      <BookOpen size={48} className="text-white/10" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="px-4 py-1.5 glass bg-black/40 text-white rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/10">
                      {post.category || "Insights"}
                    </div>
                  </div>
                </div>

                <div className="flex-grow space-y-4">
                  <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-accent/40" />
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-accent" />
                      <span>5 min read</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white leading-tight tracking-tight uppercase group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-text-secondary text-sm font-medium leading-relaxed line-clamp-3">
                    {post.excerpt || "Read more about this insightful topic..."}
                  </p>

                  <div className="pt-4 flex items-center gap-2 text-white font-bold text-[9px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                    Read Journal{" "}
                    <ArrowRight size={14} className="text-accent" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
