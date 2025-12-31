import React, { useState, useEffect } from 'react';

const TypewriterHero = () => {
  const fullText = "Hi, I'm Nirmal";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Only run if we haven't finished the full string
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        setIndex((prev) => prev + 1);
      }, 100); // Adjust speed here (100ms is standard)

      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  return (
    <div className="flex justify-center items-center py-20">
      <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">
        {displayedText}
        {/* This span creates the blinking cursor effect */}
        <span className="animate-pulse border-r-4 border-white ml-1">&nbsp;</span>
      </h1>
    </div>
  );
};

export default TypewriterHero;