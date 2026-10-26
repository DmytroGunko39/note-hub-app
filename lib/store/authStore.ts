import { User } from '@/types/user';
import { create } from 'zustand';

type AuthStore = {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  setUser: (user: User) => void;
  setAccessToken: (token: string | null) => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setInitialized: (value: boolean) => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  accessToken: null,
  setUser: (user: User) => set({ isAuthenticated: true, user }),
  setAccessToken: (token: string | null) => set({ accessToken: token }),
  setAuth: (user: User, token: string) =>
    set({ isAuthenticated: true, user, accessToken: token }),
  clearAuth: () =>
    set({ isAuthenticated: false, user: null, accessToken: null }),
  setInitialized: (value: boolean) => set({ isInitialized: value }),
}));
