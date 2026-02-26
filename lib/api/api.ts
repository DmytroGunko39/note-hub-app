import axios from 'axios';
import { useAuthStore } from '@/lib/store/authStore';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

if (!baseURL) {
  throw new Error('NEXT_PUBLIC_API_URL is missing in environment variables');
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle 401 errors by refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry for auth endpoints (prevents infinite loop)
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');

    // If 401, not an auth endpoint, and we haven't already tried to refresh
    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Call session endpoint to get new access token
        const refreshResponse = await api.get('/auth/session');
        const newToken = refreshResponse.data?.data?.accessToken;

        if (newToken) {
          // Update store with new token
          useAuthStore.getState().setAccessToken(newToken);
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth and reject
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
