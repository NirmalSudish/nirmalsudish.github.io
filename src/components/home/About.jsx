import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../common/ScrollReveal';
import { resolvePath } from '../../utils/imagePath';

const About = () => {
  return (
    <section id="about" className="w-full h-full flex items-center justify-center bg-transparent relative z-10 overflow-hidden pt-20 md:pt-0">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 h-full flex flex-col justify-center">
        <div className="flex flex-col md:flex-row gap-3 md:gap-16 items-center">

          {/* LEFT COLUMN: Personal Image */}
          <div className="w-[35vw] md:w-5/12">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <img
                  src={resolvePath('/images/about-me.jpg')}
                  alt="Nirmal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Bio and Moving Gradient Button */}
          <div className="w-full md:w-7/12 text-center md:text-left flex flex-col items-center md:items-start">
            <ScrollReveal delay={0.2}>
              <h4 className="text-xs md:text-3xl font-black text-[#c792ff] uppercase tracking-[0.2em] mb-1 md:mb-6 relative z-20 no-underline">
                The Story So Far
              </h4>

              <h2 className="text-2xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-3 md:mb-8">
                I'm Nirmal.
              </h2>

              <div className="space-y-2 md:space-y-6 text-xs md:text-xl opacity-70 leading-relaxed font-medium mb-4 md:mb-10 max-w-md md:max-w-none">
                <p>
                  I am a multi-disciplinary designer <br className="block md:hidden pb-0.5" />
                  and <span className="font-bold opacity-100">Computer Science student</span> <br className="block md:hidden pb-0.5" />
                  born and raised in the UAE.
                </p>
                <p>
                  My work lives at the edge <br className="block md:hidden pb-0.5" />
                  of design and logic, specializing <br className="block md:hidden pb-0.5" />
                  in <span className="text-[#c792ff] italic font-black">human-centered UI/UX.</span>
                </p>
              </div>

              {/* MOVING GREEN GRADIENT BUTTON: Placed below text */}
              <div className="relative inline-flex items-center justify-center p-[1.5px] overflow-hidden rounded-full group scale-90 md:scale-100">
                {/* Rotating Border Effect */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#22c55e_360deg)]"
                />

                {/* Button Content */}
                <div className="relative z-10 flex items-center gap-3 px-6 py-2 md:px-8 md:py-3 bg-white dark:bg-[#0a0a0a] rounded-full border border-black dark:border-transparent">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.3em]">Available for work</span>
                </div>
              </div>

              {/* MINIMALIST INFORMATION GRID - HIDDEN ON MOBILE TO FIT SCREEN */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12 pt-12 border-t border-black/10 dark:border-white/10 mb-8 place-items-center md:place-items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#c792ff] uppercase tracking-[0.3em] mb-2">Based In</span>
                  <span className="text-lg md:text-xl font-bold uppercase">Dubai, UAE</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#c792ff] uppercase tracking-[0.3em] mb-2">Currently working in</span>
                  <span className="text-lg md:text-xl font-bold uppercase">Google</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#c792ff] uppercase tracking-[0.3em] mb-2">Previous working</span>
                  <span className="text-lg md:text-xl font-bold opacity-40 uppercase">Independent Freelance</span>
                </div>
              </div>

              {/* VIEW RESUME BUTTON - HIDDEN ON MOBILE TO PREVENT CLUTTER */}
              <a
                href={resolvePath('/resume.pdf')}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-3 px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] text-sm rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95 mx-auto md:mx-0 mt-8"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Resume
              </a>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};
export default About;