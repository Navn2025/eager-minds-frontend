import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export default function FuturisticBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      {/* Mesh Gradients & Wandering Orbs */}
      <div className="absolute inset-0 opacity-40">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -120, 0],
            y: [0, -80, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-500/10 rounded-full blur-[100px]" 
        />
        
        {/* New Wandering High-Tech Orbs */}
        <motion.div 
          animate={{ 
            x: ["10vw", "40vw", "10vw"],
            y: ["10vh", "60vh", "10vh"],
          }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute w-64 h-64 bg-accent/5 rounded-full blur-[80px]" 
        />
        <motion.div 
          animate={{ 
            x: ["80vw", "50vw", "80vw"],
            y: ["70vh", "20vh", "70vh"],
          }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          className="absolute w-80 h-80 bg-accent/10 rounded-full blur-[100px]" 
        />
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Data Streams / Scanlines */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 1, 0] }}
            transition={{ 
              duration: 10 + i * 5, 
              repeat: Infinity, 
              delay: i * 3,
              ease: "linear" 
            }}
            className="w-full h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"
          />
        ))}
      </div>

      {/* Floating Particles (Enhanced) */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: Math.random() * 0.5,
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              y: [null, `${(Math.random() - 0.5) * 100}px`],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className={cn(
              "absolute rounded-full bg-white",
              i % 4 === 0 ? "w-1 h-1 blur-[1px] shadow-[0_0_10px_white]" : "w-0.5 h-0.5"
            )}
          />
        ))}
      </div>

      {/* Noise Overlay handled in index.css */}
      <div className="noise-overlay" />
    </div>
  );
}
