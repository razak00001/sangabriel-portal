'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  BarChart3, 
  Clock, 
  CheckCircle2,
  ArrowUpRight,
  Download,
  FileText,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { cn } from '../../../utils/cn';

import StatsCard from '../../../components/ui/StatsCard';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

/**
 * AccountingDashboard Component
 * A high-end financial oversight interface with advanced analytics and configuration.
 */
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
        api.get('/reports/job-volume').catch(() => ({ data: { data: [] } })),
        api.get('/reports/status-distribution').catch(() => ({ data: { data: [] } })),
        api.get('/rates').catch(() => ({ data: { data: [] } })),
        api.get('/reports/revenue').catch(() => ({ data: { data: [] } }))
      ]);
      
      setReportData({
        volume: volumeRes.data.data || [],
        status: statusRes.data.data || []
      });
      
      setRates(ratesRes.data.data || []);
      setRevenueData(revenueRes.data.data || []);
    } catch (error) {
      console.error('Financial intelligence load failure:', error);
      setRates([]);
      setRevenueData([]);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = revenueData.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0);
  const totalBilledCount = reportData?.status?.find(s => s._id === 'BILLED')?.count || 0;
  const avgProjectValue = totalBilledCount > 0 ? (totalRevenue / totalBilledCount).toFixed(0) : 0;
  const awaitingBilling = reportData?.status?.find(s => s._id === 'COMPLETE')?.count || 0;

  return (
    <div className="fade-in max-w-[1600px] mx-auto pb-20">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-10 mb-12 sm:mb-20 animate-slide-up px-2 sm:px-0">
        <div className="space-y-3 sm:space-y-4 w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <div className="size-8 sm:size-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-600/20">
              <DollarSign size={16} sm:size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Financial Oversight</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-tight sm:leading-none">
            Fiscal <span className="text-emerald-600">Performance</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-xl font-bold max-w-2xl leading-relaxed">
            Real-time revenue tracking and <span className="text-gray-900 font-black">automated billing</span>.
          </p>
        </div>
        
        <div className="flex gap-4">
           <Button variant="secondary" size="lg" icon={Download} onClick={() => alert("Generating report...")}>
             Export Intelligence
           </Button>
           <Button variant="primary" size="lg" icon={FileText} onClick={() => alert("Provisioning invoices...")}>
             Batch Billing
           </Button>
        </div>
      </header>

      {/* Financial KPIs */}
      <section className="responsive-grid mb-12">
        <StatsCard 
          name="Cumulative Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="#10b981"
          loading={loading}
          trend="+18.2%"
        />
        <StatsCard 
          name="Settled Accounts"
          value={totalBilledCount}
          icon={CheckCircle2}
          color="#6366f1"
          loading={loading}
        />
        <StatsCard 
          name="Mean Engagement"
          value={`$${Number(avgProjectValue).toLocaleString()}`}
          icon={BarChart3}
          color="#ec4899"
          loading={loading}
          trend="+5.4%"
        />
        <StatsCard 
          name="Awaiting Settlement"
          value={awaitingBilling}
          icon={Clock}
          color="#f59e0b"
          loading={loading}
        />
      </section>

      {/* Advanced Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card variant="glass" className="lg:col-span-2 group">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 sm:mb-14">
             <div className="flex items-center gap-4">
               <div className="size-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                 <TrendingUp size={20} strokeWidth={2.5} />
               </div>
               <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-gray-900">Revenue Stream</h2>
             </div>
             <Link href="/dashboard/accounting/reports" className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-3 hover:gap-6 transition-all group/link">
               Deep Analytics <ArrowUpRight size={14} sm:size={16} strokeWidth={3} className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
             </Link>
          </div>
          
          <div className="h-64 flex items-end gap-6 min-w-full overflow-x-auto custom-scrollbar pb-6">
            {loading ? (
              <div className="w-full h-full bg-gray-50 animate-pulse rounded-[2rem]" />
            ) : revenueData.length > 0 ? revenueData.map((m, i) => (
              <div key={i} className="flex-1 min-w-[80px] flex flex-col items-center group/bar">
                <div 
                  className="w-full bg-emerald-500/10 border-x border-t border-emerald-500/20 rounded-t-[1.5rem] relative group-hover/bar:bg-emerald-500 group-hover/bar:border-emerald-400 transition-all duration-700"
                  style={{ 
                    height: `${(m.totalRevenue / Math.max(...revenueData.map(v => v.totalRevenue), 1)) * 100}%`
                  }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all font-black">
                    ${(m.totalRevenue/1000).toFixed(1)}k
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest block">{m._id.month}/{m._id.year}</span>
                </div>
              </div>
            )) : (
              <div className="w-full flex flex-col items-center justify-center py-20 text-gray-400">
                <AlertCircle size={40} className="mb-4 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">No financial data detected</p>
              </div>
            )}
          </div>
        </Card>

        <Card variant="glass" className="lg:col-span-1">
          <div className="flex items-center gap-4 mb-10">
            <div className="size-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl">
              <BarChart3 size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.25em] text-gray-900">Fee Architecture</h2>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="h-40 bg-gray-50 animate-pulse rounded-[2rem]" />
            ) : rates.map((rate) => (
              <div key={rate._id} className="p-6 bg-gray-50/50 border border-gray-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group/rate">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900">{rate.category}</h4>
                  <span className="text-lg font-black text-indigo-600">${rate.rate}</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium mb-5">{rate.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white border border-gray-100 rounded-full text-gray-400">
                      Per {rate.unit}
                    </span>
                    <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform cursor-pointer bg-transparent border-none">
                      Adjust
                    </button>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full py-6 rounded-[2rem] mt-6 border-dashed border-2">
              Add New Rate Configuration
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

