import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, ArrowUpRight, TrendingUp } from 'lucide-react';
import IconRenderer from '../IconRenderer';

const SkillTimeline = ({ skills = [] }) => {
  // Group skills by year
  const groupedSkills = skills.reduce((acc, skill) => {
    const date = new Date(skill.learnedAt || skill.createdAt);
    const year = isNaN(date.getFullYear()) ? 'Active' : date.getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(skill);
    return acc;
  }, {});

  const years = Object.keys(groupedSkills).sort((a, b) => b === 'Active' ? -1 : (a === 'Active' ? 1 : b - a));

  const getExperience = (skill) => {
    const start = new Date(skill.learnedAt || skill.createdAt);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - start) / (1000 * 60 * 60 * 24));
    if (isNaN(diffDays)) return 'Active';
    if (diffDays < 30) return 'New';
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo exp`;
    return `${(diffDays / 365).toFixed(1)}yr exp`;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 relative pb-20">
      {years.map((year, yearIdx) => (
        <div key={year} className="mb-24 last:mb-0 relative">
          {/* Vertical Line Connector (behind nodes) */}
          <div className="absolute left-[39px] top-10 bottom-[-48px] w-px bg-gradient-to-b from-[var(--accent)]/40 via-[var(--accent)]/10 to-transparent group-last:hidden" />

          {/* Year Header */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 mb-12"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-[var(--accent)] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative px-8 py-3 rounded-2xl bg-[var(--accent)] text-[var(--bg)] font-black text-2xl shadow-[0_0_30px_var(--accent-glow)] border border-white/10">
                {year}
              </div>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent)]/40 to-transparent" />
          </motion.div>

          {/* Skills List */}
          <div className="space-y-10 ml-10 md:ml-20">
            {groupedSkills[year].map((skill, i) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                {/* Node Dot */}
                <div className="absolute left-[-51px] md:left-[-71px] top-8 w-6 h-6 rounded-full bg-[var(--bg)] border-2 border-[var(--accent)] flex items-center justify-center z-10 shadow-[0_0_15px_var(--accent-glow)] group-hover:scale-125 transition-transform duration-500">
                   <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                </div>

                <div className="glass-card group-hover:border-[var(--accent)]/40 transition-all duration-500 p-8 rounded-[2rem]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-5">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner group-hover:rotate-12 transition-transform duration-500"
                        style={{ backgroundColor: `${skill.color || 'var(--accent)'}10`, borderColor: `${skill.color || 'var(--accent)'}30`, color: skill.color || 'var(--accent)' }}
                      >
                        <IconRenderer name={skill.icon} size={32} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{skill.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1">
                           <span className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md"><Clock size={10} /> {getExperience(skill)}</span>
                           <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] opacity-30" />
                           <span style={{ color: skill.color || 'var(--accent)' }}>{skill.category || 'System'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Proficiency Level</div>
                          <div className="text-2xl font-black flex items-center justify-end gap-2" style={{ color: skill.color || 'var(--accent)' }}>
                            <TrendingUp size={16} /> {skill.level}%
                          </div>
                       </div>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic opacity-70 group-hover:opacity-100 transition-opacity mb-8 border-l-2 border-[var(--glass-border)] pl-4">
                    {skill.description || `Optimizing mission-critical ${skill.name} architectures and implementation cycles.`}
                  </p>

                  <div className="h-2 w-full bg-[var(--bg2)]/50 rounded-full overflow-hidden border border-[var(--glass-border)]">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "circOut" }}
                      className="h-full relative"
                      style={{ 
                        backgroundColor: skill.color || 'var(--accent)',
                        boxShadow: `0 0 15px ${skill.color || 'var(--accent)'}40`
                      }}
                    >
                      <div className="absolute top-0 right-0 w-12 h-full bg-white/20 blur-md animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && (
        <div className="py-40 flex flex-col items-center justify-center text-center gap-4 opacity-50">
          <Star size={40} className="text-[var(--text-muted)]" />
          <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-widest">No Archival Matches</h3>
          <p className="text-[var(--text-secondary)] text-sm">Adjust telemetry filters to synchronize historical records.</p>
        </div>
      )}
    </div>
  );
};

export default SkillTimeline;
