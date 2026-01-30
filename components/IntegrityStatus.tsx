/**
 * (c) 2026 Emveoz Hub. All Rights Reserved.
 * Integrity Status: Visualizing the 'LocoHub Star' Tier.
 */

'use client';

import React from 'react';

export default function IntegrityStatus({ score }: { score: number }) {
  // Logic to determine the Star Tier
  const getTier = (s: number) => {
    if (s >= 95) return { label: 'Diamond Star', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (s >= 85) return { label: 'Gold Star', color: 'text-amber-500', bg: 'bg-amber-50' };
    return { label: 'Silver Tier', color: 'text-slate-500', bg: 'bg-slate-50' };
  };

  const tier = getTier(score);

  return (
    <div className={`p-4 rounded-2xl border ${tier.bg} border-current/10 mb-6 transition-all`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Driver Integrity Score</p>
          <h3 className={`text-2xl font-black ${tier.color}`}>{score}%</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Current Tier</p>
          <span className={`text-sm font-black ${tier.color}`}>{tier.label}</span>
        </div>
      </div>
      
      {/* Visual Progress Bar */}
      <div className="mt-3 w-full h-2 bg-white/50 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${tier.bg.replace('bg-', 'bg-') === 'bg-blue-50' ? 'bg-blue-500' : 'bg-amber-500'}`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}