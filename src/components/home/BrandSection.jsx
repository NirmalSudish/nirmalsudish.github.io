import React from 'react';
import ScrollReveal from '../common/ScrollReveal';

const BrandSection = () => {
  // 15 slots for client logos. 
  // Replace the 'src' with your actual image paths from your public folder.
  const logos = [
    { name: 'Client 1', src: '/images/Yamanote Logo_White.png', scale: 1.4 },
    { name: 'Client 2', src: '/images/four-2.png', scale: 2.2 }, // Four Seasons has extreme padding
    { name: 'Client 3', src: '/images/HardeesArtboard.png', scale: 0.65 }, // Hardees is very wide
    { name: 'Client 4', src: '/images/LOGOS-02.png', scale: 1.2 },
    { name: 'Client 5', src: '/images/logo-white.png', scale: 1.2 },
    { name: 'Client 6', src: '/images/LunaArtboard.png', scale: 1.4 },
    { name: 'Client 7', src: '/images/MatagiArtboard.png', scale: 0.9 },
    { name: 'Client 8', src: '/images/mercuryArtboard.png', scale: 0.85 },
    { name: 'Client 9', src: '/images/MinaArtboard.png', scale: 1.1 },
    { name: 'Client 10', src: '/images/SolaArtboard.png', scale: 1.3 },
    { name: 'Client 11', src: '/images/white-logo.png', scale: 1.3 },
    { name: 'Client 12', src: '/images/Tomologo.png', scale: 1.3 },
    { name: 'Client 13', src: '/images/SeafuArtboard.png', scale: 1.4 },
    { name: 'Client 14', src: '/images/Raffles.png', scale: 1.1 },
    { name: 'Client 15', src: '/images/PiattiArtboard.png', scale: 1.0 },
  ];

  return (
    <div className="h-auto md:h-[100dvh] flex flex-col justify-center text-center px-6 w-full max-w-[90vw] lg:max-w-6xl xl:max-w-7xl mx-auto">
      {/* 5-LINE PHILOSOPHY */}
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
        <p className="text-xs font-black uppercase tracking-[0.5em] mb-8">
          Clients I have worked for
        </p>

        <div className="bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full py-6 px-6 md:px-12 w-full overflow-hidden">
          {/* Two identical sets — translateX(-50%) moves exactly one full set off screen for a seamless loop */}
          <div
            className="flex w-max gap-16 md:gap-20 items-center grayscale opacity-50"
            style={{ animation: 'marquee 50s linear infinite' }}
          >
            {[...logos, ...logos].map((logo, i) => (
              <div key={i} className="flex flex-col items-center justify-center shrink-0 w-24 md:w-32 h-12">
                <img
                  src={logo.src}
                  // Apply the custom optical scale factor directly! 
                  style={{ transform: `scale(${logo.scale || 1})`, transition: 'transform 0.3s ease' }}
                  className="max-w-full max-h-full object-contain brightness-0 dark:invert"
                  alt={logo.name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSection;