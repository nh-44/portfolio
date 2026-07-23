import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Building2 } from 'lucide-react';
import { experienceData } from '../data/portfolioData';

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>CAREER TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Professional <span className="text-gradient">Experience & Impact</span>
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Glowing Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-indigo-500 to-emerald-500 -translate-x-1/2 opacity-30" />

          <div className="space-y-12">
            {experienceData.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot Indicator */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 w-8 h-8 rounded-full bg-slate-900 border-2 border-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                  </div>

                  {/* Card Content Container */}
                  <div className="ml-12 md:ml-0 md:w-1/2 md:px-8 w-full">
                    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-mono text-sky-400 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          <span>{item.period}</span>
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{item.company}</span>
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3">
                        {item.role}
                      </h3>

                      <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        {item.description}
                      </p>

                      {/* Skills used */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                        {item.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 rounded-lg bg-slate-900/80 text-slate-300 text-xs font-mono border border-slate-700/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
