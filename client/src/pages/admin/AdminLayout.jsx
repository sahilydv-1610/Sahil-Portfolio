import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, Award, User, MessageSquare,
  LogOut, Menu, X, ShieldAlert, ChevronRight, Brain
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/admin/certificates', icon: Award, label: 'Certificates' },
  { to: '/admin/skills', icon: Brain, label: 'Skills' },
  { to: '/admin/services', icon: LayoutDashboard, label: 'Services' },
  { to: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
  { to: '/admin/profile', icon: User, label: 'Profile' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
];

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin'); };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-[var(--bg2)]/95 backdrop-blur-3xl ${mobile ? 'w-full' : 'w-72'}`}>
      {/* Brand Header */}
      <div className="flex items-center gap-4 p-6 border-b border-[var(--glass-border)] bg-black/20">
        <div className="w-10 h-10 rounded-[1rem] bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,242,255,0.15)]">
          <ShieldAlert size={20} className="text-accent" />
        </div>
        <div className="flex flex-col">
          <p className="font-black text-sm text-[var(--text-primary)] tracking-widest uppercase">Admin Panel</p>
          <p className="text-[10px] font-bold text-accent tracking-[0.2em] uppercase">User: @{user?.username}</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} onClick={() => setSidebarOpen(false)}>
              <div
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  active 
                    ? 'text-[var(--text-primary)] bg-accent/10 border border-accent/20 shadow-[inset_0_0_20px_rgba(0,242,255,0.1)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass)] border border-transparent'
                }`}
              >
                {active && (
                  <motion.div 
                    layoutId="active-indicator" 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent rounded-r-full shadow-[0_0_10px_var(--accent)]" 
                  />
                )}
                <Icon size={18} className={active ? 'text-accent' : 'opacity-70 group-hover:opacity-100 transition-opacity'} />
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                {active && <ChevronRight size={14} className="ml-auto opacity-50 text-accent" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actons */}
      <div className="p-4 border-t border-[var(--glass-border)] bg-black/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400 hover:text-[var(--text-primary)] transition-all duration-300"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-[var(--text-primary)] flex overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen border-r border-[var(--glass-border)] relative z-20 flex-shrink-0 shadow-[20px_0_60px_rgba(0,0,0,0.5)]">
        <Sidebar />
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-[var(--bg2)]/90 backdrop-blur-xl border-b border-[var(--glass-border)] flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <ShieldAlert size={16} className="text-accent" />
          </div>
          <span className="font-black text-sm tracking-widest uppercase">Admin</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(o => !o)} 
          className="w-10 h-10 bg-[var(--glass)] border border-[var(--glass-border)] rounded-xl flex items-center justify-center text-[var(--text-primary)]"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-3/4 max-w-sm border-r border-[var(--glass-border)] shadow-2xl"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 pt-20 md:pt-0">
        <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
