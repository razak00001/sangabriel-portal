'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Info, Calendar, ShieldCheck, User, Building2, Clock, AlertCircle, Edit2, Users, Activity, Sparkles } from 'lucide-react';
import { getStatusColor } from '@/utils/projectUtils';
import AssignTeamModal from './AssignTeamModal';
import api from '@/utils/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function OverviewTab({ project, onStatusUpdate }) {
  const { user } = useAuth();
  const [assignRole, setAssignRole] = useState(null);

  if (!project) return null;

  const handleAssign = async (role, userId) => {
    try {
      const payload = {};
      if (role === 'Designer') payload.designer = userId;
      if (role === 'Installer') payload.installer = userId;
      if (role === 'Customer') payload.teamMembers = [userId];

      await api.patch(`/projects/${project._id}/assign-team`, payload);
      window.location.reload(); 
    } catch (error) {
      console.error('Error assigning team member:', error);
    }
  };

  const renderTeamMember = (role, user, colorClass) => {
    if (user) {
      return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-lg transition-all duration-500 group">
          <div className={`size-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform ${colorClass}`}>
            <User size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-gray-900 truncate">{user.name}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">{role}</p>
          </div>
        </div>
      );
    }

    return (
      <button 
        onClick={() => setAssignRole(role)}
        className="flex items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all group"
      >
        <span className="text-lg group-hover:rotate-90 transition-transform">+</span> Assign {role}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Project Info */}
        <Card variant="glass" className="lg:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -mr-20 -mt-20 group-hover:bg-indigo-500/10 transition-colors duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Info size={18} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Project Strategy</h2>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2rem] border border-white shadow-inner mb-8">
              <p className="text-gray-600 text-lg font-medium leading-relaxed italic">
                "{project.description || 'Our team is dedicated to delivering excellence. This project is currently in its strategic planning phase.'}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/40 border border-white shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={16} className="text-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Timeline</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Commencement</p>
                    <p className="text-sm font-black text-gray-900">
                      {project.timeline?.startDate ? new Date(project.timeline.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Pending'}
                    </p>
                  </div>
                  <div className="size-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Clock size={14} />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/40 border border-white shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security & Status</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${getStatusColor(project.status)}15` }}>
                    <div className="size-2.5 rounded-full animate-ping" style={{ backgroundColor: getStatusColor(project.status) }}></div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Operational State</p>
                    <p className="text-lg font-black uppercase tracking-tighter" style={{ color: getStatusColor(project.status) }}>{project.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Client Bento Card & Actions */}
        <div className="flex flex-col gap-6">
          <Card variant="bento" className="bg-indigo-900 text-white border-none flex flex-col justify-between group h-full">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="size-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform duration-500">
                  <Building2 size={24} className="text-indigo-200" />
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase tracking-widest">Verified Client</div>
              </div>
              
              <h3 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">Principal Stakeholder</h3>
              <h2 className="text-3xl font-black tracking-tight leading-tight mb-6">{project.clientName || 'Global Enterprise'}</h2>
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center font-black">
                  {project.clientName?.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="text-[11px] font-black text-white/90">Authorized Contact</p>
                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Primary Decision Maker</p>
                </div>
              </div>
            </div>
            
            <button className="mt-8 w-full py-4 rounded-xl bg-white/10 hover:bg-white text-white hover:text-indigo-900 text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10">
              View Full Profile
            </button>
          </Card>

          {/* Role-Based Action Triggers */}
          <Card className="border-indigo-100 bg-indigo-50/30">
            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Sparkles size={14} /> Operational Commands
            </h3>
            
            <div className="space-y-3">
              {/* Designer Actions */}
              {user?.role === 'Designer' && project.status === 'ACTIVE' && (
                <Button 
                  variant="primary" 
                  className="w-full bg-indigo-600 shadow-lg shadow-indigo-500/20" 
                  onClick={() => onStatusUpdate('IN PROGRESS')}
                >
                  Start Work
                </Button>
              )}
              
              {user?.role === 'Designer' && project.status === 'IN PROGRESS' && (
                <Button 
                  variant="primary" 
                  className="w-full shadow-lg shadow-indigo-500/20" 
                  onClick={() => onStatusUpdate('PENDING REVIEW')}
                >
                  Submit for Review
                </Button>
              )}

              {/* Customer Actions */}
              {user?.role === 'Customer' && project.status === 'PENDING REVIEW' && (
                <>
                  <Button 
                    variant="primary" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20" 
                    onClick={() => onStatusUpdate('COMPLETE')}
                  >
                    Approve Project
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="w-full border-rose-200 text-rose-600 hover:bg-rose-50" 
                    onClick={() => onStatusUpdate('REVISION REQUESTED')}
                  >
                    Request Revision
                  </Button>
                </>
              )}

              {/* Accounting Action */}
              {user?.role === 'Accounting' && project.status === 'COMPLETE' && (
                <Button 
                  variant="primary" 
                  className="w-full bg-indigo-600 shadow-lg shadow-indigo-500/20" 
                  onClick={() => onStatusUpdate('BILLED')}
                >
                  Mark as Billed
                </Button>
              )}

              {/* Default Message if no actions available */}
              {!((user?.role === 'Designer' && project.status === 'IN PROGRESS') || 
                 (user?.role === 'Customer' && project.status === 'PENDING REVIEW') || 
                 (user?.role === 'Accounting' && project.status === 'COMPLETE')) && (
                <div className="text-center py-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                    Awaiting next operational phase from respective stakeholder.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Stakeholders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card variant="glass" className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
              <Users size={18} />
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Project Team</h2>
          </div>
          <div className="flex flex-col gap-4">
            {renderTeamMember('Project Manager', project.projectManager, 'bg-indigo-600')}
            {renderTeamMember('Lead Designer', project.designer, 'bg-purple-600')}
            {renderTeamMember('Senior Installer', project.installer, 'bg-emerald-600')}
            {renderTeamMember('Customer Liaison', project.teamMembers?.find(m => m.role === 'Customer'), 'bg-blue-600')}
          </div>
        </Card>

        {/* Activity Summary */}
        <Card variant="glass" className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gray-900 flex items-center justify-center text-white">
                <Activity size={18} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Real-time Activity</h2>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">View History</button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50/30 rounded-[2rem] border border-dashed border-gray-100">
            <div className="size-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
              <AlertCircle size={24} className="text-gray-300" />
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">System ready for updates</p>
          </div>
        </Card>
      </div>

      <AssignTeamModal 
        isOpen={!!assignRole} 
        onClose={() => setAssignRole(null)} 
        role={assignRole}
        onAssign={handleAssign}
      />
    </div>
  );
}
