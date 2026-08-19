import axiosClient from './axiosClient';

export const validationsApi = {
  // Admin: Get Validations History and Queue
  getValidations: async (params = {}) => {
    // params: { status: 'pending'|'valid'|'rejected', entity_type: 'farm'|'livestock', page, limit }
    return await axiosClient.get('/admin/validations', { params });
  },

  // Admin: Create New Validation Record
  createValidation: async (validationData) => {
    // validationData: { entity_type, entity_id, status, notes }
    return await axiosClient.post('/admin/validations', validationData);
  },

  // Admin: Update Validation Status (Approve / Reject / Pending with notes)
  updateValidationStatus: async (id, data) => {
    // data: { status: 'pending'|'valid'|'rejected', notes }
    return await axiosClient.patch(`/admin/validations/${id}`, data);
  },
};

export default validationsApi;
