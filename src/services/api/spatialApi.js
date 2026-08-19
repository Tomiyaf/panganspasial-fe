import axiosClient from './axiosClient';

export const spatialApi = {
  // Raw GeoJSON FeatureCollection of Farms (Point features)
  getFarmsGeoJSON: async (params = {}) => {
    // params: { bbox, district_id, village_id, farm_category_id, farm_scale_id, livestock_type_id, search }
    return await axiosClient.get('/spatial/farms', { params });
  },

  // Raw GeoJSON FeatureCollection of District boundaries (Polygon features)
  getDistrictsGeoJSON: async () => {
    return await axiosClient.get('/spatial/districts');
  },

  // Raw GeoJSON FeatureCollection of Village boundaries
  getVillagesGeoJSON: async (params = {}) => {
    // params: { district_id }
    return await axiosClient.get('/spatial/villages', { params });
  },

  // Spatial Detail for a District
  getDistrictSpatialDetail: async (id) => {
    return await axiosClient.get(`/spatial/districts/${id}`);
  },

  // Heatmap points with calculated weights
  getHeatmapData: async (params = {}) => {
    // params: { district_id, farm_category_id }
    return await axiosClient.get('/heatmap', { params });
  },
};

export default spatialApi;
