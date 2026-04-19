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
  Circle,
  X
} from 'lucide-react';
import api from '../utils/api';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
  { name: 'Accounting', path: '/dashboard/accounting', icon: BarChart3, roles: ['Admin', 'Accounting'] },
  { name: 'Events', path: '/dashboard/events', icon: Files, roles: ['Admin'] },
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
      const interval = setInterval(fetchNotifications, 30000);
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.4)', 
            backdropFilter: 'blur(4px)',
            zIndex: 100 
          }} 
          className="show-mobile"
        />
      )}

      <aside className={`sidebar-container ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{ 
        width: '280px', 
        height: '100vh', 
        position: 'fixed', 
        left: 0, 
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 1.25rem',
        background: '#0f172a', /* Purest dark slate for premium contrast */
        color: '#ffffff',
        zIndex: 150,
        boxShadow: '12px 0 40px rgba(0,0,0,0.4)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Logo & Header */}
        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #4338ca, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(67, 56, 202, 0.4)' }}>
              <FolderKanban size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: '900', margin: 0, letterSpacing: '0.05em', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                SAN GABRIEL
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10b981' }}></div>
                <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.45)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.075em' }}>Solutions Portal</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                color: showNotifications ? '#ffffff' : 'rgba(255,255,255,0.6)', 
                cursor: 'pointer',
                position: 'relative',
                padding: '0.6rem',
                display: 'flex',
                borderRadius: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-4px', 
                  right: '-4px', 
                  background: '#ef4444', 
                  color: '#ffffff', 
                  fontSize: '0.5rem', 
                  fontWeight: '900', 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px solid #0f172a'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="glass fade-in" style={{ 
                position: 'absolute', 
                right: '-1.5rem', 
                top: '3rem', 
                width: '300px', 
                maxHeight: '400px', 
                overflowY: 'auto', 
                zIndex: 1000, 
                padding: '1.25rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(15, 23, 42, 0.98)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '900', margin: 0, color: '#ffffff' }}>Latest Updates</h3>
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      await api.patch('/notifications/read-all');
                      fetchNotifications();
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '0.6875rem', cursor: 'pointer', fontWeight: '800' }}
                  >
                    CLEAR ALL
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {notifications.length > 0 ? notifications.map((n) => (
                    <div 
                      key={n._id} 
                      onClick={() => handleMarkRead(n._id)}
                      style={{ 
                        padding: '1rem', 
                        borderRadius: '16px', 
                        background: n.isRead ? 'rgba(255,255,255,0.03)' : 'rgba(79, 70, 229, 0.12)',
                        border: '1px solid',
                        borderColor: n.isRead ? 'rgba(255,255,255,0.05)' : 'rgba(79, 70, 229, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: '800', color: n.isRead ? 'rgba(255,255,255,0.5)' : '#ffffff' }}>{n.title}</span>
                        {!n.isRead && <Circle size={8} fill="#6366f1" color="#6366f1" />}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', lineHeight: '1.5' }}>{n.message}</p>
                    </div>
                  )) : (
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8125rem', padding: '1.5rem' }}>Zero notifications found.</p>
                  )}
                </div>
              </div>
            )}

            <button 
              onClick={onClose}
              className="show-mobile"
              style={{ 
                background: 'rgba(255,255,255,0.08)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: '#ffffff', 
                cursor: 'pointer',
                padding: '0.6rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => {
            if (item.roles && !item.roles.includes(user?.role)) return null;
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link key={item.path} href={item.path} onClick={onClose} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem 1.25rem', 
                  borderRadius: '18px',
                  background: isActive ? 'linear-gradient(to right, #4338ca, rgba(67, 56, 202, 0.4))' : 'transparent',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isActive ? '0 10px 15px -3px rgba(67, 56, 202, 0.3)' : 'none',
                  border: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent'
                }}
                className={!isActive ? 'nav-hover' : ''}
                >
                  <Icon size={20} style={{ opacity: isActive ? 1 : 0.8 }} />
                  <span style={{ fontSize: '0.9375rem', fontWeight: isActive ? '800' : '600' }}>{item.name}</span>
                  {isActive && (
                    <div style={{ position: 'absolute', right: '12px', width: '5px', height: '5px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 10px #ffffff' }}></div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Account Card */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.06)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '24px', 
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '16px', 
              background: 'linear-gradient(135deg, #4f46e5, #9333ea)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.125rem', 
              fontWeight: '900', 
              color: '#ffffff',
              boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)' 
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ fontSize: '0.9375rem', fontWeight: '900', whiteSpace: 'nowrap', textOverflow: 'ellipsis', margin: 0, color: '#ffffff' }}>{user?.name}</p>
              <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)', fontWeight: '800', textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em' }}>{user?.role}</p>
            </div>
          </div>

          <button onClick={logout} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.875rem', 
            width: '100%', 
            padding: '1.125rem', 
            borderRadius: '20px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: '900',
            fontSize: '0.875rem',
            letterSpacing: '0.05em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(239, 68, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <LogOut size={18} />
            <span>SIGN OUT</span>
          </button>
        </div>
      </aside>
    </>
  );
}
