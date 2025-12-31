import React from 'react';
import { motion } from 'framer-motion';

const TransitionCurtain = () => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: '-100%' }}
      transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
      className="fixed inset-0 bg-black z-[9998] pointer-events-none"
    />
  );
};
export default TransitionCurtain;
