import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Code, ExternalLink, Calendar, CheckCircle2, AlertTriangle, Hammer, ChevronRight } from 'lucide-react';
import { api } from '../utils/api';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/api/projects/${slug}`);
        setProject(data);

        // Fetch all projects to find related ones (excluding current project, matching same tags/category)
        const allProjects = await api.get('/api/projects');
        const related = allProjects
          .filter((p) => p.id !== data.id)
          .slice(0, 2); // Get top 2 related projects
        setRelatedProjects(related);
      } catch (err) {
        console.error('Failed to load project details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [slug]);

  // Dynamic Markdown Components Mapping for Premium Typography
  const markdownComponents = {
    h1: ({ node, ...props }) => <h1 className="text-3xl font-extrabold text-white mt-10 mb-5 border-b border-white/10 pb-3" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-white/5 pb-2" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-white mt-6 mb-3" {...props} />,
    p: ({ node, ...props }) => <p className="text-slate-300 text-sm leading-relaxed mb-5" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-5 text-slate-300 space-y-2 text-sm" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-5 text-slate-300 space-y-2 text-sm" {...props} />,
    li: ({ node, ...props }) => <li className="text-sm text-slate-300" {...props} />,
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-accent bg-slate-900/60 p-4 rounded-r-xl italic my-6 text-slate-300 text-sm" {...props} />
    ),
    code: ({ node, inline, children, ...props }) => {
      return (
        <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-white/10 text-accent font-mono text-xs break-all" {...props}>
          {children}
        </code>
      );
    },
    pre: ({ node, children, ...props }) => {
      return (
        <pre className="p-5 rounded-2xl bg-slate-950 border border-white/5 overflow-x-auto my-6 font-mono text-xs text-slate-300 shadow-inner" {...props}>
          {children}
        </pre>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 rounded-lg border-2 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs text-slate-400">Loading case study parameters...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center font-mono">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-lg font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">The requested case study slug does not exist in the database.</p>
        <Link to="/projects" className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-mono">
          Return to Registry
        </Link>
      </div>
    );
  }

  return (
    <section className="py-24 relative min-h-screen">
      {/* Background radial overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-accent/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO REGISTRY</span>
        </Link>

        {/* Project Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] uppercase font-mono text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
              {project.status} Case Study
            </span>
            {project.featured && (
              <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                Featured Build
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {project.title}
          </h1>

          <p className="text-slate-400 text-base leading-relaxed mb-6 font-normal">
            {project.short_description}
          </p>

          {/* Links & CTA Bar */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-y border-white/5">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-mono font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-all"
              >
                <Code className="w-4 h-4 text-accent" />
                <span>Source Code</span>
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-accent hover:brightness-110 text-xs font-mono font-semibold text-white flex items-center gap-2 shadow-lg shadow-accent/20 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demonstration</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Cover Image */}
        {project.cover_image && (
          <div className="w-full h-96 sm:h-[450px] rounded-3xl overflow-hidden border border-white/5 bg-slate-950 mb-12 shadow-2xl">
            <img
              src={project.cover_image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Dynamic Case Study Content (Markdown) */}
        <div className="prose prose-invert max-w-none mb-16">
          {project.long_description ? (
            <ReactMarkdown components={markdownComponents}>
              {project.long_description}
            </ReactMarkdown>
          ) : (
            <p className="text-slate-500 font-mono text-xs">No case study document has been uploaded for this project yet.</p>
          )}
        </div>

        {/* Tech Stack Breakdown Section */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="py-8 border-t border-white/5 mb-12">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Hammer className="w-5 h-5 text-accent" />
              <span>Technology Matrix</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-accent/40 text-xs font-mono text-slate-200 transition-colors shadow-inner"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Slider/Grid */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="py-8 border-t border-white/5 mb-16">
            <h3 className="text-lg font-bold text-white mb-4">Project Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.gallery.map((img, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-white/5 h-48 bg-slate-950 shadow-md">
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <div className="py-8 border-t border-white/5">
            <h3 className="text-xl font-bold text-white mb-6">Related Projects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/projects/${rel.slug}`}
                  className="glass-card rounded-2xl p-5 border border-white/5 block hover:border-accent/30"
                >
                  <h4 className="text-base font-bold text-white mb-2 flex items-center justify-between group">
                    <span>{rel.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{rel.short_description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
