'use client';

import { Clock } from 'lucide-react';

export default function ActivityTab({ activityLogs }) {
  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', fontWeight: '800' }}>Project Timeline</h2>
      <div className="glass" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '2.15rem', top: '2.5rem', bottom: '2.5rem', width: '2px', background: 'var(--border)', opacity: 0.5 }}></div>
        
        {activityLogs && activityLogs.length > 0 ? activityLogs.slice().reverse().map((log, i) => (
          <div key={i} style={{ display: 'flex', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              background: 'var(--bg-dark)', 
              border: '4px solid var(--primary)',
              marginTop: '2px',
              flexShrink: 0,
              boxShadow: '0 0 10px rgba(67, 56, 202, 0.2)'
            }}></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '800', marginBottom: '0.125rem' }}>{log.action}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.5rem' }}>
                {log.user?.name || 'Automated System'} • {new Date(log.createdAt).toLocaleString()}
              </p>
              {log.details && Object.keys(log.details).length > 0 && (
                <div style={{ padding: '0.875rem', background: 'var(--bg-darker)', borderRadius: '14px', fontSize: '0.75rem', border: '1px solid var(--border)', fontWeight: '600' }}>
                  {Object.entries(log.details).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span style={{ color: 'var(--text-main)' }}>{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
            <Clock size={40} style={{ opacity: 0.1, marginBottom: '0.75rem' }} />
            <p style={{ fontSize: '0.8125rem' }}>No activity history found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
