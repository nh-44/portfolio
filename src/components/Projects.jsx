import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, ExternalLink, ArrowUpRight, Sparkles } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { projectsData } from '../data/portfolioData';
import ProjectModal from './ProjectModal';

const filters = [
  { label: 'All Projects', value: 'all' },
  { label: 'AI & LLM', value: 'ai' },
  { label: 'Full Stack', value: 'fullstack' },
  { label: 'Frontend & UI', value: 'frontend' },
  { label: 'WebGL / Creative', value: 'webgl' },
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = projectsData.filter((project) => {
    if (activeFilter === 'all') return true;
    return project.filterTag === activeFilter;
  });

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>PORTFOLIO WORK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Featured <span className="text-gradient">Projects & Applications</span>
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-12 overflow-x-auto pb-2">
          <div className="flex p-1.5 rounded-2xl glass-panel border border-white/10 gap-2">
            {filters.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeFilter === tab.value
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-80" />

                    {/* Featured Tag */}
                    {project.featured && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-500/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-md">
                        <Sparkles className="w-3 h-3" />
                        <span>Featured</span>
                      </div>
                    )}

                    {/* Category */}
                    <div className="absolute bottom-3 left-4 text-xs font-mono text-sky-400 font-medium">
                      {project.category}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-mono border border-slate-700/50"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800/40 text-slate-400 text-xs font-mono">
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-white/5 mt-auto">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Details & Architecture</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 transition-colors"
                      title="GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Deep-dive Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
