import api from '../utils/api';

export const dashboardService = {
  /**
   * Fetch all dashboard data (stats, recent projects, activity)
   */
  getDashboardData: async () => {
    const [statsRes, projectsRes, activityRes, workloadRes, archiveRes] = await Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/recent-projects'),
      api.get('/dashboard/activity'),
      api.get('/reports/workload').catch(() => ({ data: { data: [] } })),
      api.get('/dashboard/archive-requests').catch(() => ({ data: { data: [] } }))
    ]);
    
    return {
      stats: statsRes.data.data || [],
      recentProjects: projectsRes.data.data || [],
      activity: activityRes.data.data || [],
      workload: workloadRes.data.data || [],
      archiveRequests: archiveRes.data.data || []
    };
  }
};
