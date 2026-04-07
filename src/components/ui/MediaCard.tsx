import React from 'react';
import { motion } from 'framer-motion';

interface MediaCardProps {
  image: string;
  title: string;
  subtitle: string;
  tags?: string[];
}

export const MediaCard: React.FC<MediaCardProps> = ({ image, title, subtitle, tags }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden rounded-sm bg-neutral-900 border border-white/5">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
      </div>
      <div className="mt-4 space-y-1">
        <h4 className="text-sm font-bold tracking-tight text-white group-hover:text-white transition-colors">
          {title}
        </h4>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#8a8a8a]">
          {subtitle}
        </p>
        {tags && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <span key={tag} className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border border-white/10 text-white/40">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
