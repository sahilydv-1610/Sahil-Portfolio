import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, Download, Eye, ArrowRight,
  MapPin, Award, ExternalLink, Briefcase, GraduationCap, User,
  Code2, Star, Calendar, Building2, TrendingUp, BarChart, X, FileText
} from 'lucide-react';
import { profileAPI, projectsAPI, certificatesAPI, serviceAPI, testimonialAPI, skillsAPI } from '../services/api';
import AnimatedSection from '../components/AnimatedSection';
import LazyImage from '../components/LazyImage';
import HexSkillMatrix from '../components/home/HexSkillMatrix';
import CVModal from '../components/home/CVModal';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const skillColors = {
  Frontend: 'from-blue-600 to-indigo-600',
  Backend: 'from-emerald-600 to-teal-600',
  Tools: 'from-slate-600 to-zinc-600',
  DevOps: 'from-cyan-600 to-blue-600',
  Mobile: 'from-violet-600 to-purple-600',
  Other: 'from-rose-600 to-red-600',
};

const SkeletonCard = () => (
  <div className="glass-card p-6 h-64 skeleton" />
);

/* ── Section Header ── */
const SectionHeader = ({ icon: Icon, title, subtitle, accent = false }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-1">
      {Icon && (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)', opacity: 0.9 }}>
          <Icon size={16} color="white" />
        </div>
      )}
      <h2 className={`section-title ${accent ? 'gradient-text' : ''}`}>{title}</h2>
    </div>
    {subtitle && <p className="section-subtitle ml-12">{subtitle}</p>}
  </div>
);

