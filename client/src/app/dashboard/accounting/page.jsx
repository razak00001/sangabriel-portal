'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { 
  DollarSign, 
  BarChart3, 
  Clock, 
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import StatsCard from '../../../components/ui/StatsCard';

export default function AccountingDashboard() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountingData();
  }, []);

  const fetchAccountingData = async () => {
    try {
      const [volumeRes, statusRes, ratesRes, revenueRes] = await Promise.all([
        api.get('/reports/job-volume'),
        api.get('/reports/status-distribution'),
        api.get('/rates'),
        api.get('/reports/revenue')
      ]);
      setReportData({
        volume: volumeRes.data.data,
        status: statusRes.data.data
      });
      setRates(ratesRes.data.data);
      setRevenueData(revenueRes.data.data);
    } catch (error) {
      console.error('Error fetching accounting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const totalBilledCount = reportData?.status.find(s => s._id === 'BILLED')?.count || 0;
  const avgProjectValue = totalBilledCount > 0 ? (totalRevenue / totalBilledCount).toFixed(2) : 0;

  return (
    <div className="fade-in">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-black mb-1">Financial Performance</h1>
          <p className="text-muted text-sm font-bold">Real-time revenue tracking and billing management</p>
        </div>
        <div className="flex gap-3">
           <button className="btn btn-secondary">Export PDF</button>
           <button className="btn btn-primary">Generate Invoices</button>
        </div>
      </header>

      <section className="responsive-grid mb-12">
        <StatsCard 
          name="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="#4f46e5"
          loading={loading}
        />
        <StatsCard 
          name="Invoices Paid"
          value={totalBilledCount}
          icon={CheckCircle2}
          color="#10b981"
          loading={loading}
        />
        <StatsCard 
          name="Avg. Ticket Size"
          value={`$${avgProjectValue}`}
          icon={BarChart3}
          color="#ec4899"
          loading={loading}
        />
        <StatsCard 
          name="Awaiting Billing"
          value={reportData?.status.find(s => s._id === 'COMPLETE')?.count || 0}
          icon={Clock}
          color="#f59e0b"
          loading={loading}
        />
      </section>

      <div className="detail-grid">
        <div className="glass p-8">
          <div className="flex justify-between items-center mb-10 gap-4">
             <h2 className="text-lg font-black">Revenue Trend</h2>
             <Link href="/dashboard/accounting/reports" className="flex items-center gap-1 text-xs font-black text-primary uppercase">
               Analytics <ArrowUpRight size={14} />
             </Link>
          </div>
          
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[500px] h-64 flex items-end gap-4 pb-6 border-b border-border">
              {loading ? (
                <div className="w-full h-full skeleton rounded-xl" />
              ) : revenueData.length > 0 ? revenueData.slice(0, 8).map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                  <div 
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-700 shadow-lg shadow-indigo-500/20"
                    style={{ 
                      height: `${(m.totalRevenue / Math.max(...revenueData.map(v => v.totalRevenue), 1)) * 100}%`
                    }}
                  />
                  <div className="text-center">
                    <p className="text-[10px] font-black text-primary">${(m.totalRevenue/1000).toFixed(1)}k</p>
                    <p className="text-[8px] text-muted font-bold uppercase">{m._id.month}/{m._id.year}</p>
                  </div>
                </div>
              )) : (
                <div className="w-full text-center text-muted text-sm py-20">No revenue data available</div>
              )}
            </div>
          </div>
        </div>

        <div className="glass p-8">
          <h2 className="text-lg font-black mb-8">Fee Configuration</h2>
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="skeleton h-24 w-full" />
            ) : rates.length > 0 ? rates.map((rate) => (
              <div key={rate._id} className="p-4 bg-dark rounded-xl border border-border hover:border-primary transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xs font-black text-primary uppercase tracking-wider">{rate.category}</h4>
                  <span className="text-sm font-black text-emerald-600">${rate.rate}</span>
                </div>
                <p className="text-[11px] text-secondary font-medium mb-3 leading-relaxed">{rate.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-[9px] text-primary font-black uppercase tracking-widest bg-indigo-500/5 px-2 py-1 rounded-md">Per {rate.unit}</span>
                    <button className="bg-none border-none text-muted text-[10px] font-bold underline cursor-pointer hover:text-primary transition-colors">Manage</button>
                </div>
              </div>
            )) : (
              <p className="text-center text-muted text-xs py-8">No rate configurations found.</p>
            )}
            <button className="btn btn-secondary w-full text-xs py-3 mt-2">+ Create New Rate</button>
          </div>
        </div>
      </div>
    </div>
  );
}
