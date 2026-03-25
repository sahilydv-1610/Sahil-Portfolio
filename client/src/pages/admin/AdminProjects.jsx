import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Upload, Database, Code2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { projectsAPI } from '../../services/api';
import Toast from '../../components/Toast';
import LazyImage from '../../components/LazyImage';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const emptyForm = { title: '', duration: '', organization: '', description: '', techStack: '', githubLink: '', liveLink: '', featured: false, order: 0 };

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    projectsAPI.getAll().then(r => setProjects(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setNewImages([]);
    setPreviewImages([]);
    setExistingImages([]);
    setModalOpen(true);
  };

  const openEdit = (proj) => {
    setEditing(proj._id);
    setForm({
      title: proj.title, duration: proj.duration || '', organization: proj.organization || '', description: proj.description,
      techStack: proj.techStack?.join(', ') || '',
      githubLink: proj.githubLink || '', liveLink: proj.liveLink || '',
      featured: proj.featured || false, order: proj.order || 0,
    });
    setExistingImages(proj.images || []);
    setNewImages([]);
    setPreviewImages([]);
    setModalOpen(true);
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setPreviewImages(files.map(f => URL.createObjectURL(f)));
  };

  const removeExisting = (idx) => setExistingImages(imgs => imgs.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setToast({ message: 'Title and description are required', type: 'error' }); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('existingImages', JSON.stringify(existingImages));
      newImages.forEach(f => fd.append('images', f));
      if (editing) await projectsAPI.update(editing, fd);
      else await projectsAPI.create(fd);
        setToast({ message: `Project ${editing ? 'updated' : 'added'} successfully.`, type: 'success' });
      setModalOpen(false);
      load();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save', type: 'error' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      setToast({ message: 'Project deleted successfully', type: 'success' });
      load();
    } catch { setToast({ message: 'Failed to delete project', type: 'error' }); }
  };

  return (
    <div className="pb-12 text-[var(--text-primary)] font-sans max-w-6xl mx-auto">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[var(--glass-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Database className="text-accent" size={18} />
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Manage Projects</h1>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Proj<span className="text-accent">ects</span></h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">Total projects: {projects.length}</p>
        </div>
        <motion.button 
          onClick={openCreate} 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className="bg-accent text-slate-900 px-6 py-3 rounded-[1.25rem] flex items-center justify-center gap-2 text-sm font-bold shadow-[0_10px_30px_rgba(0,242,255,0.3)] hover:shadow-[0_10px_40px_rgba(0,242,255,0.5)] transition-shadow"
        >
          <Plus size={18} /> Add Project
        </motion.button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-72 rounded-[2rem] bg-[var(--glass)] animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-[3rem] p-16 text-center flex flex-col items-center shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-6">
            <Code2 size={40} className="text-accent opacity-50" />
          </div>
          <h3 className="font-bold text-xl mb-2">No Projects Found</h3>
          <p className="mb-8 text-[var(--text-muted)]">Add the first project to get started.</p>
          <motion.button onClick={openCreate} whileHover={{ scale: 1.05 }} className="bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] px-8 py-3 rounded-2xl text-sm font-bold transition-colors">
            Add Project
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, i) => (
            <motion.div 
              key={proj._id} 
              layout
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] overflow-hidden rounded-[2.5rem] flex flex-col group hover:border-accent/40 hover:shadow-[0_20px_40px_rgba(0,242,255,0.1)] transition-all duration-500 shadow-xl"
            >

              <div className="relative aspect-video overflow-hidden border-b border-[var(--glass-border)] bg-[var(--elevated)]">
                {proj.featured && (
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-accent/20 backdrop-blur-md border border-accent/40 rounded-full text-[10px] font-black text-accent uppercase tracking-widest shadow-glow">
                    Featured Project
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 transition-opacity group-hover:opacity-40" />
                <LazyImage 
                  src={proj.images?.[0]} 
                  alt={proj.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  fallback={
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--elevated)] to-transparent">
                      <Code2 size={48} className="opacity-10" />
                    </div>
                  } 
                />
              </div>

              <div className="p-8 flex flex-col flex-1 gap-4">
                <div className="flex-1">
                  <h3 className="font-extrabold text-2xl leading-tight mb-2 text-[var(--text-primary)] group-hover:text-accent transition-colors line-clamp-1">{proj.title}</h3>
                  <p className="text-xs font-semibold leading-relaxed text-[var(--text-muted)] line-clamp-2 opacity-80 mb-4">{proj.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {proj.techStack?.slice(0, 3).map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[var(--elevated)] border border-[var(--glass-border)] text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        {tech}
                      </span>
                    ))}
                    {proj.techStack?.length > 3 && (
                       <span className="px-2 py-0.5 rounded-md bg-[var(--glass)] border border-[var(--glass-border)] text-[9px] font-bold text-accent uppercase tracking-wider">
                        +{proj.techStack.length - 3} More
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-6 border-t border-[var(--glass-border)]">
                  <motion.button 
                    onClick={() => openEdit(proj)} 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold bg-[var(--glass)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] transition-all shadow-sm"
                  >
                    <Pencil size={14} className="text-accent" /> Edit Matrix
                  </motion.button>
                  <motion.button 
                    onClick={() => handleDelete(proj._id)} 
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
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[var(--bg2)]/95 border border-[var(--glass-border)] rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-[var(--glass-border)] bg-[var(--glass)]/50">
                <h2 className="font-bold text-xl flex items-center gap-2">
                  <Database size={18} className="text-accent" /> 
                  {editing ? 'Edit Project' : 'Add Project'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--glass-border)] transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar">
                
                {/* Header Inputs */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2">Project Title</label>
                    <input 
                      type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Portfolio Website" 
                      className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent focus:bg-accent/5 transition-all" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2">Duration / Period</label>
                      <input 
                        type="text" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                        placeholder="e.g. Jan 2024 - Present" 
                        className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent focus:bg-accent/5 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2">Organization / Company</label>
                      <input 
                        type="text" value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))}
                        placeholder="e.g. Google, Freelance" 
                        className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent focus:bg-accent/5 transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2">Description</label>
                    <textarea 
                      value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Enter project details..." rows={4} 
                      className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent focus:bg-accent/5 transition-all resize-none" 
                    />
                  </div>
                </div>

                <div className="border-t border-[var(--glass-border)] py-6 space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2">Tech Stack (Comma Separated)</label>
                    <input 
                      type="text" value={form.techStack} onChange={e => setForm(p => ({ ...p, techStack: e.target.value }))}
                      placeholder="React, Framer Motion, Node.js" 
                      className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent focus:bg-accent/5 transition-all" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2 flex items-center gap-2"><Code2 size={12}/> Repo Link</label>
                      <input 
                        type="url" value={form.githubLink} onChange={e => setForm(p => ({ ...p, githubLink: e.target.value }))}
                        placeholder="https://github.com/..." 
                        className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent focus:bg-accent/5 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2 flex items-center gap-2"><LinkIcon size={12}/> Live URL</label>
                      <input 
                        type="url" value={form.liveLink} onChange={e => setForm(p => ({ ...p, liveLink: e.target.value }))}
                        placeholder="https://..." 
                        className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent focus:bg-accent/5 transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--glass-border)] py-6 grid grid-cols-2 gap-6 items-center">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative w-6 h-6 border-2 border-slate-600 rounded-md flex items-center justify-center group-hover:border-accent transition-colors">
                      <input 
                        type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} 
                        className="opacity-0 absolute inset-0 cursor-pointer" 
                      />
                      {form.featured && <div className="w-3 h-3 bg-accent rounded-sm shadow-[0_0_8px_var(--accent)]" />}
                    </div>
                    <span className="text-sm font-bold text-[var(--text-secondary)]">Set as Featured</span>
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-bold text-[var(--text-secondary)]">Order:</label>
                    <input 
                      type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: +e.target.value }))}
                      className="w-20 bg-[var(--elevated)] border border-[var(--glass-border)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-center text-sm focus:outline-none focus:border-accent focus:bg-accent/5 transition-all" 
                    />
                  </div>
                </div>

                {/* Media Uploads */}
                <div className="border-t border-[var(--glass-border)] pt-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2">Images</label>
                    <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
                    <motion.button 
                      type="button" onClick={() => fileRef.current?.click()}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] flex items-center gap-2 text-xs font-bold transition-colors"
                    >
                      <Upload size={14} /> Upload Image
                    </motion.button>
                  </div>

                  <div className="flex flex-wrap gap-4 min-h-[5rem] p-4 rounded-2xl bg-black/20 border border-[var(--glass-border)] items-center">
                    {existingImages.length === 0 && previewImages.length === 0 && (
                      <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider w-full text-center">No images attached</p>
                    )}
                    
                    {existingImages.map((img, idx) => (
                      <div key={`ex-${idx}`} className="relative w-20 h-20 rounded-full overflow-hidden border border-[var(--glass-border)] group">
                        <LazyImage src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button" onClick={() => removeExisting(idx)}
                          className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    {previewImages.map((src, idx) => (
                      <div key={`new-${idx}`} className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-accent group shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[8px] font-black text-accent uppercase tracking-widest backdrop-blur-md">New</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-[var(--glass-border)] p-6 bg-black/20 -mx-8 -mb-8 mt-4 flex justify-end gap-4 rounded-b-[2.5rem]">
                  <motion.button 
                    type="button" onClick={() => setModalOpen(false)}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-8 py-3.5 rounded-2xl text-sm font-bold bg-[var(--glass)] hover:bg-[var(--glass-border)] transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="submit" disabled={saving}
                    whileHover={{ scale: saving ? 1 : 1.05 }} whileTap={{ scale: saving ? 1 : 0.95 }}
                    className="px-10 py-3.5 rounded-2xl text-sm font-bold bg-accent text-slate-900 shadow-[0_10px_30px_rgba(0,242,255,0.3)] disabled:opacity-70 transition-all flex items-center gap-2"
                  >
                    {saving ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Code2 size={16} /></motion.div> Saving...</>
                    ) : (
                      editing ? 'Save Changes' : 'Add Project'
                    )}
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

export default AdminProjects;
