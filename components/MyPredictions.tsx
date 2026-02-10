import React, { useEffect, useState } from 'react';
import { getPredictions } from '../services/predictionService';

export const MyPredictions: React.FC = () => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPredictions()
      .then(setPredictions)
      .finally(() => setLoading(false));
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {predictions.length > 0 ? predictions.map((pred) => (
          <div key={pred.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
               <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                 pred.status === 'WON' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                 pred.status === 'LOST' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                 'bg-slate-700 text-slate-400'
               }`}>
                 {pred.status}
               </span>
             </div>

             <div className="mb-4">
               <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{new Date(pred.match_date).toLocaleDateString()}</div>
               <div className="text-sm font-black text-white">{pred.home_team} vs {pred.away_team}</div>
             </div>

             <div className="grid grid-cols-2 gap-4 border-t border-slate-700/50 pt-4">
               <div>
                 <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Prediction</div>
                 <div className="text-xs font-black text-emerald-400">{pred.prediction_type}: {pred.prediction_value}</div>
               </div>
               <div>
                 <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Model xG</div>
                 <div className="text-xs font-black text-white">{Number(pred.predicted_home_xg).toFixed(1)} - {Number(pred.predicted_away_xg).toFixed(1)}</div>
               </div>
             </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-slate-800/20 rounded-[40px] border-2 border-dashed border-slate-800">
            <p className="text-slate-500 font-black uppercase tracking-widest">No saved predictions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
