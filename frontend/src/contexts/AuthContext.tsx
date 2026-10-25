'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authHelper } from '@/src/libs/helper';
import { UserProfile, authAPI } from '@/src/services/auth.api';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: UserProfile) => void;
  logout: () => Promise<void>;
  updateUser: (userData: UserProfile) => void;
  hoveredItem: string | null;
  setHoveredItem: (item: string | null) => void;
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
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = authHelper.getToken();
    const userData = authHelper.getUserData();
    
    if (token && userData) {
      setUser(userData);
    }
    
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: UserProfile) => {
    authHelper.setToken(token);
    authHelper.setUserData(userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Call the logout API first
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local storage and user state
      authHelper.logout();
      setUser(null);
    }
  };

  const updateUser = (userData: UserProfile) => {
    authHelper.setUserData(userData);
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    hoveredItem,
    setHoveredItem,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



