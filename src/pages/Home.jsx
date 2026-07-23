import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import { motion } from 'framer-motion';

export default function Home({ settings, onOpenTerminal }) {
  // Extract focus items
  const focusItems = settings?.current_focus || [];

  return (
    <div>
      {/* Hero section */}
      <Hero settings={settings} onOpenTerminal={onOpenTerminal} />

      {/* Current Focus Bar (directly below hero) */}
      {focusItems.length > 0 && (
        <section className="py-8 bg-[#0F0F12]/60 border-y border-white/5 backdrop-blur-sm relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs uppercase font-mono font-bold tracking-widest text-slate-400">
                  Current Focus
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {focusItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-accent/40 text-xs font-mono font-medium text-slate-200 transition-colors shadow-inner"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About section */}
      <About settings={settings} />

      {/* Skills section */}
      <Skills />
    </div>
  );
}
