import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Award, Eye, Download, X } from 'lucide-react';
import { certificatesAPI } from '../services/api';
import AnimatedSection from '../components/AnimatedSection';
import LazyImage from '../components/LazyImage';

const CertificateCard = ({ cert, index, onView }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative h-[250px] bg-[var(--bg2)] rounded-[2rem] overflow-hidden border border-[var(--glass-border)] shadow-xl transition-all duration-500"
  >
    {/* Certificate Image Background */}
    <div className="absolute inset-0 z-0">
      {cert.image ? (
        <LazyImage 
          src={cert.image} 
          alt={cert.title} 
          className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[var(--elevated)]">
          <Award size={80} className="text-[var(--text-primary)] opacity-10" />
        </div>
      )}
    </div>

    {/* Static Details (Bottom) */}
    <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent">
       <span className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-1 block">
         {cert.issuer}
       </span>
       <h3 className="text-xl font-bold text-[var(--text-primary)] line-clamp-1">{cert.title}</h3>
    </div>

    {/* Hover Overlay */}
    <div className="absolute inset-0 z-20 bg-[var(--bg2)]/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 text-center">
      <div className="mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-2 block">{cert.issuer}</span>
        <h3 className="text-2xl font-black text-[var(--text-primary)] leading-tight mb-2">{cert.title}</h3>
        <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
          {cert.description || 'Professional certification validating advanced expertise and technical proficiency.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {cert.credentialUrl && (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-yellow-500 text-black text-xs font-black flex items-center gap-2 hover:bg-yellow-400 transition-colors"
          >
            <ExternalLink size={14} /> Online
          </a>
        )}
        <button
          onClick={() => onView(cert)}
          className="px-4 py-2 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text-primary)] text-xs font-black flex items-center gap-2 hover:bg-[var(--glass-border)] transition-colors"
        >
          <Eye size={14} /> View
        </button>
        {cert.image && (
          <a
            href={cert.image}
            download
            className="px-4 py-2 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text-primary)] text-xs font-black flex items-center gap-2 hover:bg-[var(--glass-border)] transition-colors"
          >
            <Download size={14} /> Download
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

const Certificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    certificatesAPI.getAll().then(r => setCerts(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 pb-32 pt-10">
        <div className="mb-12">
          <div className="skeleton w-64 h-12 rounded-2xl mb-4" />
          <div className="skeleton w-96 h-6 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-[250px] rounded-[2rem] bg-white/5 animate-pulse border border-white/10" />
          ))}

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-32 pt-10 relative">
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <AnimatedSection className="mb-16">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] backdrop-blur-md mb-6 shadow-glass">
          <Award size={18} className="text-yellow-400" />
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Credentials</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--text-secondary)] mb-6 drop-shadow-lg">
          Verified <span className="text-yellow-400">Expertise</span>.
        </h1>
        <p className="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Official recognition and certifications from leading institutions, demonstrating a commitment to continuous learning and mastery.
        </p>
      </AnimatedSection>

      {certs.length === 0 ? (
        <AnimatedSection>
          <div className="glass-card p-16 text-center rounded-[3rem] border border-[var(--glass-border)] flex flex-col items-center gap-6">
            <div className="w-24 h-24 rounded-[2rem] bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
              <Award size={40} className="text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold text-2xl mb-2 text-[var(--text-primary)]">No Credentials Found</h3>
              <p className="text-[var(--text-muted)]">Initialize the first certificate entry in the Admin Protocol.</p>
            </div>
          </div>
        </AnimatedSection>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certs.map((cert, i) => (
            <CertificateCard key={cert._id} cert={cert} index={i} onView={setSelectedCert} />
          ))}
        </div>
      )}

      {/* Viewing Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-[var(--bg)]/95 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-full overflow-hidden flex flex-col items-center gap-6"
            >
              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text-primary)] hover:bg-[var(--glass-border)] transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="w-full h-full flex items-center justify-center overflow-auto custom-scrollbar">
                <img 
                  src={selectedCert.image} 
                  alt={selectedCert.title} 
                  className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-lg"
                />
              </div>

              <div className="text-center pb-6">
                <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">{selectedCert.title}</h2>
                <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest">{selectedCert.issuer}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Certificates;

