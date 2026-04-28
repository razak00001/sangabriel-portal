'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Menu, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]" />
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="size-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/40 animate-bounce">
            <Sparkles size={32} className="text-white" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 animate-progress origin-left" />
            </div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Initializing Portal Intelligence</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-x-hidden">
      <div className="mesh-gradient fixed inset-0 pointer-events-none opacity-40"></div>

      {/* Mobile Header Overlay */}
      <header className="mobile-header fixed top-0 left-0 right-0 z-[800] bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center gap-5 lg:hidden">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="size-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all duration-200"
          aria-label="Open menu"
        >
          <Menu size={22} strokeWidth={2.5} />
        </button>
        
        <div className="flex flex-col">
          <h2 className="font-black text-[13px] text-gray-900 tracking-[0.2em] uppercase leading-none m-0">
            San Gabriel
          </h2>
          <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mt-1.5 m-0">
            Pro Solutions
          </span>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="main-content flex-1 w-full max-w-full">
        <div className="p-6 sm:p-10 lg:p-14 min-h-screen">
          {children}
        </div>
      </main>

      <style jsx global>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
