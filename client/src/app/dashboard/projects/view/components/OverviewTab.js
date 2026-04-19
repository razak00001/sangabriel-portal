'use client';

import { Info, Calendar, ShieldCheck, Clock, User } from 'lucide-react';

export default function OverviewTab({ project }) {
  if (!project) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return '#64748b';
      case 'ACTIVE': return '#4338ca';
      case 'IN PROGRESS': return '#2563eb';
      case 'PENDING REVIEW': return '#db2777';
      case 'REVISION REQUESTED': return '#d97706';
      case 'COMPLETE': return '#059669';
      case 'BILLED': return '#059669';
      case 'ARCHIVED': return '#475569';
      default: return '#64748b';
    }
  };

  return (
    <div className="detail-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Project Description & Details */}
        <div className="glass" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={18} color="var(--primary)" /> Project Details
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.7', fontWeight: '500' }}>
                {project.description || 'No detailed description available for this project.'}
              </p>
            </div>
          </div>

          <div className="responsive-grid" style={{ gap: '1.25rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--bg-dark)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <Calendar size={14} color="var(--primary)" />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Timeline</span>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: '800' }}>
                {project.timeline?.startDate ? new Date(project.timeline.startDate).toLocaleDateString() : 'TBD'} 
                <span style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }}>→</span>
                {project.timeline?.endDate ? new Date(project.timeline.endDate).toLocaleDateString() : 'TBD'}
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: 'var(--bg-dark)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Status</span>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: '800', color: getStatusColor(project.status) }}>{project.status}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Stakeholders Card */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.25rem' }}>Project Team</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-dark)', borderRadius: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <User size={18} />
              </div>
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: '800' }}>{project.projectManager?.name || 'Unassigned'}</p>
                <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Project Manager</p>
              </div>
            </div>

            {project.installer && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: '800' }}>{project.installer.name}</p>
                  <p style={{ fontSize: '0.625rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>Lead Installer</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass" style={{ padding: '1.5rem' }}>
           <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.25rem' }}>Client Information</h2>
           <p style={{ fontSize: '0.875rem', fontWeight: '700' }}>{project.clientName}</p>
           <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Authorized Entity</p>
        </div>
      </div>
    </div>
  );
}
