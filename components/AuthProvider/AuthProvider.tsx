'use client';

import { refreshSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get accessToken from session endpoint
        const sessionData = await refreshSession();

        if (sessionData?.accessToken) {
          // Store accessToken in Zustand (will be used by Axios interceptor)
          setAccessToken(sessionData.accessToken);

          // Fetch user data with the new token
          const user = await getMe();
          if (user) {
            setUser(user);
          }
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        clearAuth();
      }
    };

    initAuth();
  }, [setAccessToken, setUser, clearAuth]);

  return children;
};

export default AuthProvider;
