import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenResponse, 
  Calculator, 
  CalculatorRequest,
  ApiError 
} from '@/src/types/auth';
import { authUtils } from '@/src/utils/auth';

const API_BASE_URL = typeof window === 'undefined'
  ? process.env.NEXT_API_ENDPOINT || 'http://localhost:1631'
  : '/api';

// Browser calls use the Next.js proxy, including token refresh.
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = authUtils.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = authUtils.getRefreshToken();
        if (refreshToken) {
          const response = await refreshAuthToken(refreshToken);
          authUtils.updateTokens(response.newSession);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.newSession.authToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        authUtils.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const response: AxiosResponse<RefreshTokenResponse> = await api.post(
        '/auth/refresh-token',
        {},
        {
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Calculator API functions
export const calculatorAPI = {
  editCalculator: async (data: CalculatorRequest): Promise<Calculator> => {
    try {
      const response: AxiosResponse<Calculator> = await api.post('/calculator/edit-calculator', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCalculators: async (): Promise<Calculator[]> => {
    try {
      const response: AxiosResponse<Calculator[]> = await api.get('/calculator/calculator');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Upload API functions
export const uploadAPI = {
  getPresignedUrl: async (fileName: string, fileType: 'IMAGE' | 'VIDEO' | 'FILE', resourceType: 'JEWELLERY' | 'DIAMOND' | 'USER' | 'OTHER'): Promise<{ preSignedUrl: string; outPutUrl: string }> => {
    try {
      const response: AxiosResponse<{ preSignedUrl: string; outPutUrl: string }> = await api.get('/upload/presinged-url', {
        params: {
          fileName,
          fileType,
          resourceType,
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  uploadToS3: async (preSignedUrl: string, file: File): Promise<void> => {
    try {
      await axios.put(preSignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteFile: async (fileName: string, fileType: 'IMAGE' | 'VIDEO', resourceType: 'JEWELLERY' | 'DIAMOND' | 'USER' | 'OTHER'): Promise<void> => {
    try {
      await api.delete('/upload/delete-file', {
        params: {
          fileName,
          fileType,
          resourceType,
        },
      });
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Dynamic Section API functions
export const dynamicSectionAPI = {
  createSectionImage: async (image: string, imageType: string, mediaType: string): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await api.post('/dynamic/section-image', {
        image,
        imageType,
        mediaType,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getSectionImages: async (): Promise<any[]> => {
    try {
      const response: AxiosResponse<any[]> = await api.get('/dynamic/section-image');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Helper function for refresh token (used in interceptor)
const refreshAuthToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
    `${API_BASE_URL}/auth/refresh-token`,
    {},
    {
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

// Error handler
const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const status = error.response?.status;
    return { message, status };
  }
  return { message: 'An unexpected error occurred' };
};

export default api;
