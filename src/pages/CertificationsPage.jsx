import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Cloud, Server, Cpu, Award,
  ExternalLink, FileText, ArrowRight
} from 'lucide-react';
import { api } from '../utils/api';
import SpotlightCard from '../components/SpotlightCard';

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const data = await api.get('/api/certifications');
        setCertifications(data);
      } catch (err) {
        console.error('Failed to load certifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'cloud':
        return <Cloud className="w-5 h-5 text-sky-400" />;
      case 'server':
        return <Server className="w-5 h-5 text-amber-500" />;
      case 'robot':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'gdg':
        return <Award className="w-5 h-5 text-rose-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-accent" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 rounded-lg border-2 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs text-slate-400">Verifying security signatures & badges...</span>
      </div>
    );
  }

  return (
    <section className="py-24 relative min-h-screen">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VERIFIED CREDENTIALS AND BADGES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Certifications & <span className="text-gradient">Badges</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-xl text-sm leading-relaxed">
            Professional cloud, robotics, and developer community credentials verified via secure third-party issuers.
          </p>
        </div>

        {/* Credentials Grid */}
        {certifications.length === 0 ? (
          <div className="text-center py-16 text-slate-500 font-mono text-xs border border-white/5 bg-[#0C0C0E]/30 rounded-2xl">
            No certifications or badges registered under this profile.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="flex"
              >
                <SpotlightCard className="bg-[#0C0C0E]/50 border-white/5 p-6 text-center flex flex-col justify-between w-full">
                  <div className="flex flex-col items-center">
                    {/* Badge Emblem frame */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border relative overflow-hidden"
                      style={{
                        borderColor: `${cert.badge_color || '#EA4335'}33`,
                        backgroundColor: `${cert.badge_color || '#EA4335'}0d`
                      }}
                    >
                      <div
                        className="absolute inset-0.5 rounded-[14px] opacity-15 blur-sm"
                        style={{ backgroundColor: cert.badge_color || '#EA4335' }}
                      />
                      {cert.badge_image_url ? (
                        <img
                          src={cert.badge_image_url}
                          alt=""
                          className="w-full h-full object-cover relative z-10"
                        />
                      ) : (
                        getBadgeIcon(cert.type)
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1.5 leading-snug tracking-tight">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mb-4">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[10px] font-mono">
                    <span className="text-slate-500">{cert.date}</span>
                    <div className="flex items-center gap-3">
                      {cert.certificate_pdf_url && (
                        <a
                          href={cert.certificate_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline flex items-center gap-0.5"
                        >
                          <span>PDF</span>
                          <FileText className="w-3 h-3" />
                        </a>
                      )}
                      <a
                        href={cert.verification_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline flex items-center gap-0.5"
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
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
