import React from 'react';
import { motion } from 'framer-motion';

const PageReveal = () => {
  return (
    <motion.div
      initial={{ opacity: 1, backdropFilter: 'blur(20px)' }}
      animate={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 bg-white/80 dark:bg-black/80 z-[9998] pointer-events-none"
    />
  );
};

export default PageReveal;
