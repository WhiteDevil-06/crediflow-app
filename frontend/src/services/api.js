import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://crediflow-app.onrender.com',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('unlox_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-redirect to login on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('unlox_token');
            localStorage.removeItem('unlox_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const authAPI = {
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
    getMe: () => api.get('/api/auth/me'),
};

// Customers
export const customerAPI = {
    getAll: () => api.get('/api/customers'),
    getOne: (id) => api.get(`/api/customers/${id}`),
    create: (data) => api.post('/api/customers', data),
    update: (id, d) => api.put(`/api/customers/${id}`, d),
    remove: (id) => api.delete(`/api/customers/${id}`),
};

// Loans
export const loanAPI = {
    getAll: () => api.get('/api/loans'),
    getOne: (id) => api.get(`/api/loans/${id}`),
    create: (data) => api.post('/api/loans', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, d) => api.put(`/api/loans/${id}`, d),
    remove: (id) => api.delete(`/api/loans/${id}`),
};

// Payments
export const paymentAPI = {
    record: (data) => api.post('/api/payments', data),
    getByLoan: (loanId) => api.get(`/api/payments/${loanId}`),
};

// Dashboard
export const dashboardAPI = {
    getSummary: () => api.get('/api/dashboard/summary'),
};

export default api;
