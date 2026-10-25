import { apiHelper } from "@/src/libs/helper";

// Helper function to parse images string to JSON
const parseImages = (imagesString: string): string[] => {
  try {
    if (!imagesString || imagesString.trim() === "") {
      return [];
    }
    return JSON.parse(imagesString);
  } catch (error) {
    console.error("Failed to parse images:", error);
    return [];
  }
};

// Helper function to parse videos string to JSON
const parseVideos = (videosString: string): string[] => {
  try {
    if (!videosString || videosString.trim() === "") {
      return [];
    }
    return JSON.parse(videosString);
  } catch (error) {
    console.error("Failed to parse videos:", error);
    return [];
  }
};

// Interface for individual diamond
export interface Diamond {
  id: string;
  gemOrigin: string; // "NATURAL" or "LAB_GROWN"
  name: string;
  sku: string;
  shape: string;
  weight: number;
  color: string;
  clarity: string;
  rap: number;
  price: number;
  // Non-mandatory fields for loose parcel diamonds
  cut?: string;
  symmetry?: string;
  lab?: string;
  polish?: string;
  certificateNo?: string;
  height?: number;
  width?: number;
  length?: number;
  totalDepthInPercentage?: number;
  totalWidthInPercentage?: number;
  girdle?: string;
  fluorescence?: string;
  images?: string[];
  videos?: string[];
  certificateUrl?: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isWishlisted?: boolean;
  isFavorite?: boolean;
}

// Interface for diamond list API response
export interface DiamondListResponse {
  total: number;
  list: Diamond[];
  hasMany: boolean;
  count: number;
}

// Interface for diamond filter parameters
export interface DiamondFilters {
  skip?: number;
  take?: number;
  search?: string;
  search_column?: string | string[];
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
  symmetry?: string;
  polish?: string;
  girdle?: string;
  fluorescence?: string;
  minWidthPercentage?: number;
  maxWidthPercentage?: number;
  minDepthPercentage?: number;
  maxDepthPercentage?: number;
  include?: string;
  exclude?: string;
  orderBy?: string;
  isUserApi?: boolean;
}

// Interface for search params response
export interface DiamondSearchParams {
  weightRange: {
    min: number;
    max: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  shape: string[];
  color: string[];
  clarity: string[];
  cut: string[];
  symmetry: string[];
  lab: string[];
  polish: string[];
  girdle: string[];
  fluorescence: string[];
  gemOrigin: string[];
}

// Interface for design request
export interface DesignRequest {
  inquiresFor: string[];
  description: string;
  referenceImages: string[];
  referenceLinks: string[];
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobile: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

// Diamond API service
export const diamondAPI = {
  // Get all diamonds with filters
  getAllDiamonds: async (
    filters?: DiamondFilters,
  ): Promise<DiamondListResponse> => {
    const response = await apiHelper.get<DiamondListResponse>("/diamond", {
      params: filters,
    });
    // Parse images and videos for each diamond
    response.list = response.list.map((diamond) => {
      const processedDiamond = {
        ...diamond,
        images: parseImages(diamond.images as any),
        videos: parseVideos(diamond.videos as any),
      };
      // Handle isFavorite field from API response
      // If isFavorite is provided, sync it with isWishlisted for consistency
      if (processedDiamond.isFavorite !== undefined) {
        processedDiamond.isWishlisted = processedDiamond.isFavorite;
      }
      return processedDiamond;
    });
    return response;
  },

  // Get search parameters for diamond filters
  getSearchParams: async (): Promise<DiamondSearchParams> => {
    return await apiHelper.get<DiamondSearchParams>("/diamond/search-params");
  },

  // Get diamond by ID
  getDiamondById: async (id: string): Promise<Diamond> => {
    const response = await apiHelper.get<Diamond>(`/diamond/${id}`);
    // Parse images and videos for the diamond
    if (response) {
      response.images = parseImages(response.images as any);
      response.videos = parseVideos(response.videos as any);
      // Handle isFavorite field from API response
      // If isFavorite is provided, sync it with isWishlisted for consistency
      if (response.isFavorite !== undefined) {
        response.isWishlisted = response.isFavorite;
      }
    }
    return response;
  },

  submitDesignRequest: async (
    data: DesignRequest,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      await apiHelper.post("/auth/custom-inquiry", data);
      return { success: true, message: "Inquiry submitted successfully" };
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to submit inquiry",
      };
    }
  },

  // Create a new diamond
  createDiamond: async (
    diamondData: Omit<Diamond, "id" | "createdAt" | "updatedAt" | "isDeleted">,
  ): Promise<{ success: boolean; data?: Diamond; message?: string }> => {
    try {
      const response = await apiHelper.post<Diamond>("/diamond", diamondData);
      return { success: true, data: response };
    } catch (error: any) {
      console.error("Error creating diamond:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create diamond",
      };
    }
  },

  // Update an existing diamond
  updateDiamond: async (
    id: string,
    diamondData: Partial<
      Omit<Diamond, "id" | "createdAt" | "updatedAt" | "isDeleted">
    >,
  ): Promise<{ success: boolean; data?: Diamond; message?: string }> => {
    try {
      const response = await apiHelper.put<Diamond>(
        `/diamond/${id}`,
        diamondData,
      );
      return { success: true, data: response };
    } catch (error: any) {
      console.error("Error updating diamond:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update diamond",
      };
    }
  },

  // Delete a diamond
  deleteDiamond: async (
    id: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      await apiHelper.delete(`/diamond/${id}`);
      return { success: true, message: "Diamond deleted successfully" };
    } catch (error: any) {
      console.error("Error deleting diamond:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete diamond",
      };
    }
  },

  // Mark diamond as wishlist
  markDiamondInWishList: async (diamondId: string): Promise<any> => {
    return await apiHelper.put<any>(
      `/jewellery/${diamondId}/mark-wishlist`,
      undefined,
      { params: { type: "DIAMOND" } },
    );
  },

  // Remove diamond from wishlist
  removeDiamondFromWishList: async (diamondId: string): Promise<any> => {
    return await apiHelper.put<any>(
      `/jewellery/${diamondId}/unmark-wishlist`,
      undefined,
      { params: { type: "DIAMOND" } },
    );
  },
};
