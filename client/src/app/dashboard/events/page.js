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
    <div className="fade-in" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Events Page Management</h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>
        Configure the dynamic image grids for the Events page. Add, remove, resize, and upload photos.
      </p>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', color: '#ff4444', marginBottom: '1rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', fontWeight: '800' }}>MOMENTS WE'VE SHARED</h2>
        <GridBuilder sectionName="moments" initialLayout={momentsLayout} />
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', fontWeight: '800' }}>JOIN THE CONVERSATION</h2>
        <GridBuilder sectionName="conversation" initialLayout={conversationLayout} />
      </div>
    </div>
  );
}
