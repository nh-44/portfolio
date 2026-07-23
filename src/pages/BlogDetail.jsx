import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Clock, BookOpen, AlertTriangle, ChevronRight } from 'lucide-react';
import { api } from '../utils/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/api/blog/${slug}`);
        setPost(data);

        // Fetch related posts (excluding current post)
        const allBlogs = await api.get('/api/blog');
        const related = allBlogs
          .filter((b) => b.id !== data.id)
          .slice(0, 2);
        setRelatedPosts(related);
      } catch (err) {
        console.error('Failed to load blog details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetails();
  }, [slug]);

  // Dynamic Markdown Components Mapping for premium headers, quotes, lists, and code blocks
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 rounded-lg border-2 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs text-slate-400">Rendering manuscript views...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center font-mono">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-lg font-bold text-white mb-2">Article Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">The requested journal entry does not exist or has not been published yet.</p>
        <Link to="/blog" className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-mono">
          Return to Feed
        </Link>
      </div>
    );
  }

  return (
    <section className="py-24 relative min-h-screen">
      {/* Background radial gradient overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-accent/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO JOURNAL</span>
        </Link>

        {/* Post Metadata & Category */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400 mb-4">
            <span className="px-2.5 py-0.5 rounded-lg bg-accent/10 border border-accent/20 text-accent uppercase font-bold">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-accent" />
              <span>{formatDate(post.created_at)}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-accent" />
              <span>{post.reading_time}</span>
            </span>
            {post.status === 'draft' && (
              <span className="text-amber-500 font-bold uppercase border border-amber-500/20 px-2 py-0.5 bg-amber-500/10 rounded-lg">
                DRAFT MODE
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-white/5 bg-slate-950 mb-12 shadow-xl">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Markdown Content */}
        <article className="prose prose-invert max-w-none mb-16">
          <ReactMarkdown components={markdownComponents}>
            {post.markdown_content}
          </ReactMarkdown>
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="py-6 border-t border-white/5 mb-12">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="py-8 border-t border-white/5">
            <h3 className="text-xl font-bold text-white mb-6">Read More</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="glass-card rounded-2xl p-5 border border-white/5 block hover:border-accent/30"
                >
                  <h4 className="text-base font-bold text-white mb-2 flex items-center justify-between group">
                    <span>{rel.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </h4>
                  <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-lg border border-accent/20 uppercase font-semibold">
                    {rel.category}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
