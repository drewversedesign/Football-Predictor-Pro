
import React from 'react';
import { LeagueStats } from '../types';

interface LeagueAnalyticsProps {
  leagues: LeagueStats[];
}

export const LeagueAnalytics: React.FC<LeagueAnalyticsProps> = ({ leagues }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {leagues.map((league) => (
          <div key={league.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl group hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-black text-white">{league.name}</h3>
              <span className="text-[10px] font-black px-2 py-1 bg-slate-900 rounded-lg text-slate-500">{league.id}</span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-3 rounded-2xl">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Avg Home</span>
                  <span className="text-xl font-black text-emerald-500">{league.avgHomeGoals}</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-2xl">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Avg Away</span>
                  <span className="text-xl font-black text-rose-500">{league.avgAwayGoals}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Best Markets</span>
                <div className="flex flex-wrap gap-2">
                  {league.bestMarkets.map(m => (
                    <span key={m} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase rounded-lg">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 italic leading-relaxed pt-2 border-t border-slate-700/50">
                "{league.description}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-lg text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-4">League-Wide Correlation</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Statistical modeling shows that Bundesliga and Eredivisie remain the highest value targets for Over 2.5 markets due to a high correlation between attacking intensity and lower defensive cohesion.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="px-4 py-2 bg-slate-900 rounded-2xl border border-slate-700">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Goal Density</span>
              <span className="text-xl font-black text-white">3.12 p/m</span>
            </div>
            <div className="px-4 py-2 bg-slate-900 rounded-2xl border border-slate-700">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">BTTS Freq.</span>
              <span className="text-xl font-black text-white">58%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
