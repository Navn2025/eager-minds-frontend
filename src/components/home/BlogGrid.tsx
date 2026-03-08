import { motion } from "framer-motion";

interface BlogPost {
  image: string;
  category: string;
  title: string;
  slug: string;
}

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <section className="py-24 px-6 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post, index) => (
          <motion.a
            key={index}
            href={`/blog/${post.slug}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col gap-6"
          >
            {/* Image Container */}
            <div className="aspect-[16/10] rounded-[2rem] overflow-hidden bg-white/5 border border-white/5 relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-bold text-white uppercase tracking-widest">
                {post.category}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 px-2">
              <h3 className="text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              
              <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-widest">
                Read Article
                <span className="block w-4 h-[2px] bg-accent transition-all group-hover:w-8" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
