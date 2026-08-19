import axiosClient from './axiosClient';

export const masterApi = {
  // Farm Categories
  getFarmCategories: async () => {
    return await axiosClient.get('/farm-categories');
  },

  // Admin Create Farm Category
  createFarmCategory: async (data) => {
    return await axiosClient.post('/admin/farm-categories', data);
  },

  // Farm Scales
  getFarmScales: async () => {
    return await axiosClient.get('/farm-scales');
  },

  // Livestock Taxonomy Categories (Ruminansia Besar, Kecil, Unggas)
  getLivestockCategories: async () => {
    return await axiosClient.get('/livestock-categories');
  },

  // Livestock Types (Sapi Potong, Sapi Perah, Kambing, etc.)
  getLivestockTypes: async (params = {}) => {
    // params: { category_id }
    return await axiosClient.get('/livestock-types', { params });
  },

  // Livestock Subtypes / Breeds (Limousin, Simental, etc.)
  getLivestockSubtypes: async (params = {}) => {
    // params: { type_id }
    return await axiosClient.get('/livestock-subtypes', { params });
  },
};

export default masterApi;
