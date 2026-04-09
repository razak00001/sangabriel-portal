import api from '../utils/api';

export const userService = {
  // Get all users
  getUsers: async () => {
    const { data } = await api.get('/users');
    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
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

  // Get users by role
  getUsersByRole: async (role) => {
    const { data } = await api.get(`/users?role=${role}`);
    return data;
  }
};
