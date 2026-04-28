import api from '../utils/api';

export const sectionService = {
  /**
   * Fetch layout for a specific section
   * @param {string} sectionName 
   */
  getLayout: async (sectionName) => {
    const { data } = await api.get(`/sections/${sectionName}`);
    return data;
  },

  /**
   * Save layout for a specific section
   * @param {string} sectionName 
   * @param {Array} layout 
   */
  saveLayout: async (sectionName, layout) => {
    const { data } = await api.post(`/sections/${sectionName}/save`, { layout });
    return data;
  },

  /**
   * Upload image to section
   * @param {FormData} formData 
   */
  uploadImage: async (formData) => {
    const { data } = await api.post('/sections/upload', formData);
    return data;
  }
};
