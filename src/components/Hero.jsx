import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import DecryptedText from './DecryptedText';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 1 0 1.6 1.6 1.6 1.6 0 0 0-1.6-1.6z" />
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const defaultRoles = [
  "Software Engineer",
  "Full Stack Developer",
  "AI & Automation Architect",
  "Robotics Engineer"
];

export default function Hero({ settings, onOpenTerminal }) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract variables
  const name = settings?.hero_heading || 'Naveen';
  const tagline = settings?.hero_description || 'Building high-performance software, intelligent systems & robotic automations.';
  const aboutPreview = settings?.about_text || 'Final year Computer Science student specializing in AI, full stack systems, and robotics.';
  const profilePic = settings?.profile_picture_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80';
  const socials = settings?.social_links || {};

  const roles = settings?.quick_facts && settings.quick_facts.length > 0
    ? settings.quick_facts.slice(0, 4)
    : defaultRoles;

  useEffect(() => {
    const role = roles[currentRoleIndex];
    let timeout;

    if (!isDeleting && displayedText !== role) {
      timeout = setTimeout(() => {
        setDisplayedText(role.slice(0, displayedText.length + 1));
      }, 70);
    } else if (!isDeleting && displayedText === role) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && displayedText !== '') {
      timeout = setTimeout(() => {
        setDisplayedText(role.slice(0, displayedText.length - 1));
      }, 40);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentRoleIndex, roles]);

  return (
    <section className="relative pt-4 pb-12 overflow-hidden min-h-[70vh] flex items-center">
      {/* Background glow Orbs */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bio & Text Details */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center self-start gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-accent/20 text-accent text-xs font-mono mb-6 backdrop-blur-sm shadow-inner"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Available for high-impact roles & research</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              Hi, I'm{' '}
              <span className="text-gradient hover:brightness-110 transition-all font-sans">
                <DecryptedText text={name} delay={450} speed={40} />
              </span>
            </motion.h1>

            {/* Typing Role Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="h-10 mt-3 flex items-center"
            >
              <span className="text-lg sm:text-2xl font-mono font-semibold text-slate-300">
                I focus on <span className="text-accent underline decoration-accent/40 decoration-2 underline-offset-4">{displayedText}</span>
                <span className="animate-pulse text-accent">|</span>
              </span>
            </motion.div>

            {/* Social Icons Connections */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="flex items-center gap-3 mt-3 mb-1"
            >
              <a
                href={socials.github || "https://github.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-accent hover:border-accent/40 hover:bg-slate-850 transition-all flex items-center gap-2 text-xs font-mono group"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4 group-hover:scale-110 transition-transform text-slate-300 group-hover:text-accent" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href={socials.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-accent hover:border-accent/40 hover:bg-slate-850 transition-all flex items-center gap-2 text-xs font-mono group"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4 group-hover:scale-110 transition-transform text-slate-300 group-hover:text-accent" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
              <a
                href={socials.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-accent hover:border-accent/40 hover:bg-slate-850 transition-all flex items-center gap-2 text-xs font-mono group"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4 group-hover:scale-110 transition-transform text-slate-300 group-hover:text-accent" />
                <span className="hidden sm:inline">Instagram</span>
              </a>
              <a
                href={`mailto:${settings?.email || socials.email || "naveenselvaraj.selva@gmail.com"}`}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-accent hover:border-accent/40 hover:bg-slate-850 transition-all flex items-center gap-2 text-xs font-mono group"
                title="Email"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Email</span>
              </a>
            </motion.div>

            {/* Tagline Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl font-normal"
            >
              {tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-2 text-xs text-slate-500 leading-relaxed max-w-xl"
            >
              {aboutPreview}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/projects"
                  className="px-5 py-3 rounded-xl bg-accent hover:brightness-110 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-accent/20 transition-all group"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/contact"
                  className="px-5 py-3 rounded-xl bg-slate-900 border border-white/5 text-slate-200 hover:text-white font-mono font-bold text-xs flex items-center gap-2 hover:border-accent/40 transition-all"
                >
                  <Mail className="w-3.5 h-3.5 text-accent" />
                  <span>Contact HQ</span>
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenTerminal}
                className="px-4 py-3 rounded-xl bg-slate-950/80 border border-white/5 text-slate-400 hover:text-accent font-mono text-[10px] flex items-center gap-2 hover:border-accent/30 transition-all"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>$ invoke_terminal</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column: Premium Frame Profile Picture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <motion.div 
              whileHover={{ rotate: 1.5, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 18 }}
              className="relative group w-64 h-64 sm:w-80 sm:h-80 select-none cursor-pointer"
            >
              {/* Outer glowing ring background */}
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-accent to-accent/40 opacity-20 blur-xl group-hover:opacity-35 transition-opacity duration-500" />
              
              {/* Inner frame wrapper */}
              <div className="w-full h-full rounded-[2rem] bg-slate-950 p-2.5 border border-white/10 overflow-hidden shadow-2xl relative">
                {/* Overlay film filter */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40 z-10" />
                
                {/* Image */}
                <img
                  src={profilePic}
                  alt={name}
                  className="w-full h-full object-cover rounded-[1.5rem] grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              
              {/* Technical label overlay */}
              <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-white/10 px-3 py-1 rounded-xl text-[9px] font-mono text-slate-400 flex items-center gap-1 z-20 backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>System Owner: {name}</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
