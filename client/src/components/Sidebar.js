'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  LogOut, 
  Users,
  BarChart3,
  Bell,
  CheckCircle2,
  X,
  CreditCard,
  Calendar,
  ChevronRight
} from 'lucide-react';
import api from '../utils/api';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
  { name: 'Accounting', path: '/dashboard/accounting', icon: BarChart3, roles: ['Admin', 'Accounting'] },
  { name: 'Events', path: '/dashboard/events', icon: Calendar, roles: ['Admin'] },
  { name: 'Team', path: '/dashboard/team', icon: Users, roles: ['Admin', 'Project Manager'] },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Robust path matching for active state
  const isLinkActive = (itemPath) => {
    if (itemPath === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        onClick={onClose}
        className={`mobile-overlay ${isOpen ? 'show' : ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(5px)',
          zIndex: 900,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'all 0.3s ease',
          display: 'block'
        }}
      />

      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        {/* Header Section */}
        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #4f46e5, #9333ea)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 8px 16px rgba(79, 70, 229, 0.4)' 
            }}>
              <FolderKanban size={20} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: '900', margin: 0, letterSpacing: '0.05em', color: '#fff' }}>
                SAN GABRIEL
              </h2>
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                Solutions Portal
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', 
              color: 'rgba(255,255,255,0.6)', 
              padding: '0.5rem', 
              borderRadius: '8px', 
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span style={{ position: 'absolute', top: 0, right: 0, width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => {
            if (item.roles && !item.roles.includes(user?.role)) return null;
            const Icon = item.icon;
            const active = isLinkActive(item.path);

            return (
              <Link key={item.path} href={item.path} onClick={onClose} style={{ textDecoration: 'none' }}>
                <div className={`nav-item ${active ? 'active' : ''}`}>
                  <Icon size={20} />
                  <span>{item.name}</span>
                  {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '16px', 
            padding: '1rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px', 
              background: 'linear-gradient(135deg, #10b981, #059669)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: '800',
              color: '#fff',
              fontSize: '1rem'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '800', color: '#fff', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {user?.name || 'Loading...'}
              </p>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase', margin: 0 }}>
                {user?.role || 'User'}
              </p>
            </div>
          </div>

          <button 
            onClick={logout}
            style={{ 
              width: '100%', 
              padding: '0.875rem', 
              borderRadius: '12px', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              color: '#f87171', 
              fontSize: '0.75rem', 
              fontWeight: '800', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          >
            <LogOut size={16} />
            LOG OUT
          </button>
        </div>
      </aside>
    </>
  );
}
