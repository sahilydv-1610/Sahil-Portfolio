import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderOpen, Award, MessageSquare, User, ArrowRight, Clock, Activity } from 'lucide-react';
import { projectsAPI, certificatesAPI, contactAPI, profileAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ projects: 0, certs: 0, messages: 0, unread: 0 });
  const [profile, setProfile] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [proj, cert, msgs, prof] = await Promise.all([
          projectsAPI.getAll(), certificatesAPI.getAll(), contactAPI.getAll(), profileAPI.get(),
        ]);
        setStats({
          projects: proj.data.length,
          certs: cert.data.length,
          messages: msgs.data.length,
          unread: msgs.data.filter(m => !m.read).length,
        });
        setRecentMessages(msgs.data.slice(0, 5));
        setProfile(prof.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const cards = [
    { label: 'Active Projects', value: stats.projects, icon: FolderOpen, color: 'text-cyan-400', border: 'border-cyan-400/20', bg: 'bg-cyan-400/5', to: '/admin/projects' },
    { label: 'Verified Certs', value: stats.certs, icon: Award, color: 'text-purple-400', border: 'border-purple-400/20', bg: 'bg-purple-400/5', to: '/admin/certificates' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/5', to: '/admin/messages' },
    { label: 'Unread Messages', value: stats.unread, icon: Clock, color: 'text-rose-400', border: 'border-rose-400/20', bg: 'bg-rose-400/5', to: '/admin/messages' },
  ];

  return (
    <div className="pb-16 text-[var(--text-primary)] font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[var(--glass-border)] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-accent" size={20} />
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Overview</h1>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Dash<span className="text-accent">board</span>.</h2>
          <p className="text-sm font-medium text-[var(--text-muted)] mt-2">
            Welcome back, Admin {profile?.name ? `(${profile.name})` : ''}.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" /> Online
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map(({ label, value, icon: Icon, color, border, bg, to }, i) => (
          <Link key={label} to={to} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative h-full bg-[var(--elevated)] backdrop-blur-xl border ${border} rounded-[2rem] p-6 overflow-hidden transition-all duration-300 group-hover:border-opacity-50 group-hover:-translate-y-1 shadow-lg`}
            >
              <div className={`absolute inset-0 ${bg} opacity-50 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl bg-[var(--elevated)] border border-[var(--glass-border)] flex items-center justify-center shadow-inner ${color}`}>
                    <Icon size={20} />
                  </div>
                  <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                </div>
                <div>
                  <div className="text-4xl font-black tracking-tight mb-1">
                    {loading ? <span className="opacity-20 animate-pulse">00</span> : value}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">{label}</div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comms Log (Recent Messages) */}
        <div className="lg:col-span-2 bg-[var(--bg2)]/80 backdrop-blur-2xl border border-[var(--glass-border)] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-4 mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <MessageSquare size={18} className="text-accent" />
              Recent Messages
            </h3>
            <Link to="/admin/messages" className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-[1.5rem] bg-[var(--glass)] animate-pulse" />)}
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
              <MessageSquare size={48} className="mb-4 text-[var(--text-muted)]" />
              <p className="text-sm font-medium uppercase tracking-widest">No new messages</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentMessages.map((msg, i) => (
                <motion.div 
                  key={msg._id} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className={`flex items-start gap-4 p-4 rounded-[1.5rem] border transition-all ${
                    msg.read 
                      ? 'bg-[var(--glass)]/50 border-[var(--glass-border)]' 
                      : 'bg-accent/5 border-accent/20 shadow-[0_4px_20px_rgba(0,242,255,0.05)]'
                  }`}
                >
                  <div className="mt-1">
                    {msg.read ? (
                      <div className="w-2 h-2 rounded-full bg-slate-600" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)] animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className={`text-sm font-bold truncate pr-3 ${msg.read ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>{msg.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex-shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`text-xs truncate ${msg.read ? 'text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}`}>{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Operations */}
        <div className="bg-[var(--bg2)]/80 backdrop-blur-2xl border border-[var(--glass-border)] rounded-[2.5rem] p-8 shadow-2xl flex flex-col">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b border-[var(--glass-border)] pb-4">
            <Activity className="text-purple-400" size={18} />
            Quick Actions
          </h3>
          <div className="flex flex-col gap-3 flex-1">
            {[
              { label: 'Add Project', to: '/admin/projects', icon: FolderOpen, color: 'hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/10' },
              { label: 'Add Certificate', to: '/admin/certificates', icon: Award, color: 'hover:border-purple-400 hover:text-purple-400 hover:bg-purple-400/10' },
              { label: 'Edit Profile', to: '/admin/profile', icon: User, color: 'hover:border-pink-400 hover:text-pink-400 hover:bg-pink-400/10' },
            ].map(({ label, to, icon: Icon, color }, i) => (
              <Link key={label} to={to}>
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-between p-4 rounded-2xl bg-[var(--elevated)] border border-[var(--glass-border)] text-[var(--text-muted)] transition-all duration-300 group ${color}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                  </div>
                  <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </motion.div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--text-primary)]/5 to-transparent animate-[shimmer_2s_infinite]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">System Status: <span className="text-emerald-400">Online</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
