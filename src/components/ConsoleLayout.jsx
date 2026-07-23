import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Folder, FolderOpen, FileCode, FileText, Terminal, Settings,
  Clock, Activity, Menu, X, ChevronRight, ChevronDown,
  Terminal as ConsoleIcon, Database, Sparkles, HelpCircle,
  Cpu, Wifi, MousePointer, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BatLogo from './BatLogo';
import TelemetryChart from './TelemetryChart';
import Beams from './Beams';
import Antigravity from './Antigravity';
import Footer from './Footer';

export default function ConsoleLayout({ children, settings, onOpenTerminal }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract Dossier configuration
  let dossierData = {
    status: "Available for Internships",
    location: "Bangalore, India",
    education: "B.Tech CSE",
    graduation: "2027",
    currentMission: "Building PatentEase",
    specialization: ["AI", "Backend", "Cloud"],
    openTo: ["SDE", "AI Engineer", "Data Analyst"],
    stats: {
      projects: "15+",
      leadershipRoles: "3",
      hackathons: "8",
      researchProjects: "2"
    }
  };

  if (settings?.dossier) {
    if (typeof settings.dossier === 'object') {
      dossierData = { ...dossierData, ...settings.dossier };
    } else if (typeof settings.dossier === 'string') {
      try {
        const parsed = JSON.parse(settings.dossier);
        dossierData = { ...dossierData, ...parsed };
      } catch (e) { }
    }
  }

  // Dynamic Background Configuration from site_settings
  let rawBgConfig = settings?.background_config || {};
  if (typeof rawBgConfig === 'string') {
    try {
      rawBgConfig = JSON.parse(rawBgConfig);
    } catch (e) {
      rawBgConfig = {};
    }
  }

  const bgTheme = settings?.background_theme || rawBgConfig.theme || 'beams';

  const beamsProps = {
    beamWidth: 1.5,
    beamHeight: 12,
    beamNumber: 30,
    lightColor: '#ffffff',
    speed: 10,
    noiseIntensity: 2.75,
    scale: 0.35,
    rotation: 0,
    ...(rawBgConfig.beams || {})
  };

  const antigravityProps = {
    count: 300,
    magnetRadius: 10,
    ringRadius: 10,
    waveSpeed: 0.4,
    waveAmplitude: 1,
    particleSize: 2,
    lerpSpeed: 0.1,
    color: '#8c6b1a',
    autoAnimate: false,
    particleVariance: 1,
    rotationSpeed: 0,
    depthFactor: 1,
    pulseSpeed: 3,
    particleShape: 'capsule',
    fieldStrength: 10,
    ...(rawBgConfig.antigravity || {})
  };

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({
    overview: true,
    timeline: true,
    archive: true,
    journal: true,
    credentials: true,
    integrations: true,
    terminal: true,
  });



  // Telemetry: Uptime Timer
  const [uptime, setUptime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Telemetry: Hardware & Network ping simulation
  const [latency, setLatency] = useState(24);
  const [latencyHistory, setLatencyHistory] = useState([24, 28, 22, 25, 27, 23, 26, 24, 25, 22, 28, 24, 26, 23, 25]);
  const [cpuLoad, setCpuLoad] = useState(12);
  const [ramLoad, setRamLoad] = useState(1.34);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => {
        const next = Math.max(12, Math.min(55, prev + Math.floor(Math.random() * 9) - 4));
        setLatencyHistory(history => [...history.slice(1), next]);
        return next;
      });
      setCpuLoad(prev => Math.max(4, Math.min(22, prev + Math.floor(Math.random() * 7) - 3)));
      setRamLoad(prev => parseFloat(Math.max(1.15, Math.min(1.65, prev + (Math.random() * 0.08) - 0.04)).toFixed(2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const toggleFolder = (folder) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folder]: !prev[folder]
    }));
  };

  const navItems = [
    { name: 'Home.jsx', path: '/', folder: 'overview', type: 'code', gitStatus: 'M' },
    { name: 'Journey.md', path: '/journey', folder: 'timeline', type: 'text', gitStatus: 'U' },
    { name: 'Projects.json', path: '/projects', folder: 'archive', type: 'code', gitStatus: '🟢' },
    { name: 'Blog.md', path: '/blog', folder: 'journal', type: 'text', gitStatus: 'U' },
    { name: 'Resume.pdf', path: '/resume', folder: 'credentials', type: 'text', gitStatus: '✓' },
    { name: 'Github.json', path: '/github', folder: 'integrations', type: 'code', gitStatus: '✓' },
    { name: 'Publications.json', path: '/publications', folder: 'integrations', type: 'code', gitStatus: '✓' },
    { name: 'Contact.sh', path: '/contact', folder: 'terminal', type: 'shell', gitStatus: '⚡' }
  ];

  const [openTabs, setOpenTabs] = useState([
    { name: 'Home.jsx', path: '/', folder: 'overview', type: 'code', gitStatus: 'M' }
  ]);

  // Synchronise location.pathname with openTabs
  useEffect(() => {
    const currentItem = navItems.find(item => {
      if (item.path === '/') return location.pathname === '/';
      return location.pathname.startsWith(item.path);
    });

    if (currentItem) {
      setOpenTabs(prev => {
        if (prev.some(t => t.path === currentItem.path)) {
          return prev;
        }
        return [...prev, currentItem];
      });
    }
  }, [location.pathname]);

  const handleCloseTab = (e, tabPath) => {
    e.stopPropagation();
    if (tabPath === '/') return; // Don't close Home

    setOpenTabs(prev => {
      const filtered = prev.filter(t => t.path !== tabPath);
      // If closing active tab, redirect to the last open tab
      if (location.pathname === tabPath || (tabPath !== '/' && location.pathname.startsWith(tabPath))) {
        const lastTab = filtered[filtered.length - 1] || navItems[0];
        navigate(lastTab.path);
      }
      return filtered;
    });
  };

  const activeItem = navItems.find(item => {
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  }) || navItems[0];

  const handleNav = (path) => {
    navigate(path);
    setIsMobileSidebarOpen(false);
  };

  // Dynamic Accent switcher
  const handleAccentChange = (colorHex) => {
    try {
      localStorage.setItem('accent_color', colorHex);
    } catch (e) {}
    document.documentElement.style.setProperty('--accent', colorHex);
    // Create glow color with 15% opacity
    const glowColor = `${colorHex}26`;
    document.documentElement.style.setProperty('--accent-glow', glowColor);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#070709] border-r border-white/5 font-mono select-none">
      {/* Sidebar Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#09090C]/80">
        <Database className="w-3.5 h-3.5 text-accent" />
        <span className="text-xs font-semibold tracking-wider text-slate-300">EXPLORER</span>
      </div>

      {/* Workspace Folders tree */}
      <div className="flex-grow overflow-y-auto py-4 px-2 space-y-1.5 text-xs text-slate-400 overscroll-contain" data-lenis-prevent>
        <div className="flex items-center gap-1.5 px-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
          <span>PROJECT_ROOT / nh-44</span>
        </div>

        {/* Dynamic folders */}
        {Object.keys(expandedFolders).map((folderKey) => {
          const isExpanded = expandedFolders[folderKey];
          const folderItems = navItems.filter(item => item.folder === folderKey);
          if (folderItems.length === 0) return null;

          const isFolderActive = folderItems.some(item => activeItem.folder === folderKey);

          return (
            <div key={folderKey} className="space-y-1">
              <div
                onClick={() => toggleFolder(folderKey)}
                className={`flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors ${isFolderActive ? 'text-accent' : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                {isExpanded ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
                <span className="capitalize">{folderKey}</span>
              </div>

              {isExpanded && (
                <div className="pl-6 border-l border-white/5 ml-3.5 space-y-0.5">
                  {folderItems.map(item => (
                    <div
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg cursor-pointer transition-all ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                        ? 'bg-accent/10 border-l-2 border-accent text-white font-medium pl-2'
                        : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.type === 'code' && <FileCode className="w-3.5 h-3.5 text-sky-400" />}
                        {item.type === 'text' && <FileText className="w-3.5 h-3.5 text-amber-400" />}
                        {item.type === 'shell' && <Terminal className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{item.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 flex flex-col font-sans relative overflow-hidden">

      {/* Top Console Titlebar Header */}
      <header className="h-14 bg-[#070709] border-b border-white/5 flex items-center justify-between px-4 z-50 select-none relative">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Bat Logo Branding */}
          <div className="flex items-center gap-2" onClick={() => handleNav('/')}>
            <BatLogo className="w-10 h-5 text-accent hover:brightness-110 cursor-pointer transition-all" />
            <span className="text-xs font-mono font-bold text-slate-300 hidden sm:inline-block">
              workspace: /nh-44
            </span>
          </div>
        </div>

        {/* Central Git details */}
        <CentralGitDetails />

        {/* Right utility buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTerminal}
            className="px-3 py-1.5 rounded-lg bg-[#0C0C0F] border border-white/5 text-[10px] font-mono text-slate-400 hover:text-accent hover:border-accent/40 flex items-center gap-1.5 transition-all"
          >
            <ConsoleIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">invoke_console</span>
          </button>
        </div>
      </header>

      {/* Main Console Split Area */}
      <div className="flex-grow flex relative z-10 h-[calc(100vh-3.5rem-1.5rem)] overflow-hidden">

        {/* Left Explorer Sidebar Pane (Desktop) */}
        <aside className="hidden lg:block w-[240px] flex-shrink-0 h-full">
          {sidebarContent}
        </aside>

        {/* Mobile Sidebar overlay Drawer */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer container */}
            <div className="relative w-64 max-w-xs h-full bg-[#070709] shadow-2xl flex flex-col z-50 animate-slide-in">
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Editor Main Content Area */}
        <main className="flex-grow flex flex-col h-full bg-[#050507]/95 overflow-hidden">
          {/* File Editor Tabs */}
          <div className="h-10 flex-shrink-0 bg-[#070709] border-b border-white/5 flex items-center px-2 overflow-x-auto whitespace-nowrap scrollbar-none select-none">
            {openTabs.map((item) => {
              const isTabActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <div
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`h-full flex items-center gap-2.5 px-4 border-r border-white/5 text-xs font-mono transition-all relative cursor-pointer border-t ${isTabActive
                    ? 'bg-[#050507] text-white border-t-accent font-semibold'
                    : 'text-slate-400 hover:text-slate-200 bg-[#09090C]/50 hover:bg-[#09090C]/80 border-t-transparent'
                    }`}
                >
                  {item.type === 'code' && <FileCode className="w-3.5 h-3.5 text-sky-400" />}
                  {item.type === 'text' && <FileText className="w-3.5 h-3.5 text-amber-400" />}
                  {item.type === 'shell' && <Terminal className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{item.name}</span>
                  {item.path !== '/' && (
                    <button
                      onClick={(e) => handleCloseTab(e, item.path)}
                      className="p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-slate-200 transition-colors ml-1"
                      title="Close file"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                  {isTabActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Viewport Pane with Line Gutter decoration */}
          <div className="flex-grow flex overflow-hidden relative">
            {/* Background inside the central workspace content area (below tab bar, between sidebars) */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-30 select-none overflow-hidden">
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                {bgTheme === 'antigravity' ? (
                  <Antigravity {...antigravityProps} />
                ) : (
                  <Beams {...beamsProps} />
                )}
              </div>
            </div>

            {/* Line numbers gutter background for developer vibe */}
            <div className="hidden sm:flex flex-col text-[10px] font-mono text-slate-700 bg-[#050507]/20 backdrop-blur-[1px] border-r border-white/5 py-6 px-3 text-right select-none w-12 flex-shrink-0 h-full overflow-hidden relative z-10">
              {Array.from({ length: 45 }).map((_, i) => (
                <div key={i} className="h-[24px] leading-[24px]">{(i + 1).toString().padStart(2, '0')}</div>
              ))}
            </div>

            {/* Main Content viewport with Framer Motion slide-fade reveals */}
            <div className="flex-grow overflow-y-auto px-4 sm:px-8 py-8 relative h-full z-10 flex flex-col justify-between" data-lenis-prevent>
              <div className="max-w-5xl mx-auto pb-16 w-full flex-grow flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex-grow"
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>

                <Footer settings={settings} />
              </div>
            </div>
          </div>
        </main>

        {/* Right Status Dossier Pane (Bruce Wayne style) */}
        <aside className="hidden xl:flex w-[230px] flex-shrink-0 h-full bg-[#070709] border-l border-white/5 flex-col p-4 font-mono text-xs text-slate-400 select-none">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span className="font-semibold text-slate-200 tracking-wider">STATUS</span>
            </div>
            <span className="text-[9px] text-slate-500 font-bold">DOSSIER</span>
          </div>

          <div className="space-y-3.5 flex-grow overflow-y-auto scrollbar-none overscroll-contain" data-lenis-prevent>
            {/* Status Indicator */}
            <div className="bg-[#0C0C0F] border border-white/5 p-3 rounded-xl">
              <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-wider font-bold">Status</div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
                <span>● {dossierData.status || "Available for Internships"}</span>
              </div>
            </div>

            {/* Location & Education & Graduation */}
            <div className="bg-[#0C0C0F] border border-white/5 p-3 rounded-xl space-y-2.5">
              <div>
                <div className="text-[9px] text-slate-500 mb-0.5 uppercase tracking-wider font-bold">Location</div>
                <div className="text-xs text-slate-200 font-medium">📍 {dossierData.location || "Bangalore, India"}</div>
              </div>
              <div className="border-t border-white/5 pt-2 flex justify-between items-center">
                <div>
                  <div className="text-[9px] text-slate-500 mb-0.5 uppercase tracking-wider font-bold">Education</div>
                  <div className="text-xs text-slate-200 font-medium">🎓 {dossierData.education || "B.Tech CSE"}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-500 mb-0.5 uppercase tracking-wider font-bold">Graduation</div>
                  <div className="text-xs font-mono font-bold text-accent">{dossierData.graduation || "2027"}</div>
                </div>
              </div>
            </div>

            {/* Current Mission */}
            <div className="bg-[#0C0C0F] border border-white/5 p-3 rounded-xl">
              <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-wider font-bold">Current Mission</div>
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                <span>{dossierData.currentMission || "Building PatentEase"}</span>
              </div>
            </div>

            {/* Specialization */}
            <div className="bg-[#0C0C0F] border border-white/5 p-3 rounded-xl">
              <div className="text-[9px] text-slate-500 mb-1.5 uppercase tracking-wider font-bold">Specialization</div>
              <div className="text-xs font-bold text-slate-200">
                {(Array.isArray(dossierData.specialization) ? dossierData.specialization : [dossierData.specialization || "AI"]).join(' • ')}
              </div>
            </div>

            {/* Open To Roles */}
            <div className="bg-[#0C0C0F] border border-white/5 p-3 rounded-xl">
              <div className="text-[9px] text-slate-500 mb-1.5 uppercase tracking-wider font-bold">Open To</div>
              <div className="flex flex-wrap gap-1">
                {(Array.isArray(dossierData.openTo) ? dossierData.openTo : ["SDE", "AI Engineer", "Backend Engineer"]).map((role, i) => (
                  <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300 font-medium">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Track Record Stats */}
            <div className="bg-[#0C0C0F] border border-white/5 p-3 rounded-xl space-y-2">
              <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-wider font-bold">Track Record</div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#131318] p-1.5 rounded-lg border border-white/5">
                  <div className="text-xs font-extrabold text-accent">{dossierData.stats?.projects || '15+'}</div>
                  <div className="text-[8px] text-slate-400 font-mono">Projects</div>
                </div>
                <div className="bg-[#131318] p-1.5 rounded-lg border border-white/5">
                  <div className="text-xs font-extrabold text-emerald-400">{dossierData.stats?.leadershipRoles || '3'}</div>
                  <div className="text-[8px] text-slate-400 font-mono">Leadership</div>
                </div>
                <div className="bg-[#131318] p-1.5 rounded-lg border border-white/5">
                  <div className="text-xs font-extrabold text-sky-400">{dossierData.stats?.hackathons || '8'}</div>
                  <div className="text-[8px] text-slate-400 font-mono">Hackathons</div>
                </div>
              </div>
              <div className="bg-[#131318] p-1.5 rounded-lg border border-white/5 text-center mt-1">
                <div className="text-xs font-extrabold text-amber-300">{dossierData.stats?.researchProjects || '2'}</div>
                <div className="text-[8px] text-slate-400 font-mono">Research Projects</div>
              </div>
            </div>

            {/* System Accent Switcher */}
            <div className="bg-[#0C0C0F] border border-white/5 p-3 rounded-xl">
              <div className="text-[9px] text-slate-500 mb-2 font-bold">ACCENT THEME</div>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { name: 'gold', hex: '#EAB308' },
                  { name: 'steel', hex: '#3F3F46' },
                  { name: 'cyan', hex: '#06B6D4' },
                  { name: 'blue', hex: '#2563EB' },
                  { name: 'red', hex: '#EF4444' }
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleAccentChange(c.hex)}
                    className="p-1 rounded bg-[#131318] hover:bg-white/5 border border-white/5 text-[8px] text-center uppercase font-bold hover:text-white transition-colors"
                    title={`Switch to ${c.name} accent`}
                  >
                    <span className="block w-2.5 h-2.5 rounded-full mx-auto mb-1 border border-white/10" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3.5 mt-auto text-[9px] text-slate-600 font-mono flex items-center justify-between">
            <span>node: 24.17.0</span>
            <span>db: postgres</span>
          </div>
        </aside>

      </div>

      {/* Bottom Console Statusbar */}
      <footer className="h-6 bg-[#070709] border-t border-white/5 flex items-center justify-between px-4 text-[10px] font-mono text-slate-500 select-none z-50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-accent font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Workspace Panel
          </span>
          <span className="text-slate-700">|</span>
          <span className="hidden sm:inline">Path: {location.pathname}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Spaces: 2</span>
          <span>UTF-8</span>
          <span className="bg-accent/15 px-2 py-0.5 rounded text-[9px] text-accent font-bold">VITE_DEV</span>
        </div>
      </footer>

    </div>
  );
}

// Isolated radar component to prevent mousemove events from re-rendering the layout shell and page contents
function CursorRadar() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-[#0C0C0F] border border-white/5 p-3 rounded-xl space-y-1">
      <div className="text-[9px] text-slate-500 mb-1 flex items-center gap-1">
        <MousePointer className="w-3 h-3 text-slate-400" />
        <span>CURSOR_RADAR</span>
      </div>
      <div className="text-[10px] font-bold text-slate-300">
        X_POS: <span className="text-accent">{coords.x.toString().padStart(4, '0')}</span> px
      </div>
      <div className="text-[10px] font-bold text-slate-300">
        Y_POS: <span className="text-accent">{coords.y.toString().padStart(4, '0')}</span> px
      </div>
    </div>
  );
}

function CentralGitDetails() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-slate-400 bg-[#0C0C0F] border border-white/5 px-4 py-1.5 rounded-xl">
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        git: <span className="text-slate-200">main</span>
      </span>
      <span className="text-slate-600">|</span>
      <span>
        lat: <span className="text-slate-300 font-bold">{coords.x}</span> lon: <span className="text-slate-300 font-bold">{coords.y}</span>
      </span>
    </div>
  );
}
