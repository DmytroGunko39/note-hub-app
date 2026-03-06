'use client';

import { refreshSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [isInitialized, setIsInitialized] = useState(false);
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
      } finally {
        // Mark as initialized regardless of success/failure
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [setAccessToken, setUser, clearAuth]);

  // Show loading state while auth initializes
  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e9ecef',
            borderTop: '4px solid #0d6efd',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
