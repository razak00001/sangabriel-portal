import React from 'react';
import { User as UserIcon, Calendar, ArrowRight, FolderKanban } from 'lucide-react';
import { getStatusColor, formatDate } from '../../utils/projectUtils';
import { cn } from '../../utils/cn';
import Card from './Card';

/**
 * ProjectCard Component
 * Displays project overview in a high-end Bento format.
 */
export default function ProjectCard({ project, onClick, className }) {
  const statusColor = getStatusColor(project.status);

  return (
    <Card 
      variant="glass" 
      hover 
      onClick={onClick}
      className={cn("group flex flex-col h-full", className)}
      padding="p-8"
    >
      <div className="flex justify-between items-start mb-10">
        <div 
          className="px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 shadow-sm border border-transparent transition-all duration-500 group-hover:shadow-md"
          style={{ 
            background: `${statusColor}15`,
            color: statusColor,
            borderColor: `${statusColor}30`
          }}
        >
          <div className="size-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{ backgroundColor: statusColor }} />
          {project.status}
        </div>
        
        <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm">
          <FolderKanban size={22} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-3xl font-black mb-2 text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-10">
          {project.clientName || 'Strategic Account'}
        </p>

        <div className="grid grid-cols-1 gap-4 mb-10">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 group-hover:bg-white transition-all duration-500 group-hover:shadow-lg group-hover:shadow-indigo-500/5 group-hover:-translate-y-1">
            <div className="size-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <UserIcon size={16} strokeWidth={2.5} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Project Manager</p>
              <p className="text-xs font-black text-gray-900 truncate">{project.projectManager?.name || 'Awaiting Assignment'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 group-hover:bg-white transition-all duration-500 group-hover:shadow-lg group-hover:shadow-indigo-500/5 group-hover:-translate-y-1">
            <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
              <Calendar size={16} strokeWidth={2.5} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Commencement</p>
              <p className="text-xs font-black text-gray-900">{formatDate(project.timeline?.startDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 flex justify-between items-center mt-auto">
        <div className="flex -space-x-4">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className="size-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 border-4 border-white shadow-xl flex items-center justify-center text-xs font-black text-white transform hover:-translate-y-2 hover:z-20 transition-all duration-300"
            >
              {String.fromCharCode(64 + i)}
            </div>
          ))}
          <div className="size-10 rounded-2xl bg-gray-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-gray-400 shadow-md">+5</div>
        </div>
        <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
          WORKSPACE <ArrowRight size={16} strokeWidth={3} />
        </div>
      </div>
    </Card>
  );
}
