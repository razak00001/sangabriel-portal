import React from 'react';
import { User as UserIcon } from 'lucide-react';

/**
 * ActivityFeed Component
 * Displays a list of recent activities with a timeline.
 */
export default function ActivityFeed({ activities, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-4 text-center text-muted">
        <div className="skeleton h-20 w-full" />
        <div className="skeleton h-20 w-full" />
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="p-8 text-center text-muted text-sm">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {activities.map((log, i) => (
        <div key={i} className="flex gap-4 relative">
          {/* Timeline Connector */}
          {i < activities.length - 1 && (
            <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-border" />
          )}
          
          <div className="size-6 rounded-md bg-dark border border-light flex items-center justify-center z-10 shrink-0">
            <UserIcon size={12} className="text-primary" />
          </div>
          
          <div className="flex-1">
            <p className="text-sm leading-relaxed">
              <strong className="font-black">{log.user?.name}</strong> {log.action.toLowerCase()}
            </p>
            <p className="text-xs text-muted font-bold mt-1">
              {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
