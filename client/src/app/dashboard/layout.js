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
      router.push('/');
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
      <header className="show-mobile" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '64px', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 1.25rem',
        zIndex: 500,
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a' }}
        >
          <Menu size={24} />
        </button>
        <span style={{ marginLeft: '1rem', fontWeight: '900', fontSize: '1rem', color: '#0f172a', letterSpacing: '0.05em' }}>
          SAN GABRIEL
        </span>
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
