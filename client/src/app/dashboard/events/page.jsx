'use client';

import React, { useEffect, useState } from 'react';
import GridBuilder from '../../../components/GridBuilder';
import { sectionService } from '../../../services/sectionService';
import { AlertCircle } from 'lucide-react';

export default function EventsAdminPage() {
  const [momentsLayout, setMomentsLayout] = useState([]);
  const [conversationLayout, setConversationLayout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        setLoading(true);
        const [momentsRes, convRes] = await Promise.all([
          sectionService.getLayout('moments'),
          sectionService.getLayout('conversation')
        ]);

        setMomentsLayout(momentsRes || []);
        setConversationLayout(convRes || []);
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
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="skeleton h-12 w-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <header className="mb-10">
        <div>
          <h1 className="text-3xl font-black mb-1">Events Management</h1>
          <p className="text-muted text-sm font-bold">Configure the dynamic image grids for the public Events page.</p>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl mb-8 text-sm font-bold">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-sm font-black border-b border-border pb-3 uppercase tracking-wider mb-8">MOMENTS WE'VE SHARED</h2>
        <div className="overflow-x-auto p-4 bg-dark rounded-2xl border border-border">
          <div className="min-w-[800px]">
            <GridBuilder sectionName="moments" initialLayout={momentsLayout} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-black border-b border-border pb-3 uppercase tracking-wider mb-8">JOIN THE CONVERSATION</h2>
        <div className="overflow-x-auto p-4 bg-dark rounded-2xl border border-border">
          <div className="min-w-[800px]">
            <GridBuilder sectionName="conversation" initialLayout={conversationLayout} />
          </div>
        </div>
      </div>
    </div>
  );
}
