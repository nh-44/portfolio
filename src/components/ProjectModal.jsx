import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden border border-white/15 shadow-2xl z-10 max-h-[90vh] flex flex-col my-auto"
        >
          {/* Header Image */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-mono mb-2">
                {project.category}
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Modal Content Scrollable Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div>
              <h4 className="text-sm uppercase tracking-wider text-slate-400 font-mono mb-2">
                Overview & Architecture
              </h4>
              <p className="text-slate-300 text-base leading-relaxed">
                {project.fullDescription || project.description}
              </p>
            </div>

            {/* Key Metrics */}
            {project.metrics && (
              <div>
                <h4 className="text-sm uppercase tracking-wider text-slate-400 font-mono mb-3">
                  Impact & Key Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {project.metrics.map((metric, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2.5 text-xs font-medium text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div>
              <h4 className="text-sm uppercase tracking-wider text-slate-400 font-mono mb-3">
                Tech Stack Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-sky-300 font-mono text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl glass-card text-slate-200 hover:text-white font-semibold text-sm flex items-center gap-2 border-white/10"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View Repository</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
