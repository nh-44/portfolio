import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, Server, Cpu, FileCode, Palette, Sparkles, Box, Layers, 
  Terminal, Database, Network, Zap, Container, Brain, Cloud, 
  CloudSun, GitBranch, ShieldCheck 
} from 'lucide-react';
import { api } from '../utils/api';

const iconMap = {
  Code2, FileCode, Palette, Sparkles, Box, Layers,
  Server, Terminal, Database, Network, Zap, Container,
  Cpu, Brain, Cloud, CloudSun, GitBranch, ShieldCheck
};

export default function Skills() {
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await api.get('/api/skills/categories');
        setSkillsData(data);
      } catch (err) {
        console.error('Failed to load tools and skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-slate-500">
        <div className="w-5 h-5 rounded-full border border-accent border-t-transparent animate-spin mx-auto mb-2" />
        <span>Loading capabilities registry...</span>
      </div>
    );
  }

  if (skillsData.length === 0) {
    return null;
  }

  // Ensure activeCategory pointer remains inside bounds if list changes
  const activeIdx = activeCategory >= skillsData.length ? 0 : activeCategory;
  const currentCategory = skillsData[activeIdx];

  return (
    <section id="skills" className="py-24 relative bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>TECH STACK & CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Tools & technologies I <span className="text-gradient">work with daily</span>
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2">
          <div className="flex p-1.5 rounded-2xl glass-panel border border-white/10 gap-2">
            {skillsData.map((cat, idx) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(idx)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeIdx === idx
                    ? 'bg-accent text-slate-950 font-bold shadow-lg shadow-accent/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {cat.category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active Category Description */}
        <p className="text-center text-slate-400 text-sm mb-10 max-w-xl mx-auto">
          {currentCategory?.description}
        </p>

        {/* Skills Cards Grid */}
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentCategory?.items && currentCategory.items.map((skill, index) => {
            const IconComponent = iconMap[skill.icon] || Code2;
            return (
              <motion.div
                key={skill.id}
                whileHover={{ y: -4, scale: 1.01, borderColor: 'var(--accent)' }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between group transition-colors duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 group-hover:scale-110 group-hover:text-accent group-hover:border-accent/40 transition-all">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-white text-sm sm:text-base">
                    {skill.name}
                  </h4>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
