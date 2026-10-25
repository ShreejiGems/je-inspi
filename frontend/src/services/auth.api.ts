import { apiHelper } from "@/src/libs/helper";

// Types for authentication
export interface LoginRequest {
  email: string;
  password: string;
  userType: "USER" | "ADMIN";
}

export interface SignupRequest {
  email: string;
  password: string;
  companyName: string;
  title: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  mobile: string;
  website: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  companyNumber: string;
  registrationCopyImage: string;
  registrationCopyType:
    | "GST"
    | "VAT"
    | "BUSSINESS_REGISTRATION"
    | "BUSSINESS_LICENCE"
    | "OTHER";
  bussinessType: "RETAILER" | "WHOLESELLER" | "MANUFACTURE";
  referenceDetail: {
    companyName: string;
    contactPersonName: string;
    email: string;
    countryCode: string;
    mobile: string;
    address: string;
    city: string;
    postalcode: string;
    country: string;
  };
}

export interface ChangePasswordRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  password?: string; // Optional in profile, required during signup
  companyName: string;
  title: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  mobile: string;
  website: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  companyNumber: string;
  registrationCopyImage: string;
  registrationCopyType: string;
  bussinessType: string;
  discount: any;
  referenceDetail: {
    companyName: string;
    contactPersonName: string;
    email: string;
    countryCode: string;
    mobile: string;
    address: string;
    city: string;
    postalcode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  message?: string;
}

export interface ContactUsRequest {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  message: string;
}

export interface UpdateProfileRequest {
  title?: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  mobile?: string;
  website?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  companyNumber?: string;
  registrationCopyImage?: string;
  registrationCopyType?: "GST" | "VAT" | "BUSSINESS_REGISTRATION" | "BUSSINESS_LICENCE" | "OTHER";
  bussinessType?: "RETAILER" | "WHOLESELLER" | "MANUFACTURE";
  referenceDetail?: {
    companyName?: string;
    contactPersonName?: string;
    email?: string;
    countryCode?: string;
    mobile?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: number;
}

// Authentication API service
export const authAPI = {
  // User signup
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    return apiHelper.post<AuthResponse>("/auth/user-signup", data);
  },

  // User login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiHelper.post<AuthResponse>("/auth/login", data);
  },

  // Change password
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<{ message: string }> => {
    return apiHelper.post<{ message: string }>("/auth/change-password", undefined, {
      params: {
        email: data.email,
        password: data.password
      }
    });
  },

  // Get user profile
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    return apiHelper.get<UserProfile>(`/auth/${userId}/profile`);
  },

  // Logout user
  logout: async (): Promise<{ message: string }> => {
    return apiHelper.delete<{ message: string }>("/auth/logout");
  },

  // Contact-us
  contactUs: async (data: ContactUsRequest): Promise<{ message: string }> => {
    return apiHelper.post<{ message: string }>("/auth/contact-us", data);
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<{ message: string; user: UserProfile }> => {
    return apiHelper.post<{ message: string; user: UserProfile }>("/auth/update-profile", data);
  },

  // Send OTP for password reset
  sendOtp: async (data: SendOtpRequest): Promise<{ message: string }> => {
    return apiHelper.post<{ message: string }>("/auth/send-otp", data);
  },

  // Verify OTP for password reset
  verifyOtp: async (data: VerifyOtpRequest): Promise<{ message: string }> => {
    return apiHelper.post<{ message: string }>("/auth/verify-otp", data);
  },
};
