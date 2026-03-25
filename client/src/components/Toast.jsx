import { motion } from 'framer-motion';

const Toast = ({ message, type = 'success', onClose }) => {
  const colors = {
    success: { bg: 'linear-gradient(135deg, #059669, #10b981)', icon: '✅' },
    error: { bg: 'linear-gradient(135deg, #dc2626, #b91c1c)', icon: '❌' },
    info: { bg: 'var(--accent-gradient)', icon: 'ℹ️' },
  };
  const style = colors[type] || colors.success;

  return (
    <motion.div
      initial={{ opacity: 0, y: -40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed top-24 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl text-[var(--text-primary)] shadow-glass-lg"
      style={{ background: style.bg, minWidth: '280px' }}
    >
      <span>{style.icon}</span>
      <p className="font-medium text-sm flex-1">{message}</p>
      <button
        onClick={onClose}
        className="opacity-70 hover:opacity-100 text-lg leading-none ml-2"
      >
        ×
      </button>
    </motion.div>
  );
};

export default Toast;
