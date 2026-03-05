import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';

export function useAuth() {
  const router = useRouter();
  
  // Extraemos estado de Zustand
  const { user, token, setAuth, clearAuth } = useAuthStore();
  
  // Para evitar errores de hidratación de SSR, verificamos que el store se montó
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    setAuth(accessToken, refreshToken, userData);
    
    // Redirigir según el rol del usuario
    if (userData.role === 'OWNER') {
      router.push('/dashboard/admin');
    } else if (userData.role === 'STAFF') {
      router.push('/dashboard/staff');
    } else if (userData.role === 'SUPERADMIN') {
      router.push('/dashboard/root');
    } else {
      router.push('/settings/profile');
    }
  };

  const logout = () => {
    clearAuth();
    router.push('/auth/login');
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    isHydrated,
    role: user?.role || null,
    tenantId: user?.tenantId || null,
    login,
    logout
  };
}
