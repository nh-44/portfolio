import React from 'react';
import { motion } from 'framer-motion';
import { User, Zap, ShieldCheck, Cpu, Code2, CheckCircle2 } from 'lucide-react';

const principles = [
  {
    icon: Zap,
    title: "Performance Engineered",
    desc: "Optimizing web vitals and server responses for sub-100ms user interaction flows."
  },
  {
    icon: ShieldCheck,
    title: "Premium Architecture",
    desc: "Modular design systems, rigid backend validation, and clean REST APIs."
  },
  {
    icon: Cpu,
    title: "AI Integration",
    desc: "Implementing semantic vector indexing, autonomous LLM agents, and custom workflows."
  },
  {
    icon: Code2,
    title: "Engineering First",
    desc: "Designing responsive layouts, robust hardware controllers, and smooth micro-animations."
  }
];

export default function About({ settings }) {
  const bio = settings?.about_text || "I'm a passionate Software Engineer and final year Computer Science student. I design full-stack systems, cloud platforms, and program autonomous robotics.";
  const location = settings?.location || "Bangalore, India";
  
  // Extract quick facts
  const quickFacts = settings?.quick_facts || ["Final Year CS Student", "AI & Robotics", "Full Stack Engineer", "Bangalore"];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-3">
            <User className="w-3.5 h-3.5" />
            <span>ABOUT OWNER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Engineering digital experiences with <span className="text-gradient">precision & vision</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Bio Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 glass-panel rounded-3xl p-8 flex flex-col justify-between border border-white/5"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Software Developer & Problem Solver</span>
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  <span>{location}</span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed text-sm mb-6">
                {bio}
              </p>

              <p className="text-slate-400 leading-relaxed text-xs">
                My engineering philosophy is inspired by Batman's minimal discipline and Solo Leveling's growth loop. I believe software engineering is a craft of compounding skills—constantly tackling harder tasks, seeking technical mastery, and shipping optimized code.
              </p>
            </div>

            {/* Quick Facts List */}
            {quickFacts.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-3 font-semibold tracking-wider">Quick Status:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quickFacts.map((fact, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column: Engineering Principles */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4"
          >
            {principles.map((item, index) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -4, scale: 1.01, borderColor: 'var(--accent)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="glass-card rounded-2xl p-5 border border-white/5 flex items-start gap-4 transition-colors duration-300"
                >
                  <div className="p-3 rounded-xl bg-accent/10 text-accent border border-accent/25 shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
