import React from 'react';
import { motion } from 'framer-motion';
import { NOISE_TEXTURE_SVG } from '../constants';

export const PageTransition: React.FC = () => {
  // 5 columns for the structural curtain effect
  const columns = 5;

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex h-screen w-screen"
      initial={{ opacity: 1 }}
      exit={{ transition: { duration: 1.0 } }}
    >
      {[...Array(columns)].map((_, i) => (
        <motion.div
          key={i}
          className="relative h-full flex-1 bg-[#141414] border-r border-[#2a2a2a]/50"
          initial={{ y: "0%" }}
          exit={{ 
            y: "-100%",
            transition: { 
              duration: 0.8, 
              ease: [0.76, 0, 0.24, 1], // Custom bezier for snappy "mechanical" feel
              delay: i * 0.08 // Stagger effect
            } 
          }}
        >
          {/* Gold tip at the bottom */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A265]" />
          
          {/* Subtle noise texture on columns */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
             style={{ backgroundImage: `url("${NOISE_TEXTURE_SVG}")` }}
          />
        </motion.div>
      ))}

      {/* Loading Text Centered - High Z-Index to ensure visibility */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-[110] pointer-events-none"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -50, transition: { duration: 0.5, ease: "easeIn" } }}
      >
        <div className="flex flex-col items-center gap-6">
             <h1 className="text-3xl md:text-5xl font-serif text-[#C5A265] tracking-[0.2em] font-medium drop-shadow-2xl">
                SUZUKI TOMOHISA
             </h1>
             <div className="h-[1px] w-24 bg-[#C5A265]/50 overflow-hidden relative">
                 <motion.div 
                    className="absolute inset-0 bg-[#C5A265]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 />
             </div>
             <p className="text-[10px] text-white/40 tracking-[0.5em] font-mono">
                INITIALIZING...
             </p>
        </div>
      </motion.div>
    </motion.div>
  );
};