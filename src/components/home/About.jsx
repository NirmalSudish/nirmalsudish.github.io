import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../common/ScrollReveal';
import { resolvePath } from '../../utils/imagePath';

const About = () => {
  return (
    <section id="about" className="w-full h-full md:h-[100dvh] flex items-center justify-center bg-transparent relative z-10 overflow-visible pt-4 pb-16 md:pt-0 md:pb-0 lg:pt-20 xl:pt-0">
      <div className="container mx-auto px-0 md:px-12 lg:px-[clamp(3rem,4vw,5rem)] h-full flex flex-col justify-center max-w-7xl">
        {/* Mobile: Row Reverse (Text Left, Image Right) | Desktop: Normal Row (Image Left, Text Right) */}
        <div className="flex flex-col md:flex-row gap-5 md:gap-12 lg:gap-[clamp(2rem,4vw,5rem)] items-center md:items-center h-full md:h-auto pt-4 md:pt-0">

          {/* IMAGE COLUMN: Top on Mobile, Left on Desktop */}
          {/* Mobile: Order 1 (Top), Desktop: Order 1 (Left) */}
          <div className="w-full md:w-5/12 order-1 flex justify-center md:justify-start items-center md:block pt-4 md:pt-0">
            <div className="relative w-48 md:w-full md:max-w-[320px] lg:max-w-[380px] xl:max-w-none mx-auto md:mx-0">
              <div className="relative aspect-[3/4] md:aspect-[4/5] h-auto max-h-[45vh] md:max-h-[clamp(300px,52vh,600px)] overflow-hidden rounded-xl md:rounded-2xl border border-white/10 shadow-2xl">
                <img
                  src={resolvePath('/images/about-me.jpg')}
                  alt="Nirmal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* TEXT COLUMN: Below photo on Mobile, Right on Desktop */}
          {/* Mobile: Order 2 (Below), Desktop: Order 2 (Right) */}
          <div className="w-full md:w-7/12 text-center md:text-left flex flex-col items-center md:items-start order-2">
            <ScrollReveal delay={0.2}>
              <h4 className="text-xs md:text-2xl lg:text-[clamp(1.25rem,2vw,2rem)] font-black text-[#c792ff] uppercase tracking-[0.2em] mb-2 md:mb-4 lg:mb-[clamp(1rem,2vh,1.75rem)] relative z-20 no-underline whitespace-nowrap">
                The Story So Far
              </h4>

              <h2 className="text-3xl md:text-4xl lg:text-[clamp(2rem,3.5vw,4rem)] font-black uppercase tracking-tighter leading-tight mb-3 md:mb-4 lg:mb-[clamp(0.75rem,2vh,2rem)]">
                I'm Nirmal.
              </h2>

              <div className="space-y-1.5 md:space-y-3 lg:space-y-[clamp(0.75rem,1.5vh,1.5rem)] text-sm md:text-base lg:text-[clamp(0.9rem,1.2vw,1.25rem)] opacity-70 leading-relaxed font-medium mb-3 md:mb-4 lg:mb-[clamp(1rem,2.5vh,2.5rem)] max-w-full md:max-w-[420px] lg:max-w-xl">
                <p className="md:hidden">
                  I am a multi-disciplinary designer and <span className="font-bold opacity-100">CS student</span> born and raised in the UAE.
                </p>
                <p className="hidden md:block text-pretty">
                  I am a multi-disciplinary designer and <span className="font-bold opacity-100">CS student</span> born and raised in the UAE.
                </p>

                <p className="hidden md:block text-pretty">
                  My work lives at the edge of design and logic, specializing in <span className="text-[#c792ff] italic font-black">human-centered UI/UX.</span>
                </p>
                <p className="block md:hidden">
                  Specializing in <span className="text-[#c792ff] italic font-black">human-centered UI/UX.</span>
                </p>
              </div>

              {/* MOVING GREEN GRADIENT BUTTON */}
              <div className="hidden md:inline-flex relative items-center justify-center p-[1.5px] overflow-hidden rounded-full group scale-90 origin-center md:scale-100 mb-3 md:mb-0">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#22c55e_360deg)]"
                />
                <div className="relative z-10 flex items-center gap-2 px-5 py-2 md:px-8 md:py-3 bg-white dark:bg-[#0a0a0a] rounded-full border border-black dark:border-transparent">
                  <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] md:text-[10px] font-black text-black dark:text-white uppercase tracking-[0.3em] whitespace-nowrap">Available for work</span>
                </div>
              </div>

              {/* MINIMALIST INFORMATION GRID - Stacked on Mobile to fit width */}
              <div className="flex flex-col gap-2.5 md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-y-6 md:gap-x-12 lg:gap-y-[clamp(0.75rem,1.5vh,1.5rem)] pt-0 md:pt-8 lg:pt-[clamp(1rem,2vh,3rem)] border-t-0 md:border-t border-black/10 dark:border-white/10 mb-3 md:mb-6 lg:mb-[clamp(0.75rem,2vh,2rem)] w-full">
                <div className="hidden md:flex flex-col items-center md:items-start">
                  <span className="text-[10px] md:text-[10px] font-black text-[#c792ff] uppercase tracking-[0.3em] mb-1 md:mb-2">Based In</span>
                  <span className="text-base md:text-lg lg:text-xl font-bold uppercase">Dubai, UAE</span>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] md:text-[10px] font-black text-[#c792ff] uppercase tracking-[0.3em] mb-1 md:mb-2">Working At</span>
                  <a href="https://www.instagram.com/yamanoteatelier/" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg lg:text-xl font-bold uppercase hover:text-[#c792ff] transition-colors whitespace-nowrap">Yamanote Atelier</a>
                </div>

                <div className="hidden md:flex flex-col items-center md:items-start">
                  <span className="text-[10px] md:text-[10px] font-black text-[#c792ff] uppercase tracking-[0.3em] mb-1 md:mb-2">Past</span>
                  <span className="text-base md:text-lg lg:text-xl font-bold opacity-40 uppercase">Eye Studio</span>
                </div>
              </div>

              {/* VIEW RESUME BUTTON */}
              <a
                href={resolvePath('/resume.pdf')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 lg:py-[clamp(0.625rem,1.2vh,1rem)] bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95 mx-0 mt-0 md:mt-4 lg:mt-[clamp(0.75rem,2vh,2rem)]"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resume
              </a>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section >
  );
};
export default About;