import React, { useState } from 'react';

interface ValueBetFinderProps {
  probabilities: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

export const ValueBetFinder: React.FC<ValueBetFinderProps> = ({ probabilities }) => {
  const [odds, setOdds] = useState({ home: 2.0, draw: 3.4, away: 3.8 });

  const calculateValue = (prob: number, odd: number) => {
    return (prob * odd) - 1;
  };

  const values = {
    home: calculateValue(probabilities.homeWin, odds.home),
    draw: calculateValue(probabilities.draw, odds.draw),
    away: calculateValue(probabilities.awayWin, odds.away),
  };

  return (
    <div className="bg-slate-900/50 p-6 rounded-[32px] border border-slate-700/50">
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Value Discovery Engine</h4>

      <div className="grid grid-cols-3 gap-6">
        {['Home', 'Draw', 'Away'].map((label) => {
          const key = label.toLowerCase() as keyof typeof odds;
          const value = values[key];
          const isValue = value > 0.05;

          return (
            <div key={label} className="space-y-4">
              <div className="text-center">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label} Odds</span>
                <input
                  type="number"
                  step="0.01"
                  value={odds[key]}
                  onChange={(e) => setOdds({ ...odds, [key]: parseFloat(e.target.value) || 0 })}
                  className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-black text-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div className={`p-4 rounded-2xl border transition-all ${
                isValue ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700/50'
              }`}>
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Expected Value</div>
                <div className={`text-xl font-black ${value > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {(value * 100).toFixed(1)}%
                </div>
                {isValue && (
                  <div className="mt-2 text-[8px] font-black text-emerald-500 uppercase animate-pulse">High Value Bet</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
