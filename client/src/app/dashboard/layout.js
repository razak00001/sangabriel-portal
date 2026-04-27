'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Only redirect if we are CERTAIN the user is not logged in
    // i.e., loading is finished AND user is null
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0f172a'
      }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { to { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="mesh-gradient"></div>

      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="flex items-center gap-4 w-full">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center justify-center size-12 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-white/40 cursor-pointer text-secondary active:scale-90 transition-all duration-200"
            aria-label="Open menu"
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>
          
          <div className="flex flex-col">
            <h2 className="font-black text-[13px] text-secondary tracking-[0.15em] uppercase leading-none m-0">
              San Gabriel
            </h2>
            <span className="text-[9px] font-black text-primary/70 uppercase tracking-widest mt-1.5 m-0">
              Solutions Portal
            </span>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="main-content" style={{ flex: 1 }}>
        <div className="fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
