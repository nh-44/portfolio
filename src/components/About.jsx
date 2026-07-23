import React from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle2 } from 'lucide-react';

export default function About({ settings }) {
  const bio = settings?.about_text || "I'm a passionate Software Engineer and final year Computer Science student at PES University, Bangalore, India.";
  const location = settings?.location || "Bangalore, India";

  // Extract quick facts
  const quickFacts = settings?.quick_facts || ["Final Year CS Student at PES University", "AI & ML", "Automotives", "Coding"];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-3">
            <User className="w-3.5 h-3.5" />
            <span>ABOUT Moi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Engineering digital experiences with <span className="text-gradient">precision , vision and teamwork</span>
          </h2>
        </div>

        {/* Bio Card - Centered Full-Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-white/5"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Software Developer & Problem Solver</span>
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                <span>{location}</span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-6">
              {bio}
            </p>

            <p className="text-slate-400 leading-relaxed text-xs sm:text-sm">
              My engineering philosophy is inspired by understanding the fundamentals and continuous improvement. I believe software engineering is a craft of compounding skills—constantly learning new things, seeking technical mastery, and shipping optimized code.
            </p>
          </div>

          {/* Quick Facts List */}
          {quickFacts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/5">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-4 font-semibold tracking-wider">Quick Status & Highlights:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickFacts.map((fact, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 font-mono bg-white/5 p-3 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
