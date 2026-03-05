import { api } from "./api";

export interface PublicTenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  settings: {
    primaryColor?: string;
    description?: string;
    address?: string;
    phone?: string;
    [key: string]: unknown;
  };
}

export const publicService = {
  getTenantBySlug: async (slug: string): Promise<PublicTenant> => {
    const response = await api.get<PublicTenant>(`/tenants/public/${slug}`);
    return response.data;
  },
};
