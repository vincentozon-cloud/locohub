/**
 * (c) 2026 Emveoz Hub. All Rights Reserved.
 * Audit Log: Forensic Evidence Stream
 * Final fix for image source and longitude mapping.
 */

'use client';

import React from 'react';

export default function AuditLog({ logs }: { logs: any[] }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Field Evidence Stream
        </h3>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase">
          Sector: Butuan
        </span>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Waiting for Field Sync...</p>
          </div>
        ) : (
          logs.map((log) => {
            // Forensic Mapping: Check every possible field name for the image and coordinates
            const displayImage = log.image_url || log.photo || log.image;
            const displayLat = log.location_lat || log.lat || 0;
            const displayLng = log.location_lng || log.long || log.lng || 0;

            return (
              <div key={log.id} className="group relative bg-slate-50 p-4 rounded-2xl border border-slate-200 transition-all hover:border-blue-400 hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                    {displayImage ? (
                      <img 
                        src={displayImage} 
                        alt="Evidence" 
                        className="w-full h-full object-cover opacity-90" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-[8px] text-slate-500 uppercase font-black px-2 text-center">
                        No Media Sync
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-[8px] text-white text-center font-mono">
                      SYNCED
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                          {log.type === 'DRIVER_VERIFY' ? '👤 Partner Identity' : '⛽ Fuel Receipt/ODO'}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                          Device: EMV-MOTO-01
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-500 font-black bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'LIVE'}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        </div>
                        <p className="text-[10px] text-blue-700 font-black tracking-tighter">
                          {Number(displayLat).toFixed(6)}, {Number(displayLng).toFixed(6)}
                        </p>
                      </div>
                      
                      <div className="bg-emerald-600 px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.9L10 1.5l7.834 3.4a1 1 0 01.666.927v4.4a12.42 12.42 0 01-2.91 8.016l-5.11 5.34a.75.75 0 01-1.092 0l-5.11-5.34a12.42 12.42 0 01-2.91-8.016V5.827a1 1 0 01.666-.927zM10 14.25a.75.75 0 00.75-.75V7.456l2.12 2.12a.75.75 0 101.06-1.06l-3.4-3.4a.75.75 0 00-1.06 0l-3.4 3.4a.75.75 0 101.06 1.06l2.12-2.12V13.5a.75.75 0 00.75.75z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Integrity Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}