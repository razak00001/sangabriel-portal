'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { 
  DollarSign, 
  BarChart3, 
  Clock, 
  CheckCircle2,
  FileText,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

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

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Loading Accounting Data...</div>;

  return (
    <div className="fade-in">
      <header className="mobile-header-stack">
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Financial Performance</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Real-time revenue tracking and billing management</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
           <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.6rem 1rem' }}>Export PDF</button>
           <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.6rem 1rem' }}>Generate Invoices</button>
        </div>
      </header>

      <section className="responsive-grid" style={{ marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(67, 56, 202, 0.1)', color: 'var(--primary)', width: 'fit-content', marginBottom: '1rem' }}>
            <DollarSign size={20} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>${totalRevenue.toLocaleString()}</h3>
          <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Revenue</p>
        </div>

        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' , width: 'fit-content', marginBottom: '1rem'}}>
            <CheckCircle2 size={20} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{totalBilledCount}</h3>
          <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Invoices Paid</p>
        </div>

        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', width: 'fit-content', marginBottom: '1rem' }}>
            <BarChart3 size={20} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>${avgProjectValue}</h3>
          <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Avg. Ticket Size</p>
        </div>

        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: 'fit-content', marginBottom: '1rem' }}>
            <Clock size={20} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            {reportData?.status.find(s => s._id === 'COMPLETE')?.count || 0}
          </h3>
          <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Awaiting Billing</p>
        </div>
      </section>

      <div className="detail-grid">
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
             <h2 style={{ fontSize: '1.125rem', fontWeight: '800' }}>Revenue Trend</h2>
             <Link href="/dashboard/accounting/reports" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>View Detailed Analytics</Link>
          </div>
          
          <div className="scroll-container">
            <div style={{ minWidth: '500px', height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              {revenueData.length > 0 ? revenueData.slice(0, 8).map((m, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    width: '100%', 
                    background: 'linear-gradient(to top, var(--primary), #818cf8)', 
                    height: `${(m.totalRevenue / Math.max(...revenueData.map(v => v.totalRevenue), 1)) * 100}%`,
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.4s ease'
                  }}></div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.5625rem', fontWeight: '800', color: 'var(--text-main)' }}>${(m.totalRevenue/1000).toFixed(1)}k</p>
                    <p style={{ fontSize: '0.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>{m._id.month}/{m._id.year}</p>
                  </div>
                </div>
              )) : (
                <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-muted)' }}>No revenue data available</div>
              )}
            </div>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '2rem' }}>Fee Configuration</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {rates.length > 0 ? rates.map((rate) => (
              <div key={rate._id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: '700' }}>{rate.category}</h4>
                  <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#10b981' }}>${rate.rate}</span>
                </div>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{rate.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.5625rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase' }}>Per {rate.unit}</span>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.625rem', textDecoration: 'underline', cursor: 'pointer' }}>Edit</button>
                </div>
              </div>
            )) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No rate configurations found.</p>
            )}
            <button className="btn-secondary" style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.75rem', padding: '0.6rem' }}>+ Create New Rate</button>
          </div>
        </div>
      </div>
    </div>
  );
}
