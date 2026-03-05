import { apiPrivate } from '@/lib/axios';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'STAFF' | 'SUPERADMIN';
  isActive: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const userService = {
  getUsers: async (page: number = 1, limit: number = 10, search?: string, role?: string, status?: string) => {
    const { data } = await apiPrivate.get<PaginatedResponse<User>>('/users', {
      params: { page, limit, search, role, status }
    });
    console.log("DATA USERS-->",data);
    return data;
  },

  updateProfile: async (payload: { name?: string; avatarUrl?: string }) => {
    const { data } = await apiPrivate.patch<User>('/users/me', payload);
    return data;
  },

  activateUser: async (id: string) => {
    const { data } = await apiPrivate.patch(`/users/${id}/activate`);
    return data;
  },

  deactivateUser: async (id: string) => {
    const { data } = await apiPrivate.patch(`/users/${id}/deactivate`);
    return data;
  },

  deleteUser: async (id: string) => {
    const { data } = await apiPrivate.delete(`/users/${id}`);
    return data;
  },
};
