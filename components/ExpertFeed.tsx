import React, { useEffect, useState } from 'react';
import { authClient } from '../services/authService';

export const ExpertFeed: React.FC = () => {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      const session = await authClient.getSession();
      const response = await fetch('/api/feed', {
        headers: { 'Authorization': `Bearer ${session.data?.session?.token}` }
      });
      const data = await response.json();
      setFeed(data);
      setLoading(false);
    };
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[32px] mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500 p-3 rounded-2xl text-slate-900">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Expert Intelligence Feed</h3>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Aggregated high-confidence signals from the global engine</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {feed.map((item) => (
          <div key={item.id} className="bg-slate-800 border border-slate-700 p-6 rounded-[32px] shadow-xl hover:border-emerald-500/30 transition-all group">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{new Date(item.match_date).toLocaleDateString()}</span>
                   <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                   <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">High Confidence Signal</span>
                </div>
                <h4 className="text-2xl font-black text-white mb-2 tracking-tighter">{item.home_team} <span className="text-slate-600 px-2">VS</span> {item.away_team}</h4>
                <p className="text-slate-400 text-sm italic font-medium leading-relaxed">"{item.insight || 'Aggregated AI model indicates significant tactical mismatch in favor of the offensive line.'}"</p>
              </div>

              <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Recommended Market</div>
                  <div className="text-lg font-black text-emerald-400">{item.prediction_type}: {item.prediction_value}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Risk Level</div>
                    <div className={`text-xs font-black uppercase ${item.risk_level === 'Low' ? 'text-emerald-400' : 'text-amber-400'}`}>{item.risk_level || 'Medium'}</div>
                  </div>
                  <button className="bg-slate-700 hover:bg-emerald-500 hover:text-slate-900 p-3 rounded-2xl transition-all text-white border border-slate-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
