import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Cliente público (para rutas sin autenticación como login/register)
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cliente privado (para dashboard, acciones protegidas)
export const apiPrivate = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Inyector de JWT
apiPrivate.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Manejo de tokens expirados en respuestas 401
apiPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const { refreshToken, clearAuth, updateToken } = useAuthStore.getState();

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiPrivate(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (!refreshToken) throw new Error('No refresh token available');

        // Intentar actualizar el token
        const { data } = await api.post('/auth/refresh', {
          token: refreshToken
        });

        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken; // (si el backend lo repone)

        updateToken(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiPrivate(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth(); // Limpiar el estado de autenticación completamente
        
        // Desconectar al usuario forzando redirección sin router desde CSR si procede
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'; 
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
