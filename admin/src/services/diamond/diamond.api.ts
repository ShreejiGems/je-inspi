import api from "../api";

// Diamond types and interfaces
export type GemOrigin = "NATURAL" | "LAB_GROWN";
export type DiamondStatus = "ENABLED" | "DISABLED";

export interface Diamond {
  id: string;
  gemOrigin: GemOrigin;
  name: string;
  sku: string;
  shape: string;
  weight: number;
  color: string;
  clarity: string;
  cut: string;
  symmetry: string;
  lab: string;
  polish: string;
  certificateNo: string;
  height: number;
  width: number;
  length: number;
  totalDepthInPercentage: number;
  totalWidthInPercentage: number;
  girdle: string;
  fluorescence: string;
  images: string;
  videos: string;
  certificateUrl: string | null;
  rap: number;
  price: number;
  status: DiamondStatus;
  source: "API" | "MANUAL";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiamondPayload {
  name: string;
  sku: string;
  gemOrigin: GemOrigin;
  shape: string;
  weight: number;
  color: string;
  clarity: string;
  cut: string;
  symmetry: string;
  lab: string;
  polish: string;
  certificateNo: string;
  certificateUrl?: string;
  height: number;
  width: number;
  length: number;
  totalDepthInPercentage: number;
  totalWidthInPercentage: number;
  girdle: string;
  fluorescence: string;
  images: string[];
  videos: string[];
  rap: number;
  price: number;
  source: "API" | "MANUAL";
}

export interface UpdateDiamondPayload {
  name?: string;
  sku?: string;
  gemOrigin?: GemOrigin;
  shape?: string;
  weight?: number;
  color?: string;
  clarity?: string;
  cut?: string;
  symmetry?: string;
  lab?: string;
  polish?: string;
  certificateNo?: string;
  certificateUrl?: string;
  height?: number;
  width?: number;
  length?: number;
  totalDepthInPercentage?: number;
  totalWidthInPercentage?: number;
  girdle?: string;
  fluorescence?: string;
  images?: any;
  videos?: any;
  rap?: number;
  price?: number;
  source?: "API" | "MANUAL";
}

export interface GetDiamondsParams {
  skip?: number;
  take?: number;
  orderBy?: string[] | string;
  include?: string[];
  search_column?: string[];
  search?: string;
  name?: string;
  sku?: string;
  gemOrigin?: string;
  shape?: string;
  minWeight?: number;
  maxWeight?: number;
  color?: string;
  clarity?: string;
  cut?: string;
  lab?: string;
  certificateNo?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface GetDiamondsResponse {
  total: number;
  list: Diamond[];
  hasMany: boolean;
  count: number;
}

export interface DeleteDiamondResponse {
  message: string;
}

export interface Certificate {
  id: string;
  weightStartsAt: number;
  weightEndsAt: number;
  price: number;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const diamondAPI = {
  // 1. POST /diamond - Create a new diamond product
  createDiamond: async (payload: CreateDiamondPayload): Promise<Diamond> => {
    try {
      const response = await api.post<Diamond>("/diamond", payload);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to create diamond: ${error.response?.data?.message || error.message || error}`
      );
    }
  },

  // 2. GET /diamond - Get all diamond products with search/filter params
  getAllDiamonds: async (params?: GetDiamondsParams): Promise<GetDiamondsResponse> => {
    try {
      const response = await api.get<GetDiamondsResponse>("/diamond", { params });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch diamonds: ${error.response?.data?.message || error.message || error}`
      );
    }
  },

  // 3. GET /diamond/{id} - Get diamond product by ID
  getDiamondById: async (id: string): Promise<Diamond> => {
    try {
      const response = await api.get<Diamond>(`/diamond/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch diamond: ${error.response?.data?.message || error.message || error}`
      );
    }
  },

  // 4. PATCH /diamond/{id} - Update diamond product
  updateDiamond: async (id: string, payload: UpdateDiamondPayload): Promise<Diamond> => {
    try {
      const response = await api.patch<Diamond>(`/diamond/${id}`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to update diamond: ${error.response?.data?.message || error.message || error}`
      );
    }
  },

  // 5. DELETE /diamond/{id} - Delete diamond product
  deleteDiamond: async (id: string): Promise<DeleteDiamondResponse> => {
    try {
      const response = await api.delete<DeleteDiamondResponse>(`/diamond/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to delete diamond: ${error.response?.data?.message || error.message || error}`
      );
    }
  },

  // 6. PATCH /diamond/{id}/enable - Enable diamond product
  enableDiamond: async (id: string): Promise<Diamond> => {
    try {
      const response = await api.patch<Diamond>(`/diamond/${id}/enable`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to enable diamond: ${error.response?.data?.message || error.message || error}`
      );
    }
  },

  // 7. PATCH /diamond/{id}/disable - Disable diamond product
  disableDiamond: async (id: string): Promise<Diamond> => {
    try {
      const response = await api.patch<Diamond>(`/diamond/${id}/disable`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to disable diamond: ${error.response?.data?.message || error.message || error}`
      );
    }
  },

  // 8. GET /certificates - Get certificate pricing
  getCertificates: async (): Promise<Certificate[]> => {
    try {
      const response = await api.get<Certificate[]>("/certificates");
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch certificates: ${error.response?.data?.message || error.message || error}`
      );
    }
  },
};
