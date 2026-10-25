import api from "../api";

// User list response interface
export interface UserListResponse {
  data: User[];
  total: number;
  skip: number;
  take: number;
}

// User interface (extending from auth types)
export interface User {
  id: string;
  isVerified: boolean;
  email: string;
  companyName: string | null;
  firstName: string | null;
  lastName: string | null;
  countryCode: string | null;
  mobile: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  companyNumber: string | null;
  registrationCopyImage: string | null;
  registrationCopyType: string | null;
  bussinessType: string | null;
  userType: string;
  paymentMode: string;
  paymentCycle: string | null;
  discount: number;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  verficationType: string;
  title: string;
  password: string | any;
  referenceDetails?: UserReferenceDetails | null;
}

// User reference details interface
export interface UserReferenceDetails {
  id: string;
  userId: string;
  companyName: string | null;
  contactPersonName: string | null;
  email: string | null;
  countryCode: string | null;
  mobile: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// User list query parameters
export interface UserListParams {
  skip?: number;
  take?: number;
  orderBy?: string[] | string;
  include?: string[] | string;
  search_column?: string[];
  search?: string;
}

// Pending requests query parameters
export interface PendingRequestsParams {
  skip?: number;
  take?: number;
  orderBy?: string[];
  include?: string[] | string;
  search_column?: string[];
  search?: string;
}

// User details query parameters
export interface UserDetailsParams {
  include?: string[];
}

// Approve user request body
export interface ApproveUserRequest {
  password: string;
  discount: number;
  paymentCycle: number;
  paymentMode: string;
}

// User API functions
export const userAPI = {
  // Get user list (approved users)
  getUserList: async (
    params: UserListParams = {}
  ): Promise<UserListResponse> => {
    try {
      const response = await api.get("/user/list", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get pending requests
  getPendingRequests: async (
    params: PendingRequestsParams = {}
  ): Promise<UserListResponse> => {
    try {
      const response = await api.get("/user/pending-requests", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user details
  getUserDetails: async (
    userId: string,
    params: UserDetailsParams = {}
  ): Promise<User> => {
    try {
      const response = await api.get(`/user/${userId}/details`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Approve user
  approveUser: async (userId: string, data: any): Promise<any> => {
    try {
      const response = await api.put(`/user/${userId}/approve`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reject user
  rejectUser: async (userId: string): Promise<any> => {
    try {
      const response = await api.put(`/user/${userId}/reject`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Approve user
  sendCredentials: async (params: any): Promise<any> => {
    try {
      const response = await api.put(`/user/send-credential`, null, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId: string): Promise<any> => {
    try {
      const response = await api.delete(`/user/${userId}/delete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
