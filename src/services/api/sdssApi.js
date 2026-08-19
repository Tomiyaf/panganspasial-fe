import axiosClient from './axiosClient';

export const sdssApi = {
  // Public SDSS SAW Recommendations Ranking
  getPublicRecommendations: async () => {
    return await axiosClient.get('/recommendations');
  },

  // Admin: Get SDSS Criteria
  getCriteria: async () => {
    return await axiosClient.get('/admin/sdss/criteria');
  },

  // Admin: Add New Criterion
  createCriterion: async (criterionData) => {
    // criterionData: { name, description, criteria_type: 'benefit'|'cost', weight, is_active }
    return await axiosClient.post('/admin/sdss/criteria', criterionData);
  },

  // Admin: Update Criterion
  updateCriterion: async (id, criterionData) => {
    return await axiosClient.patch(`/admin/sdss/criteria/${id}`, criterionData);
  },

  // Admin: Delete Criterion
  deleteCriterion: async (id) => {
    return await axiosClient.delete(`/admin/sdss/criteria/${id}`);
  },

  // Admin: Recalculate and persist SDSS SAW results to database
  calculateSDSS: async () => {
    return await axiosClient.post('/admin/recommendations/calculate');
  },
};

export default sdssApi;
