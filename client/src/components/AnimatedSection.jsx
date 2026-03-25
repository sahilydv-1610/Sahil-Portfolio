import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedSection({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(12px)', scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 1.2, 
        delay, 
        type: 'spring', 
        bounce: 0.3,
        damping: 25,
        stiffness: 120
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
