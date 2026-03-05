import { api } from './api';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: 'free' | 'pro' | 'enterprise';
  isActive: boolean;
  settings: Record<string, unknown>;
}

export interface UpdateTenantInput {
  name?: string;
  logoUrl?: string;
  settings?: Record<string, unknown>;
}

export const tenantService = {
  getMyTenant: async (): Promise<Tenant> => {
    const response = await api.get<Tenant>('/tenants/me');
    return response.data;
  },
  updateMyTenant: async (data: UpdateTenantInput): Promise<Tenant> => {
    const response = await api.patch<Tenant>('/tenants/me', data);
    return response.data;
  },
  inviteMember: async (tenantId: string, email: string, role: 'STAFF' | 'OWNER'): Promise<void> => {
    await api.post(`/tenants/${tenantId}/invitations`, { email, role });
  },
};
