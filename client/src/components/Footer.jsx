import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Code2, Heart } from 'lucide-react';

const socials = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Mail, href: '#', label: 'Email' },
];

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/skills',       label: 'Skills' },
  { to: '/contact',      label: 'Contact' },
];

const Footer = () => (
  <footer className="relative z-10 mt-32">
    {/* Glowing top border */}
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
    
    <div className="bg-[var(--glass)] dark:bg-[var(--bg2)]/80 backdrop-blur-3xl border-t border-[var(--glass-border)] dark:border-[var(--glass-border)] relative overflow-hidden">
      {/* Abstract Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,242,255,0.3)] bg-gradient-to-br from-accent to-accent-secondary relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-[var(--glass-border)] blur-md translate-x-4 -translate-y-4" />
                <Code2 size={20} className="text-[var(--text-primary)] relative z-10 drop-shadow-md" />
              </div>
              <span className="font-extrabold text-xl tracking-tighter text-slate-900 dark:text-[var(--text-primary)]">
                SAHIL<span className="text-accent ml-0.5">.DEV</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-muted)] dark:text-[var(--text-muted)] max-w-sm">
              Architecting premium digital experiences across the multiverse with modern technology and elegant sci-fi design.
            </p>
            <div className="flex gap-4 mt-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                  className="w-10 h-10 bg-black/5 dark:bg-[var(--glass)] border border-black/10 dark:border-[var(--glass-border)] rounded-xl flex items-center justify-center hover:bg-accent/10 hover:border-accent/30 hover:text-accent transition-all duration-300 text-[var(--text-muted)] dark:text-[var(--text-muted)] group"
                >
                  <Icon size={16} className="group-hover:drop-shadow-[0_0_8px_var(--accent-glow)]" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] dark:text-[var(--text-muted)]">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link 
                    to={to} 
                    className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-accent dark:hover:text-accent font-medium transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] dark:text-[var(--text-muted)]">Get in Touch</h3>
            <p className="text-sm mb-6 text-[var(--text-muted)] dark:text-[var(--text-muted)] leading-relaxed">
              Have a visionary project in mind? Let's bend reality and build something amazing together.
            </p>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden px-8 py-3.5 rounded-2xl text-sm font-bold tracking-wide text-[var(--text-primary)] bg-accent shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,242,255,0.4)] group"
              >
                <div className="absolute inset-0 bg-[var(--glass-border)] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  Initiate Link <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </span>
              </motion.button>
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-black/5 dark:border-[var(--glass-border)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs flex items-center gap-1.5 font-medium tracking-wide text-[var(--text-muted)] dark:text-[var(--text-muted)]">
            Engineered with <Heart size={12} className="text-accent fill-accent animate-pulse" /> by Sahil 
            <span className="mx-2 opacity-50">|</span> 
            © {new Date().getFullYear()} System Online
          </p>
          <Link to="/admin" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-accent transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
            Admin Protocol
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
