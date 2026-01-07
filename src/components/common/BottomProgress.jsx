import React from 'react';

const BottomProgress = ({ activeSection, totalSections, onLineClick }) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col items-center gap-6">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button key={index} onClick={() => onLineClick(index)} className="group relative flex items-center justify-center p-2">
          <div className={`transition-all duration-500 rounded-full ${activeSection === index
            ? 'w-3 h-3 bg-[#c792ff] shadow-[0_0_10px_rgba(199,146,255,0.7)] scale-125'
            : 'w-2 h-2 bg-black/20 dark:bg-white/20 group-hover:bg-black/40 dark:group-hover:bg-white/40'
            }`} />
        </button>
      ))}
    </div>
  );
};

export default BottomProgress;