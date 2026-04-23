'use client';

import { Info, Calendar, ShieldCheck, User, Building2 } from 'lucide-react';
import { getStatusColor } from '../../../../../utils/projectUtils';
import Card from '../../../../../components/ui/Card';

export default function OverviewTab({ project }) {
  if (!project) return null;

  return (
    <div className="detail-grid gap-8">
      <div className="flex flex-col gap-8">
        {/* Project Description & Details */}
        <Card className="p-8">
          <div className="flex justify-between items-start mb-8 gap-4 flex-wrap">
            <div className="flex-1 min-w-[240px]">
              <h2 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2.5 text-primary">
                <Info size={18} /> Project Details
              </h2>
              <p className="text-main text-sm font-medium leading-relaxed bg-dark/20 p-6 rounded-2xl border border-border/40">
                {project.description || 'No detailed description available for this project.'}
              </p>
            </div>
          </div>

          <div className="responsive-grid gap-6">
            <div className="p-5 bg-dark rounded-2xl border border-border/50 group hover:border-primary/30 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} className="text-primary" />
                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Timeline</span>
              </div>
              <p className="text-sm font-black flex items-center gap-2">
                {project.timeline?.startDate ? new Date(project.timeline.startDate).toLocaleDateString() : 'TBD'} 
                <span className="text-muted font-normal">→</span>
                {project.timeline?.endDate ? new Date(project.timeline.endDate).toLocaleDateString() : 'TBD'}
              </p>
            </div>

            <div className="p-5 bg-dark rounded-2xl border border-border/50 group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Current Status</span>
              </div>
              <p className="text-sm font-black uppercase tracking-widest" style={{ color: getStatusColor(project.status) }}>
                {project.status}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-8">
        {/* Stakeholders Card */}
        <Card className="p-8">
          <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-primary">
             Team Members
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-border group hover:border-primary transition-all">
              <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <User size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-main truncate leading-tight">{project.projectManager?.name || 'Unassigned'}</p>
                <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-0.5">Project Manager</p>
              </div>
            </div>

            {project.installer && (
              <div className="flex items-center gap-4 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100 group hover:border-emerald-500 transition-all">
                <div className="size-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <ShieldCheck size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-black text-emerald-900 truncate leading-tight">{project.installer.name}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">Lead Installer</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-8">
           <h2 className="text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2 text-primary">
              <Building2 size={16} /> Client Information
           </h2>
           <div className="p-5 bg-dark/30 rounded-2xl border border-border/40">
             <p className="text-sm font-black text-main">{project.clientName}</p>
             <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1">Primary Authorized Contact</p>
           </div>
        </Card>
      </div>
    </div>
  );
}
