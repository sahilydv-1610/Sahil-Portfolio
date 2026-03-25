import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingTabBar from './FloatingTabBar';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.22, ease: [0.25,0.46,0.45,0.94] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.14 } },
};

export default function Layout() {
  const location = useLocation();
  return (
    <div className="page-bg">
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="page-content"
          style={{ maxWidth: '100%' }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <FloatingTabBar />
    </div>
  );
}
