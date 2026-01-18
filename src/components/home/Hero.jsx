import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const flipWords = ["communicate", "captivate", "inspire", "engage", "tell stories"];
const roles = ["graphic designer", "motion designer", "UI/UX designer"];

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const [nameFinished, setNameFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % flipWords.length);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
        ease: "easeOut"
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-center md:justify-between h-full pt-16 md:pt-0 gap-8 md:gap-0">

        {/* Left Side: Large Name Heading */}
        <div className="w-full md:w-2/3 lg:w-3/4 text-center md:text-left">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="font-black hero-title-responsive uppercase tracking-tighter leading-[0.85] select-none"
          >
            <div className="block mb-6">
              {"HI, I'M".split("").map((c, i) => <motion.span key={i} variants={letterVariants}>{c === " " ? "\u00A0" : c}</motion.span>)}
            </div>
            <div className="block">
              {"NIRMAL".split("").map((c, i) => (
                <motion.span
                  key={i}
                  variants={letterVariants}
                  onAnimationComplete={i === "NIRMAL".length - 1 ? () => setNameFinished(true) : undefined}
                >
                  {c === " " ? "\u00A0" : c}
                </motion.span>
              ))}
            </div>
          </motion.h1>
        </div>

        {/* Right Side: Spaced Description */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-end md:mt-32">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={nameFinished ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-xl md:text-xl lg:text-2xl font-light flex flex-col items-center md:items-end gap-1"
          >
            <span className="leading-none">I'm a</span>

            {/* Reserved space for Role */}
            <div className="h-[1.1em] relative w-full flex justify-center md:justify-end">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute font-bold text-center md:text-right"
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex flex-col items-center md:items-end leading-tight text-center md:text-right gap-1">
              <span>passionate about</span>
              <span>creating visuals that</span>
            </div>

            {/* Reserved space for Flipwords */}
            <div className="h-[1.25em] relative w-full flex justify-center md:justify-end">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute font-bold text-purple-600 dark:text-[#c792ff] text-center md:text-right"
                >
                  {flipWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;