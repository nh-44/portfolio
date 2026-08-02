import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, X, ArrowRight, CornerDownLeft, Sparkles, Folder, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import { gameEngine } from './wayneSecGame';

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set size
    canvas.width = canvas.parentElement?.clientWidth || 500;
    canvas.height = 160;

    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabet = katakana.split('');

    const fontSize = 11;
    const columns = canvas.width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    let animationId;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff66'; // Green text
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="block w-full bg-black rounded-xl border border-[#00ff66]/20 shadow-md shadow-[#00ff66]/5" />;
};

export default function TerminalPlayground({ isOpen, onClose, settings }) {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    {
      type: 'system',
      text: 'Console Shell v6.9 \nType "help" to view available terminal commands.'
    }
  ]);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [projectsList, setProjectsList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [terminalMode, setTerminalMode] = useState('normal'); // 'normal' or 'game'

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Fetch projects list for dynamic execution
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.get('/api/projects');
        if (Array.isArray(data)) {
          setProjectsList(data);
        }
      } catch (err) {
        console.error('Error loading terminal projects list:', err);
      }
    };
    fetchProjects();
  }, []);

  // Fetch skills categories list for dynamic technical stack breakdown
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await api.get('/api/skills/categories');
        if (Array.isArray(data)) {
          setSkillsList(data);
        }
      } catch (err) {
        console.error('Error loading terminal skills list:', err);
      }
    };
    fetchSkills();
  }, []);

  // Dynamic values
  const ownerName = settings?.hero_heading || 'Naveen S';
  const about = settings?.about_text || 'Software Engineer-in-Training with experience in backend systems, document intelligence, applied machine learning, and GenAI tooling.';
  const email = settings?.email || 'naveenselvaraj.selva@gmail.com';
  const location = settings?.location || 'Bengaluru, India';

  // Parse dossierData
  let dossierData = {
    status: "Available for Internships",
    location: "Bangalore, India",
    education: "B.Tech CSE",
    graduation: "2027",
    currentMission: "Building PatentEase",
    specialization: ["AI", "Backend", "Cloud"],
    openTo: ["SDE", "AI Engineer", "Backend Engineer"],
    stats: {
      projects: "15+",
      leadershipRoles: "3",
      hackathons: "8",
      teamsLed: "35+",
      researchProjects: "2"
    }
  };

  let rawD = settings?.dossier;
  if (rawD) {
    if (typeof rawD === 'object') dossierData = { ...dossierData, ...rawD };
    else if (typeof rawD === 'string') {
      try { dossierData = { ...dossierData, ...JSON.parse(rawD) }; } catch (e) {}
    }
  }

  const commandsHelpText = `Available Console Commands:
  whoami          Short professional bio
  resume          Open interactive resume viewer
  resume --download Download resume PDF
  projects        List available project case studies
  projects --open <slug> Inspect project detail
  journey         Condensed career timeline
  skills          Technical capabilities stack
  achievements    Hackathon placements & IEEE publications
  contact         Display interactive contact directory
  paper           Details of IEEE XAI publication
  play            Start the WAYNE_SEC Breach Protocol game

  open <github|linkedin> Open profile link in a new tab
  cd <dir>        Change directory / route page
  ls              List directories (projects, journey, contact...)
  tree            Output workspace folder tree
  clear           Clear screen buffer
  history         Show session command history
  help            Show command menu`;

  // Dynamically compile skills list string
  const compileSkillsText = () => {
    if (skillsList.length === 0) {
      return `Technical Stack Breakdown:
Frontend : React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Three.js
Backend  : Node.js, Express, Python, PostgreSQL, Redis, REST APIs
AI/Cloud : Gemini API, LangChain, Vector Databases, GCP, Docker, CI/CD
ML : Transformers , Explainable AI 
Database : MongoDB , Neon Postgres , Supabase , MySQL`;
    }
    return `Technical Stack Breakdown:\n` + 
      skillsList.map(cat => `${cat.category.padEnd(24)}: ${cat.items ? cat.items.map(item => item.name || item[0]).join(', ') : ''}`).join('\n');
  };

  const toggleThemeColor = () => {
    const accentColors = ['#EAB308', '#10B981', '#3B82F6', '#EF4444']; // Gold, Emerald, Blue, Red
    const currentAccent = localStorage.getItem('accent_color') || '#EAB308';
    let nextIndex = accentColors.indexOf(currentAccent) + 1;
    if (nextIndex >= accentColors.length) nextIndex = 0;
    const nextColor = accentColors[nextIndex];
    
    localStorage.setItem('accent_color', nextColor);
    document.documentElement.style.setProperty('--accent', nextColor);
    document.documentElement.style.setProperty('--accent-glow', nextColor + '26');
    return `Theme accent color toggled to: ${nextColor}`;
  };

  const commands = {
    help: commandsHelpText,

    whoami: `${ownerName} | Final Year CSE Student at PES University. Research Intern at CoDMAV.`,

    skills: compileSkillsText(),

    edu: `Academic Background:
    Degree    : ${dossierData.education}
    Location  : ${dossierData.location}
    Graduation: ${dossierData.graduation}`,

    pwd: `/workspace/nh44-cave`,

    ls: `drwxr-xr-x  projects/
drwxr-xr-x  journey/
drwxr-xr-x  contact/
drwxr-xr-x  literature/
drwxr-xr-x  credentials/`,

    tree: `nh44-cave/
├── projects/
├── journey/
├── contact/
├── literature/
│   ├── blog/
│   └── publications/
└── credentials/
    ├── resume/
    └── certifications/`,

    achievements: `Verified Achievements & Publications:
🏆 1st Place - Heal-O-Code Hackathon (2024)
🛡️ Finalist - Web3 & Cryptography Build-a-Thon (2024)
📄 IEEE INDICON 2025 Author: "Medicinal Leaf XAI Classifier"
   - Abstract: A multimodal Explainable AI framework utilizing Vision Transformers (BEiT) and Grad-CAM/LIME heatmaps to classify medicinal leaves.`,

    paper: `IEEE Research Publication:
Title    : Medicinal Leaf XAI Classifier (IEEE INDICON 2025)
DOI      : 10.1109/INDICON60803.2025.10998822
Abstract : A multimodal Explainable AI framework utilizing Vision Transformers (BEiT) and Grad-CAM/LIME heatmaps to classify medicinal leaves with high explainability and accuracy.
Link     : https://ieeexplore.ieee.org`,

    batman: `
    /\\                 /\\
   /  \\__  _________  __/  \\
   \\    \\_/         \\_/    /
    \\                 /
     \\___/^\\___/^\\___/

"It's not who I am underneath, but what I do that defines me."`,

    coffee: `
    (  )   (   )
     ) (    ) (
    _______  _
   |       |(_)
   |       |/
   |_______|
   [_______]

Fueled by 3 cups today. Ready to build.`,

    konami: `
    _  _____  _   _    _    __  __ ___ 
   | |/ / _ \\| \\ | |  / \\  |  \\/  |_ _|
   | ' / | | |  \\| | / _ \\ | |\\/| | | | 
   | . \\ |_| | |\\  |/ ___ \\| |  | | | | 
   |_|\\_\\___/|_| \\_/_/   \\_\\_|  |_|___|
   
[CHEAT ENABLED] Uptime bypassed. Admin protocols active.`,

    "about --terminal": "This terminal interface was vibecoded at 3:00 AM by Antigravity under the influence of dark roast coffee and synthwave playlists. Zero compilers were harmed in the making of this shell."
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const trimmed = input.trim();
      const lowerTrimmed = trimmed.toLowerCase();
      if (!lowerTrimmed) return;

      const newHistory = [...history, { type: 'user', text: `$ ${input}` }];
      setCmdHistory((prev) => [...prev, input]);
      setHistoryPointer(-1);

      // GAME MODE routing
      if (terminalMode === 'game') {
        if (lowerTrimmed === 'exit' || lowerTrimmed === 'quit' || lowerTrimmed === 'pause') {
          gameEngine.reset();
          setTerminalMode('normal');
          newHistory.push({ type: 'system', text: 'Exited WAYNE_SEC. Type "help" for commands.' });
          setHistory(newHistory);
        } else {
          const result = gameEngine.choose(trimmed);
          newHistory.push({ type: 'output', text: result.text });
          if (result.done) {
            setTerminalMode('normal');
            gameEngine.reset();
          }
          setHistory(newHistory);
        }
        setInput('');
        return;
      }

      // Normal Mode router
      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const arg1 = parts[1] ? parts[1].toLowerCase() : '';
      const arg2 = parts[2] ? parts[2].toLowerCase() : '';

      if (lowerTrimmed === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (lowerTrimmed === 'play' || lowerTrimmed === 'game') {
        gameEngine.start();
        setTerminalMode('game');
        newHistory.push({ type: 'output', text: gameEngine.currentText() });
        setHistory(newHistory);
        setInput('');
        return;
      } else if (lowerTrimmed === 'history') {
        const text = cmdHistory.length > 0
          ? cmdHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n')
          : 'No command history.';
        newHistory.push({ type: 'output', text });
        setHistory(newHistory);
      } else if (cmd === 'sudo') {
        newHistory.push({ type: 'error', text: 'Nice try. Permission denied.' });
        setHistory(newHistory);
      } else if (cmd === 'matrix') {
        newHistory.push({ type: 'matrix' });
        setHistory(newHistory);
      } else if (cmd === 'contact') {
        newHistory.push({ type: 'contact' });
        setHistory(newHistory);
      } else if (cmd === 'theme' && arg1 === '--toggle') {
        const msg = toggleThemeColor();
        newHistory.push({ type: 'system', text: msg });
        setHistory(newHistory);
      } else if (cmd === 'about' && arg1 === '--terminal') {
        newHistory.push({ type: 'output', text: commands['about --terminal'] });
        setHistory(newHistory);
      } else if (cmd === 'resume') {
        if (arg1 === '--download') {
          newHistory.push({ type: 'system', text: 'Downloading resume PDF...' });
          setHistory(newHistory);
          if (resumeUrl) {
            window.open(resumeUrl, '_blank');
          } else {
            newHistory.push({ type: 'error', text: 'Resume URL not configured.' });
            setHistory(newHistory);
          }
        } else {
          newHistory.push({ type: 'system', text: 'Opening resume viewer...' });
          setHistory(newHistory);
          setTimeout(() => { navigate('/resume'); onClose(); }, 500);
        }
      } else if (cmd === 'projects') {
        if (arg1 === '--open' && parts[2]) {
          const projectSlug = parts[2].toLowerCase();
          const targetProj = projectsList.find(p => (p.slug || p.id).toLowerCase() === projectSlug);
          if (targetProj) {
            newHistory.push({ type: 'system', text: `Opening project: ${targetProj.title}...` });
            setHistory(newHistory);
            setTimeout(() => {
              navigate(`/projects/${targetProj.slug || targetProj.id}`);
              onClose();
            }, 500);
          } else {
            newHistory.push({ type: 'error', text: `Project "${parts[2]}" not found.` });
            setHistory(newHistory);
          }
        } else {
          const text = projectsList.length > 0
            ? `Available Projects:\n${projectsList.map((p) => `  - ${p.slug || p.id} : ${p.title}`).join('\n')}\n\nType "projects --open <slug>" or "cd projects/<slug>" to inspect.`
            : 'No projects found in workspace.';
          newHistory.push({ type: 'output', text });
          setHistory(newHistory);
        }
      } else if (cmd === 'cd') {
        if (!arg1) {
          newHistory.push({ type: 'system', text: 'Navigating to overview...' });
          setHistory(newHistory);
          setTimeout(() => { navigate('/'); onClose(); }, 400);
        } else if (arg1 === 'projects') {
          newHistory.push({ type: 'system', text: 'Navigating to projects registry...' });
          setHistory(newHistory);
          setTimeout(() => { navigate('/projects'); onClose(); }, 400);
        } else if (arg1.startsWith('projects/')) {
          const projectSlug = arg1.substring(9).trim();
          const targetProj = projectsList.find(p => (p.slug || p.id).toLowerCase() === projectSlug);
          if (targetProj) {
            newHistory.push({ type: 'system', text: `Navigating to project: ${targetProj.title}...` });
            setHistory(newHistory);
            setTimeout(() => {
              navigate(`/projects/${targetProj.slug || targetProj.id}`);
              onClose();
            }, 500);
          } else {
            newHistory.push({ type: 'error', text: `Directory projects/${projectSlug} not found.` });
            setHistory(newHistory);
          }
        } else if (arg1 === 'journey') {
          newHistory.push({ type: 'system', text: 'Opening career timeline...' });
          setHistory(newHistory);
          setTimeout(() => { navigate('/journey'); onClose(); }, 400);
        } else if (arg1 === 'contact') {
          newHistory.push({ type: 'system', text: 'Opening contact page...' });
          setHistory(newHistory);
          setTimeout(() => { navigate('/contact'); onClose(); }, 400);
        } else if (arg1 === 'literature') {
          newHistory.push({ type: 'system', text: 'Opening Literature/Publications list...' });
          setHistory(newHistory);
          setTimeout(() => { navigate('/publications'); onClose(); }, 400);
        } else if (arg1 === 'credentials') {
          newHistory.push({ type: 'system', text: 'Opening credentials/resume...' });
          setHistory(newHistory);
          setTimeout(() => { navigate('/resume'); onClose(); }, 400);
        } else {
          newHistory.push({ type: 'error', text: `Directory not found: "${arg1}"` });
          setHistory(newHistory);
        }
      } else if (cmd === 'open') {
        if (arg1 === 'github') {
          newHistory.push({ type: 'system', text: 'Opening GitHub profile in a new tab...' });
          setHistory(newHistory);
          const githubLink = settings?.social_links?.github || 'https://github.com/nh-44';
          window.open(githubLink, '_blank');
        } else if (arg1 === 'linkedin') {
          newHistory.push({ type: 'system', text: 'Opening LinkedIn profile in a new tab...' });
          setHistory(newHistory);
          const linkedinLink = settings?.social_links?.linkedin || 'https://linkedin.com';
          window.open(linkedinLink, '_blank');
        } else if (arg1.startsWith('projects/') || projectsList.some(p => (p.slug || p.id).toLowerCase() === arg1)) {
          const slug = arg1.startsWith('projects/') ? arg1.substring(9).trim() : arg1;
          const targetProj = projectsList.find(p => (p.slug || p.id).toLowerCase() === slug);
          if (targetProj) {
            newHistory.push({ type: 'system', text: `Opening project: ${targetProj.title}...` });
            setHistory(newHistory);
            setTimeout(() => {
              navigate(`/projects/${targetProj.slug || targetProj.id}`);
              onClose();
            }, 500);
          } else {
            newHistory.push({ type: 'error', text: `Project "${slug}" not found.` });
            setHistory(newHistory);
          }
        } else {
          newHistory.push({ type: 'error', text: 'Usage: open <github|linkedin|projects/slug>' });
          setHistory(newHistory);
        }
      } else if (lowerTrimmed === 'journey') {
        newHistory.push({ 
          type: 'output', 
          text: `Career Timeline & Milestones:\n• 2020 - 2023 : High School & Secondary Education (First Class Honors)\n• 2023 - 2027 : PES University - B.Tech in Computer Science & Engineering\n• 2024 - Pres : Research Intern at CoDMAV (Vision Transformers & Multimodal XAI)\n• 2024 - Pres : Hackathons (1st Place Heal-O-Code, Build-a-Thon finalist)` 
        });
        setHistory(newHistory);
      } else if (commands[lowerTrimmed]) {
        newHistory.push({ type: 'output', text: commands[lowerTrimmed] });
        setHistory(newHistory);
      } else {
        newHistory.push({
          type: 'error',
          text: `command not found: "${trimmed}". Type "help" to list available commands.`
        });
        setHistory(newHistory);
      }

      setInput('');
    } else if (e.key === 'ArrowUp') {
      if (cmdHistory.length > 0) {
        const nextPtr = historyPointer === -1 ? cmdHistory.length - 1 : Math.max(0, historyPointer - 1);
        setHistoryPointer(nextPtr);
        setInput(cmdHistory[nextPtr]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyPointer !== -1) {
        const nextPtr = historyPointer + 1;
        if (nextPtr >= cmdHistory.length) {
          setHistoryPointer(-1);
          setInput('');
        } else {
          setHistoryPointer(nextPtr);
          setInput(cmdHistory[nextPtr]);
        }
      }
    }
  };

  if (!isOpen) return null;

  const getPlaceholder = () => {
    if (terminalMode === 'game') return 'choose option [1/2/A/B/C/exit]:';
    return 'type a command...';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl h-[480px] bg-[#070709] rounded-2xl border border-accent/20 shadow-2xl flex flex-col z-10 overflow-hidden font-mono text-xs"
        >
          {/* Header Bar */}
          <div className="bg-[#0F0F12] px-4 py-3 border-b border-white/5 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <button onClick={onClose} className="w-2.5 h-2.5 rounded-full bg-rose-500/80 hover:bg-rose-600 transition-colors" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-3 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-accent" />
                {ownerName.toLowerCase().replace(/\s+/g, '')}-hq ~ bash
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Terminal History Container */}
          <div
            className="flex-1 p-5 overflow-y-auto space-y-3 cursor-text text-slate-300 selection:bg-accent/40 selection:text-white scrollbar-thin"
            onClick={() => inputRef.current?.focus()}
            data-lenis-prevent
          >
            {history.map((item, idx) => (
              <div key={idx} className="leading-relaxed">
                {item.type === 'user' && (
                  <div className="text-accent font-semibold">{item.text}</div>
                )}
                {item.type === 'output' && (
                  <pre className="text-slate-300 font-mono whitespace-pre-wrap text-xs">{item.text}</pre>
                )}
                {item.type === 'system' && (
                  <div className="text-emerald-400 font-mono text-[11px]">{item.text}</div>
                )}
                {item.type === 'error' && (
                  <div className="text-rose-400 font-mono text-[11px]">{item.text}</div>
                )}
                {item.type === 'matrix' && (
                  <div className="py-2">
                    <MatrixRain />
                    <div className="text-[10px] text-emerald-500 font-mono mt-1">Decryption matrix initialized. Safe link established.</div>
                  </div>
                )}
                {item.type === 'contact' && (
                  <div className="space-y-1.5 text-xs font-mono text-slate-300 py-1 bg-slate-900/40 p-3 rounded-lg border border-white/5">
                    <div className="text-slate-400 uppercase tracking-widest text-[9px] mb-1 font-bold">HQ Contact Directory</div>
                    <div>Email    : <a href={`mailto:${email}`} className="text-accent hover:underline">{email}</a></div>
                    <div>GitHub   : <a href={settings?.social_links?.github || "https://github.com/nh-44"} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{settings?.social_links?.github || "github.com/nh-44"}</a></div>
                    <div>LinkedIn : <a href={settings?.social_links?.linkedin || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{settings?.social_links?.linkedin || "linkedin.com"}</a></div>
                  </div>
                )}
              </div>
            ))}

            {/* Current Input Line */}
            <div className="flex items-center gap-2 text-accent pt-1">
              <span className="font-semibold flex items-center gap-1">
                <span>$</span>
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono text-xs focus:ring-0 p-0"
                placeholder={getPlaceholder()}
                autoFocus
              />
            </div>
            <div ref={bottomRef} />
          </div>

          {/* Terminal Footer Info */}
          <div className="px-4 py-2 bg-[#0A0A0D] border-t border-white/5 text-[9px] text-slate-500 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>cave terminal shell</span>
            </span>
            <span>Type "help" for commands</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
