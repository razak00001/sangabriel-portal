import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  X,
  Sparkles
} from 'lucide-react';
import api from '../utils/api';
import { cn } from '../utils/cn';

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
  { name: 'Accounting', path: '/dashboard/accounting', icon: BarChart3, roles: ['Admin', 'Accounting'] },
  { name: 'Events', path: '/dashboard/events', icon: Calendar, roles: ['Admin'] },
  { name: 'Team', path: '/dashboard/team', icon: Users, roles: ['Admin', 'Project Manager'] },
];

/**
 * Sidebar Component
 * A high-end navigation system with dynamic role-based filtering.
 */
export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const { data } = await api.get('/notifications');
          setNotifications(data.data || []);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isActive = (path) => 
    path === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(path);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        onClick={onClose}
        className={cn(
          "mobile-only fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[900] transition-all duration-500",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      <aside className={cn("sidebar-container", isOpen && "open")}>
        {/* Branding Section */}
        <div className="mb-14">
          <div className="flex justify-between items-center mb-10">
            <Link href="/dashboard" className="flex items-center gap-4 group">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 flex items-center justify-center shadow-2xl shadow-indigo-600/40 group-hover:scale-110 transition-all duration-500">
                <Sparkles size={22} className="text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-black m-0 tracking-[0.2em] text-white uppercase leading-none">
                  San Gabriel
                </h2>
                <p className="text-[10px] text-indigo-400/80 font-black uppercase tracking-[0.3em] mt-2 m-0">
                  Portal Pro
                </p>
              </div>
            </Link>
            
            <button 
              onClick={onClose}
              className="mobile-only size-10 rounded-xl bg-white/5 text-white/30 hover:text-white transition-all border-none cursor-pointer flex items-center justify-center"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex justify-between items-center px-5 py-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Quick Access</span>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-white/5 border-none text-indigo-400 cursor-pointer relative hover:bg-indigo-600 hover:text-white transition-all"
            >
              <Bell size={18} strokeWidth={2.5} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 size-2.5 bg-rose-500 rounded-full border-2 border-slate-950 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 flex flex-col gap-3">
          {MENU_ITEMS.map((item) => {
            if (item.roles && !item.roles.includes(user?.role)) return null;
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <Link key={item.path} href={item.path} onClick={onClose}>
                <div className={cn(
                  "flex items-center gap-4 px-6 py-4.5 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                  active 
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 border border-white/10" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}>
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                  )}
                  <Icon size={20} strokeWidth={2.5} className={cn("transition-transform duration-500", active ? "scale-110" : "group-hover:scale-110")} />
                  <span className="text-[13px] font-black uppercase tracking-widest leading-none">
                    {item.name}
                  </span>
                  {active && <ChevronRight size={14} strokeWidth={3} className="ml-auto opacity-50 animate-bounce-x" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Auth Section */}
        <div className="mt-auto pt-10 border-t border-white/5">
          <div className="bg-white/5 border border-white/5 rounded-3xl p-5 flex items-center gap-4 mb-6 hover:bg-white/10 transition-all group cursor-pointer">
            <div className="size-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-lg group-hover:rotate-6 transition-transform">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-black text-white m-0 truncate group-hover:text-indigo-400 transition-colors">
                {user?.name || 'Loading...'}
              </p>
              <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em] mt-1.5 m-0">
                {user?.role || 'User'}
              </p>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 py-4.5 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all border border-rose-500/20 active:scale-95 cursor-pointer"
          >
            <LogOut size={16} strokeWidth={2.5} />
            SIGN OUT
          </button>
        </div>
      </aside>
    </>
  );
}
