'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/src/types/auth';
import { authUtils } from '@/src/utils/auth';
import { authAPI } from '@/src/services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = authUtils.getAuthToken();
      const userData = authUtils.getUser();

      if (token && userData) {
        // Check if token is expired
        if (authUtils.isTokenExpired(token)) {
          // Try to refresh token
          const refreshSuccess = await refreshToken();
          if (!refreshSuccess) {
            authUtils.logout();
            setUser(null);
          } else {
            setUser(userData);
          }
        } else {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      authUtils.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authAPI.login({ email, password, userType: 'ADMIN' });

      // Store tokens and user data
      authUtils.setTokens(response.userSession.authToken, response.userSession.refreshToken);
      authUtils.setUser(response);
      setUser(response);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authUtils.logout();
    setUser(null);
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenValue = authUtils.getRefreshToken();
      if (!refreshTokenValue) {
        return false;
      }

      const response = await authAPI.refreshToken(refreshTokenValue);

      // Update tokens
      authUtils.updateTokens(response.newSession);

      // Update user session in state
      if (user) {
        const updatedUser = { ...user, userSession: response.newSession };
        setUser(updatedUser);
        authUtils.setUser(updatedUser);
      }

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
