import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, Users, LogOut } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
  { name: 'Team', path: '/dashboard/team', icon: Users, roles: ['Admin', 'Project Coordinator'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="glass" style={{
      width: '280px', height: '100vh', position: 'fixed', left: 0, top: 0,
      display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem',
      borderRadius: 0, borderRight: '1px solid var(--border)'
    }}>
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SAN GABRIEL
        </h2>
        <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Portal Collaboration
        </p>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => {
          if (item.roles && !item.roles.includes(user?.role)) return null;
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path} end={item.path === '/dashboard'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: 'var(--radius)',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s ease', cursor: 'pointer'
              })}
            >
              <Icon size={18} />
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600' }}>
            {user?.name?.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{user?.role}</p>
          </div>
        </div>
        <button onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
          padding: '0.75rem 1rem', borderRadius: 'var(--radius)', background: 'transparent',
          border: 'none', color: '#f87171', cursor: 'pointer', transition: 'all 0.2s ease'
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
