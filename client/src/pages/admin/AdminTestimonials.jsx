import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Users, Quote, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonialAPI } from '../../services/api';
import Toast from '../../components/Toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({ author: '', role: '', company: '', message: '', featured: true, avatar: null });
  const [editingId, setEditingId] = useState(null);

  const fetchT = async () => {
    try {
      setLoading(true);
      const { data } = await testimonialAPI.getAll();
      setTestimonials(data);
    } catch (err) { showToast('Failed to fetch', 'error'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchT(); }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleOpenModal = (t = null) => {
    if (t) {
      setEditingId(t._id);
      setFormData({ author: t.author, role: t.role || '', company: t.company || '', message: t.message, featured: t.featured, avatar: null, existingImage: t.avatar });
    } else {
      setEditingId(null);
      setFormData({ author: '', role: '', company: '', message: '', featured: true, avatar: null });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await testimonialAPI.delete(id);
      showToast('Deleted successfully');
      fetchT();
    } catch (err) { showToast('Failed to delete', 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'avatar' && formData[key]) fd.append('avatar', formData[key]);
        else if (key !== 'avatar') fd.append(key, formData[key]);
      });

      if (editingId) await testimonialAPI.update(editingId, fd);
      else await testimonialAPI.create(fd);

      showToast(editingId ? 'Testimonial Updated' : 'Testimonial Added');
      setIsModalOpen(false);
      fetchT();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to save', 'error'); }
  };

  return (
    <div className="pb-12 text-[var(--text-primary)] font-sans max-w-6xl mx-auto">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({show: false})} />}
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[var(--glass-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-emerald-400" size={18} />
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Manage Testimonials</h1>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Testi<span className="text-emerald-400">monials</span></h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">Total testimonials: {testimonials.length}</p>
        </div>
        <motion.button 
          onClick={() => handleOpenModal()} 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          className="bg-emerald-500 text-slate-900 px-6 py-3 rounded-[1.25rem] flex items-center justify-center gap-2 text-sm font-bold shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.5)] transition-shadow"
        >
          <Plus size={18} /> Add Testimonial
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? [1,2].map(i => <div key={i} className="h-64 rounded-[2rem] bg-[var(--glass)] animate-pulse" />) : testimonials.map((t, i) => (
          <motion.div 
            key={t._id} 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-6 flex flex-col justify-between group relative overflow-hidden transition-all hover:border-emerald-400/30 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none transition-all group-hover:bg-emerald-500/10" />
            <Quote size={80} className="absolute -top-4 -right-4 text-[var(--text-primary)]/[0.02] group-hover:text-emerald-400/5 transition-colors" />

            {t.featured && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[9px] font-black uppercase tracking-wider text-emerald-400">
                <CheckCircle2 size={10} /> Active
              </div>
            )}

            <p className="italic text-[var(--text-secondary)] text-sm leading-relaxed mb-6 flex-1 relative z-10">"{t.message}"</p>
            
            <div className="flex items-center gap-4 pt-4 border-t border-[var(--glass-border)] relative z-10 mt-auto">
              {t.avatar ? (
                <img src={`${BASE_URL}${t.avatar}`} alt="" className="w-12 h-12 rounded-full object-cover border border-[var(--glass-border)] group-hover:border-emerald-400/50 transition-colors shadow-lg" />
              ) : (
                <div className="w-12 h-12 bg-[var(--elevated)] border border-[var(--glass-border)] rounded-full flex items-center justify-center font-black text-emerald-400 text-lg group-hover:border-emerald-400/50 transition-colors shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]">
                  {t.author[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[var(--text-primary)] truncate">{t.author}</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] truncate">{t.role} {t.company && `// ${t.company}`}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => handleOpenModal(t)} className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors bg-[var(--glass)] hover:bg-[var(--glass-border)] rounded-lg"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(t._id)} className="w-8 h-8 flex items-center justify-center text-red-500/60 hover:text-[var(--text-primary)] transition-colors bg-red-500/10 hover:bg-red-500 rounded-lg"><Trash2 size={12} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-[var(--bg2)]/95 border border-[var(--glass-border)] rounded-[2.5rem] shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-[var(--glass-border)] bg-[var(--glass)]/50">
                <h2 className="font-bold text-xl flex items-center gap-2"><Users size={18} className="text-emerald-400" /> {editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--glass-border)] transition-colors"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Author Name</label>
                    <input required type="text" className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-emerald-400 focus:bg-emerald-400/5 focus:outline-none transition-all" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="e.g. John Doe" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Role</label>
                    <input type="text" className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-emerald-400 focus:bg-emerald-400/5 focus:outline-none transition-all" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. CEO" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Company</label>
                  <input type="text" className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-emerald-400 focus:bg-emerald-400/5 focus:outline-none transition-all" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="e.g. Acme Corp" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Message</label>
                  <textarea required rows={4} className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-emerald-400 focus:bg-emerald-400/5 focus:outline-none transition-all resize-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Enter endorsement text..." />
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[var(--glass-border)]">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Avatar Image</label>
                    <input type="file" accept="image/*" className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-3 py-3 text-[var(--text-primary)] text-[11px] focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-[var(--glass)] file:text-[var(--text-secondary)] hover:file:bg-[var(--glass-border)] cursor-pointer" onChange={e => setFormData({...formData, avatar: e.target.files[0]})} />
                  </div>
                  
                  <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative w-6 h-6 border-2 border-slate-600 rounded-md flex items-center justify-center group-hover:border-emerald-400 transition-colors">
                        <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="opacity-0 absolute inset-0 cursor-pointer" />
                        {formData.featured && <div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-[0_0_8px_var(--tw-colors-emerald-400)]" />}
                      </div>
                      <span className="text-sm font-bold text-[var(--text-secondary)]">Show on Home Page</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex gap-4 border-t border-[var(--glass-border)] mt-4">
                  <motion.button type="button" onClick={() => setIsModalOpen(false)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-4 rounded-2xl text-sm font-bold bg-[var(--glass)] hover:bg-[var(--glass-border)] transition-colors">Cancel</motion.button>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-4 rounded-2xl text-sm font-bold bg-emerald-500 text-slate-900 shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-shadow">
                    {editingId ? 'Save Changes' : 'Add Testimonial'}
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

export default AdminTestimonials;
