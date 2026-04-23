'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, login, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError('');
    setSubmitting(true);
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sign in. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background */}
      <div className="mesh-gradient" />
      
      <div className="glass w-full max-w-[440px] p-10 fade-in border border-white/20 shadow-premium">
        <header className="text-center mb-10">
          {/* Logo Branding */}
          <div className="flex justify-center mb-6">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <LogIn size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-muted text-sm font-bold uppercase tracking-wider">
            Collaboration Portal
          </p>
        </header>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl mb-8 text-sm font-black animate-fadeIn">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <Input 
            label="Email Address"
            type="email" 
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
            disabled={submitting}
          />

          <Input 
            label="Password"
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={Lock}
            disabled={submitting}
          />

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full mt-4 h-12"
            loading={submitting}
          >
            SIGN IN
          </Button>
        </form>

        <footer className="mt-10 pt-10 border-t border-border text-center">
          <p className="text-muted text-xs font-bold uppercase tracking-widest">
            Don't have an account? 
            <a href="#" className="ml-2 text-primary hover:underline transition-all">Contact Admin</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
