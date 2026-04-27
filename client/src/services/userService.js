import api from '../utils/api';

export const userService = {
  // Get all users or filter by role
  getUsers: async (role = null) => {
    const url = role ? `/users?role=${role}` : '/users';
    const { data } = await api.get(url);
    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  // Get user statistics
  getUserStats: async () => {
    const { data } = await api.get('/users/stats');
    return data;
  },

  // Get single user by ID
  getUserById: async (userId) => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },

  // Create new user
  createUser: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const { data } = await api.patch(`/users/${userId}`, userData);
    return data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },

  // Toggle user status (Active/Inactive)
  toggleUserStatus: async (userId) => {
    const { data } = await api.patch(`/users/${userId}/toggle-status`);
    return data;
  },

  // Get users by role
  getUsersByRole: async (role) => {
    const { data } = await api.get(`/users?role=${role}`);
    return data;
  },

  // Get all admins
  getAdmins: async () => {
    return userService.getUsersByRole('Admin');
  },

  // Get all project managers
  getProjectManagers: async () => {
    return userService.getUsersByRole('Project Manager');
  },

  // Get all designers
  getDesigners: async () => {
    return userService.getUsersByRole('Designer');
  },

  // Get all installers
  getInstallers: async () => {
    return userService.getUsersByRole('Installer');
  },

  // Get all customers
  getCustomers: async () => {
    return userService.getUsersByRole('Customer');
  },

  // Get all accounting users
  getAccountingUsers: async () => {
    return userService.getUsersByRole('Accounting');
  }
};
