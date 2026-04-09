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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await dashboardService.getDashboardData();
        setStats(data.stats);
        setRecentProjects(data.recentProjects);
        setActivity(data.activity);
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
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Welcome back, {user?.name.split(' ')[0]}</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" style={{ gap: '0.5rem' }} onClick={() => router.push('/dashboard/projects')}>
            <Plus size={18} />
            <span>New Project</span>
          </button>
        )}
      </header>

      {/* Stats Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {(loading ? Array(4).fill({}) : stats).map((stat, i) => (
          <div key={stat.name || i} className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ 
                padding: '0.625rem', 
                borderRadius: '12px', 
                background: loading ? 'var(--bg-dark)' : `${stat.color}10`, 
                color: stat.color, 
                border: loading ? '1px solid var(--border)' : `1px solid ${stat.color}20` 
              }}>
                {stat.icon && iconMap[stat.icon] ? (
                  (() => {
                    const IconComp = iconMap[stat.icon];
                    return <IconComp size={22} />;
                  })()
                ) : (
                  <div className="skeleton" style={{ width: 22, height: 22, borderRadius: '4px' }} />
                )}
              </div>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>
              {loading ? <span className="skeleton-text" style={{ width: '40px' }} /> : stat.value}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {loading ? <span className="skeleton-text" style={{ width: '80px' }} /> : stat.name}
            </p>
          </div>
        ))}
      </section>

      {/* Detail Sections */}
      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: 0 }}>Recent Projects</h2>
            <Link href="/dashboard/projects" className="link-standard" style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          {loading ? (
            <div className="loading-placeholder">Loading projects...</div>
          ) : recentProjects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentProjects.map(project => (
                <div key={project._id} className="list-item-hover" style={{ 
                  padding: '1.25rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: 'var(--bg-dark)', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{project.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{project.clientName} • <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{project.status}</span></p>
                  </div>
                  <Link href={`/dashboard/projects/${project._id}`} className="btn-icon-secondary">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FolderKanban size={48} />
              <p>No active projects found.</p>
            </div>
          )}
        </div>

        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>Activity Feed</h2>
          {loading ? (
             <div className="loading-placeholder">Loading activity...</div>
          ) : activity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {activity.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                  <div className="avatar-small">
                    <UserIcon size={16} />
                  </div>
                  <div style={{ paddingBottom: '1.25rem', borderBottom: i !== activity.length -1 ? '1px solid var(--border)' : 'none', flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                      <strong style={{ fontWeight: '700' }}>{log.user?.name}</strong> {log.action.toLowerCase()}
                    </p>
                    {log.projectId?.title && <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{log.projectId.title}</p>}
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No recent activity logs.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
