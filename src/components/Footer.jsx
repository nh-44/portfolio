import React from 'react';
import { Code2 } from 'lucide-react';

export default function Footer({ settings }) {
  const footerText = settings?.footer_text || `© ${new Date().getFullYear()} Naveen S. All rights reserved.`;
  const name = settings?.hero_heading || 'Naveen';

  // Extract social links
  const socials = settings?.social_links || {};

  return (
    <footer className="py-12 border-t border-white/5 bg-[#09090B] relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center font-bold text-sm border border-accent/30">
              <Code2 className="w-4 h-4 text-accent" />
            </div>
            <span className="text-slate-400 font-mono text-xs">
              {footerText}
            </span>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  GitHub
                </a>
              )}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
