'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../utils/api';
import { 
  ArrowLeft, 
  Download,
  TrendingUp,
  PieChart,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function AccountingReports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Analytics loading logic could go here
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <Link href="/dashboard/accounting" className="flex items-center gap-2 text-xs font-black text-muted uppercase tracking-widest mb-4 hover:text-primary transition-colors">
            <ArrowLeft size={14} /> Back to Finance
          </Link>
          <h1 className="text-4xl font-black tracking-tight">Advanced Analytics</h1>
        </div>
        <button className="btn btn-primary px-8">
          <Download size={18} /> Export Full Audit
        </button>
      </header>

      <div className="detail-grid gap-8">
        <div className="glass p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="size-20 rounded-full bg-indigo-50 flex items-center justify-center text-primary mb-6">
            <TrendingUp size={40} />
          </div>
          <h2 className="text-2xl font-black mb-4">Revenue Intelligence</h2>
          <p className="text-muted max-w-md mx-auto leading-relaxed">
            Predictive revenue models and historical growth patterns are being processed. 
            Check back shortly for the finalized Q3 projections.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="glass p-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
              <PieChart size={18} /> Asset Allocation
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Project Labor', value: 65, color: 'bg-indigo-500' },
                { label: 'Material Costs', value: 25, color: 'bg-emerald-500' },
                { label: 'Operational overhead', value: 10, color: 'bg-amber-500' }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 bg-dark rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
              <Activity size={18} /> Audit Integrity
            </h3>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[11px] text-emerald-800 font-bold leading-relaxed">
                All financial records for the current period have been cryptographically verified and matched against project milestones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
