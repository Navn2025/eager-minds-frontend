import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Pagination from "../components/Pagination";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  Search,
  Calendar,
  User,
  ArrowRight,
  Notebook as Writing,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  excerpt: string;
  author: string;
  publishDate: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "9" });
    if (search) params.set("search", search);
    api
      .get(`/blog?${params}`)
      .then((res) => {
        const data =
          res.data.posts || (Array.isArray(res.data) ? res.data : []);
        setPosts(data);
        setTotalPages(res.data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, [page, search]);

  return (
    <div className="page-container pb-32 pt-40 md:pt-52">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex mt-10 flex-col md:flex-row md:items-center justify-between gap-10 mb-20"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-400/20 bg-purple-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-purple-300/70">
            <Writing size={12} className="text-purple-400" />
            <span>Editorial Insights</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            Academic <span className="text-gradient">Studio.</span>
          </h1>
          <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed">
            Advanced study architecture and industry updates. Expert narratives
            for the modern learner.
          </p>
        </div>

        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-20 transition-opacity" />
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search the archive..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-16 pr-6 py-5 bg-white/[0.02] border border-white/5 rounded-3xl text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all font-black uppercase tracking-widest text-[10px]"
          />
        </div>
      </motion.header>

      <section className="min-h-[600px]">
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <Card className="group relative h-full flex flex-col overflow-hidden bg-white/[0.01] border-white/5 hover:bg-white/[0.02] transition-all duration-700 rounded-[3rem]">
                    <div className="relative aspect-[16/10] overflow-hidden p-4">
                      <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                            <Writing size={48} className="text-white/5" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-20" />

                        <div className="absolute top-6 left-6">
                          <Badge className="bg-white/10 backdrop-blur-3xl border border-white/10 text-white font-black uppercase tracking-widest text-[8px] px-3 py-1.5 rounded-full">
                            Insights
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-10 pt-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 group-hover:text-white/40 transition-colors">
                        <span className="flex items-center gap-2">
                          <Calendar size={12} strokeWidth={3} />{" "}
                          {new Date(post.publishDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2">
                          <User size={12} strokeWidth={3} /> {post.author}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-white mb-4 tracking-tighter leading-tight group-hover:translate-x-1 transition-transform">
                        {post.title}
                      </h3>

                      <p className="text-white/40 text-sm font-medium leading-relaxed mb-10 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">
                          Architecture Detail
                        </span>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                          <ArrowRight size={20} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-32 border border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]">
            <div className="relative mb-8">
              <Search size={64} className="text-white/5" />
              <Sparkles
                className="absolute -top-2 -right-2 text-white/20"
                size={24}
              />
            </div>
            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">
              Zero Matches Identified
            </h4>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
              Adjust your query for the editorial vault.
            </p>
          </div>
        )}
      </section>

      <div className="mt-20 flex justify-center">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
