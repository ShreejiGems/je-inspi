import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Browser calls stay on the website origin; Next.js forwards them to Nest.
const API_BASE_URL = typeof window === 'undefined'
  ? process.env.NEXT_API_ENDPOINT || 'http://localhost:1631'
  : '/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export const apiHelper = {
  // GET request
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Auth helper methods
export const authHelper = {
  // Set auth token
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  // Get auth token
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  // Remove auth token
  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  // Set user data
  setUserData: (userData: any) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  },

  // Get user data
  getUserData: (): any => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData && userData !== 'undefined' && userData !== 'null') {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          localStorage.removeItem('userData');
          return null;
        }
      }
      return null;
    }
    return null;
  },

  // Remove user data
  removeUserData: () => {
    localStorage.removeItem('userData');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },
};

// Utility helper methods
export const utilityHelper = {
  // Format error message
  formatErrorMessage: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Something went wrong. Please try again.';
  },

  // Validate email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  isStrongPassword: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  // Format phone number
  formatPhoneNumber: (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },
};
