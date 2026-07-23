import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, Star, Eye, ExternalLink, Award, ShieldCheck, 
  Cpu, Cloud, Server, HelpCircle, Code, Users, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '../utils/api';
import SpotlightCard from '../components/SpotlightCard';

export default function GithubPage({ settings }) {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [certifications, setCertifications] = useState([]);
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

    const fetchCerts = async () => {
      try {
        const data = await api.get('/api/certifications');
        setCertifications(data);
      } catch (err) {
        console.error('Failed to fetch certifications:', err);
      }
    };

    fetchGithubData();
    fetchCerts();
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

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'cloud':
        return <Cloud className="w-5 h-5 text-sky-400" />;
      case 'server':
        return <Server className="w-5 h-5 text-amber-500" />;
      case 'robot':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'gdg':
        return <Award className="w-5 h-5 text-rose-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-accent" />;
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
                <div className="flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Gists: <span className="text-slate-300 font-bold">{profile.public_gists}</span></span>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      )}

      {/* Repositories Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-accent" />
          <h3 className="text-lg font-bold font-mono tracking-tight text-white uppercase">Active GitHub Repositories</h3>
        </div>

        {repos.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-mono text-xs">
            No public repositories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repos.map((repo, idx) => {
              const isExpanded = expandedRepo === repo.id;
              const readme = readmes[repo.id];

              return (
                <motion.div
                  key={repo.id}
                  layout="position"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`flex flex-col h-full transition-all duration-300 ${isExpanded ? 'md:col-span-2' : ''}`}
                >
                  <SpotlightCard className="bg-[#0C0C0E]/50 border-white/5 p-5 flex flex-col justify-between w-full h-full">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <a 
                          href={repo.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-white hover:text-accent transition-colors flex items-center gap-1"
                        >
                          <span>{repo.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </a>
                        {repo.language && (
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-[9px] font-mono text-slate-400">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
                        {repo.description || 'No description provided.'}
                      </p>

                      {/* README Collapsible Trigger */}
                      <button
                        onClick={() => handleToggleReadme(repo)}
                        className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-mono text-slate-300 transition-colors border border-white/5"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Hide README.md</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>Import README.md</span>
                          </>
                        )}
                      </button>

                      {/* README Content Display */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-4"
                          >
                            <div className="max-h-[350px] overflow-y-auto overscroll-contain p-4 rounded-xl bg-slate-950/80 border border-white/5 text-xs font-sans text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-white/10 prose prose-invert prose-xs max-w-none" data-lenis-prevent>
                              {readme?.loading ? (
                                <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 py-4">
                                  <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                                  <span>Fetching repository documentation...</span>
                                </div>
                              ) : (
                                <ReactMarkdown>{readme?.content || ''}</ReactMarkdown>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-accent" />
                        <span>{repo.stargazers_count}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                        <span>{repo.forks_count}</span>
                      </span>
                      <span className="ml-auto text-[9px] text-slate-600">
                        Updated: {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certifications and Badges Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <h3 className="text-lg font-bold font-mono tracking-tight text-white uppercase">Verified Credentials & Badges</h3>
        </div>

        {certifications.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-mono text-xs">
            No certifications found in records.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="flex"
              >
                <SpotlightCard className="bg-[#0C0C0E]/50 border-white/5 p-5 text-center flex flex-col justify-between w-full">
                  <div className="flex flex-col items-center">
                    {/* Badge Emblem frame */}
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border relative overflow-hidden"
                      style={{ 
                        borderColor: `${cert.badge_color || '#EA4335'}33`,
                        backgroundColor: `${cert.badge_color || '#EA4335'}0d` 
                      }}
                    >
                      <div 
                        className="absolute inset-0.5 rounded-[14px] opacity-10 blur-sm"
                        style={{ backgroundColor: cert.badge_color || '#EA4335' }}
                      />
                      {cert.badge_image_url ? (
                        <img 
                          src={cert.badge_image_url} 
                          alt="" 
                          className="w-full h-full object-cover relative z-10" 
                        />
                      ) : (
                        getBadgeIcon(cert.type)
                      )}
                    </div>
                    
                    <h4 className="text-xs font-bold text-white mb-1 leading-snug tracking-tight">
                      {cert.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono mb-3">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3.5 border-t border-white/5 text-[9px] font-mono">
                    <span className="text-slate-600">{cert.date}</span>
                    <div className="flex items-center gap-2.5">
                      {cert.certificate_pdf_url && (
                        <a 
                          href={cert.certificate_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline flex items-center gap-0.5"
                        >
                          <span>PDF</span>
                          <FileText className="w-2.5 h-2.5" />
                        </a>
                      )}
                      <a 
                        href={cert.verification_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline flex items-center gap-0.5"
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
