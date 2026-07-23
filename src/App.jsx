import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { api } from './utils/api';
import TerminalPlayground from './components/TerminalPlayground';
import BackgroundCanvas from './components/BackgroundCanvas';
import ConsoleLayout from './components/ConsoleLayout';
import CustomCursor from './components/CustomCursor';

// Pages
import Home from './pages/Home';
import JourneyPage from './pages/JourneyPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import ResumePage from './pages/ResumePage';
import BlogPage from './pages/BlogPage';
import BlogDetail from './pages/BlogDetail';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import GithubPage from './pages/GithubPage';
import PublicationsPage from './pages/PublicationsPage';
import useSmoothScroll from './hooks/useSmoothScroll';

export default function App() {
  useSmoothScroll(); // Enable smooth scrolling globally
  const [settings, setSettings] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const settingsData = await api.get('/api/settings');
      setSettings(settingsData);

      // Inject dynamic accent CSS variables (prefer user local selection, then settings, default to Gotham Gold #EAB308)
      const activeAccent = localStorage.getItem('accent_color') || settingsData?.accent_color || '#EAB308';
      document.documentElement.style.setProperty('--accent', activeAccent);
      
      let glowColor = `${activeAccent}26`;
      document.documentElement.style.setProperty('--accent-glow', glowColor);

      // Update Favicon and Title
      if (settingsData.seo_title) {
        document.title = settingsData.seo_title;
      }
      if (settingsData.favicon_url) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = settingsData.favicon_url;
      }
    } catch (err) {
      console.error('Failed to fetch site settings:', err);
      // Fallback: preserve local choice or default to Gold (#EAB308)
      const fallbackAccent = localStorage.getItem('accent_color') || '#EAB308';
      document.documentElement.style.setProperty('--accent', fallbackAccent);
      document.documentElement.style.setProperty('--accent-glow', `${fallbackAccent}26`);
    }
  };

  const fetchResume = async () => {
    try {
      const resumeData = await api.get('/api/settings/resume');
      setResumeUrl(resumeData.url);
    } catch (err) {
      console.error('Failed to fetch resume:', err);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      setLoading(true);
      await Promise.all([fetchSettings(), fetchResume()]);
      setLoading(false);
    };
    initApp();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-slate-100 flex flex-col items-center justify-center font-mono">
        <div className="w-12 h-12 rounded-xl border-2 border-accent border-t-transparent animate-spin mb-4"></div>
        <div className="text-sm text-slate-400">Loading digital headquarters...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#050507] text-slate-100 relative overflow-hidden flex flex-col">
        {/* Custom cursor (outer spring circle + inner target dot) */}
        <CustomCursor />

        {/* Live dynamic mesh grid canvas */}
        <BackgroundCanvas settings={settings} />

        {/* Tactical Console Workspace wrapper */}
        <ConsoleLayout 
          settings={settings} 
          onOpenTerminal={() => setTerminalOpen(true)}
        >
          <Routes>
            <Route path="/" element={<Home settings={settings} onOpenTerminal={() => setTerminalOpen(true)} />} />
            <Route path="/github" element={<GithubPage settings={settings} />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/resume" element={<ResumePage resumeUrl={resumeUrl} />} />
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/contact" element={<ContactPage settings={settings} />} />
            <Route path="/nh-44" element={<AdminDashboard onSettingsUpdated={fetchSettings} onResumeUpdated={fetchResume} />} />
          </Routes>
        </ConsoleLayout>

        {/* Interactive CLI terminal */}
        <TerminalPlayground
          isOpen={terminalOpen}
          onClose={() => setTerminalOpen(false)}
          settings={settings}
        />
      </div>
    </Router>
  );
}
