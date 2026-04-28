import React from 'react';
import { FolderKanban, ArrowRight } from 'lucide-react';
import { getStatusColor } from '../../utils/projectUtils';
import { cn } from '../../utils/cn';

/**
 * ProjectListItem Component
 * A high-end row for dashboard project lists.
 */
export default function ProjectListItem({ project, onClick, className }) {
  const statusColor = getStatusColor(project.status);

  return (
    <div 
      className={cn(
        "flex justify-between items-center p-5 bg-white border border-gray-100 rounded-[1.5rem]",
        "cursor-pointer hover:bg-gray-50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 group",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-5 overflow-hidden">
        <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform">
          <FolderKanban size={20} className="text-indigo-600" strokeWidth={2.5} />
        </div>
        <div className="overflow-hidden">
          <h4 className="text-[13px] font-black mb-1.5 truncate text-gray-900 group-hover:text-indigo-600 transition-colors">
            {project.title}
          </h4>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full animate-pulse" style={{ backgroundColor: statusColor }} />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
              {project.status}
            </p>
          </div>
        </div>
      </div>
      <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <ArrowRight size={14} strokeWidth={3} />
      </div>
    </div>
  );
}
