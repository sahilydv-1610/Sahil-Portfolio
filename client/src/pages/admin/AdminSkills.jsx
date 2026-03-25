import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Brain, Code, Network } from 'lucide-react';
import { skillsAPI } from '../../services/api';
import IconRenderer from '../../components/IconRenderer';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Tech', level: 50, color: '#00f2ff', icon: 'Code', description: '', projects: '', learnedAt: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await skillsAPI.getAll();
      setSkills(res.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (skill = null) => {
    if (skill) {
      setCurrentSkill(skill);
      setFormData({
        name: skill.name, category: skill.category, level: skill.level,
        color: skill.color, icon: skill.icon, description: skill.description || '',
        projects: skill.projects ? skill.projects.join(', ') : '',
        learnedAt: skill.learnedAt ? new Date(skill.learnedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setCurrentSkill(null);
      setFormData({
        name: '', category: 'Tech', level: 50, color: '#00f2ff', icon: 'Code', description: '', projects: '',
        learnedAt: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        projects: formData.projects.split(',').map(p => p.trim()).filter(p => p)
      };
      if (currentSkill) await skillsAPI.update(currentSkill._id, submitData);
      else await skillsAPI.create(submitData);
      
      fetchSkills();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving skill:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await skillsAPI.delete(id);
        fetchSkills();
      } catch (err) {
        console.error('Error deleting skill:', err);
      }
    }
  };

  return (
    <div className="pb-12 text-[var(--text-primary)] font-sans max-w-6xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[var(--glass-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Network className="text-purple-400" size={18} />
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Manage Skills</h1>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Skills</h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">Total skills: {skills.length}</p>
        </div>
        <motion.button 
          onClick={() => handleOpenModal()} 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className="bg-purple-500 text-[var(--text-primary)] px-6 py-3 rounded-[1.25rem] flex items-center justify-center gap-2 text-sm font-bold shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:shadow-[0_10px_40px_rgba(168,85,247,0.5)] transition-shadow"
        >
          <Plus size={18} /> Add Skill
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {skills.map((skill) => (
            <motion.div
              layout
              key={skill._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-6 flex flex-col justify-between group relative overflow-hidden transition-all hover:border-[var(--accent-color)] shadow-xl"
              style={{ '--glow-color': `${skill.color}40`, '--accent-color': skill.color }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-10 group-hover:opacity-30 pointer-events-none transition-opacity" style={{ backgroundColor: skill.color }} />
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl transition-transform group-hover:rotate-12"
                  style={{ backgroundColor: `${skill.color}15`, borderColor: `${skill.color}30`, color: skill.color }}
                >
                  <IconRenderer name={skill.icon} size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1 text-[var(--text-primary)]">{skill.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors">
                      {skill.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[var(--glass-border)]" />
                    <span className="text-xs font-black" style={{ color: skill.color }}>
                      Lvl {skill.level}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <p className="text-xs text-[var(--text-secondary)] opacity-70 line-clamp-2 italic mb-4">
                  {skill.description || 'No description provided.'}
                </p>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-[var(--elevated)] rounded-full overflow-hidden border border-[var(--glass-border)] shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    className="h-full rounded-full shadow-[0_0_15px_var(--accent-color)]" 
                    style={{ backgroundColor: skill.color }} 
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
                   <div className="flex -space-x-2">
                      {skill.projects?.slice(0, 3).map((p, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-[var(--elevated)] border border-[var(--glass-border)] flex items-center justify-center text-[8px] font-bold text-[var(--text-muted)]" title={p}>
                           {p[0]}
                        </div>
                      ))}
                      {skill.projects?.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center text-[8px] font-bold text-[var(--accent-color)]">
                           +{skill.projects.length - 3}
                        </div>
                      )}
                   </div>
                   <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => handleOpenModal(skill)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--glass)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] transition-colors"
                    >
                      <Pencil size={14} className="text-[var(--text-secondary)]" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(skill._id)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:text-[var(--text-primary)] text-red-400 transition-colors shadow-lg"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[var(--bg2)]/95 border border-[var(--glass-border)] rounded-[2.5rem] shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-[var(--glass-border)] bg-[var(--glass)]/50">
                <h2 className="font-bold text-xl flex items-center gap-2">
                  <Network size={18} className="text-purple-400" />
                  {currentSkill ? 'Edit Skill' : 'Add Skill'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--glass-border)] transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Skill Name</label>
                    <input
                      type="text" required
                      className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-purple-500 focus:bg-purple-500/5 focus:outline-none transition-all"
                      placeholder="e.g. React"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Category</label>
                      <select
                        className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-purple-500 focus:outline-none transition-all appearance-none"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Tech">Tech</option>
                        <option value="Soft">Soft</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Color (Hex)</label>
                      <div className="relative flex items-center w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl overflow-hidden pr-3 focus-within:border-purple-500 transition-all">
                        <input
                          type="color"
                          className="w-12 h-14 bg-transparent border-none cursor-pointer p-0"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                        <span className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider pl-2">{formData.color}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Icon Name</label>
                      <input
                        type="text"
                        className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="e.g. Code, Brain..."
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2 flex justify-between">
                        Level 
                        <span className="text-purple-400">{formData.level}%</span>
                      </label>
                      <div className="h-14 flex items-center px-2">
                        <input
                          type="range"
                          min="0" max="100"
                          className="w-full h-2 bg-black/60 rounded-full appearance-none cursor-pointer outline-none border border-[var(--glass-border)] shadow-inner overflow-hidden"
                          style={{
                             background: `linear-gradient(to right, ${formData.color} ${formData.level}%, rgba(0,0,0,0.4) ${formData.level}%)`
                          }}
                          value={formData.level}
                          onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Description</label>
                    <textarea
                      required rows={2}
                      className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-purple-500 focus:outline-none transition-all resize-none"
                      placeholder="Brief description of expertise..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Date Learned</label>
                      <input
                        type="date"
                        className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-purple-500 focus:outline-none transition-all"
                        value={formData.learnedAt}
                        onChange={(e) => setFormData({ ...formData, learnedAt: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Linked Projects (Comma Separated)</label>
                      <input
                        type="text"
                        className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="e.g. Project Alpha, Web Portal"
                        value={formData.projects}
                        onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--glass-border)] pt-6 mt-4 flex gap-4">
                  <motion.button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 py-4 rounded-2xl text-sm font-bold bg-[var(--glass)] hover:bg-[var(--glass-border)] transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 py-4 rounded-2xl text-sm font-bold bg-purple-500 text-[var(--text-primary)] shadow-[0_10px_30px_rgba(168,85,247,0.3)] transition-shadow"
                  >
                    {currentSkill ? 'Save Changes' : 'Save Skill'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSkills;
