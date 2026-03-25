import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import IconRenderer from '../IconRenderer';

const SkillGrid = ({ skills = [] }) => {
  const getExperienceLabel = (skill) => {
    const dateValue = skill.learnedAt || skill.createdAt;
    if (!dateValue) return 'Active Node';
    
    const start = new Date(dateValue);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (isNaN(diffDays)) return 'Active Node';
    if (diffDays < 30) return 'New Node';
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo Active`;
    return `${(diffDays / 365).toFixed(1)}yr Mastery`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {skills.map((skill, i) => (
            <motion.div
              layout
              key={skill._id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className="group relative"
            >
              <div 
                className="glass-card h-full p-8 border border-[var(--glass-border)] hover:border-[var(--accent)]/30 transition-all duration-500 rounded-[2rem] flex flex-col gap-6 relative overflow-hidden"
              >
                {/* Background Accent Glow */}
                <div 
                  className="absolute -top-24 -right-24 w-48 h-48 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{ backgroundColor: skill.color || 'var(--accent)' }}
                />

                {/* Card Header: Icon & Metadata */}
                <div className="flex items-start justify-between">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl group-hover:scale-110 transition-transform duration-500"
                    style={{ 
                      backgroundColor: `${skill.color || 'var(--accent)'}10`, 
                      borderColor: `${skill.color || 'var(--accent)'}30`,
                      color: skill.color || 'var(--accent)'
                    }}
                  >
                    <IconRenderer name={skill.icon} size={32} />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end text-[10px] font-black uppercase tracking-widest text-[var(--accent)] mb-1">
                      <TrendingUp size={10} /> {skill.level}%
                    </div>
                    <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">
                      {getExperienceLabel(skill)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-black text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {skill.name}
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">
                    {skill.category || 'System'}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity">
                    {skill.description || `Specialized implementation and optimization of ${skill.name} architectures.`}
                  </p>
                </div>

                {/* Progress Footer */}
                <div className="mt-auto pt-6 border-t border-[var(--glass-border)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Telemetry</span>
                    <span className="text-[9px] font-black text-[var(--text-primary)]">{skill.level}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg2)]/50 rounded-full overflow-hidden border border-[var(--glass-border)]">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "circOut" }}
                      className="h-full relative"
                      style={{ backgroundColor: skill.color || 'var(--accent)' }}
                    >
                      <div className="absolute top-0 right-0 w-8 h-full bg-white/30 blur-sm animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {skills.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-40 flex flex-col items-center justify-center text-center gap-4"
        >
          <h3 className="text-2xl font-black text-[var(--text-primary)]">No Matches Found</h3>
          <p className="text-[var(--text-secondary)] max-w-xs">Adjust your telemetry filters to locate the desired skill node.</p>
        </motion.div>
      )}
    </div>
  );
};

export default SkillGrid;
