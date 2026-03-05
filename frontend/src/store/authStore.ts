import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types'; 

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (token: string, refreshToken: string, user: User) => void;
  clearAuth: () => void;
  updateToken: (token: string, refreshToken?: string) => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      setAuth: (token, refreshToken, user) => set({ token, refreshToken, user }),
      clearAuth: () => set({ token: null, refreshToken: null, user: null }),
      updateToken: (token, refreshToken) => 
        set((state) => ({ 
          token, 
          refreshToken: refreshToken || state.refreshToken 
        })),
      updateUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : null,
        })),
    }),
    {
      name: 'auth-storage', // key in local storage
    }
  )
);
