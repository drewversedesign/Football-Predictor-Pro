
import React, { useEffect, useState, useMemo } from 'react';
import { Match, TeamStats, PredictionResult, AIAnalysis, LeagueStats } from '../types';
import { calculatePrediction } from '../utils/engine';
import { LEAGUES, MOCK_TEAMS } from '../constants';
import { getAIAnalysis } from '../services/geminiService';
import { StatCard } from './StatCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MatchPredictorProps {
  match: Match;
  customStats?: Record<number, TeamStats>;
}

const ScoreHeatMap: React.FC<{ matrix: number[][]; homeName: string; awayName: string }> = ({ matrix, homeName, awayName }) => {
  return (
    <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
      <div className="min-w-[400px]">
        <div className="grid grid-cols-7 gap-1">
          <div className="flex items-center justify-center text-[10px] text-slate-500 font-black uppercase italic">{awayName} →</div>
          {[0, 1, 2, 3, 4, 5].map(g => (
            <div key={g} className="text-center text-[10px] text-slate-500 font-black">{g}</div>
          ))}
          
          {[0, 1, 2, 3, 4, 5].map(h => (
            <React.Fragment key={h}>
              <div className="text-right text-[10px] text-slate-500 font-black flex items-center justify-end pr-2">{h}</div>
              {matrix[h].map((prob, a) => (
                <div 
                  key={`${h}-${a}`}
                  className="aspect-square rounded-md flex items-center justify-center text-[9px] font-black transition-all hover:scale-110 cursor-help"
                  style={{ 
                    backgroundColor: `rgba(16, 185, 129, ${Math.min(0.95, prob * 18)})`,
                    color: prob > 0.04 ? '#000' : '#475569',
                    border: '1px solid rgba(255,255,255,0.03)'
                  }}
                  title={`${h}-${a}: ${(prob * 100).toFixed(1)}%`}
                >
                  {(prob * 100).toFixed(0)}%
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const FormBadge: React.FC<{ lastFive: string[] }> = ({ lastFive }) => (
  <div className="flex gap-1.5">
    {lastFive.map((res, i) => (
      <span 
        key={i} 
        className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white shadow-sm ${
          res.startsWith('W') ? 'bg-emerald-500 shadow-emerald-500/20' : 
          res.startsWith('D') ? 'bg-slate-500 shadow-slate-500/10' : 
          'bg-rose-500 shadow-rose-500/20'
        }`}
      >
        {res[0]}
      </span>
    ))}
  </div>
);

export const MatchPredictor: React.FC<MatchPredictorProps> = ({ match, customStats }) => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const stats = customStats || MOCK_TEAMS;
  const homeTeam = stats[match.homeTeam.id];
  const awayTeam = stats[match.awayTeam.id];
  const league = useMemo(() => LEAGUES.find(l => l.id === match.leagueId)!, [match.leagueId]);

  useEffect(() => {
    const pred = calculatePrediction(homeTeam, awayTeam, league);
    setPrediction(pred);
    
    setAnalysis(null);
    const fetchAI = async () => {
      setLoading(true);
      const aiRes = await getAIAnalysis(match, homeTeam, awayTeam, pred);
      setAnalysis(aiRes);
      setLoading(false);
    };

    fetchAI();
  }, [match, homeTeam, awayTeam, league]);

  if (!prediction) return null;

  const chartData = [
    { name: 'Home Win', value: prediction.probabilities.homeWin },
    { name: 'Draw', value: prediction.probabilities.draw },
    { name: 'Away Win', value: prediction.probabilities.awayWin },
  ];

  const COLORS = ['#10b981', '#64748b', '#ef4444'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* League Expert Insight */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700 shadow-xl overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex-1">
            <h4 className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] mb-2">League Expert Notes</h4>
            <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
              "{league.description}"
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {league.bestMarkets.map(m => (
              <span key={m} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Summary Bar */}
      <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-6 shadow-inner">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{homeTeam.shortName} Form</span>
            <FormBadge lastFive={homeTeam.lastFive} />
          </div>
          <div className="h-10 w-px bg-slate-700/50" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{awayTeam.shortName} Form</span>
            <FormBadge lastFive={awayTeam.lastFive} />
          </div>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Projected Home xG</div>
            <div className="text-3xl font-black text-emerald-500 tabular-nums">{prediction.homeXG.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Projected Away xG</div>
            <div className="text-3xl font-black text-rose-500 tabular-nums">{prediction.awayXG.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Match Outcome (1X2)" 
          value={`${(prediction.probabilities.homeWin * 100).toFixed(0)}% - ${(prediction.probabilities.draw * 100).toFixed(0)}% - ${(prediction.probabilities.awayWin * 100).toFixed(0)}%`}
          subValue="Expected Probabilities"
        />
        <StatCard 
          label="BTTS Prob" 
          value={prediction.probabilities.btts > 0.5 ? "LIKELY" : "UNLIKELY"}
          subValue={`${(prediction.probabilities.btts * 100).toFixed(0)}% Probability`}
          colorClass={prediction.probabilities.btts > 0.5 ? "text-emerald-400" : "text-rose-400"}
        />
        <StatCard 
          label="Total Goals (2.5)" 
          value={prediction.probabilities.over25 > 0.5 ? "OVER" : "UNDER"}
          subValue={`${(prediction.probabilities.over25 * 100).toFixed(0)}% Probability`}
          colorClass="text-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-black mb-6 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
            </div>
            Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" animationDuration={1000} stroke="none">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }} 
                  itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }} 
                  formatter={(value: number) => `${(value * 100).toFixed(1)}%`} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
            {chartData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 relative overflow-hidden flex flex-col shadow-lg">
          <div className="absolute top-0 right-0 p-4">
             <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
               analysis?.riskLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
               analysis?.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
               'bg-rose-500/20 text-rose-400 border border-rose-500/30'
             }`}>
               Risk: {analysis?.riskLevel || 'ANALYZING...'}
             </span>
          </div>
          
          <h3 className="text-lg font-black mb-6 flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.335 14.75a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707z" />
              </svg>
            </div>
            AI Intelligence
          </h3>

          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="space-y-2">
                <div className="h-3 bg-slate-700/50 rounded-full w-full"></div>
                <div className="h-3 bg-slate-700/50 rounded-full w-5/6"></div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="h-10 bg-slate-700/30 rounded-xl"></div>
                <div className="h-10 bg-slate-700/30 rounded-xl"></div>
                <div className="h-10 bg-slate-700/30 rounded-xl"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 flex-1">
              <p className="text-slate-300 italic text-sm leading-relaxed border-l-4 border-purple-500/30 pl-4 py-1">
                "{analysis?.insight}"
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {analysis?.keyFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[11px] text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-700/50 hover:bg-slate-900/60 transition-colors">
                    <span className="flex-shrink-0 w-5 h-5 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center font-black">#</span>
                    {factor}
                  </div>
                ))}
              </div>
              
              {analysis?.sources && analysis.sources.length > 0 && (
                <div className="pt-5 border-t border-slate-700/50 mt-auto">
                  <p className="text-[9px] text-slate-500 uppercase font-black mb-3 flex items-center gap-2 tracking-widest">
                    Verified Grounding Sources
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.sources.slice(0, 3).map((source, i) => (
                      <a key={i} href={source.uri} target="_blank" rel="noreferrer" className="text-[9px] bg-slate-900/80 px-3 py-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all truncate max-w-[160px] border border-slate-700/50">
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-black mb-6">Top Predicted Scorelines</h3>
          <div className="space-y-3">
            {prediction.mostLikelyScores.map((score) => (
              <div key={score.score} className="flex items-center justify-between bg-slate-900/30 px-5 py-3 rounded-2xl border border-slate-700/30 group hover:border-emerald-500/30 transition-all">
                <span className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">{score.score}</span>
                <div className="flex items-center gap-6">
                  <div className="w-28 bg-slate-900 rounded-full h-1.5 overflow-hidden shadow-inner">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                      style={{ width: `${(score.prob * 100) * 4}%` }} 
                    />
                  </div>
                  <span className="text-xs text-emerald-400 font-black w-10 text-right tabular-nums">{(score.prob * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-7 bg-slate-800 p-6 rounded-3xl border border-slate-700 overflow-hidden shadow-lg">
          <h3 className="text-lg font-black mb-6">Poisson Matrix Analytics</h3>
          <ScoreHeatMap 
            matrix={prediction.scoreMatrix} 
            homeName={homeTeam.shortName} 
            awayName={awayTeam.shortName} 
          />
          <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Heat map: Probability of exact goals</span>
            <span className="italic">Based on 2024/25 League Trend</span>
          </div>
        </div>
      </div>
    </div>
  );
};
