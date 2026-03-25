import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, Check, Eye, Send, Reply, X } from 'lucide-react';
import { contactAPI } from '../../services/api';
import Toast from '../../components/Toast';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const load = () => {
    setLoading(true);
    contactAPI.getAll().then(r => setMessages(r.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markRead = async (id) => {
    try { await contactAPI.markRead(id); load(); } catch { setToast({ message: 'Failed to mark as read', type: 'error' }); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try { await contactAPI.delete(id); setToast({ message: 'Message deleted', type: 'success' }); setSelected(null); load(); }
    catch { setToast({ message: 'Failed to delete message', type: 'error' }); }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="pb-12 text-[var(--text-primary)] font-sans max-w-6xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[var(--glass-border)] pb-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="text-rose-400" size={18} />
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Manage Messages</h1>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Mes<span className="text-rose-400">sages</span></h2>
          <div className="flex items-center gap-4 mt-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--glass)] px-3 py-1.5 rounded-lg border border-[var(--glass-border)]">Total: {messages.length}</p>
            {unreadCount > 0 && (
              <p className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 box-shadow px-[0_0_10px_rgba(244,63,94,0.2)] animate-pulse">
                Unread: {unreadCount}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-6">
        
        {/* Messages List pane */}
        <div className={`flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 w-full ${selected ? 'hidden lg:flex lg:w-[400px] xl:w-[450px]' : ''}`}>
          {loading ? (
            <div className="flex flex-col gap-3">{[1,2,3,4,5].map(i => <div key={i} className="h-28 rounded-2xl bg-[var(--glass)] animate-pulse" />)}</div>
          ) : messages.length === 0 ? (
            <div className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] p-16 rounded-[2.5rem] text-center flex flex-col items-center h-full justify-center">
              <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-6">
                <Mail size={32} className="text-rose-400 opacity-50" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-[var(--text-primary)]/50">No Messages</h3>
              <p className="text-sm text-[var(--text-muted)]">There are currently no messages.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div 
                key={msg._id} 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => { setSelected(msg); if (!msg.read) markRead(msg._id); }}
                className={`group cursor-pointer relative overflow-hidden rounded-[1.5rem] p-5 transition-all
                  ${selected?._id === msg._id 
                    ? 'bg-rose-500/10 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]' 
                    : !msg.read 
                      ? 'bg-[var(--bg2)]/90 border-rose-400/30 shadow-[0_0_10px_rgba(244,63,94,0.05)] hover:border-rose-400/50' 
                      : 'bg-[var(--bg2)]/60 border-[var(--glass-border)] hover:bg-[var(--bg2)]/80 hover:border-[var(--glass)]'
                  } border`}
              >
                {!msg.read && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,1)]" />
                )}
                
                <div className="flex justify-between items-start gap-3 mb-2">
                  <h4 className={`font-bold text-sm truncate ${!msg.read ? 'text-rose-100' : 'text-[var(--text-secondary)]'}`}>{msg.name}</h4>
                  <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text-muted)] shrink-0 mt-0.5">
                    {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <p className="text-xs font-mono text-rose-400/70 truncate mb-3">{msg.email}</p>
                <p className={`text-xs line-clamp-2 leading-relaxed ${!msg.read ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>{msg.message}</p>
                
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!msg.read && (
                    <button onClick={e => { e.stopPropagation(); markRead(msg._id); }} className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-[var(--text-primary)] transition-colors border border-emerald-500/20">
                      <Check size={14} />
                    </button>
                  )}
                  <button onClick={e => { e.stopPropagation(); handleDelete(msg._id); }} className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-[var(--text-primary)] transition-colors border border-red-500/20">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Selected Message Pane */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div 
              key={selected._id}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className={`flex-1 bg-[var(--bg2)]/90 backdrop-blur-2xl border border-[var(--glass-border)] rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden relative ${!selected ? 'hidden lg:flex' : 'flex'}`}
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />

              <div className="p-8 border-b border-[var(--glass-border)] relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-black border border-[var(--glass-border)] rounded-full flex items-center justify-center text-rose-400 text-2xl font-black shadow-[inset_0_0_20px_rgba(244,63,94,0.1)]">
                      {selected.name[0]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{selected.name}</h2>
                      <p className="text-sm font-mono text-rose-400/80 tracking-tight">{selected.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-border)] transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="px-3 py-1.5 rounded-lg bg-black border border-[var(--glass-border)] text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] text-center inline-block">
                    {new Date(selected.createdAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-black border border-[var(--glass-border)] text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    ID: <span className="text-rose-400">{selected._id.slice(-8)}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <div className="bg-[var(--elevated)] border border-[var(--glass-border)] rounded-3xl p-8 relative">
                  <div className="absolute top-8 left-0 w-1 h-12 bg-rose-500/50 rounded-r-md" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6">Message Details</p>
                  <p className="text-[var(--text-secondary)] text-base leading-relaxed whitespace-pre-wrap font-medium">{selected.message}</p>
                </div>
              </div>

              <div className="p-6 border-t border-[var(--glass-border)] bg-black/20 flex gap-4 relative z-10">
                <button onClick={() => handleDelete(selected._id)} className="w-14 shrink-0 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-[var(--text-primary)] transition-colors border border-red-500/20">
                  <Trash2 size={20} />
                </button>
                <a href={`mailto:${selected.email}`} className="flex-1 flex items-center justify-center gap-3 bg-rose-500 text-slate-900 rounded-2xl font-bold shadow-[0_10px_30px_rgba(244,63,94,0.3)] hover:shadow-[0_10px_40px_rgba(244,63,94,0.5)] transition-shadow">
                  <Reply size={18} /> Reply to Message
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="hidden lg:flex flex-1 bg-[var(--bg2)]/40 border border-[var(--glass-border)] rounded-[2.5rem] items-center justify-center flex-col shadow-inner">
              <Eye size={48} className="text-[var(--text-primary)]/5 mb-4" />
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">No Message Selected</p>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AdminMessages;
