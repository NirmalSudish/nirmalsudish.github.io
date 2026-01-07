import React from 'react';

const BottomProgress = ({ activeSection, totalSections, onLineClick }) => {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center">
      <div className="flex gap-4 items-center">
        {Array.from({ length: totalSections }).map((_, index) => (
          <button key={index} onClick={() => onLineClick(index)} className="group relative h-6 flex items-center px-1">
            {/* Thicker lines */}
            <div className={`transition-all duration-700 rounded-full ${activeSection === index
              ? 'w-14 h-[4px] bg-[#c792ff] shadow-[0_0_15px_rgba(199,146,255,0.7)]'
              : 'w-8 h-[2px] bg-black/10 dark:bg-white/10 group-hover:bg-black/30 dark:group-hover:bg-white/30'
              }`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomProgress;