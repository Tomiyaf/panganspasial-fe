import axiosClient from './axiosClient';

export const statisticsApi = {
  // Main KPI Overview, Category distribution & Scale distribution
  getOverview: async (params = {}) => {
    // params: { district_id, farm_category_id, farm_scale_id }
    return await axiosClient.get('/statistics/overview', { params });
  },

  // District-level Farm and Population Statistics
  getFarmsStats: async () => {
    return await axiosClient.get('/statistics/farms');
  },

  // Commodity / Livestock Population Statistics
  getLivestockStats: async (params = {}) => {
    // params: { district_id }
    return await axiosClient.get('/statistics/livestock', { params });
  },
};

export default statisticsApi;
