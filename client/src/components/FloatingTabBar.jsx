import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Home, FolderOpen, Award, User, Mail, Sun, Moon, Brain, Github, Linkedin
} from 'lucide-react';
import { profileAPI } from '../services/api';

const TABS = [
  { to: '/',             label: 'Home',      Icon: Home       },
  { to: '/projects',     label: 'Projects',  Icon: FolderOpen },
  { to: '/certificates', label: 'Certs',     Icon: Award      },
  { to: '/skills',       label: 'Skills',    Icon: Brain      },
  { to: '/contact',      label: 'Contact',   Icon: Mail       },
];

export default function FloatingTabBar() {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    profileAPI.get().then(r => setProfile(r.data)).catch(console.error);
  }, []);

  const activeIdx = TABS.findIndex(
    t => t.to === pathname || (t.to !== '/' && pathname.startsWith(t.to))
  );

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'max-content',
        maxWidth: 'calc(100vw - 24px)',
        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
      }}
    >
      <div
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px', 
          gap: 6,
          background: 'var(--glass)',
          backdropFilter: 'blur(40px) saturate(2)',
          WebkitBackdropFilter: 'blur(40px) saturate(2)',
          border: '1px solid var(--glass-border)',
          borderRadius: 28,
          boxShadow: 'var(--glass-shadow), var(--glass-inner)',
        }}
      >
        {TABS.map((tab, idx) => {
          const active = idx === activeIdx;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 18px',
                  minWidth: 76,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  zIndex: 2,
                  transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
              >
                {active && (
                  <motion.div
                    layoutId="dock-active-bg"
                    className="absolute inset-0 bg-[var(--glass)] border border-[var(--glass-border)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[20px] -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 2}
                  style={{
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                    transition: 'color 0.25s ease',
                    marginBottom: 4,
                    filter: active ? 'drop-shadow(0 0 8px var(--accent-glow))' : 'none'
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                    transition: 'color 0.25s ease',
                    lineHeight: 1,
                  }}
                >
                  {tab.label}
                </span>
                
                {active && (
                  <motion.div
                    layoutId="dock-active-dot"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
            </Link>
          );
        })}

        {/* Separator */}
        <div style={{ width: 1, height: 28, background: 'var(--separator)', margin: '0 6px', borderRadius: 99, opacity: 0.6 }} />

        {/* Social Links */}
        {profile?.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px',
              borderRadius: '16px',
              color: 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Github size={20} />
          </a>
        )}
        {profile?.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px',
              borderRadius: '16px',
              color: 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Linkedin size={20} />
          </a>
        )}

        {/* Separator */}
        <div style={{ width: 1, height: 28, background: 'var(--separator)', margin: '0 6px', borderRadius: 99, opacity: 0.6 }} />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 14px',
            minWidth: 60,
            borderRadius: 18,
            background: 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { 
            e.currentTarget.style.background = 'rgba(120,120,128,0.08)'; 
            e.currentTarget.style.color = 'var(--accent)';
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.background = 'transparent'; 
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.92)'; }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isDark
            ? <Sun  size={20} strokeWidth={1.8} style={{ marginBottom: 2 }} />
            : <Moon size={20} strokeWidth={1.8} style={{ marginBottom: 2 }} />
          }
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1 }}>
            {isDark ? 'Light' : 'Dark'}
          </span>
        </button>
      </div>
    </div>
  );
}
