import React from 'react';
import { MoreVertical, User as UserIcon, Calendar } from 'lucide-react';
import { getStatusColor, formatDate } from '../../utils/projectUtils';

/**
 * ProjectCard Component
 * Displays project overview in a card format for the projects grid.
 */
export default function ProjectCard({ project, onClick }) {
  const statusColor = getStatusColor(project.status);

  return (
    <div 
      className="glass p-6 card-hover cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <span 
          className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full"
          style={{ 
            background: `${statusColor}15`,
            color: statusColor,
            border: `1px solid ${statusColor}30`
          }}
        >
          {project.status}
        </span>
        <button className="p-1 rounded-md hover:bg-black/5 text-muted transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>

      <h3 className="text-lg font-black mb-1 truncate">{project.title}</h3>
      <p className="text-sm text-muted font-bold mb-6">{project.clientName}</p>

      <div className="flex flex-col gap-2.5 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold">
          <UserIcon size={14} className="text-primary" />
          <span className="truncate">{project.projectManager?.name?.split(' ')[0] || 'Unassigned'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted font-bold">
          <Calendar size={14} />
          <span>{formatDate(project.timeline?.startDate)}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
         <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className="size-6 rounded-full bg-dark border-2 border-white" 
            />
          ))}
        </div>
        <span className="text-[10px] text-muted font-black uppercase">4 Files</span>
      </div>
    </div>
  );
}
