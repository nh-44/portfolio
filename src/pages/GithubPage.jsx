import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, Star, Eye, ExternalLink, HelpCircle, Code, Users, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SpotlightCard from '../components/SpotlightCard';

export default function GithubPage({ settings }) {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Expanded README tracking
  const [expandedRepo, setExpandedRepo] = useState(null);
  const [readmes, setReadmes] = useState({});

  // Extract github username dynamically from settings social links
  const githubUrl = settings?.social_links?.github || '';
  const username = githubUrl ? githubUrl.split('/').pop() : 'naveen-dev';

  useEffect(() => {
    const fetchGithubData = async () => {
      setLoading(true);
      try {
        // Fetch profile info
        const profileRes = await fetch(`https://api.github.com/users/${username}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        // Fetch repositories (sorted by updated, limit to 6)
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          setRepos(reposData);
        }
      } catch (err) {
        console.error('Failed to retrieve GitHub credentials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, [username]);

  const handleToggleReadme = async (repo) => {
    if (expandedRepo === repo.id) {
      setExpandedRepo(null);
      return;
    }
    
    setExpandedRepo(repo.id);
    if (readmes[repo.id]) return; // already loaded

    setReadmes(prev => ({
      ...prev,
      [repo.id]: { loading: true, content: '' }
    }));

    try {
      const res = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`);
      if (res.ok) {
        const data = await res.json();
        // Decode base64 README content
        const decoded = atob(data.content.replace(/\s/g, ''));
        setReadmes(prev => ({
          ...prev,
          [repo.id]: { loading: false, content: decoded }
        }));
      } else {
        setReadmes(prev => ({
          ...prev,
          [repo.id]: { loading: false, content: '*No README.md file found in this repository.*' }
        }));
      }
    } catch (err) {
      console.error('Error fetching readme:', err);
      setReadmes(prev => ({
        ...prev,
        [repo.id]: { loading: false, content: '*Failed to retrieve README from GitHub.*' }
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 rounded-lg border-2 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs text-slate-400">Connecting GitHub repositories & credentials...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-4">
      {/* GitHub Profile HUD Panel */}
      {profile && (
        <SpotlightCard className="bg-[#0C0C0E]/40 border-white/5 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={profile.avatar_url} 
              alt={profile.name || username} 
              className="w-20 h-20 rounded-2xl border border-white/10 shadow-xl"
            />
            <div className="flex-grow text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">{profile.name || username}</h2>
                <a 
                  href={profile.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-mono text-accent hover:underline self-center"
                >
                  <span>github.com/{profile.login}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-slate-400 text-xs max-w-2xl">{profile.bio || 'Building high-performance software, intelligent systems & robotic automations.'}</p>
              
              {/* GitHub metrics */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-[10px] font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  <span>Repos: <span className="text-slate-300 font-bold">{profile.public_repos}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Followers: <span className="text-slate-300 font-bold">{profile.followers}</span></span>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      )}

      {/* Repositories grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-accent" />
          <h3 className="text-lg font-bold font-mono tracking-tight text-white uppercase">Active Repositories</h3>
        </div>

        {repos.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-mono text-xs">
            No active public repositories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repos.map((repo) => {
              const isReadmeOpen = expandedRepo === repo.id;
              return (
                <motion.div
                  key={repo.id}
                  layout="position"
                  className="flex flex-col"
                >
                  <SpotlightCard className="bg-[#0C0C0E]/40 border-white/5 p-6 flex flex-col justify-between h-full relative">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className="text-sm font-bold text-white font-mono truncate">{repo.name}</h4>
                        <a 
                          href={repo.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-accent shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4 h-8">
                        {repo.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Readme toggle section */}
                      <button
                        onClick={() => handleToggleReadme(repo)}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-accent/40 text-[10px] font-mono text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                      >
                        {isReadmeOpen ? (
                          <>
                            <span>Hide README.md</span>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Show README.md</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>

                      {/* README viewport inside repositories */}
                      <AnimatePresence>
                        {isReadmeOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden bg-[#070709] border border-white/5 rounded-xl text-left"
                          >
                            <div className="p-4 max-h-[300px] overflow-y-auto font-mono text-[10px] text-slate-300 leading-normal scrollbar-none markdown-viewport">
                              {readmes[repo.id]?.loading ? (
                                <div className="py-8 text-center flex items-center justify-center gap-2">
                                  <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                                  <span>Syncing README...</span>
                                </div>
                              ) : (
                                <ReactMarkdown
                                  components={{
                                    h1: ({node, ...props}) => <h1 className="text-xs font-bold text-white border-b border-white/10 pb-1 mt-4 mb-2" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-xs font-bold text-slate-200 mt-3 mb-2" {...props} />,
                                    p: ({node, ...props}) => <p className="mb-2 text-slate-400" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                    li: ({node, ...props}) => <li className="text-[10px]" {...props} />,
                                    code: ({node, inline, children, ...props}) => (
                                      <code className="bg-slate-950 px-1 py-0.5 rounded text-accent" {...props}>
                                        {children}
                                      </code>
                                    )
                                  }}
                                >
                                  {readmes[repo.id]?.content || '*No README found.*'}
                                </ReactMarkdown>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{repo.watchers_count}</span>
                        </div>
                        {repo.language && (
                          <span className="ml-auto text-accent">{repo.language}</span>
                        )}
                        <span className="ml-auto text-[9px] text-slate-600">
                          Updated: {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
