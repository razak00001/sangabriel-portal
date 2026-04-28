'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Layout, Image as ImageIcon, Save, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import GridBuilder from '../../../components/GridBuilder';
import { sectionService } from '../../../services/sectionService';
import Card from '../../../components/ui/Card';
import StatsCard from '../../../components/ui/StatsCard';

/**
 * EventsAdminPage Component
 * Orchestrates the dynamic image grids for the public events portal.
 */
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
        setError('Strategic sync failure. Ensure the orchestration server is operational.');
      } finally {
        setLoading(false);
      }
    };

    fetchLayouts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] animate-pulse">
        <div className="size-16 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6">
          <RefreshCw size={32} className="text-indigo-600 animate-spin" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Synchronizing Visual Assets</p>
      </div>
    );
  }

  return (
    <div className="fade-in max-w-[1600px] mx-auto">
      {/* Header Architecture */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20 animate-slide-up">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <Sparkles size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Visual Orchestration</span>
          </div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none">
            Events Management
          </h1>
          <p className="text-gray-400 text-xl font-bold max-w-2xl leading-relaxed">
            Configure dynamic image grids and <span className="text-gray-900">visual narratives</span> for the public events gateway.
          </p>
        </div>
      </header>

      {error && (
        <Card variant="glass" className="mb-12 border-red-100 bg-red-50/30">
          <div className="flex items-center gap-4 text-red-600">
            <AlertCircle size={24} />
            <p className="text-sm font-black uppercase tracking-widest">{error}</p>
          </div>
        </Card>
      )}

      {/* Strategic Insights */}
      <section className="responsive-grid mb-20">
        <StatsCard 
          name="Moment Assets" 
          value={momentsLayout.length} 
          icon={ImageIcon} 
          color="bg-indigo-600" 
          trend="Live Distribution"
        />
        <StatsCard 
          name="Connectivity" 
          value="100%" 
          icon={RefreshCw} 
          color="bg-emerald-600" 
          trend="Stable Sync"
        />
        <StatsCard 
          name="Layout Nodes" 
          value={momentsLayout.length + conversationLayout.length} 
          icon={Layers} 
          color="bg-slate-900" 
          trend="Orchestrated"
        />
      </section>

      {/* Grid Orchestration Sections */}
      <div className="space-y-24">
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="size-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900">
              <Layout size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900">Moments We've Shared</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Primary Grid Configuration</p>
            </div>
          </div>
          
          <Card variant="glass" className="p-0 overflow-hidden border-indigo-100/50 shadow-2xl shadow-indigo-500/5">
            <div className="bg-gray-50/50 p-2 border-b border-gray-100 flex items-center justify-between px-6">
               <div className="flex items-center gap-2">
                 <div className="size-2 rounded-full bg-emerald-500"></div>
                 <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Interactive Preview Mode</span>
               </div>
            </div>
            <div className="p-8">
              <GridBuilder sectionName="moments" initialLayout={momentsLayout} />
            </div>
          </Card>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="size-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900">Join The Conversation</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Secondary Asset Flow</p>
            </div>
          </div>
          
          <Card variant="glass" className="p-0 overflow-hidden border-slate-100/50">
            <div className="bg-gray-50/50 p-2 border-b border-gray-100 flex items-center justify-between px-6">
               <div className="flex items-center gap-2">
                 <div className="size-2 rounded-full bg-indigo-500"></div>
                 <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Asset Management Module</span>
               </div>
            </div>
            <div className="p-8">
              <GridBuilder sectionName="conversation" initialLayout={conversationLayout} />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
