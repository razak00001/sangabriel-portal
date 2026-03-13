'use client';

import { useAuth } from '../../context/AuthContext';
import { 
  FolderKanban, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  Plus,
  ArrowRight
} from 'lucide-react';

const stats = [
  { name: 'Active Projects', value: '12', icon: FolderKanban, color: 'var(--primary)' },
  { name: 'In Progress', value: '5', icon: Clock, color: 'var(--secondary)' },
  { name: 'Completed', value: '48', icon: CheckCircle2, color: '#10b981' },
  { name: 'Messages', value: '128', icon: MessageCircle, color: '#f59e0b' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Welcome back, {user?.name.split(' ')[0]}</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <Plus size={18} />
            <span>New Project</span>
          </button>
        )}
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat) => (
          <div key={stat.name} className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '10px', background: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={20} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{stat.value}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.name}</p>
          </div>
        ))}
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: 0 }}>Recent Projects</h2>
            <Link href="/dashboard/projects" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
            <FolderKanban size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.875rem' }}>No active projects found.</p>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Activity Feed</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
              No recent activity logs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper to avoid build error
function Link({ children, href, style }) {
  return <a href={href} style={style}>{children}</a>;
}
