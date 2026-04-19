'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GridBuilder from '../../../components/GridBuilder';

export default function EventsAdminPage() {
  const [momentsLayout, setMomentsLayout] = useState([]);
  const [conversationLayout, setConversationLayout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [momentsRes, convRes] = await Promise.all([
          axios.get('https://sangabriel-portal.onrender.com/api/sections/moments', { headers }),
          axios.get('https://sangabriel-portal.onrender.com/api/sections/conversation', { headers })
        ]);

        setMomentsLayout(momentsRes.data);
        setConversationLayout(convRes.data);
      } catch (err) {
        console.error('Failed to fetch layouts', err);
        setError('Failed to load existing layouts. Make sure the server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchLayouts();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', color: 'white' }}>Loading event sections...</div>;
  }

  return (
    <div className="fade-in">
      <header className="mobile-header-stack" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Events Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Configure the dynamic image grids for the public Events page.</p>
        </div>
      </header>

      {error && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '2rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.8125rem' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', fontWeight: '800', marginBottom: '2rem' }}>MOMENTS WE'VE SHARED</h2>
        <div className="scroll-container" style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ minWidth: '800px' }}>
            <GridBuilder sectionName="moments" initialLayout={momentsLayout} />
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', fontWeight: '800', marginBottom: '2rem' }}>JOIN THE CONVERSATION</h2>
        <div className="scroll-container" style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ minWidth: '800px' }}>
            <GridBuilder sectionName="conversation" initialLayout={conversationLayout} />
          </div>
        </div>
      </div>
    </div>
  );
}
