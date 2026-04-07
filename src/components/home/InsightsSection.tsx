import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import api from "../../services/api";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: string | null;
  category: string | null;
  createdAt: string;
}

export default function InsightsSection() {
  const [articles, setArticles] = useState<BlogPost[]>([]);

  useEffect(() => {
    api
      .get("/blog?limit=3")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.posts || [];
        setArticles(data.slice(0, 3));
      })
      .catch(() => setArticles([]));
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
            >
              Latest Insights
            </motion.h2>
            <p className="text-text-secondary text-lg">
              Thought leadership on education and cognitive growth.
            </p>
          </div>
          <Link
            to="/blog"
            className="hidden md:block px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-semibold text-white"
          >
            Visit Blog
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/blog/${article.slug}`}>
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-white/10">
                  {article.featuredImage ? (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                      <BookOpen size={48} className="text-white/10" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    {article.category || "Insights"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-xs text-text-secondary font-medium">
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
