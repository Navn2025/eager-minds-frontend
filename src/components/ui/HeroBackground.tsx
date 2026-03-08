import React, { useEffect, useRef } from "react";
import { motion, useTransform, useSpring } from "framer-motion";

const PARTICLE_COUNT = 40;
const NEURAL_NODES = 12;

export default function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Spring-smoothed mouse position for cursor spotlight
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black"
    >
      {/* Layer 1 — Grid Field */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] opacity-100"
        style={{
          maskImage: "radial-gradient(circle at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 20%, transparent 80%)",
        }}
      />

      {/* Layer 2 — Aurora Gradient Mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: ["-20%", "20%", "-20%"],
            y: ["-10%", "10%", "-10%"],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-[#6366F1]/10 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            x: ["20%", "-20%", "20%"],
            y: ["10%", "-10%", "10%"],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-[#8B5CF6]/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: ["-10%", "10%", "-10%"],
            y: ["10%", "-10%", "10%"],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-[#22D3EE]/5 rounded-full blur-[100px]"
        />
      </div>

      {/* Layer 3 — Floating Glow Particles */}
      <div className="absolute inset-0">
        {[...Array(PARTICLE_COUNT)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.3,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, `${(Math.random() - 0.5) * 100 + 50}vh`],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Layer 4 — Neural Network Lines (Symbolic SVG Nodes) */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[...Array(NEURAL_NODES)].map((_, i) => {
          const startX = Math.random() * 100 + "%";
          const startY = Math.random() * 100 + "%";
          const endX = (Math.random() * 20 - 10) + parseFloat(startX) + "%";
          const endY = (Math.random() * 20 - 10) + parseFloat(startY) + "%";
          
          return (
            <React.Fragment key={i}>
              <motion.circle
                cx={startX}
                cy={startY}
                r="1.5"
                fill="#6366F1"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
              {i % 2 === 0 && (
                <motion.line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#6366F1"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 0], opacity: [0, 0.3, 0] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    delay: Math.random() * 10,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </svg>

      {/* Interaction — Cursor Spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(circle 250px at ${x}px ${y}px, rgba(99, 102, 241, 0.08), transparent 90%)`
          ),
        }}
      />

      {/* Global Noise Overlay */}
      <div className="absolute inset-0 noise-overlay opacity-[0.03] pointer-events-none" />
    </div>
  );
}
