import React from 'react';
import { FolderKanban, ArrowRight } from 'lucide-react';

/**
 * ProjectListItem Component
 * A standardized row for project lists.
 */
export default function ProjectListItem({ project, onClick }) {
  return (
    <div 
      className="flex justify-between items-center p-4 bg-dark border border-light rounded-2xl cursor-pointer card-hover"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="size-8 rounded-md bg-primary flex items-center justify-center shrink-0">
          <FolderKanban size={16} color="white" />
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-black mb-1 truncate">{project.title}</h4>
          <p className="text-xs text-muted font-bold">{project.status}</p>
        </div>
      </div>
      <ArrowRight size={14} className="text-muted" />
    </div>
  );
}
