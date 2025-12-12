// API Configuration Service

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        refresh: '/api/auth/refresh',
    },
    users: {
        me: '/api/users/me',
        update: '/api/users/me',
        getById: (id: string) => `/api/users/${id}`,
    },
    email: {
        send: '/api/send-email',
    },
};

export const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};
