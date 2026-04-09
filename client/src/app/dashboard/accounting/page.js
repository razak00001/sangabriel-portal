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
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountingData();
  }, []);

  const fetchAccountingData = async () => {
    try {
      const [volumeRes, statusRes, ratesRes] = await Promise.all([
        api.get('/reports/job-volume'),
        api.get('/reports/status-distribution'),
        api.get('/rates')
      ]);
      setReportData({
        volume: volumeRes.data,
        status: statusRes.data
      });
      setRates(ratesRes.data);
    } catch (error) {
      console.error('Error fetching accounting data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Loading Accounting Data...</div>;

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Accounting Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Financial overview and rate management</p>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            {reportData?.status.find(s => s._id === 'BILLED')?.count || 0}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Billed Projects</p>
        </div>

        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Clock size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            {reportData?.status.find(s => s._id === 'COMPLETE')?.count || 0}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Ready for Billing</p>
        </div>

        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{rates.length}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Active RateConfigs</p>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Monthly Job Volume</h2>
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            {reportData?.volume.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  width: '100%', 
                  background: 'var(--primary)', 
                  height: `${(m.count / Math.max(...reportData.volume.map(v => v.count), 1)) * 100}%`,
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.8,
                  transition: 'height 1s ease-out'
                }}></div>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{m._id.month}/{m._id.year}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Active Rates</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {rates.length > 0 ? rates.map((rate) => (
              <div key={rate._id} style={{ padding: '1rem', background: 'var(--bg-darker)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.875rem' }}>{rate.category}</h4>
                  <span style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--primary)' }}>${rate.rate}/{rate.unit}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rate.description}</p>
              </div>
            )) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No rate configurations found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
