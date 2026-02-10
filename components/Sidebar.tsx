import React from 'react';
import { AppView } from '../types';
import { signOut, useSession } from '../services/authService';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isSyncing?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { data: session } = useSession();

  const menuItems = [
    {
      id: 'PREDICT' as AppView,
      label: 'Match Center',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: 'Live Predictions'
    },
    {
      id: 'FEED' as AppView,
      label: 'Expert Feed',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      description: 'Global Insights'
    },
    {
      id: 'MY_PREDICTIONS' as AppView,
      label: 'My Tracked',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ),
      description: 'Prediction History'
    },
    {
      id: 'BACKTEST' as AppView,
      label: 'Backtest Lab',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: 'Historical ROI'
    },
    {
      id: 'LEAGUE_ANALYTICS' as AppView,
      label: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      description: 'League Trends'
    },
    {
      id: 'SETTINGS' as AppView,
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: 'Configuration'
    }
  ];

  return (
    <nav className="w-full lg:w-64 flex-shrink-0 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 h-auto lg:h-screen lg:sticky lg:top-0 z-30 flex flex-col">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl text-slate-900 shadow-lg shadow-emerald-500/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white leading-none">STATKICK</h1>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">PRO ENGINE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar lg:overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all group min-w-[160px] lg:min-w-0 ${
              currentView === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/30 border border-transparent'
            }`}
          >
            <div className={`${currentView === item.id ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
              {item.icon}
            </div>
            <div className="text-left">
              <div className="text-xs font-black uppercase tracking-wider leading-none mb-1">{item.label}</div>
              <div className="text-[10px] font-medium text-slate-500 group-hover:text-slate-400 whitespace-nowrap">{item.description}</div>
            </div>
            {currentView === item.id && (
              <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-700/50 mt-auto">
        {session?.user && (
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-2xl border border-slate-700/30 mb-2">
            <img src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`} alt="" className="w-8 h-8 rounded-full border border-slate-600" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black text-white truncate uppercase tracking-tighter">{session.user.name}</div>
              <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Premium User</div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/30 hidden lg:block">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
            Gemini 3 Flash enabled with real-time grounding.
          </p>
        </div>
      </div>
    </nav>
  );
};
