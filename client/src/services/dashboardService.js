import api from '../utils/api';

export const dashboardService = {
  /**
   * Fetch all dashboard data (stats, recent projects, activity)
   */
  getDashboardData: async () => {
    const [statsRes, projectsRes, activityRes] = await Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/recent-projects'),
      api.get('/dashboard/activity')
    ]);
    
    return {
      stats: statsRes.data,
      recentProjects: projectsRes.data,
      activity: activityRes.data
    };
  }
};
