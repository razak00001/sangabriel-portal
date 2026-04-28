import React from 'react';
import { cn } from '../../utils/cn';

/**
 * StatsCard Component
 * Modern premium design with subtle gradients and micro-animations.
 */
export default function StatsCard({ name, value, icon: Icon, color, loading, trend }) {
  const colorMap = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'group-hover:ring-indigo-500/10' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'group-hover:ring-emerald-500/10' },
    fuchsia: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', ring: 'group-hover:ring-fuchsia-500/10' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'group-hover:ring-amber-500/10' },
  };

  const c = colorMap[color] || colorMap.indigo;

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden animate-pulse">
        <div className="size-10 sm:size-14 rounded-2xl bg-gray-100 mb-6 sm:mb-8" />
        <div className="h-8 w-20 bg-gray-100 rounded-xl mb-3" />
        <div className="h-4 w-24 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  const isPositive = trend?.startsWith('+');

  return (
    <div className={cn(
      "group bg-white rounded-[2.5rem] p-8 border border-gray-100 transition-all duration-700",
      "hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/5 hover:ring-1 hover:ring-gray-200",
      "relative overflow-hidden"
    )}>
      <div className="flex justify-between items-start mb-6 sm:mb-10 relative z-10">
        <div className={cn(
          "size-12 sm:size-16 rounded-2xl flex items-center justify-center transition-all duration-500",
          "transform group-hover:scale-110 group-hover:rotate-6 shadow-sm",
          c.bg, c.text
        )}>
          {Icon && <Icon size={24} className="sm:w-7 sm:h-7" strokeWidth={2.5} />}
        </div>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border",
            isPositive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
          )}>
            <span>{trend}</span>
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">
          {value}
        </h3>
        <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
          {name}
        </p>
      </div>
    </div>
  );
}
