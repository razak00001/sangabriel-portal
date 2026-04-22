'use client';

import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  Plus,
  ArrowRight,
  User as UserIcon,
  Calendar
} from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StatsCard from '../../components/ui/StatsCard';
import ProjectListItem from '../../components/ui/ProjectListItem';
import ActivityFeed from '../../components/ui/ActivityFeed';

/**
 * DashboardPage Component
 * Provides a high-level overview of system activity and project status.
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [activity, setActivity] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [archiveRequests, setArchiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await dashboardService.getDashboardData();
        setStats(data.stats);
        setRecentProjects(data.recentProjects);
        setActivity(data.activity);
        setWorkload(data.workload);
        setArchiveRequests(data.archiveRequests);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const isAdmin = user?.role === 'Admin';
  const isPM = user?.role === 'Project Manager';

  return (
    <div className="fade-in">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black mb-1">{user?.role} Dashboard</h1>
          <p className="text-muted text-sm font-bold">Welcome back, {user?.name?.split(' ')[0] || 'User'}</p>
        </div>
        
        {['Admin', 'Project Manager'].includes(user?.role) && (
          <button className="btn btn-primary" onClick={() => router.push('/dashboard/projects')}>
            <Plus size={18} />
            <span>New Project</span>
          </button>
        )}
      </header>

      {/* Stats Cards */}
      <section className="responsive-grid mb-8">
        {(loading ? Array(4).fill({}) : stats).map((stat, i) => (
          <StatsCard 
            key={stat.name || i}
            name={stat.name}
            value={stat.value}
            icon={stat.icon === 'FolderKanban' ? FolderKanban : 
                  stat.icon === 'Clock' ? Clock : 
                  stat.icon === 'CheckCircle2' ? CheckCircle2 : 
                  stat.icon === 'MessageCircle' ? MessageCircle : null}
            color={stat.color}
            loading={loading}
          />
        ))}
      </section>

      {/* Admin Specific: Workload Heatmap */}
      {isAdmin && workload.length > 0 && (
        <section className="glass p-6 mb-8">
           <h2 className="text-sm font-black mb-6 uppercase tracking-wider">Operational Workload</h2>
           <div className="flex gap-4 h-24 items-flex-end min-w-[400px]">
              {workload.map((item, idx) => (
                <div key={idx} className="flex-1 relative text-center">
                    <div 
                      className="bg-primary rounded-md opacity-80 mb-2 transition-all duration-500"
                      style={{ 
                        height: `${(item.count / Math.max(...workload.map(w => w.count))) * 100}%`
                      }}
                    />
                    <span className="text-[10px] font-black uppercase text-muted truncate block">{item._id}</span>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* Admin Specific: Archive Queue */}
      {isAdmin && archiveRequests.length > 0 && (
        <section className="glass p-6 mb-10 border-l-4 border-l-indigo-600">
           <h2 className="text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-wider">
             <Clock size={16} className="text-primary" />
             Archive Retrieval Queue
           </h2>
           <div className="responsive-grid">
              {archiveRequests.map((req, idx) => (
                <div key={idx} className="p-4 bg-dark rounded-xl border border-light">
                    <p className="text-sm font-black">{req.projectId?.title}</p>
                    <p className="text-xs text-muted font-bold">Req: {req.requestedBy?.name}</p>
                    <div className="mt-3 flex justify-between items-center">
                       <span className="text-[10px] text-amber-500 font-black">SLA: 24h Remaining</span>
                       <button className="text-[10px] text-primary font-black underline bg-none border-none cursor-pointer">Fulfill</button>
                    </div>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* PM Specific Widgets */}
      {isPM && (
        <div className="detail-grid mb-10">
          <div className="glass p-6">
            <h2 className="text-sm font-black mb-5 flex items-center gap-2 uppercase tracking-wider">
              <Calendar size={16} className="text-primary" />
              Installer Availability
            </h2>
            <div className="flex flex-col gap-3">
               {recentProjects.filter(p => p.milestones?.some(m => m.label === 'Installation Scheduled' && !m.completed)).slice(0, 3).map((p, idx) => (
                 <div key={idx} className="p-3 bg-dark rounded-xl flex justify-between items-center hover:bg-black/5 transition-colors">
                    <div>
                       <p className="text-xs font-black">{p.title}</p>
                       <p className="text-[10px] text-emerald-500 font-black">Schedule: Confirmed</p>
                    </div>
                    <span className="text-[10px] text-muted font-bold">{p.installer?.name?.split(' ')[0] || 'Assigned'}</span>
                 </div>
               ))}
               <button className="btn-secondary text-[10px] w-full p-2 mt-2">View Master Schedule</button>
            </div>
          </div>

          <div className="glass p-6">
            <h2 className="text-sm font-black mb-5 flex items-center gap-2 uppercase tracking-wider">
              <UserIcon size={16} className="text-pink-500" />
              Recent Customer Actions
            </h2>
            <div className="flex flex-col gap-3">
               {activity.filter(a => a.user?.role === 'Customer').slice(0, 3).map((a, idx) => (
                 <div key={idx} className="p-3 bg-dark rounded-xl">
                    <p className="text-xs">
                      <strong className="text-pink-500 font-black">{a.user?.name}</strong> {a.action.toLowerCase()}
                    </p>
                    <p className="text-[10px] text-muted mt-1">{a.projectId?.title}</p>
                 </div>
               ))}
               {activity.filter(a => a.user?.role === 'Customer').length === 0 && (
                 <p className="text-center text-muted text-xs p-4">No recent activity.</p>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Sections */}
      <div className="detail-grid">
        <div className="glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black uppercase tracking-wider">{user?.role === 'Customer' ? 'Active Projects' : 'Project Pipeline'}</h2>
            <Link href="/dashboard/projects" className="text-xs font-black text-primary flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex flex-col gap-3">
              <div className="h-16 w-full skeleton" />
              <div className="h-16 w-full skeleton" />
            </div>
          ) : recentProjects.length > 0 ? (
            <div className="flex flex-col gap-3">
              {recentProjects.map(project => (
                <ProjectListItem 
                  key={project._id} 
                  project={project} 
                  onClick={() => router.push(`/dashboard/projects/view?id=${project._id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted text-sm">
              No projects found.
            </div>
          )}
        </div>

        <div className="glass p-8">
          <h2 className="text-lg font-black mb-8">Collaboration Feed</h2>
          <ActivityFeed activities={activity} loading={loading} />
        </div>
      </div>
    </div>
  );
}
