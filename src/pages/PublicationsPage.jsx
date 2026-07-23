import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Users, ExternalLink, Download, Sparkles, BookOpen } from 'lucide-react';
import { api } from '../utils/api';
import SpotlightCard from '../components/SpotlightCard';

export default function PublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const data = await api.get('/api/publications');
        setPublications(data);
      } catch (err) {
        console.error('Failed to load publications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 rounded-lg border-2 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs text-slate-400">Syncing index records...</span>
      </div>
    );
  }

  return (
    <section className="py-24 relative min-h-screen">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ACADEMIC & RESEARCH LIBRARY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Scientific <span className="text-gradient">Publications</span> & Research
          </h1>
          <p className="mt-4 text-slate-400 max-w-xl text-sm leading-relaxed">
            Index of peer-reviewed articles, IEEE conference publications, and technical patents.
          </p>
        </div>

        {/* Publications List */}
        {publications.length === 0 ? (
          <div className="text-center py-16 text-slate-500 font-mono text-sm border border-white/5 bg-[#0C0C0E]/30 rounded-2xl">
            No publications found in the records.
          </div>
        ) : (
          <div className="space-y-6">
            {publications.map((pub, idx) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <SpotlightCard className="p-6 md:p-8 bg-[#0C0C0E]/50 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-3 flex-grow">
                      <div className="flex items-center gap-2 text-xs font-mono text-accent">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{pub.date}</span>
                        {pub.journal_or_conference && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400 font-semibold">{pub.journal_or_conference}</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                        {pub.title}
                      </h3>

                      {pub.authors && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span>{pub.authors}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row md:flex-col items-center gap-3 shrink-0 self-start md:self-auto w-full md:w-auto border-t border-white/5 pt-4 md:border-t-0 md:pt-0">
                      {pub.pdf_url && (
                        <a
                          href={pub.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full md:w-auto px-4 py-2 rounded-xl bg-accent text-slate-950 font-mono text-xs font-bold hover:brightness-110 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </a>
                      )}
                      
                      {pub.verification_url && (
                        <a
                          href={pub.verification_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full md:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Article</span>
                        </a>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
