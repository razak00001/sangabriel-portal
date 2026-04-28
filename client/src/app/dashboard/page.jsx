'use client';

import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  Plus,
  ArrowRight,
  User as UserIcon,
  Calendar,
  Sparkles,
  Zap,
  TrendingUp,
  Activity as ActivityIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import { cn } from '../../utils/cn';

import StatsCard from '../../components/ui/StatsCard';
import ProjectListItem from '../../components/ui/ProjectListItem';
import ActivityFeed from '../../components/ui/ActivityFeed';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

/**
 * DashboardPage Component
 * Provides a high-level strategic overview of system activity and project performance.
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState({
    stats: [],
    recentProjects: [],
    activity: [],
    workload: [],
    archiveRequests: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const result = await dashboardService.getDashboardData();
        setData(result);
      } catch (error) {
        console.error('Master dashboard load failure:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const isAdmin = user?.role === 'Admin';
  const isPM = user?.role === 'Project Manager';

  return (
    <div className="fade-in max-w-[1600px] mx-auto">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-10 mb-12 sm:mb-20 animate-slide-up px-2 sm:px-0">
        <div className="space-y-3 sm:space-y-4 w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <div className="size-8 sm:size-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <Sparkles size={16} sm:size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Strategic Control Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-tight sm:leading-none">
            Welcome, {user?.name?.split(' ')[0] || 'Executive'}
            <span className="hidden sm:inline text-gray-200 mx-4 lg:mx-6 font-thin">|</span>
            <br className="sm:hidden" />
            <span className="text-indigo-600 drop-shadow-sm">{user?.role}</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-xl font-bold max-w-2xl leading-relaxed">
            Your portfolio is currently operating at <span className="text-gray-900">optimal efficiency</span>.
          </p>
        </div>
        
        {(isAdmin || isPM) && (
          <Button 
            variant="primary" 
            size="lg"
            icon={Plus}
            onClick={() => router.push('/dashboard/projects')}
            className="shadow-2xl shadow-indigo-600/30"
          >
            Initiate Project
          </Button>
        )}
      </header>

      {/* Primary Analytics Grid */}
      <section className="responsive-grid mb-12">
        {(loading ? Array(4).fill({}) : data.stats).map((stat, i) => (
          <StatsCard 
            key={stat.name || i}
            name={stat.name}
            value={stat.value}
            icon={
              stat.icon === 'FolderKanban' ? FolderKanban : 
              stat.icon === 'Clock' ? Clock : 
              stat.icon === 'CheckCircle2' ? CheckCircle2 : 
              stat.icon === 'MessageCircle' ? MessageCircle : ActivityIcon
            }
            color={stat.color}
            loading={loading}
            trend={stat.trend}
          />
        ))}
      </section>

      {/* Strategic Operational Heatmap */}
      {isAdmin && data.workload.length > 0 && (
        <Card variant="glass" className="mb-12 group overflow-hidden" padding="p-6 sm:p-10">
           <div className="absolute top-0 right-0 p-8 sm:p-12 text-gray-100 opacity-5 group-hover:opacity-20 transition-all duration-1000 scale-150">
             <TrendingUp size={100} sm:size={160} strokeWidth={3} />
           </div>
           
           <h2 className="text-[9px] sm:text-[11px] font-black mb-8 sm:mb-14 flex items-center gap-3 sm:gap-4 uppercase tracking-[0.3em] text-gray-400">
             <Zap size={14} sm:size={18} className="text-indigo-600 fill-indigo-600/10" />
             Portfolio Load Distribution
           </h2>
           
           <div className="flex gap-4 sm:gap-10 h-32 sm:h-48 items-end min-w-full overflow-x-auto custom-scrollbar pb-4 sm:pb-6">
              {data.workload.map((item, idx) => (
                <div key={idx} className="flex-1 relative group/bar min-w-[80px] sm:min-w-[100px]">
                    <div 
                      className="bg-indigo-600 rounded-[1.5rem] opacity-90 mb-6 transition-all duration-1000 shadow-xl shadow-indigo-600/20 group-hover/bar:scale-x-105 group-hover/bar:opacity-100 group-hover/bar:bg-indigo-500"
                      style={{ 
                        height: `${(item.count / Math.max(...data.workload.map(w => w.count))) * 100}%`
                      }}
                    >
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity font-black">
                         {item.count}
                       </div>
                    </div>
                    <div className="text-center">
                      <span className="text-[11px] font-black uppercase text-gray-900 truncate block mb-1.5">{item._id}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Units</span>
                    </div>
                </div>
              ))}
           </div>
        </Card>
      )}

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Project Intelligence Feed */}
        <Card variant="glass" className="lg:col-span-2">
          <div className="flex justify-between items-center mb-14">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl">
                <FolderKanban size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.25em] text-gray-900">
                {user?.role === 'Customer' ? 'Your Engagements' : 'Strategic Portfolio'}
              </h2>
            </div>
            <Link href="/dashboard/projects" className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-3 hover:gap-6 transition-all group/link">
              Full Spectrum Analysis <ArrowRight size={16} strokeWidth={3} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => <div key={i} className="h-24 w-full bg-gray-50 animate-pulse rounded-3xl" />)}
            </div>
          ) : data.recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {data.recentProjects.map(project => (
                <ProjectListItem 
                  key={project._id} 
                  project={project} 
                  onClick={() => router.push(`/dashboard/projects/view?id=${project._id}`)}
                  className="hover:scale-[1.01] active:scale-100"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
              <FolderKanban size={48} className="text-gray-200 mb-6 mx-auto" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">No active project data found</p>
            </div>
          )}
        </Card>

        {/* Global Communication Stream */}
        <Card variant="glass" className="lg:col-span-1">
          <div className="flex items-center gap-4 mb-14">
            <div className="size-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <ActivityIcon size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.25em] text-gray-900">Collaboration</h2>
          </div>
          <ActivityFeed activities={data.activity} loading={loading} />
        </Card>
      </div>
    </div>
  );
}
