import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, X, ArrowRight, CornerDownLeft, Sparkles, Folder, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';

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
  whoami          Professional profile & background
  skills          Technical stack breakdown
  exp             Experience & leadership highlights
  edu             Academic background (B.Tech CSE '27)

  projects        List all projects with IDs & serials
  open <id|num>   Open specific project case study
  publications    Open scientific publications & patents

  journey         Open career timeline & milestones
  blog            Open engineering articles & journal
  resume          Open interactive resume viewer
  contact         Contact information & contact page

  ls              List workspace directories
  tree            Output portfolio file structure
  pwd             Display current terminal path
  clear           Clear terminal output
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

  const commands = {
    help: commandsHelpText,

    whoami: `${ownerName} | Software Engineer
Location : ${location}
Focus    : ${(Array.isArray(dossierData.specialization) ? dossierData.specialization : [dossierData.specialization]).join(', ')}
About    : ${about}`,

    skills: compileSkillsText(),

    exp: `Experience & Leadership Highlights:
• Current Mission: ${dossierData.currentMission}
• Projects: ${dossierData.stats?.projects || '15+'}
• Leadership Roles: ${dossierData.stats?.leadershipRoles || '3'}
• Hackathons Completed: ${dossierData.stats?.hackathons || '8'}
• Research Projects: ${dossierData.stats?.researchProjects || '2'}`,

    edu: `Academic Background:
    Degree    : ${dossierData.education}
    Location  : ${dossierData.location}
    Graduation: ${dossierData.graduation}`,

    pwd: `/workspace/nh44-cave`,

    ls: `drwxr-xr-x  Overview/      -> Home.jsx
drwxr-xr-x  Timeline/      -> Journey.md
drwxr-xr-x  Archive/       -> Projects.json
drwxr-xr-x  Literature/    -> Blog.md & Publications.json
drwxr-xr-x  Credentials/   -> Resume.pdf & Certificates.json`,

    tree: `nh44-cave/
├── Overview/
│   └── Home.jsx
├── Timeline/
│   └── Journey.md
├── Archive/
│   └── Projects.json
├── Literature/
│   ├── Blog.md
│   └── Publications.json
├── Credentials/
│   ├── Resume.pdf
│   └── Certificates.json
└── Terminal/
    └── Contact.sh`
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const trimmed = input.trim();
      const lowerTrimmed = trimmed.toLowerCase();
      if (!lowerTrimmed) return;

      const newHistory = [...history, { type: 'user', text: `$ ${input}` }];
      setCmdHistory((prev) => [...prev, input]);
      setHistoryPointer(-1);

      // Routing navigation commands
      if (lowerTrimmed === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (lowerTrimmed === 'publications') {
        newHistory.push({ type: 'system', text: 'Opening scientific publications...' });
        setHistory(newHistory);
        setTimeout(() => { navigate('/publications'); onClose(); }, 400);
      } else if (lowerTrimmed === 'journey') {
        newHistory.push({ type: 'system', text: 'Opening career timeline...' });
        setHistory(newHistory);
        setTimeout(() => { navigate('/journey'); onClose(); }, 400);
      } else if (lowerTrimmed === 'blog') {
        newHistory.push({ type: 'system', text: 'Opening engineering blog...' });
        setHistory(newHistory);
        setTimeout(() => { navigate('/blog'); onClose(); }, 400);
      } else if (lowerTrimmed === 'resume') {
        newHistory.push({ type: 'system', text: 'Opening resume viewer...' });
        setHistory(newHistory);
        setTimeout(() => { navigate('/resume'); onClose(); }, 400);
      } else if (lowerTrimmed === 'contact') {
        newHistory.push({
          type: 'output',
          text: `Contact Info:\nEmail: ${email}\nLocation: ${location}\nNavigating to contact page...`
        });
        setHistory(newHistory);
        setTimeout(() => { navigate('/contact'); onClose(); }, 600);
      } else if (lowerTrimmed === 'projects' || lowerTrimmed === 'get projects') {
        const text = projectsList.length > 0
          ? `Available Projects:\n${projectsList.map((p, idx) => `  ${idx + 1}. [id: ${p.slug || p.id}] ${p.title}`).join('\n')}\n\nType "open <id>" or "open <number>" to view details.`
          : 'No projects found in workspace.';
        newHistory.push({ type: 'output', text });
        setHistory(newHistory);
      } else if (lowerTrimmed.startsWith('open ') || lowerTrimmed.startsWith('cd ')) {
        const spaceIdx = lowerTrimmed.indexOf(' ');
        const arg = lowerTrimmed.substring(spaceIdx + 1).trim();
        let targetProj = null;

        // Try numeric index first
        const numIdx = parseInt(arg, 10) - 1;
        if (!isNaN(numIdx) && numIdx >= 0 && numIdx < projectsList.length) {
          targetProj = projectsList[numIdx];
        } else {
          // Try matching ID/slug
          targetProj = projectsList.find(p => (p.slug || p.id).toLowerCase() === arg.toLowerCase());
        }

        if (targetProj) {
          newHistory.push({ type: 'system', text: `Opening project: ${targetProj.title}...` });
          setHistory(newHistory);
          setTimeout(() => {
            navigate(`/projects/${targetProj.slug || targetProj.id}`);
            onClose();
          }, 500);
        } else {
          newHistory.push({
            type: 'error',
            text: `Project not found for query "${arg}". Type "projects" to view all available IDs & numbers.`
          });
          setHistory(newHistory);
        }
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
                {ownerName.toLowerCase()}-hq ~ bash
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
            className="flex-1 p-5 overflow-y-auto space-y-3 cursor-text text-slate-300 selection:bg-accent/40 selection:text-white"
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
                placeholder="type a command..."
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
