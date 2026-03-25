import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, Phone, Globe, User, Star } from 'lucide-react';
import { profileAPI, projectsAPI, certificatesAPI, skillsAPI } from '../services/api';
import AnimatedSection from '../components/AnimatedSection';
import LazyImage from '../components/LazyImage';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ projects: 0, certs: 0 });
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, proj, cert, sk] = await Promise.all([
          profileAPI.get(), 
          projectsAPI.getAll(), 
          certificatesAPI.getAll(),
          skillsAPI.getAll()
        ]);
        setProfile(p.data);
        setStats({ projects: proj.data.length, certs: cert.data.length });
        setSkills(sk.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 pb-32 pt-10">
        <div className="skeleton w-full h-64 rounded-[3rem] mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-[2rem]" />)}
        </div>
      </div>
    );
  }

  const contactItems = profile ? [
    { icon: Mail, value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, value: profile.phone, href: `tel:${profile.phone}` },
    { icon: MapPin, value: profile.location },
    { icon: Globe, value: profile.website, href: profile.website },
  ].filter(c => c.value) : [];

  const socialItems = profile ? [
    { icon: Github, value: 'GitHub', href: profile.github },
    { icon: Linkedin, value: 'LinkedIn', href: profile.linkedin },
    { icon: Twitter, value: 'Twitter', href: profile.twitter },
  ].filter(s => s.href) : [];

  const skillGroups = skills.reduce((acc, s) => {
    const cat = s.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-6 pb-32 pt-10 relative">
      {/* Background Glow */}
      <div className="absolute top-20 right-1/4 w-[600px] h-[600px] bg-accent-secondary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Profile Header (Large Cinematic Card) */}
      <AnimatedSection className="mb-8">
        <div className="relative bg-[var(--bg2)]/80 backdrop-blur-3xl border border-[var(--glass-border)] rounded-[3rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col md:flex-row gap-8 md:gap-12 items-center text-center md:text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[100px] rounded-full" />
          
          <div className="relative group perspective-1000 flex-shrink-0">
            <div className="absolute inset-0 bg-accent rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <motion.div
              whileHover={{ rotateY: 10, rotateX: 5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] overflow-hidden border border-[var(--glass)] shadow-[-10px_-10px_30px_rgba(255,255,255,0.05),10px_10px_30px_rgba(0,0,0,0.8)]"
            >
              <LazyImage
                src={profile?.avatar}
                alt={profile?.name}
                className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-6xl font-extrabold text-[var(--text-primary)] bg-gradient-to-br from-[var(--text-primary)]/10 to-transparent">
                    {profile?.name?.[0] || 'S'}
                  </div>
                }
              />
            </motion.div>
          </div>

          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] mb-4 text-xs font-bold uppercase tracking-widest text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Identity Core
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[var(--text-primary)] mb-2 leading-tight">
              {profile?.name}
            </h1>
            <p className="text-xl font-medium text-accent-secondary mb-6">{profile?.role}</p>
            <p className="text-[var(--text-muted)] leading-relaxed text-sm md:text-base max-w-2xl">
              {profile?.bio}
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Bento Grid */}
      <AnimatedSection className="mb-8" delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Completed Projects', value: stats.projects, icon: '💻', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
            { label: 'Certifications', value: stats.certs, icon: '🏆', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            { label: 'Tech Skills', value: skills.length || 0, icon: '⚡', color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { label: 'Years Experience', value: `${profile?.experience?.length || 0}+`, icon: '🚀', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-6 text-center flex flex-col items-center justify-center shadow-glass relative overflow-hidden group"
            >
              <div className={`absolute -inset-4 ${stat.bg} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="text-3xl mb-3 relative z-10 filter drop-shadow-md">{stat.icon}</div>
              <div className="font-black text-3xl md:text-4xl text-[var(--text-primary)] relative z-10 mb-1 tracking-tight">{stat.value}</div>
              <div className={`text-xs font-bold uppercase tracking-widest ${stat.color} relative z-10 opacity-80`}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Grid Row: Contact / Socials / About */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Contact Info */}
        <AnimatedSection delay={0.2} className="md:col-span-1 h-full">
          <div className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-[2.5rem] shadow-glass flex flex-col h-full overflow-hidden">
            <div className="px-8 py-6 border-b border-[var(--glass-border)] bg-[var(--glass)]/50">
              <h2 className="font-bold text-lg text-[var(--text-primary)] flex items-center gap-2">
                <MapPin size={18} className="text-accent" /> Uplink
              </h2>
            </div>
            <div className="flex flex-col p-4">
              {contactItems.map(({ icon: Icon, value, href }, idx) => (
                <div key={value} className="flex items-center gap-4 p-4 hover:bg-[var(--glass)] rounded-[1.5rem] transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center flex-shrink-0 group-hover:border-accent/40 group-hover:shadow-[0_0_15px_rgba(0,242,255,0.2)] transition-all">
                    <Icon size={16} className="text-[var(--text-muted)] group-hover:text-accent transition-colors" />
                  </div>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] truncate">
                      {value}
                    </a>
                  ) : (
                    <span className="flex-1 text-sm font-semibold text-[var(--text-secondary)] truncate">{value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* About & Socials */}
        <AnimatedSection delay={0.3} className="md:col-span-2 h-full flex flex-col gap-6">
          <div className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-[2.5rem] shadow-glass p-8 flex-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-secondary/5 blur-3xl rounded-full" />
            <h2 className="font-bold text-lg text-[var(--text-primary)] mb-4 flex items-center gap-2 relative z-10">
              <User size={18} className="text-accent-secondary" /> Bio.Txt
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed text-sm md:text-base relative z-10 font-medium whitespace-pre-line">
              {profile?.about || "Loading secure data..."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {socialItems.map(({ icon: Icon, value, href }, idx) => (
              <motion.a
                key={value}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-6 shadow-glass flex flex-col items-center justify-center gap-3 hover:border-accent hover:shadow-[0_10px_30px_rgba(0,242,255,0.15)] transition-all group"
              >
                <Icon size={28} className="text-[var(--text-muted)] group-hover:text-accent transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] group-hover:text-accent transition-colors">{value}</span>
              </motion.a>
            ))}
          </div>
        </AnimatedSection>

      </div>

      {/* Technical Skills Database */}
      {Object.keys(skillGroups).length > 0 && (
        <AnimatedSection className="mt-8" delay={0.4}>
          <div className="bg-[var(--bg2)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-[3rem] shadow-glass relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="px-8 md:px-12 py-8 border-b border-[var(--glass-border)] bg-[var(--glass)]/50">
              <h2 className="font-bold text-xl text-[var(--text-primary)] flex items-center gap-3">
                <Star size={20} className="text-accent" /> Skill Repository
              </h2>
            </div>
            <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 relative z-10">
              {Object.entries(skillGroups).map(([cat, skills], catIdx) => (
                <div key={cat} className="flex flex-col gap-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent/80 border-l-2 border-accent pl-3 py-1">
                    {cat}
                  </h3>
                  <div className="flex flex-col gap-6">
                    {skills.map((s, i) => (
                      <div key={s.name} className="group">
                        <div className="flex justify-between items-center mb-2 px-1">
                          <span className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{s.name}</span>
                          <span className="text-xs font-black text-accent opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_8px_var(--accent)]">{s.level}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--elevated)] border border-[var(--glass-border)] overflow-hidden shadow-inner">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 + (i * 0.1) }}
                            className="h-full rounded-full shadow-[0_0_15px_rgba(0,242,255,0.6)]"
                            style={{ 
                              background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent))'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

    </div>
  );
};

export default Profile;
