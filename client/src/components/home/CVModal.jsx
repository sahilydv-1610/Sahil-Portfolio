import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, FileText, ExternalLink } from 'lucide-react';

const CVModal = ({ isOpen, onClose, cvUrl }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'Sahil_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Sahil CV',
          text: 'Check out my professional resume',
          url: cvUrl || window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(cvUrl || window.location.href);
        alert('CV link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl h-[85vh] bg-[var(--bg2)]/80 border border-[var(--glass-border)] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 md:px-10 border-b border-[var(--glass-border)] bg-[var(--glass)]/50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[var(--accent)]">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Professional Dossier</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">curriculum vitae // v2.4.0</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleShare}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all"
              >
                <Share2 size={16} /> Share
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:opacity-80 text-white text-xs font-bold transition-all shadow-[0_10px_20px_var(--accent-o20)]"
              >
                <Download size={16} /> Download
              </button>
              <div className="w-px h-8 bg-[var(--glass-border)] mx-2 hidden md:block" />
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Viewport */}
          <div className="flex-1 bg-black/40 relative group">
            {cvUrl ? (
              <iframe 
                src={`${cvUrl}#toolbar=0&navpanes=0`} 
                className="w-full h-full border-none"
                title="CV Preview"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[var(--glass-border)] flex items-center justify-center mb-6 animate-pulse">
                   <FileText size={32} className="text-[var(--text-muted)]" />
                </div>
                <h4 className="text-[var(--text-secondary)] font-bold mb-2">No CV Data Synchronized</h4>
                <p className="text-[var(--text-muted)]">Establish the first connection by adding a project in the Admin Protocol.</p>
              </div>
            )}
            
            {/* Mobile Share Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden">
               <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--elevated)] border border-[var(--glass-border)] shadow-2xl text-sm font-bold backdrop-blur-3xl"
              >
                <Share2 size={18} /> Share Profile
              </button>
            </div>
          </div>
          
          {/* Footer Stats */}
          <div className="p-4 px-10 bg-black/20 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="flex flex-col">
                   <span className="text-[9px] uppercase font-black text-[var(--text-muted)] tracking-tighter">Status</span>
                   <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Verified Access</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] uppercase font-black text-[var(--text-muted)] tracking-tighter">Encryption</span>
                   <span className="text-[11px] font-bold text-[var(--text-secondary)]">TLS v1.3</span>
                </div>
             </div>
             <div className="hidden md:block">
                <span className="text-[10px] font-medium text-[var(--text-muted)] opacity-50 italic">Generated dynamically via Portfolio Engine</span>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CVModal;
