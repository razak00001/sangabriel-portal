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
  User as UserIcon
} from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const iconMap = {
  FolderKanban,
  Clock,
  CheckCircle2,
  MessageCircle
};

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

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{user?.role} Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Welcome back, {user?.name?.split(' ')[0] || 'User'}</p>
        </div>
        
        {['Admin', 'Project Manager'].includes(user?.role) && (
          <button className="btn btn-primary" style={{ gap: '0.5rem' }} onClick={() => router.push('/dashboard/projects')}>
            <Plus size={18} />
            <span>New Project</span>
          </button>
        )}
      </header>

      {/* Stats Cards */}
      <section className="responsive-grid" style={{ marginBottom: '2rem' }}>
        {(loading ? Array(4).fill({}) : stats).map((stat, i) => (
          <div key={stat.name || i} className="glass card-hover" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ 
                padding: '0.4rem', 
                borderRadius: '8px', 
                background: loading ? 'var(--bg-dark)' : `${stat.color}10`, 
                color: stat.color, 
                border: loading ? '1px solid var(--border)' : `1px solid ${stat.color}20` 
              }}>
                {stat.icon && iconMap[stat.icon] ? (
                  (() => {
                    const IconComp = iconMap[stat.icon];
                    return <IconComp size={18} />;
                  })()
                ) : (
                  <div className="skeleton" style={{ width: 18, height: 18, borderRadius: '4px' }} />
                )}
              </div>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.125rem' }}>
              {loading ? <span className="skeleton-text" style={{ width: '40px' }} /> : stat.value}
            </h3>
            <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {loading ? <span className="skeleton-text" style={{ width: '80px' }} /> : stat.name}
            </p>
          </div>
        ))}
      </section>

      {/* Extreme Polish Phase: Advanced Widgets */}
      {user?.role === 'Admin' && workload.length > 0 && (
        <section className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', overflowX: 'auto' }}>
           <h2 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Operational Workload Heatmap</h2>
           <div style={{ display: 'flex', gap: '1rem', height: '100px', alignItems: 'flex-end', minWidth: '400px' }}>
              {workload.map((item, idx) => (
                <div key={idx} style={{ flex: 1, position: 'relative', textAlign: 'center' }}>
                    <div style={{ 
                      height: `${(item.count / Math.max(...workload.map(w => w.count))) * 100}%`, 
                      background: 'var(--primary)', 
                      borderRadius: '6px',
                      opacity: 0.8,
                      marginBottom: '0.5rem'
                    }}></div>
                    <span style={{ fontSize: '0.5625rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{item._id}</span>
                </div>
              ))}
           </div>
        </section>
      )}

      {user?.role === 'Admin' && archiveRequests.length > 0 && (
        <section className="glass" style={{ padding: '1.5rem', marginBottom: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
           <h2 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800' }}>
             <Clock size={18} color="var(--primary)" />
             Archive Retrieval Queue
           </h2>
           <div className="responsive-grid">
              {archiveRequests.map((req, idx) => (
                <div key={idx} style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: '800' }}>{req.projectId?.title}</p>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Req: {req.requestedBy?.name}</p>
                    <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '0.5625rem', color: '#f59e0b', fontWeight: '800' }}>SLA: 24h Remaining</span>
                       <button style={{ fontSize: '0.5625rem', color: 'var(--primary)', fontWeight: '800', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Fulfill</button>
                    </div>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* PM Specific Widgets */}
      {user?.role === 'Project Manager' && (
        <div className="detail-grid" style={{ marginBottom: '2.5rem' }}>
          <div className="glass" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="var(--primary)" />
              Installer Availability
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               {recentProjects.filter(p => p.milestones?.some(m => m.label === 'Installation Scheduled' && !m.completed)).slice(0, 3).map((p, idx) => (
                 <div key={idx} style={{ padding: '0.75rem 1rem', background: 'var(--bg-dark)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                       <p style={{ fontSize: '0.75rem', fontWeight: '800' }}>{p.title}</p>
                       <p style={{ fontSize: '0.625rem', color: '#10b981', fontWeight: '700' }}>Schedule: Confirmed</p>
                    </div>
                    <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '700' }}>{p.installer?.name?.split(' ')[0] || 'Assigned'}</span>
                 </div>
               ))}
               <button className="btn-secondary" style={{ fontSize: '0.6875rem', width: '100%', padding: '0.5rem' }}>View Master Schedule</button>
            </div>
          </div>

          <div className="glass" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserIcon size={18} color="#ec4899" />
              Recent Customer Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               {activity.filter(a => a.user?.role === 'Customer').slice(0, 3).map((a, idx) => (
                 <div key={idx} style={{ padding: '0.75rem 1rem', background: 'var(--bg-dark)', borderRadius: '10px' }}>
                    <p style={{ fontSize: '0.75rem' }}>
                      <strong style={{ color: '#ec4899', fontWeight: '800' }}>{a.user?.name}</strong> {a.action.toLowerCase()}
                    </p>
                    <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{a.projectId?.title}</p>
                 </div>
               ))}
               {activity.filter(a => a.user?.role === 'Customer').length === 0 && (
                 <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '1rem' }}>No recent activity.</p>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Sections */}
      <div className="detail-grid">
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '800' }}>{user?.role === 'Customer' ? 'Active Projects' : 'Project Pipeline'}</h2>
            <Link href="/dashboard/projects" className="link-standard" style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)' }}>
              View All <ArrowRight size={12} />
            </Link>
          </div>
          
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : recentProjects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentProjects.map(project => (
                <div key={project._id} className="list-item-hover" style={{ 
                  padding: '1rem 1.25rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: 'rgba(0,0,0,0.02)', 
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => router.push(`/dashboard/projects/view?id=${project._id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FolderKanban size={16} color="white" />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '800', marginBottom: '0.125rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{project.title}</h4>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '600' }}>{project.status}</p>
                    </div>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p style={{ fontSize: '0.8125rem' }}>No projects found.</p>
            </div>
          )}
        </div>

        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '2rem' }}>Collaboration Feed</h2>
          {loading ? (
             <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : activity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {activity.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                  {i < activity.length - 1 && <div style={{ position: 'absolute', left: '12px', top: '24px', bottom: '-12px', width: '1px', background: 'var(--border)' }}></div>}
                  <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, flexShrink: 0 }}>
                    <UserIcon size={12} color="var(--primary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.8125rem', lineHeight: '1.4', color: 'var(--text-main)' }}>
                      <strong style={{ fontWeight: '800' }}>{log.user?.name}</strong> {log.action.toLowerCase()}
                    </p>
                    <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '700', marginTop: '0.25rem' }}>
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No recent activity.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
