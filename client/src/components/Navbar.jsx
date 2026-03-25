import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Code2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/skills', label: 'Skills' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}
      >
        <div className="w-full max-w-5xl px-4 md:px-6">
          <div className="bg-[var(--glass)] dark:bg-[var(--bg2)]/60 backdrop-blur-3xl border border-[var(--glass-border)] dark:border-[var(--glass-border)] rounded-[2rem] px-6 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-500">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group relative">
              <div className="absolute inset-0 bg-accent glow-pulse blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="w-10 h-10 rounded-[14px] flex items-center justify-center relative z-10"
                style={{ 
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 4px 12px rgba(0,242,255,0.4)'
                }}
              >
                <Code2 size={20} className="text-[var(--text-primary)] drop-shadow-md" />
              </motion.div>
              <span className="font-extrabold text-xl tracking-tighter text-slate-900 dark:text-[var(--text-primary)] relative z-10">
                SAHIL<span className="text-accent ml-0.5"></span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-300 text-[var(--text-muted)] dark:text-[var(--text-secondary)] hover:text-slate-900 dark:hover:text-[var(--text-primary)]"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-black/5 dark:bg-[var(--glass-border)] rounded-xl border border-black/5 dark:border-[var(--glass-border)] shadow-sm"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 tracking-wide">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 rounded-xl glass flex items-center justify-center"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isDark ? 'sun' : 'moon'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={() => setMenuOpen((o) => !o)}
                whileTap={{ scale: 0.9 }}
                className="md:hidden w-9 h-9 rounded-xl glass flex items-center justify-center"
              >
                {menuOpen ? <X size={16} /> : <Menu size={16} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-24 left-4 right-4 z-40 bg-[var(--glass-border)] dark:bg-[var(--bg2)]/80 backdrop-blur-3xl border border-[var(--glass)] dark:border-[var(--glass-border)] shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-[2rem] p-6 flex flex-col gap-2 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />
            
            {navLinks.map((link, i) => {
              const isActive = location.pathname === link.to;
              return (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1, type: 'spring', stiffness: 300 }}
                >
                  <Link
                    to={link.to}
                    className={`block w-full px-6 py-4 rounded-2xl text-lg font-bold tracking-wide transition-all duration-300 ${
                      isActive 
                        ? 'bg-accent/10 text-accent border border-accent/20' 
                        : 'text-[var(--text-muted)] dark:text-[var(--text-secondary)] hover:bg-[var(--glass)] hover:text-[var(--text-primary)] border border-transparent'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