/* ── Timeline Card ── */
const TimelineItem = ({ title, subtitle, duration, description, icon, delay = 0 }) => (
  <AnimatedSection delay={delay} className="relative pl-8 mb-6 last:mb-0">
    {/* vertical line */}
    <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent)] to-transparent opacity-30" />
    {/* dot */}
    <div className="absolute left-0 top-4 w-6 h-6 rounded-full flex items-center justify-center"
      style={{ background: 'var(--elevated)', border: '2px solid var(--accent)', boxShadow: '0 0 10px var(--accent-glow)' }}>
      {icon && <span style={{ fontSize: 10 }}>{icon}</span>}
    </div>
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
        <h3 className="font-bold text-sm leading-snug">{title}</h3>
        {duration && (
          <span className="flex items-center gap-1 tag text-[10px] py-0.5 shrink-0">
            <Calendar size={9} /> {duration}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>{subtitle}</p>
      )}
      {description && (
        <p className="text-xs leading-6" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      )}
    </div>
  </AnimatedSection>
);

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCvOpen, setIsCvOpen] = useState(false);

  const handleDownloadCV = async () => {
    try {
      if (!profile?.cvFile) return;
      const response = await fetch(`${BASE_URL}${profile.cvFile}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('link');
      a.href = url;
      a.download = profile?.name ? `${profile.name}_CV.pdf` : 'CV.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed, falling back to new tab", err);
      window.open(`${BASE_URL}${profile.cvFile}`, '_blank');
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [p, proj, cert, srv, testm, sk] = await Promise.all([
          profileAPI.get(),
          projectsAPI.getFeatured(),
          certificatesAPI.getFeatured(),
          serviceAPI.getAll(),
          testimonialAPI.getAll(),
          skillsAPI.getAll()
        ]);
        setProfile(p.data);
        setProjects(proj.data);
        setCerts(cert.data);
        setServices(srv.data);
        setTestimonials(testm.data);
        setSkills(sk.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const socials = profile ? [
    { icon: Github, href: profile.github, label: 'GitHub' },
    { icon: Linkedin, href: profile.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: profile.twitter, label: 'Twitter' },
    { icon: Mail, href: `mailto:${profile.email}`, label: 'Email' },
  ].filter(s => s.href) : [];

  const skillGroups = skills.reduce((acc, s) => {
    const cat = s.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});



  return (
    <div className="max-w-6xl mx-auto px-6 pb-32">

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section className="min-h-screen flex items-center py-16">
        {loading ? (
          <div className="w-full flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 flex flex-col gap-5">
              <div className="skeleton w-48 h-5 rounded-xl" />
              <div className="skeleton w-72 h-12 rounded-xl" />
              <div className="skeleton w-full h-4 rounded-xl" />
              <div className="skeleton w-3/4 h-4 rounded-xl" />
              <div className="flex gap-3 mt-2">
                <div className="skeleton w-28 h-11 rounded-2xl" />
                <div className="skeleton w-28 h-11 rounded-2xl" />
              </div>
            </div>
            <div className="skeleton w-64 h-64 rounded-3xl flex-shrink-0" />
          </div>
        ) : (
          <div className="w-full flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">

            {/* ── LEFT: Text Content ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-1 flex flex-col gap-5 text-left"
            >
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="online-dot" />
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
                  Available for work
                </span>
              </div>

              {/* Name */}
              <h1
                className="font-extrabold gradient-text leading-tight"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', letterSpacing: '-0.03em' }}
              >
                {profile?.name || 'Sahil'}
              </h1>

              {/* Role */}
              <p className="font-semibold text-xl" style={{ color: 'var(--accent)' }}>
                {profile?.role || 'Full Stack Developer'}
              </p>

              {/* Location */}
              {profile?.location && (
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <MapPin size={14} /> {profile.location}
                </div>
              )}

              {/* Bio */}
              <p className="text-base leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                {profile?.bio}
              </p>

              {/* Socials */}
              {socials.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 glass rounded-xl flex items-center justify-center tab-hover"
                    >
                      <Icon size={17} />
                    </a>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div className="flex gap-4 flex-wrap mt-4">
                <Link to="/contact">
                  <button className="relative overflow-hidden group px-8 py-3.5 rounded-2xl flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] bg-accent shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,242,255,0.4)] hover:scale-105 active:scale-95 transition-all">
                    <Mail size={16} className="relative z-10" />
                    <span className="relative z-10">Initiate Contact</span>
                  </button>
                </Link>
                <button 
                  onClick={() => setIsCvOpen(true)}
                  className="px-8 py-3.5 rounded-2xl flex items-center gap-2 text-sm font-bold bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] hover:scale-105 active:scale-95 transition-all"
                >
                  <Eye size={16} /> View CV
                </button>
              </div>
            </motion.div>

            {/* ── RIGHT: Profile Image ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-shrink-0"
            >
              <div className="relative group perspective-1000">
                <div
                  className="absolute inset-0 rounded-full bg-accent glow-pulse blur-[80px] opacity-30 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
                  style={{ transform: 'scale(1.4) translateZ(-50px)' }}
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] bg-[var(--glass)] backdrop-blur-md"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <LazyImage
                    src={profile?.avatar}
                    alt={profile?.name}
                    className="w-full h-full object-cover transition-all duration-700"
                    fallback={
                      <div className="w-full h-full flex items-center justify-center text-6xl font-extrabold gradient-text bg-gradient-to-br from-[var(--text-primary)]/10 to-white/5">
                        {profile?.name?.[0] || 'S'}
                      </div>
                    }
                  />
                </motion.div>
                <div
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl"
                  style={{
                    padding: '5px 10px',
                    background: 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    backdropFilter: 'blur(10px)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#10b981',
                  }}
                >
                  <span className="online-dot" />
                  Online
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </section>

      {/* ══════════════════════════════ SKILL MATRIX ══════════════════════════════ */}
      {skills.length > 0 && (
        <AnimatedSection className="mb-20">
          <SectionHeader icon={Code2} title="Skill Matrix" subtitle="Technological arsenal and core proficiencies" accent />
          <HexSkillMatrix skills={skills} />
        </AnimatedSection>
      )}





      {/* ══════════════════════════════ NAVIGATION CTA ══════════════════════════════ */}

      <AnimatedSection className="mb-20">
        <div className="glass-card p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden shadow-2xl border border-[var(--glass-border)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent-secondary)]/10 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-black tracking-tight relative z-10 text-[var(--text-primary)]">Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]">Archive</span></h2>
          <p className="text-[var(--text-secondary)] max-w-lg mb-4 relative z-10">Dive deeper into my verified credentials, full project matrix, and complete skill logs.</p>
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <Link to="/projects" className="btn-primary px-8 py-4 rounded-xl font-extrabold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_var(--accent-glow)] text-[var(--text-primary)]">
              <Code2 size={18} /> View Projects
            </Link>
            <Link to="/certificates" className="btn-ghost px-8 py-4 rounded-xl font-extrabold flex items-center gap-2 border border-[var(--glass-border)] hover:bg-[var(--glass-border)] hover:scale-105 transition-all text-[var(--accent)]">
              <Award size={18} /> Certificates
            </Link>
          </div>
        </div>
      </AnimatedSection>
      {/* ══════════════════════════════ RESUME ACCESS ══════════════════════════════ */}
      {profile && (
        <AnimatedSection className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-[var(--glass)] p-10 rounded-[2.5rem] border border-[var(--glass-border)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent skew-y-6 translate-y-20 pointer-events-none" />
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] shadow-[0_0_20px_var(--accent-glow)] flex items-center justify-center text-[var(--bg)]">
                <FileText size={20} />
              </div>
              <h2 className="text-3xl font-black text-[var(--text-primary)]">Professional Dossier</h2>
            </div>
            <p className="text-[var(--text-secondary)] mb-8 max-w-xl leading-relaxed">
              Access my complete professional record, technical proficiencies, and project impact metrics in a consolidated, verifiable format.
            </p>
            <div className="flex flex-wrap gap-4">
               <button 
                onClick={() => setIsCvOpen(true)}
                className="flex-1 min-w-[200px] btn-primary py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-[0_10px_30px_var(--accent-o20)] hover:-translate-y-1 transition-all"
               >
                 <Eye size={18} /> Initialize Viewer
               </button>
               <button 
                onClick={handleDownloadCV}
                className="flex-1 min-w-[200px] py-4 rounded-2xl bg-white/5 border border-[var(--glass-border)] font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm"
               >
                 <Download size={18} /> Offline Copy
               </button>
            </div>
          </div>
          <div className="hidden lg:flex justify-center relative items-center">
             <div className="absolute inset-0 bg-[var(--accent)] filter blur-[100px] opacity-10 animate-pulse" />
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 className="w-56 h-72 bg-[var(--elevated)] border-2 border-[var(--glass-border)] rounded-2xl shadow-2xl relative z-10 flex flex-col items-center justify-center group-hover:border-[var(--accent)]/50 transition-colors overflow-hidden cursor-pointer"
                 onClick={() => setIsCvOpen(true)}
               >
                  {profile.cvFile ? (
                    <div className="absolute inset-0 w-full h-full p-2 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
                       <iframe 
                         src={`${BASE_URL}${profile.cvFile}#toolbar=0&navpanes=0`} 
                         className="w-full h-full border-none scale-[0.4] origin-top-left"
                         style={{ width: '250%', height: '250%' }}
                         title="CV Thumbnail"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg2)] via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="w-16 h-20 border-2 border-[var(--text-muted)] opacity-20 relative text-[var(--text-muted)]">
                       <div className="absolute top-3 left-2 right-2 h-1 bg-current opacity-20" />
                       <div className="absolute top-7 left-2 right-4 h-1 bg-current opacity-20" />
                       <div className="absolute top-11 left-2 right-2 h-1 bg-current opacity-20" />
                    </div>
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                     <FileText size={32} className="text-[var(--accent)] opacity-60" />
                     <span className="text-[11px] uppercase font-black tracking-widest text-[var(--text-primary)] bg-[var(--bg2)]/80 px-3 py-1.5 rounded-lg border border-[var(--glass-border)] backdrop-blur-md shadow-xl">
                        curriculum_vitae<span className="text-[var(--accent)]">.pdf</span>
                     </span>
                  </div>
               </motion.div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ══════════════════════════ EXPERIENCE + EDUCATION (side by side) ══════════════════════════ */}
      {(profile?.experience?.length > 0 || profile?.education?.length > 0) && (
        <AnimatedSection className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ── Experience Column ── */}
            {profile?.experience?.length > 0 && (
              <div>
                <SectionHeader icon={Briefcase} title="Experience" subtitle="My professional journey" accent />
                <div>
                  {profile.experience.map((exp, i) => (
                    <TimelineItem
                      key={i}
                      delay={i * 0.04}
                      title={exp.role}
                      subtitle={exp.company}
                      duration={exp.duration}
                      description={exp.description}
                      icon="💼"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Education Column ── */}
            {profile?.education?.length > 0 && (
              <div>
                <SectionHeader icon={GraduationCap} title="Education" subtitle="Academic background" accent />
                <div>
                  {profile.education.map((edu, i) => (
                    <TimelineItem
                      key={i}
                      delay={i * 0.04}
                      title={edu.degree}
                      subtitle={edu.institution}
                      duration={edu.duration}
                      description={edu.description}
                      icon="🎓"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* If only one column, show a placeholder CTA for the other */}
            {profile?.experience?.length > 0 && !profile?.education?.length && (
              <div className="glass-card p-8 flex flex-col items-center justify-center gap-3 text-center">
                <GraduationCap size={32} style={{ color: 'var(--accent)', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-muted)' }} className="text-sm">Education details coming soon.</p>
              </div>
            )}
            {profile?.education?.length > 0 && !profile?.experience?.length && (
              <div className="glass-card p-8 flex flex-col items-center justify-center gap-3 text-center">
                <Briefcase size={32} style={{ color: 'var(--accent)', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-muted)' }} className="text-sm">Experience details coming soon.</p>
              </div>
            )}
          </div>
        </AnimatedSection>
      )}

      {/* ══════════════════════════════ EXPERIENCE (FORMERLY TESTIMONIALS) ══════════════════════════════ */}
      {testimonials.filter(t => t.featured).length > 0 && (
        <AnimatedSection className="mb-20">
          <SectionHeader icon={Star} title="Experience" subtitle="Professional endorsements and impact" accent />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.filter(t => t.featured).map((t, i) => (
              <AnimatedSection key={t._id} delay={i * 0.05}>
                <div className="glass flex flex-col gap-4 p-8 h-full relative group hover:border-[var(--accent)]/30 transition-colors" style={{ borderRadius: '24px 24px 24px 4px' }}>
                  <div className="text-6xl absolute top-2 right-6 opacity-[0.05] font-serif group-hover:text-[var(--accent)] transition-colors text-[var(--text-primary)]">"</div>
                  <p className="italic text-base leading-relaxed flex-1 relative z-10 text-[var(--text-secondary)]">"{t.message}"</p>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--glass-border)] relative z-10">
                    {t.avatar ? (
                      <LazyImage src={t.avatar} className="w-12 h-12 rounded-full border-2 border-[var(--accent)]/50 shadow-lg bg-[var(--elevated)]" />
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[var(--text-primary)] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] shadow-lg">
                        {t.author[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm tracking-wide text-[var(--text-primary)]">{t.author}</h4>
                      <p className="text-xs font-semibold text-[var(--accent)]">{t.role} {t.company && <span className="text-[var(--text-muted)]">@ {t.company}</span>}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* ══════════════════════════════ EXPERTISE (FORMERLY SERVICES) ══════════════════════════════ */}
      {services.length > 0 && (
        <AnimatedSection className="mb-20">
          <SectionHeader icon={Briefcase} title="Expertise" subtitle="Specialized offerings and domains" accent />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <AnimatedSection key={s._id} delay={i * 0.05}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="glass-card p-8 h-full flex flex-col gap-4 text-center items-center group hover:shadow-[0_20px_40px_rgba(31,38,135,0.1)] transition-shadow border border-[var(--glass-border)] hover:border-[var(--accent)]/30"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[var(--glass-border)] to-transparent text-3xl mb-2 border border-[var(--glass-border)] shadow-xl group-hover:border-[var(--accent)]/50 group-hover:scale-110 transition-transform">
                    {s.icon || '✨'}
                  </div>
                  <h3 className="font-bold text-xl tracking-tight leading-tight text-[var(--text-primary)]">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{s.description}</p>
                  {s.skills?.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-auto pt-6 border-t border-[var(--glass-border)] w-full">
                      {s.skills.map((skill) => <span key={skill} className="tag text-[9px] py-1.5 px-3 uppercase font-black tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">{skill}</span>)}
                    </div>
                  )}
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* ══════════════════════════════ CV VIEWER MODAL ══════════════════════════════ */}
      <CVModal 
        isOpen={isCvOpen} 
        onClose={() => setIsCvOpen(false)} 
        cvUrl={profile?.cvFile ? `${BASE_URL}${profile.cvFile}` : null} 
      />

    </div>
  );
};

export default Home;
