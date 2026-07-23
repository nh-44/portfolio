import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, Download, Code2 } from 'lucide-react';

export default function Navbar({ settings, resumeUrl, onToggleTerminal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoName = settings?.hero_heading || 'Naveen';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Journey', href: '/journey' },
    { name: 'Projects', href: '/projects' },
    { name: 'Resume', href: '/resume' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0A0C]/85 backdrop-blur-md border-b border-white/5 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-accent/25 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-slate-100 group-hover:text-accent transition-colors tracking-tight">
                {logoName}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-accent font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                HQ Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-accent text-white shadow-md shadow-accent/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onToggleTerminal}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-accent/40 text-accent hover:text-white text-xs font-mono flex items-center gap-2 transition-all"
              title="Toggle Interactive CLI Terminal"
            >
              <Terminal className="w-4 h-4 text-accent" />
              <span>CLI Mode</span>
            </button>

            {resumeUrl && (
              <Link
                to="/resume"
                className="px-4 py-2 rounded-xl bg-accent hover:brightness-110 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resume</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleTerminal}
              className="p-2 rounded-lg bg-slate-900 text-accent border border-accent/20"
              aria-label="Toggle Terminal"
            >
              <Terminal className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/5 px-4 pt-3 pb-6 space-y-3 mt-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-mono text-slate-300 hover:text-white hover:bg-accent/10 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          {resumeUrl && (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/resume"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-accent text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                Resume View
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
