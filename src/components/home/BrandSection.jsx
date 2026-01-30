import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../common/ScrollReveal';

const BrandSection = () => {
  // Array of client logos to be used in the marquee
  const logos = Array(12).fill({
    name: 'RAFFLES',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Emaar_Properties_logo.svg/2560px-Emaar_Properties_logo.svg.png'
  });

  return (
    <div className="h-auto md:h-[100dvh] flex flex-col justify-center text-center px-6 w-full max-w-[90vw] lg:max-w-6xl xl:max-w-7xl mx-auto">
      {/* 5-LINE PHILOSOPHY: Each line is forced to stay on one line for desktop */}
      <ScrollReveal>
        <div className="text-xl md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium leading-[1.2] mb-12 uppercase tracking-tight">
          <div className="">DRIVEN BY THE LOGIC OF SYSTEMS AND</div>
          <div className="">THE PRECISION OF VISUAL COMMUNICATION.</div>
          <div className="">I BUILD <span className="font-black">HIGH-END DIGITAL PRODUCTS</span></div>
          <div className="">THAT BRIDGE THE GAP BETWEEN COMPLEX</div>
          <div className="">ENGINEERING AND <span className="text-purple-600 dark:text-[#c792ff] font-black italic">HUMAN-CENTERED UI/UX DESIGN.</span></div>
        </div>
      </ScrollReveal>

      {/* CLIENT MARQUEE PILL SECTION */}
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
        {/* Color updated to text-white for high visibility */}
        <p className="text-xs font-black uppercase tracking-[0.5em] mb-8">
          Clients I have worked for
        </p>

        <div className="bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full py-6 px-6 md:px-12 w-full overflow-hidden">
          {/* Moving marquee uses the infinite animation from index.css */}
          <div className="flex animate-marquee-slow w-max gap-20 items-center grayscale opacity-40">
            {logos.map((logo, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <img src={logo.src} className="h-4 md:h-6 w-auto brightness-0 dark:invert" alt={logo.name} />
                <span className="text-[8px] tracking-widest uppercase">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSection;