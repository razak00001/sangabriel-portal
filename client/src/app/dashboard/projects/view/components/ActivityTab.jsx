'use client';

import { Clock, History } from 'lucide-react';
import Card from '../../../../../components/ui/Card';

export default function ActivityTab({ activityLogs }) {
  const logs = activityLogs ? [...activityLogs].reverse() : [];

  return (
    <div className="fade-in space-y-6">
      <header className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-black tracking-tight">Project Timeline</h2>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-0.5">Audit Log & System Events</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-dark/30 rounded-xl border border-border">
          <History size={14} className="text-primary" />
          <span className="text-[10px] font-black uppercase">{logs.length} EVENTS</span>
        </div>
      </header>

      <Card className="p-10 relative overflow-hidden bg-white/40">
        {/* Timeline Connector */}
        <div className="absolute left-10 top-12 bottom-12 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />
        
        <div className="space-y-12">
          {logs.length > 0 ? logs.map((log, i) => (
            <div key={i} className="flex gap-8 relative z-10 group">
              {/* Timeline Indicator */}
              <div className="size-5 rounded-full bg-white border-4 border-indigo-500 shadow-lg shadow-indigo-500/30 flex-shrink-0 group-hover:scale-125 transition-transform" />
              
              <div className="flex-1 -mt-1">
                <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-3">
                  <h3 className="text-sm font-black text-main tracking-tight uppercase">{log.action}</h3>
                  <span className="text-[10px] font-bold text-muted uppercase bg-dark px-2 py-0.5 rounded">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </header>

                <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="size-1 rounded-full bg-primary" />
                  {log.user?.name || 'Automated System'}
                </p>

                {log.details && Object.keys(log.details).length > 0 && (
                  <div className="p-4 bg-dark/20 rounded-2xl border border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    {Object.entries(log.details).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between py-1 border-b border-border/20 last:border-0">
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-[10px] font-black text-secondary truncate ml-4" title={String(val)}>{String(val)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
              <Clock size={64} className="text-muted mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">No activity history found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
