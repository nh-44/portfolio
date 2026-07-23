import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Sparkles, ChevronDown, ChevronUp, Clock, BookOpen, Layers } from 'lucide-react';
import { api } from '../utils/api';

export default function JourneyPage() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const data = await api.get('/api/journey');
        setMilestones(data);
      } catch (err) {
        console.error('Failed to load journey timeline:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  // Extract unique categories (plus "All")
  const categories = ['All', ...new Set(milestones.map((m) => m.category))];

  // Filtered milestones
  const filteredMilestones = activeCategory === 'All'
    ? milestones
    : milestones.filter((m) => m.category === activeCategory);

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 rounded-lg border-2 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs text-slate-400">Loading continuous growth records...</span>
      </div>
    );
  }

  return (
    <section className="py-24 relative min-h-screen">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GROWTH SYSTEM</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            The Journey of <span className="text-gradient">Continuous Progression</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-xl text-sm leading-relaxed">
            Inspired by Solo Leveling. Documenting my technical skill tree expansions, project challenges, and level-ups.
          </p>
        </div>

        {/* Categories Filtering Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedId(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                activeCategory === cat
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/25'
                  : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-white hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Timeline Layout */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          {/* Vertical central glowing guide line */}
          <div className="absolute left-6 md:left-1/2 top-2 bottom-2 w-[1.5px] bg-white/5 -translate-x-1/2 pointer-events-none">
            <motion.div 
              style={{ scaleY, transformOrigin: 'top' }}
              className="w-full h-full bg-gradient-to-b from-accent/80 via-accent/20 to-accent/80 shadow-[0_0_8px_var(--accent)]" 
            />
          </div>

          {filteredMilestones.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono text-sm">
              No milestones found in this category.
            </div>
          ) : (
            <div className="space-y-10">
              {filteredMilestones.map((item, index) => {
                const isEven = index % 2 === 0;
                const isExpanded = expandedId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    variants={{
                      hidden: { 
                        opacity: 0, 
                        x: isEven ? 45 : -45,
                        y: 15
                      },
                      visible: { 
                        opacity: 1, 
                        x: 0, 
                        y: 0,
                        transition: {
                          type: 'spring',
                          stiffness: 90,
                          damping: 15,
                          mass: 0.8
                        }
                      }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className={`relative flex flex-col md:flex-row items-start ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Timeline Node Dot Indicator */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-6 w-8 h-8 rounded-full bg-slate-950 border-2 border-accent flex items-center justify-center shadow-lg shadow-accent/20 z-20">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                    </div>

                    {/* Timeline Card */}
                    <div className="ml-14 md:ml-0 md:w-1/2 md:px-8 w-full">
                      <div
                        onClick={() => toggleExpand(item.id)}
                        className={`glass-card rounded-2xl p-6 border transition-all cursor-pointer select-none ${
                          isExpanded ? 'border-accent/40 bg-slate-900/60 shadow-lg shadow-accent/5' : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        {/* Header Details */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                          <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.date}</span>
                          </span>
                          <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-900 border border-white/5 px-2.5 py-1 rounded-xl">
                            {item.category}
                          </span>
                        </div>

                        {item.thumbnail && (
                          <div className="w-full h-40 rounded-xl overflow-hidden mb-4 border border-white/10 relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-50 z-10" />
                            <img 
                              src={item.thumbnail} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              loading="lazy"
                            />
                          </div>
                        )}

                        <div className="flex gap-4 items-start">
                          <div className="flex-grow">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-between group/title">
                              <Link 
                                to={`/blog?journey_id=${item.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="hover:text-accent hover:underline decoration-accent/40 transition-colors flex items-center gap-1.5"
                                title="Click to view related blog entries"
                              >
                                <span>{item.title}</span>
                                <span className="text-[10px] opacity-0 group-hover/title:opacity-100 font-mono text-accent transition-opacity font-normal">
                                  (View Logs ↗)
                                </span>
                              </Link>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </h3>

                            <p className="text-slate-300 text-xs leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Location */}
                        {item.location && (
                          <div className="flex items-center gap-1.5 mt-3 text-[10px] font-mono text-slate-400">
                            <MapPin className="w-3 h-3 text-accent" />
                            <span>{item.location}</span>
                          </div>
                        )}

                        {/* Expanded details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden mt-4 pt-4 border-t border-white/5 text-xs text-slate-400"
                            >
                              {/* Lessons Learned */}
                              {item.lessons_learned && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-1.5 text-white font-bold mb-2">
                                    <BookOpen className="w-3.5 h-3.5 text-accent" />
                                    <span>Lessons Learned</span>
                                  </div>
                                  <div className="prose prose-invert prose-xs text-slate-400 max-w-none pl-1 leading-relaxed">
                                    {item.lessons_learned.split('\n').map((line, idx) => (
                                      <p key={idx} className="mb-1">{line}</p>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Tech Stack Used */}
                              {item.technologies_used && item.technologies_used.length > 0 && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-1.5 text-white font-bold mb-2">
                                    <Layers className="w-3.5 h-3.5 text-accent" />
                                    <span>Technologies & Skills</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {item.technologies_used.map((tech, tIdx) => (
                                      <span
                                        key={tIdx}
                                        className="px-2 py-0.5 rounded-lg bg-slate-900 text-[10px] font-mono border border-white/5 text-slate-300"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Gallery Grid */}
                              {item.gallery && item.gallery.length > 0 && (
                                <div>
                                  <div className="text-white font-bold mb-2">Gallery</div>
                                  <div className="grid grid-cols-2 gap-2">
                                    {item.gallery.map((img, gIdx) => (
                                      <img
                                        key={gIdx}
                                        src={img}
                                        alt={`Gallery ${gIdx}`}
                                        className="rounded-lg object-cover w-full h-24 border border-white/5"
                                        loading="lazy"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
