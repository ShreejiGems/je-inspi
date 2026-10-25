export interface UserSession {
  id: string;
  userId: string;
  authToken: string;
  refreshToken: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  userSession: UserSession;
}

export interface LoginRequest {
  email: string;
  password: string;
  userType: string;
}

export interface LoginResponse {
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
  userSession: UserSession;
}

export interface RefreshTokenResponse {
  newSession: UserSession;
}

export interface Calculator {
  id?: string;
  miscellaneous: number;
  silverPerGram: number;
  tenKtGoldPerGram: number;
  forteenKtGoldPerGram: number;
  eighteenKtGoldPerGram: number;
  extraCost: number;
  filterMin: number;
  filterMax: number;
  duty: number;
  profit: number;
  usRate: number;
  status?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CalculatorRequest {
  miscellaneous: number;
  silverPerGram: number;
  tenKtGoldPerGram: number;
  forteenKtGoldPerGram: number;
  eighteenKtGoldPerGram: number;
  extraCost: number;
  duty: number;
  profit: number;
  usRate: number;
}

export interface ApiError {
  message: string;
  status?: number;
}
