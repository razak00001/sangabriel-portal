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
      
      <div className="login-card fade-in relative z-10">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-8">
            <div className="size-20 rounded-[28px] bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-2xl shadow-indigo-500/40 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <LogIn size={40} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          
          <h1 className="text-4xl font-black mb-3 tracking-tighter text-secondary">San Gabriel</h1>
          <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">
            Collaboration Portal
          </p>
        </header>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl mb-8 text-xs font-bold animate-fadeIn">
            <span className="size-2 bg-red-500 rounded-full animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
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
            className="w-full h-14 text-sm tracking-widest mt-4 shadow-xl"
            loading={submitting}
          >
            SIGN IN TO PORTAL
          </Button>
        </form>

        <footer className="mt-12 pt-8 border-t border-border/60 text-center">
          <p className="text-muted text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            Trouble logging in? <br/>
            <a href="#" className="mt-2 inline-block text-primary hover:underline transition-all">Contact System Administrator</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
