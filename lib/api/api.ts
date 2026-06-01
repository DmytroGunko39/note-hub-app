import axios, { AxiosError, AxiosResponse } from 'axios';
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

// Helper: Check if URL is a session/refresh endpoint
const isSessionEndpoint = (url?: string): boolean => {
  return url?.includes('/auth/session') ?? false;
};

// Helper: Check if URL is any auth endpoint (login, register, logout, etc.)
const isAuthEndpoint = (url?: string): boolean => {
  return url?.includes('/auth/') ?? false;
};

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

// Response interceptor: production-safe 401 handling
api.interceptors.response.use(
  // Success handler - pass through
  (response: AxiosResponse) => response,

  // Error handler
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // CASE 1: 401 from /auth/session
    // This is EXPECTED when user is not logged in
    // Return resolved promise with null data (not an error)
    if (status === 401 && isSessionEndpoint(originalRequest?.url)) {
      // Return a "successful" response with null data
      // This prevents console error pollution
      return Promise.resolve({
        data: { data: null },
        status: 401,
        statusText: 'Unauthorized',
        headers: error.response?.headers ?? {},
        config: originalRequest,
      } as AxiosResponse);
    }

    // CASE 2: 401 from protected endpoint (not auth)
    // Try to refresh token, if fails -> clear auth

    if (
      status === 401 &&
      !isAuthEndpoint(originalRequest?.url) &&
      !(originalRequest as typeof originalRequest & { _retry?: boolean })
        ?._retry
    ) {
      (
        originalRequest as typeof originalRequest & { _retry?: boolean }
      )._retry = true;

      try {
        // Attempt to refresh session
        const refreshResponse = await api.get('/auth/session');
        const newToken = refreshResponse.data?.data?.accessToken;

        if (newToken) {
          // Update store with new token
          useAuthStore.getState().setAccessToken(newToken);

          // Retry original request with new token
          if (originalRequest) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
      } catch {
        // Refresh failed - clear auth state
        useAuthStore.getState().clearAuth();
      }

      // If we get here, refresh failed or no token returned
      // Clear auth and reject (will trigger redirect in components)
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }
    // CASE 3: 401 from other auth endpoints (login, register)
    // These are real auth failures - reject normally

    if (status === 401 && isAuthEndpoint(originalRequest?.url)) {
      return Promise.reject(error);
    }

    // CASE 4: Other errors (500, 403, network errors)
    // Log and reject - these are real problems

    if (status && status >= 500) {
      console.error(`[API Error] ${status}:`, error.response?.data);
    }

    return Promise.reject(error);
  },
);
