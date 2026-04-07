import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { Button } from "../components/ui/Button";
import { Calendar, User, ArrowLeft, Share2, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  content: string;
  author: string;
  publishDate: string;
}

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/blog/${id}`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !post) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-purple-400/20 border-t-purple-400 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-white/20 animate-pulse" size={20} />
          </div>
        </div>
        <p className="mt-8 text-white/20 font-black tracking-[0.4em] uppercase text-[10px]">Synchronizing Editorial Node...</p>
      </div>
    );
  }

  return (
    <div className="page-container pb-40 pt-40 md:pt-52">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link to="/blog">
          <Button variant="ghost" className="mb-20 px-6 h-14 rounded-2xl border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all group">
            <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" />
            Return to Studio
          </Button>
        </Link>
      </motion.div>

      <article className="max-w-6xl mx-auto">
        <header className="mb-20 space-y-10 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/40"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500/80">
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
               Latest Narrative
            </div>
            <div className="flex items-center gap-2"><Calendar size={14} strokeWidth={3} /> {new Date(post.publishDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
            <div className="flex items-center gap-2"><User size={14} strokeWidth={3} /> {post.author}</div>
            <div className="flex items-center gap-2"><Clock size={14} strokeWidth={3} /> 5 MIN READ</div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter"
          >
            {post.title}
          </motion.h1>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="relative aspect-[21/9] rounded-[4rem] overflow-hidden border border-white/10 mb-24 shadow-2xl"
        >
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover grayscale opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
              <Sparkles size={80} className="text-white/5" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:w-2/3"
          >
            <div className="prose prose-invert max-w-none prose-p:text-white/60 prose-p:leading-[1.8] prose-p:text-xl prose-p:font-medium prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-white prose-blockquote:border-none prose-blockquote:bg-white/[0.02] prose-blockquote:p-12 prose-blockquote:rounded-[3rem] prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-white/10 prose-blockquote:relative whitespace-pre-wrap">
              {post.content}
            </div>
          </motion.div>
          
          <aside className="lg:w-1/3">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-32 space-y-12"
            >
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                   <Share2 size={80} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-8 flex items-center gap-3">
                  Circulate Logic
                </h3>
                <p className="text-sm text-white/40 mb-10 leading-relaxed font-medium">
                  Found this architectural insight valuable? Expand the network by sharing with your academic circle.
                </p>
                <Button 
                  onClick={handleCopy}
                  className={cn(
                    "w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all",
                    copied ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-[1.02] border-none shadow-[0_4px_16px_rgba(168,85,247,0.30)]"
                  )}
                >
                  {copied ? "Node Link Copied" : "Extract Article Link"}
                </Button>
              </div>

              <div className="p-10 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center text-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                    <Sparkles size={20} />
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Next iteration scheduled for Monday</span>
              </div>
            </motion.div>
          </aside>
        </div>
      </article>

      <section className="mt-40 pt-20 border-t border-white/5">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Correlated Media</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-400/20 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {[1, 2].map((i) => (
             <div key={i} className="p-20 border border-dashed border-white/5 rounded-[4rem] text-center bg-white/[0.01] flex flex-col items-center gap-6 group hover:border-white/20 transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-white/10 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                  <ArrowLeft className="rotate-180" size={24} />
                </div>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Decoding complementary nodes...</p>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}
