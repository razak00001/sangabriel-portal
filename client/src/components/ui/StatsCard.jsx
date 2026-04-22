import React from 'react';

/**
 * StatsCard Component
 * Displays a single metric with an icon and label.
 */
export default function StatsCard({ name, value, icon: Icon, color, loading }) {
  if (loading) {
    return (
      <div className="glass p-6 flex flex-col gap-4">
        <div className="size-10 rounded-md skeleton" />
        <div className="h-6 w-16 skeleton" />
        <div className="h-3 w-24 skeleton" />
      </div>
    );
  }

  return (
    <div className="glass card-hover p-6">
      <div className="mb-4 flex justify-between items-center">
        <div 
          className="size-10 rounded-md flex items-center justify-center"
          style={{ 
            background: `${color}15`, 
            color: color,
            border: `1px solid ${color}30`
          }}
        >
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <h3 className="text-xl font-black mb-1">{value}</h3>
      <p className="text-xs text-muted font-bold uppercase tracking-wider">{name}</p>
    </div>
  );
}
