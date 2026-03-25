import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!creds.username || !creds.password) { setError('Authentication parameters missing.'); return; }
    const result = await login(creds);
    if (result.success) navigate('/admin/dashboard');
    else setError(result.message || 'Access Denied.');
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Deep Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none opacity-30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[var(--bg2)]/90 backdrop-blur-3xl border border-[var(--glass-border)] rounded-[2.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden group">
          
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          
          {/* Logo / Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-[1.5rem] bg-[var(--elevated)] border border-[var(--glass-border)] flex items-center justify-center mb-6 relative group-hover:border-accent/40 group-hover:shadow-[0_0_30px_rgba(0,242,255,0.2)] transition-all duration-700"
            >
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Shield size={36} className="text-[var(--text-primary)] relative z-10 group-hover:text-accent transition-colors duration-500" />
            </motion.div>
            <h1 className="font-black text-3xl text-[var(--text-primary)] tracking-tight mb-2">System <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary">Uplink</span></h1>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Provide clearance credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Designation</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={16} className="text-[var(--text-muted)]" />
                </div>
                <input
                  type="text"
                  value={creds.username}
                  onChange={e => setCreds(p => ({ ...p, username: e.target.value }))}
                  placeholder="admin"
                  className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl pl-11 pr-4 py-3.5 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent focus:bg-accent/5 focus:shadow-[0_0_20px_rgba(0,242,255,0.1)] transition-all"
                  autoComplete="username"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2">Passphrase</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={16} className="text-[var(--text-muted)]" />
                </div>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={creds.password}
                  onChange={e => setCreds(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-2xl pl-11 pr-12 py-3.5 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent focus:bg-accent/5 focus:shadow-[0_0_20px_rgba(0,242,255,0.1)] transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="text-xs font-bold text-red-400 text-center py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/20 overflow-hidden">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full relative overflow-hidden group/btn mt-2 bg-accent text-slate-900 rounded-2xl py-4 flex items-center justify-center font-bold text-sm shadow-[0_10px_30px_rgba(0,242,255,0.3)] disabled:opacity-70 transition-all"
            >
              <div className="absolute inset-0 bg-[var(--glass-border)] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Shield size={16} /></motion.div> Authenticating...</>
                ) : (
                  <>Grant Access <Shield size={16} /></>
                )}
              </span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
