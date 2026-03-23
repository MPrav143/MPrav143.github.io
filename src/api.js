import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://portfoliobackend-hnac.onrender.com/api',
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('auth-token');
        if (token) {
            config.headers['auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
