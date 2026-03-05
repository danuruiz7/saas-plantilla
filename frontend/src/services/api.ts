import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/authStore';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Petición: Añadir JWT
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Respuesta: Manejo de 401 y Refresco de Token
interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: Error | AxiosError | null) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si el error es 401 y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      try {
        // Intentar refrescar el token
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        
        useAuthStore.getState().updateToken(newToken, newRefreshToken);
        
        processQueue(null, newToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        const err = refreshError as Error | AxiosError;
        processQueue(err, null);
        // Si el refresco falla, cerramos sesión
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
