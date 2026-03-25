import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Code2, Eye, X } from 'lucide-react';
import { projectsAPI } from '../services/api';
import AnimatedSection from '../components/AnimatedSection';
import LazyImage from '../components/LazyImage';

const ProjectCard = ({ proj, index, onView }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative h-[250px] bg-[var(--bg2)] rounded-[2rem] overflow-hidden border border-[var(--glass-border)] shadow-xl transition-all duration-500"
  >
    {/* Project Image Background */}
    <div className="absolute inset-0 z-0">
      {proj.images?.length > 0 ? (
        <LazyImage 
          src={proj.images[0]} 
          alt={proj.title} 
          className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[var(--elevated)]">
          <Code2 size={80} className="text-[var(--text-primary)] opacity-10" />
        </div>
      )}
    </div>


    {/* Static Details (Bottom) */}
    <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent">
       <span className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-1 block">
         {proj.organization || 'Professional Project'}
       </span>
       <h3 className="text-xl font-bold text-[var(--text-primary)] line-clamp-1">{proj.title}</h3>
    </div>

    {/* Hover Overlay */}
    <div className="absolute inset-0 z-20 bg-[var(--bg2)]/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-6 group-hover:translate-y-0 text-center">
      <div className="mb-6">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-2 block">
          {proj.organization}
        </span>
        <h3 className="text-3xl font-black text-[var(--accent)] leading-tight mb-2">{proj.title}</h3>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {proj.techStack?.map((tech, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">
              {tech}
            </span>
          ))}
        </div>
        <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
          {proj.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {proj.liveLink && (
          <a
            href={proj.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-black flex items-center gap-2 hover:opacity-90 transition-opacity shadow-glow"
          >
            <ExternalLink size={14} /> Live Demo
          </a>
        )}
        {proj.githubLink && (
          <a
            href={proj.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text-primary)] text-xs font-black flex items-center gap-2 hover:bg-[var(--glass-border)] transition-colors"
          >
            <Github size={14} /> Source
          </a>
        )}
        <button
          onClick={() => onView(proj)}
          className="px-5 py-2.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text-primary)] text-xs font-black flex items-center gap-2 hover:bg-[var(--glass-border)] transition-colors"
        >
          <Eye size={14} /> View
        </button>
      </div>
    </div>
  </motion.div>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProj, setSelectedProj] = useState(null);

  useEffect(() => {
    projectsAPI.getAll().then(r => setProjects(r.data)).catch(console.error).finally(() => setLoading(false));
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
            <div key={i} className="h-[250px] rounded-[2.5rem] bg-white/5 animate-pulse border border-white/10" />
          ))}

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-32 pt-10 relative text-[var(--text-primary)]">
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <AnimatedSection className="mb-16">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] backdrop-blur-md mb-6 shadow-glass">
          <Code2 size={18} className="text-accent" />
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Archive</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--text-secondary)] mb-6 drop-shadow-lg">
          Project <span className="text-accent">Matrix</span>.
        </h1>
        <p className="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
          A cinematic collection of engineered solutions, web applications, and experimental digital tools built with modern frameworks.
        </p>
      </AnimatedSection>

      {projects.length === 0 ? (
        <AnimatedSection>
          <div className="glass-card p-16 text-center rounded-[3rem] border border-[var(--glass-border)] flex flex-col items-center gap-6">
            <div className="w-24 h-24 rounded-[2rem] bg-accent/10 flex items-center justify-center border border-accent/20 shadow-glow">
              <Code2 size={40} className="text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-2xl mb-2 text-[var(--text-primary)]">No Projects Initialized</h3>
              <p className="text-[var(--text-muted)]">Establish the first connection by adding a project in the Admin Protocol.</p>
            </div>
          </div>
        </AnimatedSection>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj, i) => (
            <ProjectCard key={proj._id} proj={proj} index={i} onView={setSelectedProj} />
          ))}
        </div>
      )}

      {/* Viewing Modal */}
      <AnimatePresence>
        {selectedProj && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProj(null)}
              className="absolute inset-0 bg-[var(--bg)]/95 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-full overflow-hidden flex flex-col items-center"
            >
              <button 
                onClick={() => setSelectedProj(null)}
                className="absolute top-4 right-4 z-50 p-3 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text-primary)] hover:bg-[var(--glass-border)] transition-colors"
              >
                <X size={28} />
              </button>
              
              <div className="w-full h-full flex items-center justify-center overflow-auto custom-scrollbar p-10">
                <img 
                  src={selectedProj.images?.[0]} 
                  alt={selectedProj.title} 
                  className="max-w-full max-h-[75vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl"
                />
              </div>

              <div className="text-center p-10 bg-gradient-to-t from-[var(--bg)] to-transparent w-full">
                <h2 className="text-4xl font-black text-[var(--text-primary)] mb-2">{selectedProj.title}</h2>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">{selectedProj.organization}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] opacity-30" />
                  <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.3em]">{selectedProj.duration}</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {selectedProj.techStack?.map((tech, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-xs font-bold text-[var(--accent)]">
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">{selectedProj.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;


