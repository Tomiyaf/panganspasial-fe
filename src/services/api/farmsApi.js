import axiosClient from './axiosClient';

export const farmsApi = {
  // Public Farms List
  getPublicFarms: async (params = {}) => {
    // params: { page, limit, search, district_id, village_id, farm_category_id, farm_scale_id, livestock_type_id }
    return await axiosClient.get('/farms', { params });
  },

  // Public / Detail Farm
  getFarmDetail: async (id) => {
    return await axiosClient.get(`/farms/${id}`);
  },

  // Farm Livestock
  getFarmLivestock: async (farmId) => {
    return await axiosClient.get(`/farms/${farmId}/livestock`);
  },

  // Farm Photos
  getFarmPhotos: async (farmId) => {
    return await axiosClient.get(`/farms/${farmId}/photos`);
  },

  // Admin Farms List
  getAdminFarms: async (params = {}) => {
    // params: { page, limit, search, district_id, farm_category_id }
    return await axiosClient.get('/admin/farms', { params });
  },

  // Admin Create Farm
  createFarm: async (farmData) => {
    return await axiosClient.post('/admin/farms', farmData);
  },

  // Admin Get Farm For Edit
  getAdminFarmById: async (id) => {
    return await axiosClient.get(`/admin/farms/${id}`);
  },

  // Admin Update Farm
  updateFarm: async (id, farmData) => {
    return await axiosClient.patch(`/admin/farms/${id}`, farmData);
  },

  // Admin Delete Farm
  deleteFarm: async (id) => {
    return await axiosClient.delete(`/admin/farms/${id}`);
  },

  // Admin Add Livestock to Farm
  addLivestock: async (farmId, livestockData) => {
    // livestockData: { livestock_category_id, livestock_type_id, livestock_subtype_id, population }
    return await axiosClient.post(`/admin/farms/${farmId}/livestock`, livestockData);
  },

  // Admin Update Livestock
  updateLivestock: async (id, livestockData) => {
    return await axiosClient.patch(`/admin/livestock/${id}`, livestockData);
  },

  // Admin Delete Livestock
  deleteLivestock: async (id) => {
    return await axiosClient.delete(`/admin/livestock/${id}`);
  },

  // Admin Upload Photo (Multipart)
  uploadPhoto: async (farmId, formData) => {
    return await axiosClient.post(`/admin/farms/${farmId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Admin Update Photo Metadata (Primary, caption, order)
  updatePhoto: async (photoId, photoData) => {
    return await axiosClient.patch(`/admin/farm-photos/${photoId}`, photoData);
  },

  // Admin Delete Photo
  deletePhoto: async (photoId) => {
    return await axiosClient.delete(`/admin/farm-photos/${photoId}`);
  },
};

export default farmsApi;
