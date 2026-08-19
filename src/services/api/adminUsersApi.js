import axiosClient from './axiosClient';

export const adminUsersApi = {
  // Admin: Dashboard Overview KPI Summary
  getDashboardSummary: async () => {
    return await axiosClient.get('/admin/dashboard/summary');
  },

  // Admin: Get Users List
  getUsers: async () => {
    return await axiosClient.get('/admin/users');
  },

  // Admin: Create User
  createUser: async (userData) => {
    // userData: { name, email, password, role_id }
    return await axiosClient.post('/admin/users', userData);
  },

  // Admin: Update User
  updateUser: async (id, userData) => {
    // userData: { name, email, password, is_active, role_id }
    return await axiosClient.patch(`/admin/users/${id}`, userData);
  },

  // Admin: Delete User
  deleteUser: async (id) => {
    return await axiosClient.delete(`/admin/users/${id}`);
  },
};

export default adminUsersApi;
