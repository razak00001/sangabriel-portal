import React from 'react';

/**
 * StatsCard Component
 * Modern premium design with subtle gradients and micro-animations
 */
export default function StatsCard({ name, value, icon: Icon, color, loading, trend }) {
  // Map our simple color names to Tailwind colors
  const colorMap = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'group-hover:border-indigo-100', shadow: 'group-hover:shadow-indigo-500/10' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'group-hover:border-emerald-100', shadow: 'group-hover:shadow-emerald-500/10' },
    fuchsia: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', border: 'group-hover:border-fuchsia-100', shadow: 'group-hover:shadow-fuchsia-500/10' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'group-hover:border-amber-100', shadow: 'group-hover:shadow-amber-500/10' },
  };

  const c = colorMap[color] || colorMap.indigo;

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100/50 to-transparent" />
        <div className="size-12 rounded-xl bg-gray-100 mb-6" />
        <div className="h-8 w-24 bg-gray-100 rounded-lg mb-2" />
        <div className="h-4 w-32 bg-gray-100 rounded-md" />
      </div>
    );
  }

  const isPositive = trend?.startsWith('+');

  return (
    <div className={`group bg-white rounded-3xl p-6 border border-gray-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${c.border} ${c.shadow} relative overflow-hidden`}>
      {/* Subtle background glow on hover */}
      <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent to-white/10 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`size-14 rounded-2xl ${c.bg} ${c.text} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
          {Icon && <Icon size={24} strokeWidth={2.5} />}
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black tracking-wider ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <span>{trend}</span>
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{value}</h3>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{name}</p>
      </div>
    </div>
  );
}
