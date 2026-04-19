import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://internhub-ai-dx1i.onrender.com/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// ─── Internships ───
export const searchInternships = (domain) => api.get(`/internships?domain=${domain}`);
export const saveInternship = (data) => api.post('/internships/save', data);
export const getSavedInternships = () => api.get('/internships/saved');

// ─── Platform Jobs ───
export const getPlatformJobs = () => api.get('/jobs');
export const applyForJob = (jobId, data) => api.post(`/jobs/apply/${jobId}`, data);
export const recommendJobs = (formData) => api.post('/jobs/recommend', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

// ─── AI Tools ───
export const optimizeResume = (data) => api.post('/ai/optimize-resume', data);
export const analyzeSkillGap = (data) => api.post('/ai/skill-gap', data);
export const chatWithAI = (message, history) => api.post('/ai/chat', { message, history });
export const downloadResume = (data) => api.post('/ai/download-resume', data, { responseType: 'blob' });

// ─── Industry ML Models ───
export const scoreResume = (formData) => api.post('/ats', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const analyzeSkillGapNew = (formData) => api.post('/ats/skill-gap', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// ─── Resume Builder ───
export const enhanceWithAI = (section, text) => api.post('/resume/ai-enhance', { section, text });

// ─── Conversations (ChatGPT-style) ───
export const getConversations = () => api.get('/conversations');
export const getConversation = (id) => api.get(`/conversations/${id}`);
export const createConversation = (message) => api.post('/conversations', { message });
export const sendMessage = (id, message) => api.post(`/conversations/${id}/messages`, { message });
export const deleteConversation = (id) => api.delete(`/conversations/${id}`);
export const updateConversationTitle = (id, title) => api.patch(`/conversations/${id}`, { title });

export default api;
