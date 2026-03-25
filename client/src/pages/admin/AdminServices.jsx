import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Terminal, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { serviceAPI } from '../../services/api';
import Toast from '../../components/Toast';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({ title: '', description: '', icon: '', skills: '', order: 0 });
  const [editingId, setEditingId] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await serviceAPI.getAll();
      setServices(data);
    } catch (err) { showToast('Database read failure', 'error'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleOpenModal = (srv = null) => {
    if (srv) {
      setEditingId(srv._id);
      setFormData({ title: srv.title, description: srv.description, icon: srv.icon || '', skills: srv.skills?.join(', ') || '', order: srv.order || 0 });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', icon: '', skills: '', order: 0 });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await serviceAPI.delete(id);
      showToast('Service deleted');
      fetchServices();
    } catch (err) { showToast('Failed to delete', 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };

      if (editingId) await serviceAPI.update(editingId, payload);
      else await serviceAPI.create(payload);

      showToast(editingId ? 'Service updated' : 'Service added');
      setIsModalOpen(false);
      fetchServices();
    } catch (err) { showToast(err.response?.data?.message || 'Transaction failed', 'error'); }
  };

  return (
    <div className="pb-12 text-[var(--text-primary)] font-sans max-w-6xl mx-auto">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({show: false})} />}
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[var(--glass-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Server className="text-cyan-400" size={18} />
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Manage Services</h1>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Ser<span className="text-cyan-400">vices</span></h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">Total services: {services.length}</p>
        </div>
        <motion.button 
          onClick={() => handleOpenModal()} 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          className="bg-cyan-400 text-slate-900 px-6 py-3 rounded-[1.25rem] flex items-center justify-center gap-2 text-sm font-bold shadow-[0_10px_30px_rgba(34,211,238,0.3)] hover:shadow-[0_10px_40px_rgba(34,211,238,0.5)] transition-shadow"
        >
          <Plus size={18} /> Add Service
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? [1,2,3].map(i => <div key={i} className="h-56 rounded-[2rem] bg-[var(--glass)] animate-pulse" />) : services.map((s, i) => (
          <motion.div 
            key={s._id} 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-6 flex flex-col justify-between group relative overflow-hidden transition-all hover:border-cyan-400/30 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-[40px] rounded-full pointer-events-none transition-all group-hover:bg-cyan-400/10" />
            
            <div className="flex items-start gap-4 mb-4 relative z-10">
              <div className="w-14 h-14 rounded-[1.25rem] bg-[var(--elevated)] border border-[var(--glass-border)] flex items-center justify-center text-2xl group-hover:border-cyan-400/40 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all">
                {s.icon || '✨'}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-[var(--text-primary)] leading-tight mb-1 group-hover:text-cyan-400 transition-colors">{s.title}</h3>
                <div className="flex gap-1 flex-wrap">
                  {s.skills?.slice(0, 2).map((skill, idx) => (
                    <span key={idx} className="text-[9px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">{skill}</span>
                  ))}
                  {s.skills?.length > 2 && <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text-muted)] bg-[var(--glass)] px-2 py-0.5 rounded-full border border-[var(--glass-border)]">+{s.skills.length - 2}</span>}
                </div>
              </div>
            </div>
            
            <p className="text-xs text-[var(--text-muted)] line-clamp-3 mb-6 relative z-10 flex-1">{s.description}</p>
            
            <div className="flex gap-3 justify-end relative z-10 border-t border-[var(--glass-border)] pt-4">
              <button onClick={() => handleOpenModal(s)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--glass)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] transition-colors text-[var(--text-secondary)]"><Edit2 size={14} /></button>
              <button onClick={() => handleDelete(s._id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:text-[var(--text-primary)] text-red-400 transition-colors"><Trash2 size={14} /></button>
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
              className="relative w-full max-w-lg bg-[var(--bg2)]/95 border border-[var(--glass-border)] rounded-[2.5rem] shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-[var(--glass-border)] bg-[var(--glass)]/50">
                <h2 className="font-bold text-xl flex items-center gap-2"><Terminal size={18} className="text-cyan-400" /> {editingId ? 'Edit Service' : 'Add Service'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--glass-border)] transition-colors"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Service Name</label>
                    <input required type="text" className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-cyan-400 focus:bg-cyan-400/5 focus:outline-none transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Backend Development" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Description</label>
                    <textarea required rows={3} className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-cyan-400 focus:bg-cyan-400/5 focus:outline-none transition-all resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the service..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-[var(--glass-border)] py-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Icon (Emoji or Text)</label>
                    <input type="text" className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-cyan-400 focus:bg-cyan-400/5 focus:outline-none transition-all text-center text-xl" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="🚀" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Order</label>
                    <input type="number" className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-cyan-400 focus:bg-cyan-400/5 focus:outline-none transition-all text-center" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pb-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Skills (Comma Separated)</label>
                  <input type="text" className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-cyan-400 focus:bg-cyan-400/5 focus:outline-none transition-all" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="Node.js, Postgres, Docker" />
                </div>

                <div className="pt-2 flex gap-4 border-t border-[var(--glass-border)] mt-4">
                  <motion.button type="button" onClick={() => setIsModalOpen(false)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-4 rounded-2xl text-sm font-bold bg-[var(--glass)] hover:bg-[var(--glass-border)] transition-colors">Cancel</motion.button>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-4 rounded-2xl text-sm font-bold bg-cyan-400 text-slate-900 shadow-[0_10px_30px_rgba(34,211,238,0.3)] transition-shadow">
                    {editingId ? 'Save Changes' : 'Add Service'}
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

export default AdminServices;
