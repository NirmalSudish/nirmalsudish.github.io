import React from 'react';
import ScrollReveal from '../common/ScrollReveal';

const Contact = () => {
  return (
    <div className="text-center px-6 md:px-8">
      <ScrollReveal>
        {/* Animated gradient shimmering text */}
        <h2 className="text-4xl md:text-6xl lg:text-[clamp(4.5rem,7.5vw,8rem)] font-black uppercase tracking-tighter leading-none mb-6 md:mb-8
                       bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 dark:from-violet-400 dark:via-fuchsia-300 dark:to-indigo-400 bg-clip-text text-transparent animate-text-gradient bg-[length:200%_auto]">
          LET'S WORK <br className="md:hidden" />TOGETHER
        </h2>
        <a href="mailto:nirmal.sudish@gmail.com" className="text-lg md:text-3xl font-bold opacity-60 hover:opacity-100 hover:text-purple-600 dark:hover:text-[#c792ff] transition-all duration-500 lowercase tracking-tight break-all">
          nirmal.sudish@gmail.com
        </a>
      </ScrollReveal>
    </div>
  );
};

export default Contact;