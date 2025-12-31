import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const flipWords = ["communicate", "captivate", "inspire", "engage", "tell stories"];

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [nameFinished, setNameFinished] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const line1 = "HI, I'M".split("");
  const line2 = "NIRMAL".split(""); 

  // --- CUSTOM ULTRA-SMOOTH SCROLL FUNCTION ---
  const smoothScrollToWork = () => {
    const target = document.getElementById('work');
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Duration in milliseconds (Increase for slower, smoother glide)
    const duration = 1200; 

    // Easing function: Cubic-Bezier (Power4 easeOut)
    const ease = (t) => 1 - Math.pow(1 - t, 4);

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      window.scrollTo(0, startPosition + distance * ease(progress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % flipWords.length);
    }, 3000);

    const handleInitialScroll = () => {
      // Trigger as soon as the user attempts to move
      if (window.scrollY > 2 && !hasScrolled) {
        setHasScrolled(true);
        smoothScrollToWork();
      }
    };

    window.addEventListener('scroll', handleInitialScroll, { passive: true });

    return () => {
      clearInterval(wordInterval);
      window.removeEventListener('scroll', handleInitialScroll);
    };
  }, [hasScrolled]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.5 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, display: "none" },
    visible: { 
      opacity: 1, 
      display: "inline-block",
      transition: { duration: 0.05 } 
    },
  };

  const subTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: "easeOut" } 
    },
  };

  return (
    <section id="hero" className="color-trigger-section min-h-[100dvh] relative flex flex-col justify-center z-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between h-full">
        
        {/* LEFT SIDE: NAME */}
        <div className="w-full md:w-2/3 lg:w-3/4 z-10 text-center md:text-left">
          <motion.h1 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onAnimationComplete={() => setNameFinished(true)}
            className="font-black hero-title-responsive text-white uppercase tracking-tighter leading-[0.9]"
          >
            <div className="block">
              {line1.map((char, index) => (
                <motion.span key={`l1-${index}`} variants={letterVariants}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
            <div className="block">
              {line2.map((char, index) => (
                <motion.span key={`l2-${index}`} variants={letterVariants}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
          </motion.h1>
        </div>

        {/* RIGHT SIDE: INFO */}
        <div className="w-full md:w-1/3 lg:w-1/4 text-center md:text-right z-10 flex flex-col items-center md:items-end md:mt-32">
          <motion.div
            variants={subTextVariants}
            initial="hidden"
            animate={nameFinished ? "visible" : "hidden"}
          >
            <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-lg">
              I’m a graphic designer passionate about creating visuals that{' '}
              <span className="relative inline-block w-40 text-left font-bold text-white align-top">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-0 whitespace-nowrap"
                  >
                    {flipWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </p>
          </motion.div>
        </div>
        
        {/* BUTTON: HIDES PERMANENTLY ON SCROLL */}
        <AnimatePresence>
            {nameFinished && !hasScrolled && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.5, filter: "blur(15px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                >
                    <button 
                        onClick={() => { setHasScrolled(true); smoothScrollToWork(); }}
                        className="group relative flex items-center justify-center w-32 h-32 rounded-full border border-white/10 hover:border-white/30 transition-all duration-500"
                    >
                        <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-70" viewBox="0 0 100 100">
                            <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                            <text className="text-[8.5px] uppercase font-bold tracking-[2px] fill-white" dominantBaseline="middle" textAnchor="middle">
                                <textPath href="#curve" startOffset="50%">
                                   WORKS {"\u00A0"} • {"\u00A0"} WORKS {"\u00A0"} • {"\u00A0"} WORKS {"\u00A0"} • {"\u00A0"}
                                </textPath>
                            </text>
                        </svg>
                        <div className="text-white transform transition-transform duration-300 group-hover:translate-y-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;