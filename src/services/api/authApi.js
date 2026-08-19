import axiosClient from './axiosClient';

export const authApi = {
  login: async (credentials) => {
    // credentials: { email, password }
    const response = await axiosClient.post('/auth/login', credentials);
    return response; // { success, message, data: { token, user } }
  },

  getProfile: async () => {
    const response = await axiosClient.get('/auth/me');
    return response; // { success, message, data: user }
  },
};

export default authApi;
