import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, Save, User as UserIcon, Shield, Activity, GraduationCap, Briefcase } from 'lucide-react';
import { profileAPI } from '../../services/api';
import Toast from '../../components/Toast';
import LazyImage from '../../components/LazyImage';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [newAvatar, setNewAvatar] = useState(null);
  const [newCv, setNewCv] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const avatarRef = useRef();
  const cvRef = useRef();

  useEffect(() => {
    profileAPI.get().then(r => {
      const p = r.data;
      setProfile(p);
      setForm({ name: p.name || '', role: p.role || '', bio: p.bio || '', about: p.about || '', email: p.email || '', phone: p.phone || '', location: p.location || '', github: p.github || '', linkedin: p.linkedin || '', twitter: p.twitter || '', website: p.website || '' });
      setExperience(p.experience || []);
      setEducation(p.education || []);
    }).catch(console.error);
  }, []);

  const handleAvatarChange = (e) => {
    const f = e.target.files[0];
    if (f) { setNewAvatar(f); setAvatarPreview(URL.createObjectURL(f)); }
  };

  const handleCvChange = (e) => {
    const f = e.target.files[0];
    if (f) setNewCv(f);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('experience', JSON.stringify(experience));
      fd.append('education', JSON.stringify(education));
      if (newAvatar) fd.append('avatar', newAvatar);
      else if (profile?.avatar) fd.append('existingAvatar', profile.avatar);
      
      if (newCv) fd.append('cvFile', newCv);
      else if (profile?.cvFile) fd.append('existingCvFile', profile.cvFile);

      await profileAPI.update(fd);
      setToast({ message: 'Profile updated.', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save', type: 'error' });
    } finally { setSaving(false); }
  };

  const addExp = () => setExperience(e => [...e, { role: '', company: '', duration: '', description: '', current: false, order: e.length }]);
  const updateExp = (i, k, v) => setExperience(e => e.map((ex, idx) => idx === i ? { ...ex, [k]: v } : ex));
  const removeExp = (i) => setExperience(e => e.filter((_, idx) => idx !== i));

  const addEdu = () => setEducation(e => [...e, { degree: '', institution: '', duration: '', description: '', order: e.length }]);
  const updateEdu = (i, k, v) => setEducation(e => e.map((ed, idx) => idx === i ? { ...ed, [k]: v } : ed));
  const removeEdu = (i) => setEducation(e => e.filter((_, idx) => idx !== i));

  const inputClass = "w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-[var(--text-primary)] text-sm focus:border-indigo-500 focus:bg-indigo-500/5 focus:outline-none transition-all placeholder:text-[var(--text-muted)]";
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2 mb-2";
  const sectionClass = "bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-[2.5rem] p-8 mb-8 relative overflow-hidden shadow-2xl";

  return (
    <div className="pb-12 text-[var(--text-primary)] font-sans max-w-5xl mx-auto">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[var(--glass-border)] pb-6 mt-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-indigo-500" size={18} />
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Manage Profile</h1>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Pro<span className="text-indigo-400">file</span></h2>
          <div className="flex items-center gap-4 mt-3">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--glass)] px-3 py-1.5 rounded-lg border border-[var(--glass-border)]">
              <Activity size={12} className="text-emerald-400" /> Online
            </p>
          </div>
        </div>
        <motion.button 
          onClick={handleSave} disabled={saving} 
          whileHover={{ scale: saving ? 1 : 1.05 }} whileTap={{ scale: saving ? 1 : 0.95 }}
          className="bg-indigo-500 text-[var(--text-primary)] px-8 py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_10px_40px_rgba(99,102,241,0.5)] transition-all disabled:opacity-70 disabled:shadow-none"
        >
          {saving ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Shield size={18} /></motion.div> Saving...</> : <><Save size={18} /> Save Profile</>}
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column - Core Identity & Media */}
        <div className="lg:col-span-1 space-y-8">
          {/* Avatar Module */}
          <div className={sectionClass}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <UserIcon size={16} className="text-indigo-400" />
              <h2 className="font-bold text-lg text-[var(--text-primary)]">Avatar</h2>
            </div>
            
            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] flex-shrink-0 bg-[var(--elevated)] p-1 group">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <LazyImage src={avatarPreview || profile?.avatar} alt="avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    fallback={<div className="w-full h-full flex items-center justify-center text-5xl font-black text-indigo-400 bg-indigo-500/10">{form.name?.[0] || 'X'}</div>} />
                </div>
              </div>
              <div className="w-full">
                <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                <motion.button type="button" onClick={() => avatarRef.current?.click()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 rounded-xl bg-[var(--glass)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                  <Upload size={14} /> Upload Image
                </motion.button>
              </div>
            </div>
          </div>

          {/* CV Module */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <Upload size={16} className="text-indigo-400" />
              <h2 className="font-bold text-lg text-[var(--text-primary)]">CV Document</h2>
            </div>
            
            <div className="flex flex-col gap-4 relative z-10">
              <div className="bg-[var(--elevated)] border border-[var(--glass-border)] rounded-xl p-4 flex flex-col items-center text-center">
                <p className="text-xs font-medium text-[var(--text-muted)] mb-1">Current Status</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                  {newCv ? newCv.name : profile?.cvFile ? 'Document Uploaded' : 'No Document Uploaded'}
                </p>
              </div>
              <input ref={cvRef} type="file" accept=".pdf" onChange={handleCvChange} className="hidden" />
              <motion.button type="button" onClick={() => cvRef.current?.click()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                <Upload size={14} /> Upload PDF
              </motion.button>
            </div>
          </div>
        </div>

        {/* Right Column - Data Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Identity Parameters */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 mb-8 relative z-10">
              <UserIcon size={16} className="text-indigo-400" />
              <h2 className="font-bold text-lg text-[var(--text-primary)]">Personal Details</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              {['name','role','email','phone','location','website','github','linkedin','twitter'].map(field => (
                <div key={field} className={field === 'website' || field.includes('Link') || field === 'github' || field === 'linkedin' || field === 'twitter' ? 'md:col-span-1' : ''}>
                  <label className={labelClass}>{field}</label>
                  <input type={field === 'email' ? 'email' : field.includes('Link') || field === 'github' || field === 'linkedin' || field === 'twitter' || field === 'website' ? 'url' : 'text'}
                    value={form[field] || ''} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                    className={inputClass} placeholder={`Enter ${field}...`} />
                </div>
              ))}
            </div>
            <div className="mt-6 relative z-10">
              <label className={labelClass}>Bio (Short)</label>
              <textarea value={form.bio || ''} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={2} className={`${inputClass} resize-none`} placeholder="Short description..." />
            </div>
            <div className="mt-6 relative z-10">
              <label className={labelClass}>About (Long)</label>
              <textarea value={form.about || ''} onChange={e => setForm(p => ({ ...p, about: e.target.value }))} rows={4} className={`${inputClass} resize-none`} placeholder="Detailed description..." />
            </div>
          </div>

          {/* Operational History */}
          <div className={sectionClass}>
            <div className="flex justify-between items-center mb-8 relative z-10 border-b border-[var(--glass-border)] pb-4">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-indigo-400" />
                <h2 className="font-bold text-lg text-[var(--text-primary)]">Experience</h2>
              </div>
              <motion.button onClick={addExp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[var(--glass)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] px-4 py-2 flex items-center gap-2 rounded-xl text-xs font-bold"><Plus size={14}/> Add Experience</motion.button>
            </div>
            
            <div className="space-y-6 relative z-10">
              {experience.length === 0 && <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider text-center py-8 border border-dashed border-[var(--glass-border)] rounded-2xl">No experience added</p>}
              
              <AnimatePresence>
                {experience.map((ex, i) => (
                  <motion.div key={`exp-${i}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-6 rounded-[1.5rem] mb-4 bg-[var(--elevated)] border border-[var(--glass-border)] relative group hover:border-indigo-500/30 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 rounded-l-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col gap-1">
                        <label className={labelClass}>Role/Position</label>
                        <input value={ex.role} onChange={e => updateExp(i, 'role', e.target.value)} className={inputClass} placeholder="Role / Position" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className={labelClass}>Company</label>
                        <input value={ex.company} onChange={e => updateExp(i, 'company', e.target.value)} className={inputClass} placeholder="Company" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className={labelClass}>Duration</label>
                        <input value={ex.duration} onChange={e => updateExp(i, 'duration', e.target.value)} className={inputClass} placeholder="e.g. 2022–2024" />
                      </div>
                      <div className="flex flex-col justify-center pt-6 px-4">
                        <label className="flex items-center gap-3 cursor-pointer group/chk">
                          <div className="relative w-5 h-5 border-2 border-slate-600 rounded-md flex items-center justify-center group-hover/chk:border-indigo-400 transition-colors">
                            <input type="checkbox" checked={ex.current} onChange={e => updateExp(i, 'current', e.target.checked)} className="opacity-0 absolute inset-0 cursor-pointer" />
                            {ex.current && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm shadow-[0_0_8px_var(--tw-colors-indigo-500)]" />}
                          </div>
                          <span className="text-xs font-bold text-[var(--text-muted)]">Current Role</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className={labelClass}>Description</label>
                      <textarea value={ex.description} onChange={e => updateExp(i, 'description', e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Description..." />
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t border-[var(--glass-border)]">
                      <motion.button onClick={() => removeExp(i)} whileTap={{ scale: 0.95 }} className="w-10 h-10 flex items-center justify-center text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl hover:bg-red-400 hover:text-[var(--text-primary)] transition-colors"><Trash2 size={16} /></motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Academic Records */}
          <div className={sectionClass}>
            <div className="flex justify-between items-center mb-8 relative z-10 border-b border-[var(--glass-border)] pb-4">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-indigo-400" />
                <h2 className="font-bold text-lg text-[var(--text-primary)]">Education</h2>
              </div>
              <motion.button onClick={addEdu} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[var(--glass)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] px-4 py-2 flex items-center gap-2 rounded-xl text-xs font-bold"><Plus size={14}/> Add Education</motion.button>
            </div>
            
            <div className="space-y-6 relative z-10">
              {education.length === 0 && <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider text-center py-8 border border-dashed border-[var(--glass-border)] rounded-2xl">No education added</p>}
              
              <AnimatePresence>
                {education.map((ed, i) => (
                  <motion.div key={`edu-${i}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-6 rounded-[1.5rem] mb-4 bg-[var(--elevated)] border border-[var(--glass-border)] relative group hover:border-indigo-500/30 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 rounded-l-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col gap-1">
                        <label className={labelClass}>Degree</label>
                        <input value={ed.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} className={inputClass} placeholder="Degree Name" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className={labelClass}>Institution</label>
                        <input value={ed.institution} onChange={e => updateEdu(i, 'institution', e.target.value)} className={inputClass} placeholder="Institution" />
                      </div>
                      <div className="flex flex-col gap-1 md:col-span-2">
                        <label className={labelClass}>Duration</label>
                        <input value={ed.duration} onChange={e => updateEdu(i, 'duration', e.target.value)} className={inputClass} placeholder="e.g. 2020–2024" />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className={labelClass}>Description</label>
                      <textarea value={ed.description} onChange={e => updateEdu(i, 'description', e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Academic achievements..." />
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t border-[var(--glass-border)]">
                      <motion.button onClick={() => removeEdu(i)} whileTap={{ scale: 0.95 }} className="w-10 h-10 flex items-center justify-center text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl hover:bg-red-400 hover:text-[var(--text-primary)] transition-colors"><Trash2 size={16} /></motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
