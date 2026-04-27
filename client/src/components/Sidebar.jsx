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
  Calendar,
  ChevronRight,
  X
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

  const isLinkActive = (itemPath) => {
    if (itemPath === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <>
      {/* Mobile Overlay - Strictly for mobile */}
      <div 
        onClick={onClose}
        className={`mobile-only fixed inset-0 bg-black/60 backdrop-blur-sm z-[900] transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                <FolderKanban size={20} color="#ffffff" />
              </div>
              <div>
                <h2 className="text-sm font-black m-0 tracking-wider text-white uppercase">
                  SAN GABRIEL
                </h2>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest m-0">
                  Solutions Portal
                </p>
              </div>
            </div>
            
            {/* Mobile Close Button - Strictly for mobile */}
            <button 
              onClick={onClose}
              className="mobile-only p-2 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all border-none cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex justify-between items-center px-2 py-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Quick Actions</span>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-white/5 border-none text-white/60 cursor-pointer relative hover:bg-white/10 transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 size-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => {
            if (item.roles && !item.roles.includes(user?.role)) return null;
            const Icon = item.icon;
            const active = isLinkActive(item.path);

            return (
              <Link key={item.path} href={item.path} onClick={onClose} className="no-underline">
                <div className={`nav-item ${active ? 'active' : ''}`}>
                  <Icon size={20} />
                  <span>{item.name}</span>
                  {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto pt-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 mb-4">
            <div className="size-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-black text-white text-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-white m-0 truncate">
                {user?.name || 'Loading...'}
              </p>
              <p className="text-[10px] text-white/40 font-bold uppercase m-0">
                {user?.role || 'User'}
              </p>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full btn btn-danger hover:transform-none"
          >
            <LogOut size={16} />
            LOG OUT
          </button>
        </div>
      </aside>
    </>
  );
}
