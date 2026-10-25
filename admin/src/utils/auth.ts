import { UserSession, User } from '@/src/types/auth';

const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const authUtils = {
  // Token management
  setTokens: (authToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  getAuthToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },

  removeTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  // User management
  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getAuthToken();
  },

  // Check if token is expired (basic check - tokens expire in 1 hour)
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true; // If we can't parse the token, consider it expired
    }
  },

  // Update tokens from refresh response
  updateTokens: (newSession: UserSession) => {
    authUtils.setTokens(newSession.authToken, newSession.refreshToken);
    
    // Update user session in stored user data
    const user = authUtils.getUser();
    if (user) {
      user.userSession = newSession;
      authUtils.setUser(user);
    }
  },

  // Clear all auth data
  logout: () => {
    authUtils.removeTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
};
