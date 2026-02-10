
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, colorClass = "text-emerald-400" }) => {
  return (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center transition-all hover:scale-105">
      <span className="text-slate-400 text-xs uppercase font-semibold tracking-wider mb-1">{label}</span>
      <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
      {subValue && <span className="text-slate-500 text-[10px] mt-1">{subValue}</span>}
    </div>
  );
};
