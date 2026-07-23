import React, { useState } from 'react';
import { FileText, Download, Maximize2, AlertCircle, RefreshCw } from 'lucide-react';

export default function ResumePage({ resumeUrl }) {
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [viewerError, setViewerError] = useState(false);

  // Backend proxy for inline viewing — serves PDF with correct content-type from our server
  // This bypasses CORS/content-type issues with raw Cloudinary URLs
  const getViewerUrl = (url) => {
    if (!url) return '';
    return `/api/media/view?url=${encodeURIComponent(url)}`;
  };

  // Backend proxy download — guarantees correct filename + extension
  const getProxyDownloadUrl = (url) => {
    if (!url) return '#';
    return `/api/media/download?url=${encodeURIComponent(url)}&filename=Resume_Naveen_S_GKN.pdf`;
  };

  const handleRefresh = () => {
    setIframeLoaded(false);
    setViewerError(false);
    setIframeKey((k) => k + 1);
  };

  const handleFullscreen = () => {
    if (resumeUrl) {
      // Open through our proxy so it renders correctly in new tab too
      window.open(getViewerUrl(resumeUrl), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="pt-2 pb-12 relative flex flex-col items-center">
      {/* Background glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full relative z-10 flex flex-col">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono mb-2">
            <FileText className="w-3 h-3" />
            <span>CREDENTIALS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Curriculum <span className="text-gradient">Vitae</span>
          </h1>
          <p className="mt-3 text-slate-400 text-xs font-mono">
            Directly sourced from the digital headquarters database.
          </p>
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-950/60 border border-white/5 rounded-2xl mb-6 backdrop-blur">
          <span className="text-xs font-mono text-slate-400">
            Format: PDF Document
          </span>

          <div className="flex items-center gap-3">
            {resumeUrl && (
              <>
                <button
                  onClick={handleRefresh}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all"
                  title="Reload viewer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-accent" />
                  <span className="hidden sm:inline">Reload</span>
                </button>

                <button
                  onClick={handleFullscreen}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all"
                  title="Open PDF in new tab"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-accent" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </button>
              </>
            )}

            <a
              href={getProxyDownloadUrl(resumeUrl)}
              className="px-4 py-2 rounded-xl bg-accent hover:brightness-110 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-accent/25 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>

        {/* Embedded PDF — proxied through our backend to ensure correct MIME type */}
        {resumeUrl ? (
          <div
            className="w-full rounded-2xl overflow-hidden border border-white/5 bg-slate-950 shadow-2xl relative"
            style={{ height: '82vh', minHeight: '600px' }}
          >
            {/* Loading spinner overlay */}
            {!iframeLoaded && !viewerError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10 gap-3">
                <div className="w-8 h-8 rounded-xl border-2 border-accent border-t-transparent animate-spin" />
                <span className="text-xs font-mono text-slate-500">Fetching resume from Cloudinary...</span>
              </div>
            )}

            {/* Error state */}
            {viewerError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10 gap-4 p-8 text-center">
                <AlertCircle className="w-10 h-10 text-amber-500" />
                <p className="text-white font-bold font-mono text-sm">Failed to load PDF viewer.</p>
                <p className="text-slate-400 text-xs font-mono">Try downloading the file directly instead.</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-slate-300 text-xs font-mono font-bold flex items-center gap-2 hover:bg-slate-700 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Try Again
                  </button>
                  <a
                    href={getProxyDownloadUrl(resumeUrl)}
                    className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-mono font-bold flex items-center gap-2 hover:brightness-110 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </a>
                </div>
              </div>
            )}

            <iframe
              key={iframeKey}
              src={getViewerUrl(resumeUrl)}
              className="w-full h-full border-0"
              title="Resume PDF Viewer"
              onLoad={() => { setIframeLoaded(true); setViewerError(false); }}
              onError={() => { setViewerError(true); setIframeLoaded(true); }}
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full h-96 flex flex-col items-center justify-center text-center p-8 bg-slate-900/40 border border-dashed border-white/10 rounded-3xl font-mono text-xs text-slate-500">
            <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
            <span>No resume PDF URL is currently configured in the database settings.</span>
            <span className="mt-2 text-slate-600">Go to Creator Studio → Resume tab to upload one.</span>
          </div>
        )}
      </div>
    </section>
  );
}
