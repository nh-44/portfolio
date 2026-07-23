import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, ExternalLink, ArrowRight, Layers, Eye, ShieldAlert, CheckCircle, FileText } from 'lucide-react';
import { api } from '../utils/api';
import SpotlightCard from '../components/SpotlightCard';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed, archived

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.get('/api/projects');
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filter projects by status
  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p) => p.status === filter);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'archived':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 rounded-lg border-2 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs text-slate-400">Retrieving system artifacts...</span>
      </div>
    );
  }

  return (
    <section className="py-24 relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-3">
            <Code className="w-3.5 h-3.5" />
            <span>PROJECT REGISTRY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Premium Engineering <span className="text-gradient">Case Studies</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-xl text-sm leading-relaxed">
            A curated showcase of production builds, robotics interfaces, and AI engines—engineered for scalability and speed.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center justify-center gap-1.5 mb-16 bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 max-w-sm mx-auto backdrop-blur">
          {['all', 'active', 'completed', 'archived'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-mono capitalize transition-all ${
                filter === tab
                  ? 'bg-accent text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 text-slate-500 font-mono text-sm">
            No projects found matching the filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[auto]">
            {filteredProjects.map((project, idx) => {
              const isFeatured = project.featured;
              const cardSpan = isFeatured ? 'lg:col-span-2 md:col-span-2' : 'col-span-1';

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`h-full flex w-full group ${cardSpan}`}
                >
                  <SpotlightCard className="p-0 sm:p-0 overflow-hidden h-full w-full flex flex-col border-white/5 bg-[#0C0C0E]/50">
                    <div className={`h-full flex flex-col ${isFeatured ? 'lg:flex-row' : ''}`}>
                      {/* Cover Image Container */}
                      <Link
                        to={`/projects/${project.slug}`}
                        className={`block relative overflow-hidden bg-slate-900 border-b border-white/5 shrink-0 ${
                          isFeatured 
                            ? 'h-48 lg:h-auto lg:w-1/2 lg:border-b-0 lg:border-r' 
                            : 'h-48'
                        }`}
                      >
                        {project.cover_image ? (
                          <img
                            src={project.cover_image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-950 font-mono text-xs">
                            No cover image
                          </div>
                        )}
                        {/* Status Ribbon overlay */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur border border-white/10 text-[10px] font-mono capitalize text-slate-300">
                          {getStatusIcon(project.status)}
                          <span>{project.status}</span>
                        </div>
                      </Link>

                      {/* Card Content & Details */}
                      <div className={`p-6 flex flex-col justify-between flex-grow ${isFeatured ? 'lg:w-1/2' : ''}`}>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors leading-snug">
                            <Link to={`/projects/${project.slug}`}>
                              {project.title}
                            </Link>
                          </h3>

                          <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3 lg:line-clamp-4">
                            {project.short_description}
                          </p>

                          {/* Tech Stack Badges */}
                          {project.tech_stack && project.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {project.tech_stack.slice(0, isFeatured ? 6 : 4).map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-[10px] font-mono border border-white/5 text-slate-300"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.tech_stack.length > (isFeatured ? 6 : 4) && (
                                <span className="px-2 py-0.5 text-[9px] font-mono text-slate-500">
                                  +{project.tech_stack.length - (isFeatured ? 6 : 4)} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-6">
                          <div className="flex items-center gap-3">
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-white transition-colors"
                                title="GitHub Repository"
                              >
                                <Code className="w-4.5 h-4.5" />
                              </a>
                            )}
                            {project.demo_url && (
                              <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-white transition-colors"
                                title="Live Demo"
                              >
                                <ExternalLink className="w-4.5 h-4.5" />
                              </a>
                            )}
                          </div>

                          <Link
                            to={`/projects/${project.slug}`}
                            className="flex items-center gap-1 text-xs font-mono font-bold text-accent hover:text-white group-hover:gap-1.5 transition-all"
                          >
                            <span>Case Study</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
