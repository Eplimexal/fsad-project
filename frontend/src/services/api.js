import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  async getMe() {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

export const loanApi = {
  async getDashboardData() {
    const [loans, offers, applications] = await Promise.all([
      api.get('/loans'),
      api.get('/offers'),
      api.get('/applications'),
    ]);

    return {
      loans: loans.data,
      loanOffers: offers.data,
      applications: applications.data,
    };
  },

  async createLoanOffer(payload) {
    const { data } = await api.post('/offers', payload);
    return data;
  },

  async createLoanApplication(payload) {
    const { data } = await api.post('/applications', payload);
    return data;
  },

  async approveLoan(applicationId) {
    const { data } = await api.put(`/applications/${applicationId}/approve`);
    return data;
  },

  async rejectApplication(applicationId) {
    const { data } = await api.put(`/applications/${applicationId}/reject`);
    return data;
  },

  async addPayment(loanId, payment) {
    const { data } = await api.post(`/loans/${loanId}/payments`, payment);
    return data;
  },
};

export default api;
