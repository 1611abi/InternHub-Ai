import api from './api'; // reuse the existing authenticated axios instance

const careervaultApi = {
    // Public
    getResources: (params) => api.get('/careervault/resources', { params }),
    getResource: (id) => api.get(`/careervault/resources/${id}`),
    search: (q) => api.get('/careervault/search', { params: { q } }),
    getByField: (field) => api.get(`/careervault/field/${field}`),

    // Protected
    createResource: (formData) => api.post('/careervault/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' } // Important for file uploads
    }),
    updateResource: (id, data) => api.put(`/careervault/resources/${id}`, data),
    deleteResource: (id) => api.delete(`/careervault/resources/${id}`),
    upvote: (id) => api.post(`/careervault/resources/${id}/upvote`),
    save: (id) => api.post(`/careervault/resources/${id}/save`),
    rate: (id, value) => api.post(`/careervault/resources/${id}/rate`, { value }),
    report: (id, reason) => api.post(`/careervault/resources/${id}/report`, { reason }),

    // Folders
    getFolders: () => api.get('/careervault/folders'),
    getFolder: (id) => api.get(`/careervault/folders/${id}`),
    createFolder: (data) => api.post('/careervault/folders', data),

    // Admin
    getPending: () => api.get('/careervault/admin/pending'),
    approve: (id) => api.put(`/careervault/admin/approve/${id}`),
    reject: (id) => api.put(`/careervault/admin/reject/${id}`)
};

export default careervaultApi;
