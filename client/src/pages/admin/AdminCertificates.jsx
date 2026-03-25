import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Upload, Award, ExternalLink } from 'lucide-react';
import { certificatesAPI } from '../../services/api';
import Toast from '../../components/Toast';
import LazyImage from '../../components/LazyImage';

const emptyForm = { title: '', issuer: '', date: '', description: '', credentialUrl: '', featured: false, order: 0, existingImage: '' };

const AdminCertificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    certificatesAPI.getAll().then(r => setCerts(r.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setNewImage(null); setPreview(''); setModalOpen(true); };
  
  const openEdit = (cert) => {
    setEditing(cert._id);
    setForm({ 
      title: cert.title, issuer: cert.issuer, 
      date: cert.date ? cert.date.split('T')[0] : '', 
      description: cert.description || '', credentialUrl: cert.credentialUrl || '', 
      featured: cert.featured || false, order: cert.order || 0, existingImage: cert.image || '' 
    });
    setNewImage(null); setPreview('');
    setModalOpen(true);
  };

  const handleImg = (e) => {
    const f = e.target.files[0];
    if (f) { setNewImage(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.issuer) { setToast({ message: 'Title and issuer are required', type: 'error' }); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (newImage) fd.append('image', newImage);
      if (editing) await certificatesAPI.update(editing, fd);
      else await certificatesAPI.create(fd);
      setToast({ message: `Certificate ${editing ? 'updated' : 'added'} successfully!`, type: 'success' });
      setModalOpen(false); load();
    } catch (err) { setToast({ message: err.response?.data?.message || 'Failed to save', type: 'error' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try { await certificatesAPI.delete(id); setToast({ message: 'Deleted successfully', type: 'success' }); load(); }
    catch { setToast({ message: 'Failed to delete', type: 'error' }); }
  };

  return (
    <div className="pb-12 text-[var(--text-primary)] font-sans max-w-6xl mx-auto">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[var(--glass-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-yellow-400" size={18} />
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Manage Certificates</h1>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Certificates</h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">Total records: {certs.length}</p>
        </div>
        <motion.button 
          onClick={openCreate} 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          className="bg-yellow-500 text-slate-900 px-6 py-3 rounded-[1.25rem] flex items-center justify-center gap-2 text-sm font-bold shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:shadow-[0_10px_40px_rgba(234,179,8,0.5)] transition-shadow"
        >
          <Plus size={18} /> Add Certificate
        </motion.button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 rounded-[2rem] bg-[var(--glass)] animate-pulse" />)}
        </div>
      ) : certs.length === 0 ? (
        <div className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-[3rem] p-16 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 mb-6">
            <Award size={40} className="text-yellow-400 opacity-50" />
          </div>
          <h3 className="font-bold text-xl mb-2">No Certificates Found</h3>
          <p className="mb-8 text-[var(--text-muted)]">Add your first certificate to get started.</p>
          <motion.button onClick={openCreate} whileHover={{ scale: 1.05 }} className="bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] px-8 py-3 rounded-2xl text-sm font-bold transition-colors">Add Certificate</motion.button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, i) => (
            <motion.div 
              key={cert._id} 
              layout
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] overflow-hidden rounded-[2.5rem] flex flex-col group hover:border-yellow-400/40 hover:shadow-[0_20px_40px_rgba(234,179,8,0.1)] transition-all duration-500 shadow-xl"
            >

              <div className="w-32 h-32 mx-auto mt-8 flex-shrink-0 mb-4 overflow-hidden rounded-full border border-[var(--glass-border)] shadow-xl relative bg-[var(--elevated)] flex items-center justify-center p-2">

                {cert.featured && (
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/40 rounded-full text-[9px] font-black text-yellow-500 uppercase tracking-widest shadow-glow">
                    Featured
                  </div>
                )}
                {cert.image ? (
                  <LazyImage src={cert.image} alt={cert.title} className="w-full h-full object-cover filter drop-shadow-lg group-hover:scale-110 transition-transform duration-700 rounded-full" />
                ) : (
                  <Award size={64} className="text-[var(--text-primary)] opacity-10" />
                )}
              </div>

              <div className="p-8 flex flex-col flex-1 gap-4 text-center">
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-2 block opacity-80">{cert.issuer}</span>
                  <h3 className="font-extrabold text-2xl leading-tight mb-2 text-[var(--text-primary)] group-hover:text-yellow-400 transition-colors line-clamp-2">{cert.title}</h3>
                  {cert.date && (
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-4">
                      Issued: {new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  )}
                  <p className="text-xs text-[var(--text-secondary)] italic opacity-70 line-clamp-2">{cert.description || 'No description provided.'}</p>
                </div>
                
                <div className="flex gap-4 mt-4 pt-6 border-t border-[var(--glass-border)]">
                  <motion.button 
                    onClick={() => openEdit(cert)} 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                    className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold bg-[var(--glass)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] transition-all shadow-sm"
                  >
                    <Pencil size={14} className="text-yellow-400" /> Modify
                  </motion.button>
                  <motion.button 
                    onClick={() => handleDelete(cert._id)} 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                    className="w-14 py-3 rounded-2xl flex items-center justify-center text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}

        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[var(--bg2)]/95 border border-[var(--glass-border)] rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-[var(--glass-border)] bg-[var(--glass)]/50">
                <h2 className="font-bold text-xl flex items-center gap-2"><Award size={18} className="text-yellow-400" /> {editing ? 'Edit Certificate' : 'Add Certificate'}</h2>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--glass-border)] transition-colors"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} className="overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2">Title</label>
                    <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Advanced Google Analytics" className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-yellow-400 focus:bg-yellow-400/5 focus:outline-none transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2">Issuer</label>
                    <input type="text" value={form.issuer} onChange={e => setForm(p => ({ ...p, issuer: e.target.value }))} placeholder="e.g. Google, Coursera" className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-yellow-400 focus:bg-yellow-400/5 focus:outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[var(--glass-border)] py-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2">Date</label>
                    <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-yellow-400 focus:outline-none transition-all color-scheme-dark" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2">Order</label>
                    <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: +e.target.value }))} className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-yellow-400 focus:outline-none transition-all" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2">Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." rows={3} className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-yellow-400 focus:bg-yellow-400/5 focus:outline-none transition-all resize-none" />
                </div>
                
                <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-border)]">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2 flex items-center gap-2"><ExternalLink size={12}/> Credential URL</label>
                  <input type="url" value={form.credentialUrl} onChange={e => setForm(p => ({ ...p, credentialUrl: e.target.value }))} placeholder="https://..." className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-yellow-400 focus:bg-yellow-400/5 focus:outline-none transition-all" />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative w-6 h-6 border-2 border-slate-600 rounded-md flex items-center justify-center group-hover:border-yellow-400 transition-colors">
                      <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="opacity-0 absolute inset-0 cursor-pointer" />
                      {form.featured && <div className="w-3 h-3 bg-yellow-400 rounded-sm shadow-[0_0_8px_var(--tw-colors-yellow-400)]" />}
                    </div>
                    <span className="text-sm font-bold text-[var(--text-secondary)]">Set as Featured</span>
                  </label>
                </div>

                {/* Image */}
                <div className="pt-4 border-t border-[var(--glass-border)]">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2">Image</label>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} className="hidden" />
                    <motion.button type="button" onClick={() => fileRef.current?.click()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] flex items-center gap-2 text-xs font-bold transition-colors"><Upload size={14} /> Upload Image</motion.button>
                  </div>
                  {(preview || form.existingImage) && (
                    <div className="w-32 h-32 mx-auto rounded-full border-2 border-yellow-400/30 overflow-hidden bg-[var(--elevated)] p-2 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.1)] relative">
                      <LazyImage src={preview || form.existingImage} alt="preview" className="w-full h-full object-cover rounded-full" />
                    </div>
                  )}
                </div>

                <div className="border-t border-[var(--glass-border)] p-6 bg-black/20 -mx-8 -mb-8 mt-4 flex justify-end gap-4 rounded-b-[2.5rem]">
                  <motion.button type="button" onClick={() => setModalOpen(false)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3.5 rounded-2xl text-sm font-bold bg-[var(--glass)] hover:bg-[var(--glass-border)] transition-colors">Cancel</motion.button>
                  <motion.button type="submit" disabled={saving} whileHover={{ scale: saving ? 1 : 1.05 }} whileTap={{ scale: saving ? 1 : 0.95 }} className="px-10 py-3.5 rounded-2xl text-sm font-bold bg-yellow-500 text-slate-900 shadow-[0_10px_30px_rgba(234,179,8,0.3)] disabled:opacity-70 transition-all flex items-center gap-2">
                    {saving ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Award size={16} /></motion.div> Saving...</> : editing ? 'Save Changes' : 'Add Certificate'}
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

export default AdminCertificates;
