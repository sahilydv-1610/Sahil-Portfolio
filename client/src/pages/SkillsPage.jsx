import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { skillsAPI } from '../services/api';
import SkillGrid from '../components/skills/SkillGrid';
import SkillTimeline from '../components/skills/SkillTimeline';
import { LayoutGrid, ListTree, Search, Filter, Calendar } from 'lucide-react';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await skillsAPI.getAll();
        setSkills(res.data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(skills.map(s => s.category || 'Other'))], [skills]);
  const years = useMemo(() => {
    const yrs = skills.map(s => {
      const d = new Date(s.learnedAt || s.createdAt);
      return isNaN(d.getFullYear()) ? null : d.getFullYear().toString();
    }).filter(Boolean);
    return ['All', ...new Set(yrs)].sort((a, b) => b - a);
  }, [skills]);

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const skillYear = new Date(skill.learnedAt || skill.createdAt).getFullYear().toString();
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      const matchesYear = selectedYear === 'All' || skillYear === selectedYear;
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesYear && matchesSearch;
    });
  }, [skills, selectedCategory, selectedYear, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 pt-32 pb-40"
      >
        {/* Header Section */}
        <div className="max-w-5xl mx-auto px-6 mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_10px_var(--accent)]" />
            <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-secondary)]">Telemetry Archive</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
            Skill <span className="gradient-text">Matrix</span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Visualizing technological progression and core proficiencies through dual-mode telemetry. 
          </p>
        </div>

        {/* ── CENTRAL CONTROL UNIT ── */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="glass-card p-5 border border-[var(--glass-border)] rounded-[2.5rem] flex flex-col xl:flex-row items-center gap-6 shadow-2xl"
               style={{ backgroundColor: 'var(--bg2)' }}>
            
            {/* View Toggle (Segmented Control) */}
            <div className="flex p-1.5 bg-[var(--bg)] rounded-2xl border border-[var(--glass-border)] shrink-0 shadow-inner">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-[var(--accent)] text-white shadow-[0_0_20px_var(--accent-glow)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <LayoutGrid size={14} /> Grid
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  viewMode === 'timeline' 
                    ? 'bg-[var(--accent)] text-white shadow-[0_0_20px_var(--accent-glow)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <ListTree size={14} /> Timeline
              </button>
            </div>

            {/* Separator */}
            <div className="hidden xl:block w-px h-10 bg-[var(--glass-border)] opacity-50" />

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-4 flex-1 w-full xl:w-auto">
              {/* Search */}
              <div className="relative group flex-1 min-w-[240px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] group-focus-within:scale-110 transition-transform" size={16} />
                <input
                  type="text"
                  placeholder="Search Technology Stack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--glass-border)] rounded-2xl py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-[var(--accent)]/50 focus:ring-4 focus:ring-[var(--accent)]/5 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)] opacity-80 focus:opacity-100 shadow-sm"
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative shrink-0 w-full sm:w-auto">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] pointer-events-none" size={14} />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto bg-[var(--bg)] border border-[var(--glass-border)] rounded-2xl py-3 pl-11 pr-10 text-xs font-black uppercase tracking-wider appearance-none focus:outline-none focus:border-[var(--accent)]/50 transition-all cursor-pointer text-[var(--text-primary)] shadow-sm"
                >
                  {categories.map(cat => <option key={cat} value={cat} className="bg-[var(--bg2)] text-[var(--text-primary)] font-sans">{cat} System</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-2 h-2 border-b-2 border-r-2 border-[var(--text-muted)] rotate-45" />
              </div>

              {/* Year Dropdown */}
              <div className="relative shrink-0 w-full sm:w-auto">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] pointer-events-none" size={14} />
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full sm:w-auto bg-[var(--bg)] border border-[var(--glass-border)] rounded-2xl py-3 pl-11 pr-10 text-xs font-black uppercase tracking-wider appearance-none focus:outline-none focus:border-[var(--accent)]/50 transition-all cursor-pointer text-[var(--text-primary)] shadow-sm"
                >
                  {years.map(yr => <option key={yr} value={yr} className="bg-[var(--bg2)] text-[var(--text-primary)] font-sans">{yr === 'All' ? 'All Origins' : `Cycle ${yr}`}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-2 h-2 border-b-2 border-r-2 border-[var(--text-muted)] rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="w-full py-40 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-24 h-24 mb-8">
              <div className="absolute inset-0 border-[1px] border-accent/30 rounded-full animate-spin" />
              <div className="w-4 h-4 bg-accent rounded-full animate-pulse shadow-[0_0_20px_var(--accent)]" />
            </div>
            <p className="text-accent/60 text-xs uppercase font-black tracking-[0.5em]">Syncing Archives...</p>
          </div>
        ) : (
          <div className="min-h-[600px]">
            {viewMode === 'grid' ? (
              <SkillGrid skills={filteredSkills} />
            ) : (
              <SkillTimeline skills={filteredSkills} />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SkillsPage;
