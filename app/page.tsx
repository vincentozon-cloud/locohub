'use client'; 
import React, { useState, useEffect } from 'react';
import { 
  Truck, Shield, Target, ZapOff, BarChart3, 
  Search, ClipboardCheck, Tag, LayoutDashboard, 
  Settings, LogOut, Activity, ChevronRight, RefreshCw, Plane, CheckCircle2,
  MapPin, Clock, Camera, MessageSquare, ShieldAlert, ShieldCheck, Scale, History, Info,
  Smartphone, Monitor, Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LocoHubCommandCenter() {
  const [activeTab, setActiveTab] = useState('visibility');
  const [selectedVan, setSelectedVan] = useState<any>(null);
  const [fleetData, setFleetData] = useState<any[]>([]);
  const [thumblingAlert, setThumblingAlert] = useState(false);
  
  const [coords, setCoords] = useState({ 
    lat: 8.9475, 
    lng: 125.5406, 
    lastUpdated: new Date().getTime() 
  });

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
    { id: 'compliance', label: 'Verification & Compliance', icon: <ClipboardCheck size={20} /> },
    { id: 'transparency', label: 'Price Transparency', icon: <Tag size={20} /> },
    { id: 'analytics', label: 'Efficiency Analytics', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans text-slate-800">
      
      {/* SIDEBAR NAVIGATION - Hover-to-Expand Logic */}
      <aside className="group fixed lg:sticky left-0 top-0 h-screen bg-slate-900 flex flex-col border-r border-slate-800 z-50 transition-all duration-300 ease-in-out w-0 lg:w-20 lg:hover:w-72 overflow-hidden lg:flex">
        <div className="p-6 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="min-w-[32px] w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white">LH</div>
            <h1 className="text-xl font-black tracking-tighter text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              EMVEOZ<span className="text-emerald-500">HUB</span>
            </h1>
          </div>

          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-500 ${
            thumblingAlert ? 'bg-red-500/20 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <div className={`min-w-[8px] w-2 h-2 rounded-full ${thumblingAlert ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${thumblingAlert ? 'text-red-500' : 'text-emerald-500'}`}>
              {thumblingAlert ? 'Signal Lost' : 'Satellite Lock'}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-hidden">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all font-bold text-sm ${
                activeTab === item.id ? 'bg-[#E31E24] text-white shadow-lg shadow-red-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}>
              <div className="min-w-[20px]">{item.icon}</div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase tracking-tighter whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* REWARD SYSTEM INTEGRATION */}
        <div className="p-4 mt-auto overflow-hidden">
            <div className="bg-gradient-to-br from-yellow-500 to-amber-700 p-4 rounded-2xl border border-yellow-400/30 shadow-xl min-w-[48px]">
                <div className="flex items-center gap-3">
                    <Zap className="min-w-[16px] text-white w-4 h-4 fill-white" />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
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
                  
                  {/* LIVE DEMO INSTRUCTIONS OVERLAY */}
                  <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 z-20 max-w-[180px] lg:max-w-xs bg-white/90 backdrop-blur-md p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 border-emerald-500 shadow-2xl transition-transform group-hover:scale-105">
                    <div className="flex items-center gap-2 mb-1 lg:mb-2 text-emerald-600">
                        <Smartphone size={16} className="animate-bounce" />
                        <span className="font-black text-[10px] lg:text-xs uppercase italic">Live GPS Test</span>
                    </div>
                    <p className="text-[9px] lg:text-[11px] font-bold text-slate-600 leading-tight lg:leading-snug">
                        Open on Phone and walk outside. 
                        <span className="text-emerald-600 font-black ml-1 uppercase">Watch the map move live!</span>
                    </p>
                  </div>

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
                {/* DEVICE SYNC CARD */}
                <div className="bg-emerald-600 p-6 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-xl text-white">
                    <div className="flex items-center justify-between mb-4">
                        <Monitor size={24} />
                        <div className="h-px w-8 bg-white/30" />
                        <Smartphone size={24} />
                    </div>
                    <h3 className="font-black text-sm uppercase italic mb-1">Cross-Device Sync</h3>
                    <p className="text-[10px] font-bold opacity-80 uppercase leading-tight">Proof of Real-Time Logistics Tracking</p>
                </div>

                <div className="bg-slate-900 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-2xl border-b-8 border-[#E31E24]">
                  <div className="flex items-center gap-3 mb-4 lg:mb-6 border-b border-slate-700 pb-5 text-white">
                    <ZapOff className="text-[#FDB813] w-5 h-5 lg:w-6 lg:h-6" />
                    <h3 className="font-black text-base lg:text-lg uppercase tracking-tight italic">Thumbling Alerts</h3>
                  </div>
                  {thumblingAlert ? (
                    <div className="bg-red-900/40 p-4 lg:p-5 rounded-2xl border-l-4 border-l-[#E31E24] animate-pulse">
                      <p className="text-[10px] font-black text-[#FDB813] uppercase mb-1">Sync Lapse</p>
                      <p className="text-lg lg:text-xl font-black text-white italic">{selectedVan?.plate_number || 'UNKNOWN'}</p>
                    </div>
                  ) : (
                    <div className="bg-emerald-900/20 p-4 lg:p-5 rounded-2xl border-l-4 border-l-emerald-500">
                      <p className="text-base lg:text-lg font-black text-white italic uppercase">All Systems Clear</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 max-h-[200px] lg:max-h-[220px] overflow-y-auto pr-2">
                  {fleetData.map((van, i) => (
                    <button key={i} onClick={() => setSelectedVan(van)} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${selectedVan?.id === van.id ? 'border-[#E31E24] bg-red-50' : 'border-white bg-white shadow-sm'}`}>
                      <div className="flex items-center gap-3 text-left">
                        <Truck size={20} className="text-slate-300" />
                        <div>
                          <h4 className="text-sm font-black text-slate-900 leading-none">{van.plate_number}</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">SR: {van.senior_salesman}</p>
                        </div>
                      </div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className={`bg-white p-6 rounded-3xl border shadow-sm flex items-center justify-between ${thumblingAlert ? 'border-red-500 bg-red-50' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 text-red-600 p-3 rounded-2xl"><ShieldAlert size={24} /></div>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase">{selectedVan?.plate_number || 'Unit Audit'}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{thumblingAlert ? 'Urgent: Signal Lost' : 'Verification Pending'}</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black uppercase text-[#E31E24] px-4 py-2 border border-red-100 rounded-lg">Audit</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}