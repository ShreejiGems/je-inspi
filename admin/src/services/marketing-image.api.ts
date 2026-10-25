import api from "./api";

export interface MarketingImageRequest {
  images: string[];
}

export interface MarketingImageResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface PrimeProductRequest {
  categoryId?: string; // optional
  productId: string;   // required
  primeImage: string;  // required
  productType: string; // required (e.g., "JEWELLERY" or "DIAMOND")
}

export interface PrimeProductResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const marketingImageAPI = {
  // Get marketing images for a specific category
  getMarketingImages: async (categoryId: string): Promise<string[]> => {
    try {
      const response = await api.get<any>(
        `/jewellery-category/${categoryId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch marketing images: ${error}`);
    }
  },

  // Add marketing images to a category
  addMarketingImages: async (
    categoryId: string,
    images: string[]
  ): Promise<MarketingImageResponse> => {
    try {
      const response = await api.post<MarketingImageResponse>(
        `/dynamic/${categoryId}/marketing-images`,
        { images }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add marketing images: ${error}`);
    }
  },

  addOrEditPrimeProduct: async (
    payload: PrimeProductRequest
  ): Promise<PrimeProductResponse> => {
    try {
      const response = await api.post<PrimeProductResponse>(
        `/dynamic/prime-product?categoryId=${payload.categoryId}&productId=${payload.productId}&primeImage=${payload.primeImage}&productType=${payload.productType}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add/edit prime product: ${error}`);
    }
  },

  getPrimeProducts: async (): Promise<PrimeProductResponse> => {
    try {
      const response = await api.get<PrimeProductResponse>(
        `/dynamic/prime-product`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch prime products: ${error}`);
    }
  },
};
