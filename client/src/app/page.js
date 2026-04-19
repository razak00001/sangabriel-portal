'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

/**
 * Root Redirector (Billion Dollar Architecture)
 * Highly efficient entry point that serves as the traffic controller for the entire portal.
 * Directs users to either the Dashboard or Login based on verified auth state.
 */
export default function rootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-sidebar)'
    }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '3px solid rgba(255,255,255,0.1)', 
        borderTopColor: 'var(--primary)', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite' 
      }}></div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
