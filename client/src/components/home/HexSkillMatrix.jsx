import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Activity } from 'lucide-react';
import IconRenderer from '../IconRenderer';

const HexSkillMatrix = ({ skills = [] }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);

  const techSkills = skills.filter(s => s.category === 'Tech');
  const softSkills = skills.filter(s => s.category === 'Soft');

  const SkillGrid = ({ title, icon: Icon, data, accentColor }) => (
    <div className="mb-12 last:mb-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
          <Icon size={20} />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">{title}</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-[var(--glass-border)] to-transparent opacity-50" />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
        {data.map((skill, i) => {
          const color = skill.color || accentColor;
          const isSelected = selectedSkill?._id === skill._id;
          
          return (
            <motion.div
              key={skill._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onMouseEnter={() => setSelectedSkill(skill)}
              onMouseLeave={() => setSelectedSkill(null)}
              whileHover={{ scale: 1.1, translateY: -8, zIndex: 50 }}
              className="relative cursor-pointer"
            >
              <div 
                className={`w-[100px] h-[115px] relative flex items-center justify-center transition-all duration-300 ${isSelected ? 'shadow-[0_15px_40px_rgba(0,0,0,0.4)]' : ''}`}
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: isSelected ? `${color}40` : 'var(--glass)',
                  border: `1px solid ${isSelected ? color : 'var(--glass-border)'}`,
                }}
              >
                <div 
                  className="absolute inset-[2px] bg-[var(--bg2)]/90 backdrop-blur-xl flex flex-col items-center justify-center"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    backgroundColor: isSelected ? `${color}10` : undefined
                  }}
                >
                  <div className="mb-1 transition-transform duration-300" style={{ color: color, transform: isSelected ? 'scale(1.2)' : 'scale(1)' }}>
                    <IconRenderer name={skill.icon} size={32} />
                  </div>
                  <span className={`text-[9px] font-black tracking-[0.1em] uppercase text-center px-1 leading-tight ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {skill.name}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full relative min-h-[600px] bg-[var(--elevated)]/30 rounded-[3rem] border border-[var(--glass-border)] p-8 md:p-12 overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--accent-o10)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <SkillGrid 
            title="Technical Arsenal" 
            icon={Cpu} 
            data={techSkills} 
            accentColor="var(--accent)" 
          />
          <div className="my-16" />
          <SkillGrid 
            title="Soft Core" 
            icon={Activity} 
            data={softSkills} 
            accentColor="var(--accent-purple)" 
          />
        </div>

        {/* Info Panel - Fixed on Desktop, Floating on Mobile */}
        <div className="lg:w-80 shrink-0">
          <div className="sticky top-8 glass-card border border-[var(--glass-border)] min-h-[450px] transition-all duration-500 overflow-hidden flex flex-col relative"
               style={{ 
                 borderColor: selectedSkill ? `${selectedSkill.color}50` : 'var(--glass-border)',
                 boxShadow: selectedSkill ? `0 20px 50px ${selectedSkill.color}15` : 'none'
               }}>
            <AnimatePresence>
              {selectedSkill ? (
                <motion.div
                  key={selectedSkill._id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="absolute inset-0 p-8 flex flex-col"
                >
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-white/5"
                         style={{ backgroundColor: `${selectedSkill.color}20`, color: selectedSkill.color }}>
                      <IconRenderer name={selectedSkill.icon} size={48} />
                    </div>
                    <h4 className="font-black text-2xl text-[var(--text-primary)] leading-tight mb-2">{selectedSkill.name}</h4>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10" style={{ color: selectedSkill.color }}>
                      {selectedSkill.category} System
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Proficiency Level</span>
                        <span className="text-xl font-black text-[var(--text-primary)]">{selectedSkill.level || 0}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedSkill.level || 0}%` }}
                          transition={{ duration: 0.8, ease: "circOut" }}
                          className="h-full relative"
                          style={{ backgroundColor: selectedSkill.color || 'var(--accent)' }}
                        >
                          <div className="absolute top-0 right-0 w-8 h-full bg-white/20 blur-sm" />
                        </motion.div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic opacity-80">
                        "{selectedSkill.description || `Optimizing ${selectedSkill.name} integration within the core framework.`}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 p-12 flex flex-col items-center justify-center text-center group"
                >
                  <div className="w-16 h-16 rounded-full border border-[var(--glass-border)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Zap className="text-[var(--text-muted)] animate-pulse" size={24} />
                  </div>
                  <h4 className="font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest text-xs">Awaiting Input</h4>
                  <p className="text-[10px] text-[var(--text-muted)] leading-relaxed max-w-[180px]">
                    Hover over a skill node to initialize data synchronization and view detailed telemetry.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HexSkillMatrix;
