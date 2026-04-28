import React from 'react';
import { User as UserIcon, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * ActivityFeed Component
 * Displays a list of recent activities with a premium timeline.
 */
export default function ActivityFeed({ activities, loading, className }) {
  if (loading) {
    return (
      <div className={cn("flex flex-col gap-8", className)}>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-5 animate-pulse">
            <div className="size-10 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex-1 pt-2">
              <div className="h-4 bg-gray-100 rounded-lg w-3/4 mb-3" />
              <div className="h-3 bg-gray-50 rounded-lg w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className={cn("p-12 text-center rounded-[2rem] border-2 border-dashed border-gray-100 bg-gray-50/30", className)}>
        <Clock size={32} className="text-gray-200 mb-4 mx-auto" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
          No recent operational activity detected in the stream.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      {activities.map((log, i) => (
        <div key={i} className="flex gap-6 relative group/activity">
          {/* Timeline Connector */}
          {i < activities.length - 1 && (
            <div className="absolute left-[20px] top-10 bottom-[-40px] w-px bg-gradient-to-b from-gray-200 to-transparent" />
          )}
          
          <div className="size-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center z-10 shrink-0 shadow-lg group-hover/activity:scale-110 group-hover/activity:bg-indigo-600 transition-all duration-500">
            <UserIcon size={16} className="text-white" strokeWidth={2.5} />
          </div>
          
          <div className="flex-1 pt-1">
            <p className="text-[13px] leading-relaxed text-gray-700 group-hover/activity:text-gray-900 transition-colors">
              <strong className="font-black text-gray-900">{log.user?.name}</strong> 
              <span className="mx-1.5 opacity-60 font-medium">{log.action.toLowerCase()}</span>
            </p>
            <div className="flex items-center gap-3 mt-2 text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover/activity:text-indigo-400 transition-colors">
              <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="opacity-30">•</span>
              <span>{new Date(log.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
