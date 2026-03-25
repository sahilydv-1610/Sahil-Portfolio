import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { blogAPI } from '../services/api';
import AnimatedSection from '../components/AnimatedSection';
import LazyImage from '../components/LazyImage';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await blogAPI.getAll();
        setBlogs(data.filter(b => b.published));
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 pb-32 pt-12 min-h-screen">
      <AnimatedSection className="mb-16">
        <div className="flex flex-col gap-3">
          <span className="label-caps !text-[11px] tracking-[0.3em] opacity-50 px-1">Insights & Thoughts</span>
          <h1 className="section-title text-4xl md:text-6xl gradient-text leading-tight">Engineering Journal</h1>
          <p className="section-subtitle max-w-xl text-lg">Weekly thoughts on software architecture, craft, and my personal growth as a developer.</p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="glass-card h-80 skeleton" />)
        ) : blogs.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-xl opacity-40">No articles published yet. Check back soon!</p>
          </div>
        ) : (
          blogs.map((b, i) => (
            <AnimatedSection key={b._id} delay={i * 0.05} className="h-full">
              <Link to={`/blog/${b.slug}`} className="h-full block">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="glass-card flex flex-col h-full overflow-hidden group border-[var(--glass-border)]"
                >
                  <div className="h-56 overflow-hidden relative">
                    {b.coverImage ? (
                      <LazyImage
                        src={b.coverImage}
                        alt={b.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--accent)]/10 to-purple-500/10 flex flex-col items-center justify-center">
                        <span className="text-5xl opacity-40">📝</span>
                      </div>
                    )}
                    {b.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-full bg-[var(--accent)] text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-widest shadow-lg">
                          Editor's Choice
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1 gap-5">
                    <div className="flex flex-wrap gap-2">
                      {b.tags?.map(tag => <span key={tag} className="tag !bg-blue-500/10 !text-blue-500 text-[9px] uppercase tracking-tighter">{tag}</span>)}
                    </div>
                    
                    <h2 className="text-2xl font-bold leading-snug group-hover:text-[var(--accent)] transition-colors">
                      {b.title}
                    </h2>
                    
                    <p className="text-sm leading-7 line-clamp-2 flex-1 opacity-70">
                      {b.excerpt || b.content?.substring(0, 100).replace(/[#*]/g, '') + '...'}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-[var(--glass-border)] mt-auto">
                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-40">
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {b.readTime || 5} min read</span>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--text-primary)] transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </AnimatedSection>
          ))
        )}
      </div>
    </div>
  );
};

export default Blog;
