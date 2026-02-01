/**
 * (c) 2026 Emveoz Hub. All Rights Reserved.
 * Proprietary and Confidential.
 * Updated: Dashboard Field Sync Integration with Hybrid Sidebar Fix & Forensic Watermarking
 */

'use client'; 
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Truck, Shield, Target, ZapOff, BarChart3, 
  Search, ClipboardCheck, Tag, LayoutDashboard, 
  Settings, LogOut, Activity, ChevronRight, RefreshCw, Plane, CheckCircle2,
  MapPin, Clock, Camera, MessageSquare, ShieldAlert, ShieldCheck, Scale, History, Info,
  Smartphone, Monitor, Zap, PenTool
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// --- NEW IMPORTS FOR THE AUDIT FEATURE ---
import GasStationAudit from '@/components/GasStationAudit';
import AuditLog from '@/components/AuditLog';
import IntegrityStatus from '@/components/IntegrityStatus';
import { watermarkImage } from '@/lib/image-utils';

export default function LocoHubCommandCenter() {
  const [activeTab, setActiveTab] = useState('visibility');
  const [selectedVan, setSelectedVan] = useState<any>(null);
  const [fleetData, setFleetData] = useState<any[]>([]);
  const [thumblingAlert, setThumblingAlert] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Sidebar State
  
  // --- NEW STATE FOR AUDIT SYNC ---
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const integrityScore = useMemo(() => (auditLogs.length > 0 ? 100 : 0), [auditLogs]);

  const [coords, setCoords] = useState({ 
    lat: 8.9475, 
    lng: 125.5406, 
    lastUpdated: new Date().getTime() 
  });

 const handleNewCapture = async (newEntry: any) => {
    try {
      let finalImageBlob: Blob | File = newEntry.image;

      // 1. Attempt Forensic Watermarking
      try {
        finalImageBlob = await watermarkImage(newEntry.image, coords.lat, coords.lng);
      } catch (watermarkErr) {
        console.warn("Watermark failed, falling back to raw image:", watermarkErr);
        // If watermarking fails, we still use the original image file
      }

      // 2. Prepare for Upload
      const fileName = `audit-${Date.now()}.jpg`;
      const filePath = `field-runs/${fileName}`;

      // 3. Upload to Supabase
      const { data, error: storageError } = await supabase.storage
        .from('evidence')
        .upload(filePath, finalImageBlob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (storageError) throw storageError;

      // 4. Generate URL
      const { data: { publicUrl } } = supabase.storage
        .from('evidence')
        .getPublicUrl(filePath);

      // 5. Update Database
      const { error: dbError } = await supabase
        .from('field_audits')
        .insert([{
         plate_number: selectedVan?.plate_number || 'EMV-MOTO-01',
          odo_reading: Number(newEntry.odo) || 0, // Force it to be a number
         location_lat: coords.lat,
          location_lng: coords.lng,
          integrity_score: 100,
         image_url: publicUrl 
  }]);

      if (dbError) throw dbError;

      // 6. Success: Update the UI
      setAuditLogs((prev) => [{ ...newEntry, image: publicUrl }, ...prev]);

    } catch (err: any) {
      console.error('CRITICAL SYNC ERROR:', err.message);
      alert("Sync Error: " + err.message); // This will pop up on your phone
    }
  };
  
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        (pos) => {
          setCoords({ 
            lat: pos.coords.latitude, 
            lng: pos.coords.longitude,
            lastUpdated: new Date().getTime() 
          });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const lastSignal = coords.lastUpdated;
      if (now - lastSignal > 30000) {
        setThumblingAlert(true);
      } else {
        setThumblingAlert(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [coords.lastUpdated]);

  const fetchData = async () => {
    const { data: vans } = await supabase.from('vans').select('*');
    if (vans) setFleetData(vans);
  };

  useEffect(() => { fetchData(); }, []);

  const navItems = [
    { id: 'visibility', label: 'HQ Visibility', icon: <LayoutDashboard size={20} /> },
    { id: 'audit', label: 'Field Audit', icon: <Camera size={20} /> },
    { id: 'compliance', label: 'Verification & Compliance', icon: <ClipboardCheck size={20} /> },
    { id: 'transparency', label: 'Price Transparency', icon: <Tag size={20} /> },
    { id: 'analytics', label: 'Efficiency Analytics', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans text-slate-800">
      
      {/* MOBILE TOGGLE BUTTON */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[70] bg-slate-900 text-white p-4 rounded-full shadow-2xl border-2 border-emerald-500 active:scale-95 transition-transform"
      >
        {isSidebarOpen ? <LogOut size={24} /> : <LayoutDashboard size={24} />}
      </button>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[45] lg:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`
        group fixed lg:sticky left-0 top-0 h-screen bg-slate-900 flex flex-col border-r border-slate-800 z-50 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 w-0 lg:w-20 lg:hover:w-72'}
        overflow-hidden flex
      `}>
        <div className="p-6 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="min-w-[32px] w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white">LH</div>
            <h1 className={`text-xl font-black tracking-tighter text-slate-100 transition-opacity duration-300 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              EMVEOZ<span className="text-emerald-500">HUB</span>
            </h1>
          </div>

          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-500 ${
            thumblingAlert ? 'bg-red-500/20 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <div className={`min-w-[8px] w-2 h-2 rounded-full ${thumblingAlert ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest transition-opacity duration-300 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} ${thumblingAlert ? 'text-red-500' : 'text-emerald-500'}`}>
              {thumblingAlert ? 'Signal Lost' : 'Satellite Lock'}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-hidden">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false); 
              }}
              className={`w-full flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all font-bold text-sm ${
                activeTab === item.id ? 'bg-[#E31E24] text-white shadow-lg shadow-red-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}>
              <div className="min-w-[20px]">{item.icon}</div>
              <span className={`transition-opacity duration-300 uppercase tracking-tighter whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto overflow-hidden">
            <div className="bg-gradient-to-br from-yellow-500 to-amber-700 p-4 rounded-2xl border border-yellow-400/30 shadow-xl min-w-[48px]">
                <div className="flex items-center gap-3">
                    <Zap className="min-w-[16px] text-white w-4 h-4 fill-white" />
                    <div className={`transition-opacity duration-300 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">Star Program</span>
                      <p className="text-[8px] font-bold text-yellow-100 uppercase opacity-80 leading-tight">Integrity Active</p>
                    </div>
                </div>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-[#F4F5F7]">
        <header className="bg-white h-20 border-b border-slate-200 px-4 lg:px-10 flex items-center justify-between shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-2 lg:gap-4">
            <h2 className="text-base lg:text-xl font-black text-slate-900 uppercase tracking-tighter">{navItems.find(i => i.id === activeTab)?.label}</h2>
            <span className="h-4 w-[2px] bg-slate-200 mx-1 lg:mx-2" />
            <p className="hidden md:block text-[11px] font-bold text-slate-400 italic uppercase">Locating Integrity in Every Route.</p>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <button onClick={fetchData} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><RefreshCw size={18} className="text-slate-400" /></button>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#FDB813] rounded-full border-2 border-white shadow-md flex items-center justify-center font-black text-[10px] lg:text-xs">HQ</div>
          </div>
        </header>

        <div className="p-4 lg:p-8 flex-1 overflow-y-auto">
          
          {activeTab === 'visibility' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <div className="lg:col-span-8">
                <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] border-2 lg:border-4 border-white shadow-2xl overflow-hidden h-[350px] lg:h-[550px] relative border-slate-100 group">
                  <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-10 bg-slate-900/95 text-white p-3 lg:p-4 rounded-xl lg:rounded-2xl flex items-center gap-3 lg:gap-4 shadow-2xl border border-slate-700">
                    <Target className={`w-4 h-4 lg:w-6 lg:h-6 ${selectedVan ? 'text-[#FDB813] animate-pulse' : 'text-slate-500'}`} />
                    <div>
                      <p className="text-[8px] lg:text-[9px] font-black uppercase text-[#FDB813]">Satellite Lock</p>
                      <p className="text-xs lg:text-sm font-black tracking-widest">{selectedVan ? selectedVan.plate_number : 'SELECT UNIT'}</p>
                    </div>
                  </div>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng-0.002},${coords.lat-0.002},${coords.lng+0.002},${coords.lat+0.002}&layer=mapnik&marker=${coords.lat},${coords.lng}`} 
                    className="rounded-lg border-0" 
                  />
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-emerald-600 p-6 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-xl text-white">
                    <h3 className="font-black text-sm uppercase italic mb-1">Live Asset Sync</h3>
                    <p className="text-[10px] font-bold opacity-80 uppercase leading-tight">Field Node EMV-001 [ACTIVE]</p>
                </div>

                <div className="bg-slate-900 p-6 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-2xl border-b-8 border-[#E31E24]">
                  <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-5 text-white">
                    <ZapOff className="text-[#FDB813] w-5 h-5" />
                    <h3 className="font-black text-lg uppercase tracking-tight italic">Thumbling Alerts</h3>
                  </div>
                  {thumblingAlert ? (
                    <div className="bg-red-900/40 p-4 rounded-2xl border-l-4 border-l-[#E31E24] animate-pulse">
                      <p className="text-lg font-black text-white italic">{selectedVan?.plate_number || 'UNKNOWN'}</p>
                    </div>
                  ) : (
                    <div className="bg-emerald-900/20 p-4 rounded-2xl border-l-4 border-l-emerald-500">
                      <p className="text-lg font-black text-white italic uppercase">All Systems Clear</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {fleetData.map((van, i) => (
                    <button key={i} onClick={() => setSelectedVan(van)} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${selectedVan?.id === van.id ? 'border-[#E31E24] bg-red-50' : 'border-white bg-white shadow-sm'}`}>
                      <div className="flex items-center gap-3">
                        <Truck size={20} className="text-slate-300" />
                        <h4 className="text-sm font-black text-slate-900 leading-none">{van.plate_number}</h4>
                      </div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="space-y-6">
                 <div className="bg-white p-2 rounded-3xl shadow-xl border-t-4 border-blue-600">
                    <GasStationAudit onCapture={handleNewCapture} />
                 </div>
                 <div className="bg-[#0F172A] p-6 rounded-3xl text-white shadow-lg">
                    <IntegrityStatus score={integrityScore} />
                 </div>
              </section>
              
              <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                 <AuditLog logs={auditLogs} />
              </section>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="p-8 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
               <p className="text-slate-400 font-bold uppercase tracking-widest">Verification Modules Standby</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}