import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[10000] bg-[#111111] flex items-center justify-center"
    >
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        {/* Animated Logo */}
        <motion.svg
          viewBox="5 10.21 272.38 392.93"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.path
            fill="none"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="12"
            d="M5 21.53v381.61l194.89-178.66-139.48-45.96 43.16-33.49L5 21.53z"
          />
          <motion.path
            fill="none"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="12"
            d="M277.38 10.21 60.41 178.52l139.48 45.96-32.3 29.61 109.79 145.17V10.21z"
          />
        </motion.svg>

        {/* Optional: Progress Bar or Glow */}
        <motion.div 
          className="absolute -inset-4 border border-white/10 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

export default Loader;