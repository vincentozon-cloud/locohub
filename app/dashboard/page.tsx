/**
 * (c) 2026 Emveoz Hub. All Rights Reserved.
 * Dashboard: Field Sync Edition (Butuan -> Cebu)
 */

'use client';

import React, { useState, useMemo } from 'react';
import GasStationAudit from '@/components/GasStationAudit';
import AuditLog from '@/components/AuditLog';
import IntegrityStatus from '@/components/IntegrityStatus';

export default function DashboardPage() {
  const [logs, setLogs] = useState<any[]>([]);

  const handleNewCapture = (newEntry: any) => {
    setLogs((prev) => [newEntry, ...prev]);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* 1. TOP NAV (Matching your Screenshot) */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-[#003B31] tracking-tighter">EMVEOZ <span className="text-emerald-500">HUB</span></h1>
          <div className="h-4 w-[1px] bg-slate-300 mx-2"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Butuan ➜ Cebu Live Link</p>
        </div>
        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xs">HQ</div>
      </nav>

      <div className="flex flex-1">
        {/* 2. SIDEBAR (Matching your Screenshot) */}
        <aside className="w-64 bg-[#0F172A] p-4 hidden lg:flex flex-col gap-2">
           <div className="bg-[#003B31] p-3 rounded-lg border border-emerald-500/30 mb-4">
              <p className="text-[10px] font-bold text-emerald-400 uppercase italic">Satellite Lock Active</p>
           </div>
           <div className="bg-red-600 p-3 rounded-lg text-white text-xs font-bold uppercase tracking-tight">HQ Visibility</div>
           <div className="p-3 text-slate-400 text-xs font-bold uppercase tracking-tight hover:text-white cursor-pointer transition-colors">Verification</div>
           <div className="p-3 text-slate-400 text-xs font-bold uppercase tracking-tight hover:text-white cursor-pointer transition-colors">Price Transparency</div>
        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: MAP/LOG AREA (2 Columns wide) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-1">
               <div className="h-[400px] bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 italic font-medium">
                  [ LIVE FIELD MAP VIEW: BUTUAN SECTOR ]
               </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[200px]">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Evidence Stream</p>
                  <span className="text-[10px] font-bold text-emerald-500">REAL-TIME SYNC</span>
               </div>
               <AuditLog logs={logs} />
            </div>
          </div>

          {/* RIGHT: THE "ACTION" SIDEBAR (Where your Audit Tool goes) */}
          <div className="space-y-6">
            
            {/* INTEGRITY STATUS TILE */}
            <div className="bg-[#059669] p-6 rounded-3xl text-white shadow-lg">
               <IntegrityStatus score={logs.length > 0 ? 100 : 0} />
               <p className="text-[10px] font-bold opacity-70 mt-4 uppercase tracking-widest text-center italic">Lead Partner: EMV-001</p>
            </div>

            {/* THE GAS STATION AUDIT (High Visibility) */}
            <div className="bg-[#0F172A] p-1.5 rounded-[2rem] shadow-2xl border-t-4 border-blue-500">
               <div className="bg-white rounded-[1.75rem] overflow-hidden">
                  <GasStationAudit onCapture={handleNewCapture} />
               </div>
            </div>

            {/* THUMBLING ALERTS REPLACEMENT */}
            <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-800">
               <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Thumbling Alerts</p>
               <div className="p-3 bg-slate-900/50 rounded-xl border border-emerald-500/20">
                  <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-tight">System Ready for Field Loop</p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}