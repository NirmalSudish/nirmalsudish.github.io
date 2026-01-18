import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../common/ScrollReveal';
import { resolvePath } from '../../utils/imagePath';

const About = () => {
  return (
    <section id="about" className="w-full h-full md:h-screen flex items-center justify-center bg-transparent relative z-10 overflow-visible pt-4 pb-16 md:pt-0 md:pb-0">
      <div className="container mx-auto px-0 md:px-12 lg:px-20 h-full flex flex-col justify-center">
        {/* Mobile: Row Reverse (Text Left, Image Right) | Desktop: Normal Row (Image Left, Text Right) */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-16 items-center md:items-center h-full md:h-auto pt-4 md:pt-0">

          {/* IMAGE COLUMN: Top on Mobile, Left on Desktop */}
          {/* Mobile: Order 1 (Top), Desktop: Order 1 (Left) */}
          <div className="w-full md:w-5/12 order-1 flex justify-center md:justify-start items-center md:block pt-4 md:pt-0">
            <div className="relative w-72 md:w-full">
              <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-xl md:rounded-2xl border border-white/10 shadow-2xl">
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
              <h4 className="text-xs md:text-3xl font-black text-[#c792ff] uppercase tracking-[0.2em] mb-2 md:mb-6 relative z-20 no-underline whitespace-nowrap">
                The Story So Far
              </h4>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-tight mb-4 md:mb-8">
                I'm Nirmal.
              </h2>

              <div className="space-y-2 md:space-y-6 text-sm md:text-lg lg:text-xl opacity-70 leading-relaxed font-medium mb-4 md:mb-10 max-w-full md:max-w-none">
                <p>
                  I am a multi-disciplinary designer <br className="block md:hidden" />
                  and <span className="font-bold opacity-100">CS student</span> <br className="block md:hidden" />
                  born and raised in the UAE.
                </p>
                <p className="hidden md:block">
                  My work lives at the edge of design <br />
                  and logic, specializing in <br />
                  <span className="text-[#c792ff] italic font-black">human-centered UI/UX.</span>
                </p>
                <p className="block md:hidden">
                  Specializing in <span className="text-[#c792ff] italic font-black">human-centered UI/UX.</span>
                </p>
              </div>

              {/* MOVING GREEN GRADIENT BUTTON */}
              <div className="relative inline-flex items-center justify-center p-[1.5px] overflow-hidden rounded-full group scale-90 origin-center md:scale-100 mb-4 md:mb-0">
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
              <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-y-8 md:gap-x-12 pt-0 md:pt-12 border-t-0 md:border-t border-black/10 dark:border-white/10 mb-4 md:mb-8 w-full">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] md:text-[10px] font-black text-[#c792ff] uppercase tracking-[0.3em] mb-1 md:mb-2">Based In</span>
                  <span className="text-base md:text-lg lg:text-xl font-bold uppercase">Dubai, UAE</span>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] md:text-[10px] font-black text-[#c792ff] uppercase tracking-[0.3em] mb-1 md:mb-2">Working At</span>
                  <span className="text-base md:text-lg lg:text-xl font-bold uppercase">Google</span>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] md:text-[10px] font-black text-[#c792ff] uppercase tracking-[0.3em] mb-1 md:mb-2">Past</span>
                  <span className="text-base md:text-lg lg:text-xl font-bold opacity-40 uppercase">Freelance</span>
                </div>
              </div>

              {/* VIEW RESUME BUTTON */}
              <a
                href={resolvePath('/resume.pdf')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-4 bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95 mx-0 mt-0 md:mt-8"
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