'use client';

import { useState } from 'react';

interface EvidenceLog {
  id: string;
  url: string;
}

export default function EvidenceGrid({ evidenceLogs }: { evidenceLogs: EvidenceLog[] }) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase px-1">
        Field Evidence Vault
      </h3>

      {/* The Evidence Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {evidenceLogs.map((log) => (
          <div key={log.id} className="relative group overflow-hidden rounded-lg border border-slate-200 shadow-sm">
            <img 
              src={log.url} 
              className="aspect-square object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImg(log.url)}
              alt="Field Evidence"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
              <span className="text-white text-[10px] font-bold bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                VERIFY DATA
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* The Zoom Modal (Lightbox) */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImg(null)}
        >
          {/* Close Button */}
          <button className="absolute top-6 right-6 text-white/50 hover:text-white text-4xl font-light transition">
            &times;
          </button>
          
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <img 
              src={selectedImg} 
              className="max-w-full max-h-[85vh] rounded shadow-2xl border border-white/10" 
              alt="Enlarged Evidence"
            />
            <p className="mt-4 text-slate-400 text-xs font-mono uppercase tracking-widest">
              Forensic View // Immutable Metadata Active
            </p>
          </div>
        </div>
      )}
    </section>
  );
}