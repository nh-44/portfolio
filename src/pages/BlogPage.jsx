import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Search, Calendar, Clock, ArrowRight, X } from 'lucide-react';
import { api } from '../utils/api';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams, setSearchParams] = useSearchParams();
  const filterJourneyId = searchParams.get('journey_id');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await api.get('/api/blog');
        setBlogs(data);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = [
    'All',
    'Engineering',
    'AI',
    'Cycling',
    'Movies',
    'Anime',
    'Life',
    'Projects'
  ];

  // Filter posts
  const filteredBlogs = blogs.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      activeCategory === 'All' || post.category === activeCategory;

    const matchesJourneyId =
      !filterJourneyId || String(post.journey_id) === String(filterJourneyId);

    return matchesSearch && matchesCategory && matchesJourneyId;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 rounded-lg border-2 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs text-slate-400">Syncing journal logs...</span>
      </div>
    );
  }

  return (
    <section className="py-24 relative min-h-screen">
      {/* Background glow orb */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>TECHNICAL JOURNAL & MEMOIRS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineering & <span className="text-gradient">Ideas</span>
          </h1>
          <p className="mt-3 text-slate-400 max-w-xl text-sm">
            Technical builds, cycling chronicles, movie reviews, and anime notes. A collection of thoughts on continuous learning.
          </p>
        </div>

        {/* Search and Category filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search posts or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 focus:border-accent/40 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap items-center gap-1.5 justify-center md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  activeCategory === cat
                    ? 'bg-accent border-accent text-white font-semibold'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter HUD indicator */}
        {filterJourneyId && (
          <div className="mb-8 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Filtered by Linked Journey Milestone (Milestone ID: #{filterJourneyId})</span>
            </div>
            <button
              onClick={() => {
                searchParams.delete('journey_id');
                setSearchParams(searchParams);
              }}
              className="text-accent hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          </div>
        )}

        {/* Articles Feed */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 text-slate-500 font-mono text-sm">
            No journal entries found matching the query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group flex flex-col justify-between glass-card rounded-2xl overflow-hidden border border-white/5 relative hover:border-accent/30"
              >
                <div>
                  {/* Cover Image */}
                  <Link to={`/blog/${post.slug}`} className="block relative h-48 bg-slate-900 border-b border-white/5 overflow-hidden">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-950 font-mono text-xs">
                        No cover image
                      </div>
                    )}
                    {/* Category Overlay */}
                    <div className="absolute top-4 left-4 px-2.5 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur border border-white/10 text-[9px] font-mono uppercase text-slate-300">
                      {post.category}
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-6">
                    {/* Post Meta */}
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-accent" />
                        <span>{formatDate(post.created_at)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-accent" />
                        <span>{post.reading_time}</span>
                      </span>
                      {post.status === 'draft' && (
                        <span className="text-amber-500 font-bold uppercase">DRAFT</span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-accent transition-colors leading-snug">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    {/* Tag list */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {post.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/5 text-[9px] font-mono text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer read action */}
                <div className="px-6 pb-6 pt-4 border-t border-white/5 mt-auto flex justify-end">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-xs font-mono font-bold text-accent hover:text-white group-hover:gap-1.5 transition-all"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
