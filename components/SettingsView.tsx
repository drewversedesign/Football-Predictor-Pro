
import React, { useState, useEffect } from 'react';

export const SettingsView: React.FC = () => {
  const [footballKey, setFootballKey] = useState('');
  const [apiFootballKey, setApiFootballKey] = useState('');
  const [showFootballKey, setShowFootballKey] = useState(false);
  const [showApiFootballKey, setShowApiFootballKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFootballKey(localStorage.getItem('FOOTBALL_API_KEY') || '');
    setApiFootballKey(localStorage.getItem('API_FOOTBALL_KEY') || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('FOOTBALL_API_KEY', footballKey);
    localStorage.setItem('API_FOOTBALL_KEY', apiFootballKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearKeys = () => {
    if (window.confirm('Are you sure you want to clear all API keys from this device?')) {
      localStorage.removeItem('FOOTBALL_API_KEY');
      localStorage.removeItem('API_FOOTBALL_KEY');
      setFootballKey('');
      setApiFootballKey('');
      setSaved(true);
      setTimeout(() => setSaved(false), 1000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Engine Settings</h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Multi-Provider Synchronization & API Management</p>
        </div>
        <button 
          onClick={clearKeys}
          className="text-[10px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest border border-rose-500/20 px-4 py-2 rounded-xl transition-all"
        >
          Clear Device Storage
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-slate-800 p-8 rounded-[32px] border border-slate-700 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full -mr-20 -mt-20" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                 <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                 </svg>
               </div>
               <div>
                 <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1">API Authentication</h3>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Enter keys to enable real-time updates</p>
               </div>
            </div>

            {/* Recommended Source: API-Football */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-black text-white uppercase tracking-widest">API-Football (Tier 1)</label>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">Primary Data</span>
                </div>
                <div className="flex gap-4">
                  <a href="https://dashboard.api-football.com/" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-500 hover:text-emerald-400 font-black uppercase tracking-widest border-b border-emerald-500/30 hover:border-emerald-500 transition-all">Get API Key</a>
                </div>
              </div>
              <div className="relative group">
                <input 
                  type={showApiFootballKey ? "text" : "password"}
                  value={apiFootballKey}
                  onChange={(e) => setApiFootballKey(e.target.value)}
                  placeholder="Paste api-sports-key (e.g. 061ba...)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-5 text-white font-bold placeholder:text-slate-700 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none pr-14"
                />
                <button 
                  onClick={() => setShowApiFootballKey(!showApiFootballKey)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 p-1"
                >
                  {showApiFootballKey ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                Broad global coverage including Asian and Scandinavian leagues.
              </p>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-slate-700/50 flex-1" />
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Resilience Backup</span>
              <div className="h-px bg-slate-700/50 flex-1" />
            </div>

            {/* Secondary Source: Football-Data.org */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Football-Data.org (Tier 2)</label>
                  <span className="bg-slate-700 text-slate-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-slate-600 uppercase">Backup</span>
                </div>
                <a href="https://www.football-data.org/client/register" target="_blank" rel="noreferrer" className="text-[10px] text-slate-400 hover:text-white font-black uppercase tracking-widest border-b border-slate-700 hover:border-slate-500 transition-all">Sign Up</a>
              </div>
              <div className="relative group">
                <input 
                  type={showFootballKey ? "text" : "password"}
                  value={footballKey}
                  onChange={(e) => setFootballKey(e.target.value)}
                  placeholder="Paste X-Auth-Token..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-5 text-white font-bold placeholder:text-slate-700 focus:ring-2 focus:ring-slate-500/50 transition-all outline-none pr-14"
                />
                <button 
                  onClick={() => setShowFootballKey(!showFootballKey)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 p-1"
                >
                  {showFootballKey ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-600 font-medium leading-relaxed italic">
                Used if the Primary source fails or is restricted. Covers European Big 5.
              </p>
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-6 rounded-2xl transition-all shadow-xl shadow-emerald-500/10 active:scale-95 flex items-center justify-center gap-3 group"
            >
              {saved ? (
                <>
                  <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  CONFIG SAVED & SYNCED
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  SAVE & INITIALIZE PRO ENGINE
                </>
              )}
            </button>
          </div>
        </section>

        <div className="bg-slate-800/40 p-8 rounded-[40px] border border-slate-700/50 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-500" />
          <div className="bg-emerald-500/10 p-6 rounded-[32px] flex-shrink-0 border border-emerald-500/20 relative z-10">
            <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-3 relative z-10 text-center lg:text-left">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Resilience & Failover Logic</h4>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight">
              StatKick Pro is engineered for 99.9% uptime using a progressive waterfall architecture.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-3 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                <span className="text-[8px] font-black text-slate-600 block mb-1">PRIMARY</span>
                <span className="text-[10px] font-black text-emerald-400">API-FOOTBALL</span>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                <span className="text-[8px] font-black text-slate-600 block mb-1">FALLBACK A</span>
                <span className="text-[10px] font-black text-slate-500 italic">FOOTBALL-DATA</span>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                <span className="text-[8px] font-black text-slate-600 block mb-1">FALLBACK B</span>
                <span className="text-[10px] font-black text-purple-400">GEMINI SEARCH</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
              If Football-Data.org or API-Football are down, the engine automatically deploys Gemini AI Grounding to scrape real-time scores and upcoming schedules from the web.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
