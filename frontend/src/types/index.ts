// Interfaces y Tipos Globales

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: 'SUPERADMIN' | 'OWNER' | 'STAFF';
  avatarUrl: string | null;
  tenantId: string | null;
  isActive: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isActive: boolean;
  settings: Record<string, unknown>;
}
