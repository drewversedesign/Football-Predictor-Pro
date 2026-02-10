
import React, { useMemo } from 'react';
import { HistoricalMatch, BacktestResult, LeagueStats, TeamStats } from '../types';
import { calculatePrediction } from '../utils/engine';
import { MOCK_TEAMS } from '../constants';

interface BacktestDashboardProps {
  historicalMatches: HistoricalMatch[];
  league: LeagueStats;
  customStats: Record<number, TeamStats>;
}

export const BacktestDashboard: React.FC<BacktestDashboardProps> = ({ historicalMatches, league, customStats }) => {
  const results: BacktestResult[] = useMemo(() => {
    return historicalMatches.map(m => {
      const homeStats = customStats[m.homeTeam.id] || MOCK_TEAMS[1];
      const awayStats = customStats[m.awayTeam.id] || MOCK_TEAMS[2];
      const prediction = calculatePrediction(homeStats, awayStats, league);
      
      const homeWin = m.homeGoals > m.awayGoals;
      const draw = m.homeGoals === m.awayGoals;
      const awayWin = m.homeGoals < m.awayGoals;

      let isOutcomeCorrect = false;
      const probs = prediction.probabilities;
      if (homeWin && probs.homeWin > probs.draw && probs.homeWin > probs.awayWin) isOutcomeCorrect = true;
      if (draw && probs.draw > probs.homeWin && probs.draw > probs.awayWin) isOutcomeCorrect = true;
      if (awayWin && probs.awayWin > probs.homeWin && probs.awayWin > probs.draw) isOutcomeCorrect = true;

      const isBTTSCorrect = (m.homeGoals > 0 && m.awayGoals > 0) === (prediction.probabilities.btts > 0.5);
      const isOver25Correct = (m.homeGoals + m.awayGoals > 2.5) === (prediction.probabilities.over25 > 0.5);

      return {
        match: m,
        prediction,
        isOutcomeCorrect,
        isBTTSCorrect,
        isOver25Correct
      };
    });
  }, [historicalMatches, league, customStats]);

  const stats = useMemo(() => {
    if (results.length === 0) return null;
    return {
      outcomeAccuracy: (results.filter(r => r.isOutcomeCorrect).length / results.length) * 100,
      bttsAccuracy: (results.filter(r => r.isBTTSCorrect).length / results.length) * 100,
      over25Accuracy: (results.filter(r => r.isOver25Correct).length / results.length) * 100,
    };
  }, [results]);

  if (historicalMatches.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-800/40 rounded-[32px] border-2 border-dashed border-slate-700">
        <p className="text-slate-500 font-black uppercase tracking-widest">No historical data available for this league.</p>
        <p className="text-slate-600 text-xs mt-2 font-bold uppercase">Click "Fetch Historical Data" to begin the backtest.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Outcome Accuracy</span>
          <div className="text-3xl font-black text-emerald-500">{stats?.outcomeAccuracy.toFixed(1)}%</div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${stats?.outcomeAccuracy}%` }} />
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">BTTS Accuracy</span>
          <div className="text-3xl font-black text-purple-500">{stats?.bttsAccuracy.toFixed(1)}%</div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-purple-500 h-full" style={{ width: `${stats?.bttsAccuracy}%` }} />
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Over 2.5 Accuracy</span>
          <div className="text-3xl font-black text-amber-500">{stats?.over25Accuracy.toFixed(1)}%</div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: `${stats?.over25Accuracy}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight flex items-center gap-3">
          Detailed Backtest Log
          <span className="text-[10px] bg-slate-900 text-slate-500 px-3 py-1 rounded-full">{results.length} Matches Analyzed</span>
        </h3>
        <div className="space-y-4">
          {results.map((res, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-700/50 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{new Date(res.match.utcDate).toLocaleDateString()}</span>
                <span className="text-xs font-bold text-white truncate">{res.match.homeTeam.name} vs {res.match.awayTeam.name}</span>
              </div>
              <div className="text-center">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Actual Score</span>
                <span className="text-lg font-black text-white">{res.match.homeGoals} - {res.match.awayGoals}</span>
              </div>
              <div className="text-center">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Model Choice</span>
                <span className={`text-[10px] font-black px-2 py-1 rounded-md ${res.isOutcomeCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {res.prediction.probabilities.homeWin > res.prediction.probabilities.awayWin ? 'HOME' : 'AWAY'} W ({(Math.max(res.prediction.probabilities.homeWin, res.prediction.probabilities.awayWin) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm ${res.isOutcomeCorrect ? 'bg-emerald-500 text-slate-900' : 'bg-slate-700 text-slate-500 opacity-50'}`}>1X2</div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm ${res.isBTTSCorrect ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-500 opacity-50'}`}>BTTS</div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm ${res.isOver25Correct ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-500 opacity-50'}`}>O/U</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
