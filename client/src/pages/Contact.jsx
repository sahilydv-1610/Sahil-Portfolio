import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { contactAPI } from '../services/api';
import AnimatedSection from '../components/AnimatedSection';
import Toast from '../components/Toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSending(true);
    try {
      await contactAPI.send(form);
      setToast({ message: 'Message encrypted & transmitted successfully! 🚀', type: 'success' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Transmission failed. Retrying... or not.', type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pb-32 pt-10 relative">
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Abstract Backgrounds */}
      <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <AnimatedSection className="mb-16">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] backdrop-blur-md mb-6 shadow-glass">
          <Send size={18} className="text-accent" />
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Comms Link</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--text-secondary)] mb-6 drop-shadow-lg">
          Initiate <span className="text-accent">Contact</span>.
        </h1>
        <p className="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Open a secure channel. Whether it's a project inquiry, a collaboration proposal, or just a digital greeting.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Info Cards Side */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AnimatedSection delay={0.1}>
            <div className="bg-[var(--bg2)]/80 backdrop-blur-2xl border border-[var(--glass-border)] rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
                <Send size={140} />
              </div>
              
              {[
                { icon: Mail, title: 'Direct Comm', subtitle: 'Always open for new opportunities', value: 'sahilydv114@gmail.com', color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
                { icon: MessageSquare, title: 'Response Time', subtitle: 'Typical response latency < 24h', value: 'Active Monitoring', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
                { icon: User, title: 'Freelance Status', subtitle: 'Currently accepting new directives', value: 'Available Now', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
              ].map(({ icon: Icon, title, subtitle, value, color, bg }, i) => (
                <div key={title} className="flex gap-5 relative z-10 group">
                  <div className={`w-14 h-14 rounded-[1.5rem] border ${bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <Icon size={22} className={color} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-[var(--text-primary)] text-base leading-tight mb-1">{title}</h3>
                    <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{subtitle}</p>
                    <p className={`text-sm font-black ${color} drop-shadow-md`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Message Form Section */}
        <AnimatedSection className="lg:col-span-7 h-full" delay={0.3}>
          <form onSubmit={handleSubmit} className="h-full bg-[var(--bg2)]/80 backdrop-blur-2xl border border-[var(--glass-border)] rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col gap-8 relative overflow-hidden group/form inline-block w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-focus-within/form:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Inputs */}
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex justify-between items-center mb-2 px-1 border-b border-[var(--glass-border)] pb-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Transmission Payload</h2>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[var(--text-muted)]">Secure AES-256</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2 flex items-center gap-2">
                    <User size={12} className="text-accent" /> Identifier
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your designation"
                    className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-[1.5rem] px-5 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent focus:bg-accent/5 focus:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-all"
                  />
                  {errors.name && <p className="text-xs font-bold mt-1 text-red-400 px-2 animate-pulse">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2 flex items-center gap-2">
                    <Mail size={12} className="text-accent" /> Return Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nexus@node.com"
                    className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-[1.5rem] px-5 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent focus:bg-accent/5 focus:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-all"
                  />
                  {errors.email && <p className="text-xs font-bold mt-1 text-red-400 px-2 animate-pulse">{errors.email}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-2 flex items-center gap-2">
                  <MessageSquare size={12} className="text-accent" /> Encrypted Data
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Insert transmission payload here..."
                  rows={6}
                  className="w-full bg-[var(--elevated)] border border-[var(--glass-border)] rounded-[1.5rem] px-5 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent focus:bg-accent/5 focus:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-all resize-none"
                />
                {errors.message && <p className="text-xs font-bold mt-1 text-red-400 px-2 animate-pulse">{errors.message}</p>}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-[var(--glass-border)] flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider max-w-[250px]">
                Authentication signature applied upon transmission.
              </p>
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: sending ? 1 : 1.05 }}
                whileTap={{ scale: sending ? 1 : 0.95 }}
                className="w-full md:w-auto overflow-hidden relative group px-10 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 text-sm font-bold text-[var(--text-primary)] bg-accent shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_10px_30px_rgba(0,242,255,0.4)] transition-all disabled:opacity-70 disabled:grayscale"
              >
                <div className="absolute inset-0 bg-[var(--glass-border)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                {sending ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="relative z-10">
                    <Send size={18} />
                  </motion.div>
                ) : (
                  <><Send size={18} className="relative z-10" /> <span className="relative z-10">Transmit Data</span></>
                )}
              </motion.button>
            </div>
          </form>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Contact;
