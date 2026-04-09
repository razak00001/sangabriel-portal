'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  Files, 
  LogOut, 
  Settings,
  Users,
  BarChart3,
  Bell,
  CheckCheck,
  Circle
} from 'lucide-react';
import api from '../utils/api';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
  { name: 'Accounting', path: '/dashboard/accounting', icon: BarChart3, roles: ['Admin', 'Accounting'] },
  { name: 'Events', path: '/dashboard/events', icon: Files, roles: ['Admin'] },
  { name: 'Team', path: '/dashboard/team', icon: Users, roles: ['Admin', 'Project Manager'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Polling for demo, ideally use socket.io
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <aside className="glass" style={{ 
      width: '280px', 
      height: '100vh', 
      position: 'fixed', 
      left: 0, 
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1.5rem',
      borderRadius: 0,
      borderRight: '1px solid var(--border)',
      background: 'var(--bg-darker)',
      zIndex: 50
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SAN GABRIEL
          </h2>
          <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Portal Collaboration
          </p>
        </div>
        
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: showNotifications ? 'var(--primary)' : 'var(--text-muted)', 
              cursor: 'pointer',
              position: 'relative',
              padding: '0.25rem'
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                background: '#f87171', 
                color: 'white', 
                fontSize: '0.625rem', 
                fontWeight: '800', 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '2px solid var(--bg-darker)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="glass fade-in" style={{ 
              position: 'absolute', 
              left: '2rem', 
              top: 0, 
              width: '300px', 
              maxHeight: '400px', 
              overflowY: 'auto', 
              zIndex: 1000, 
              padding: '1rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
              border: '1px solid var(--border)',
              background: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600' }}>Notifications</h3>
                <button 
                  onClick={async () => {
                    await api.patch('/notifications/read-all');
                    fetchNotifications();
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Mark all read
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notifications.length > 0 ? notifications.map((n) => (
                  <div 
                    key={n._id} 
                    onClick={() => handleMarkRead(n._id)}
                    style={{ 
                      padding: '0.75rem', 
                      borderRadius: 'var(--radius)', 
                      background: n.isRead ? 'rgba(0,0,0,0.02)' : 'rgba(67, 56, 202, 0.04)',
                      border: '1px solid',
                      borderColor: n.isRead ? 'transparent' : 'rgba(67, 56, 202, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: n.isRead ? 'var(--text-muted)' : 'var(--text-main)' }}>{n.title}</span>
                      {!n.isRead && <Circle size={8} fill="var(--primary)" color="var(--primary)" />}
                    </div>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{n.message}</p>
                    <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.25rem', opacity: 0.6 }}>
                      {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )) : (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '1rem' }}>No notifications yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => {
          if (item.roles && !item.roles.includes(user?.role)) return null;
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.75rem 1rem', 
                borderRadius: 'var(--radius)',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => !isActive && (e.currentTarget.style.background = 'rgba(0,0,0,0.03)')}
              onMouseLeave={(e) => !isActive && (e.currentTarget.style.background = 'transparent')}
              >
                <Icon size={18} />
                <span style={{ fontSize: '0.875rem', fontWeight: isActive ? '600' : '500' }}>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', color: 'white' }}>
            {user?.name?.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{user?.role}</p>
          </div>
        </div>
        
        <button onClick={logout} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          width: '100%', 
          padding: '0.75rem 1rem', 
          borderRadius: 'var(--radius)',
          background: 'transparent',
          border: 'none',
          color: '#f87171',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
