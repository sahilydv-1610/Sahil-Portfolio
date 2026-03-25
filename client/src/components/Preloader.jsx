import { useEffect } from 'react';
import { motion } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  useEffect(() => {
    // Dynamically load a cursive font for the signature effect
    const fontId = 'dancing-script-font';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // 2.5s duration for the complete intro

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-[#050505]"
    >
      <div className="relative flex flex-col items-center">
        {/* Glow behind the signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute inset-0 bg-accent blur-[80px] rounded-full scale-150"
          style={{ background: 'var(--accent, #3dea34ff)' }}
        />
        
        <svg width="400" height="150" viewBox="0 0 400 150" className="relative z-10 w-full max-w-[80vw]">
          <motion.text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="130"
            fontFamily="'Dancing Script', cursive, sans-serif"
            fontWeight="bold"
            fill="transparent"
            stroke="var(--accent, #a11de4ff)"
            strokeWidth="3"
            style={{ filter: "drop-shadow(0px 0px 12px rgba(26, 29, 30, 0.8))" }}
            initial={{ strokeDasharray: 1000, strokeDashoffset: 1000, fill: "rgba(156, 223, 23, 0)", opacity: 0 }}
            animate={{ strokeDashoffset: 0, fill: "rgba(254, 0, 0, 1)", opacity: 1 }}
            transition={{
              strokeDashoffset: { duration: 2, ease: "easeInOut" },
              fill: { duration: 1, ease: "easeInOut", delay: 1.3 },
              opacity: { duration: 0.2 }
            }}
          >
            Sahil
          </motion.text>
        </svg>
      </div>
    </motion.div>
  );
};

export default Preloader;
