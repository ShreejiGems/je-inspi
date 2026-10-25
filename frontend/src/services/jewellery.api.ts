import { apiHelper } from "@/src/libs/helper";

// Helper function to parse images string to JSON
const parseImages = (images: ProductImage[] | string | any): ProductImage[] => {
  try {
    // If it's already an array, return as is
    if (Array.isArray(images)) {
      return images;
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof images === 'string' && images.trim() !== "") {
      return JSON.parse(images);
    }
    
    return [];
  } catch (error) {
    console.error("Failed to parse images:", error);
    return [];
  }
};

// Interface for product image
export interface ProductImage {
  color: string;
  image: string;
}

// Interface for collection
export interface Collection {
  id: string;
  name: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for jewellery collection
export interface JewelleryCollection {
  id: string;
  jewelleryId: string;
  collectionId: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  collection: Collection;
}

// Interface for gem
export interface Gem {
  id: string;
  variantId: string;
  shape: string;
  mm: string;
  weight: number;
  color: string;
  clarity: string;
  quantity: number;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for jewellery variant
export interface JewelleryVariant {
  id: string;
  jewelleryId: string;
  gemOrigin: string;
  hasGems: boolean;
  size: number;
  silver: number;
  tenKtGold: number;
  forteenKtGold: number;
  eighteenKtGold: number;
  mesurement: Record<string, string>;
  basePrice: number;
  totalGemWeight: number | null;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  gem: Gem[];
}

// Interface for category
export interface Category {
  id: string;
  name: string;
  marketingImages: string[];
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for sub category
export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for type
export interface Type {
  id: string;
  name: string;
  categoryId: string;
  subCategoryId: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for individual product
export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  subCategoryId: string;
  typeId: string;
  description: string;
  images: ProductImage[] | any;
  basePrice: number;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isWishlisted?: boolean;
  category?: Category;
  subCategory?: SubCategory;
  type?: Type;
  jewelleryCollection?: JewelleryCollection[];
  jewelleryVariant?: JewelleryVariant[];
  material?: any;
  purity?: any;
  plating?: any;
  length?: any;
  width?: any;
  height?: any;
  totalWeight?: any;
}

// Interface for product API response
export interface ProductResponse {
  total: number;
  list: Product[];
  hasMany: boolean;
  count: number;
  availableSizes: number[];
  availableShapes: string[];
  categoryMarketingImages?: string[][];
}

// Interface for product filter parameters
export interface ProductFilters {
  skip?: number;
  take?: number;
  search?: string;
  search_column?: string | string[];
  categoryId?: string;
  subcategoryId?: string;
  typeId?: string;
  collectionId?: string;
  shapes?: string;
  sizes?: string;
  material?: string[];
  minPrice?: number;
  maxPrice?: number;
  gemOrigin?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  orderBy?: string;
  userId?: string;
}

// Home Page API service
export const jewelleryAPI = {
  getEnabledCategories: async (params: ProductFilters): Promise<any[]> => {
    return await apiHelper.get<any[]>("/jewellery-category/get-enabled", {
      params: params,
    });
  },

  getCategoriesById: async (id: string): Promise<any> => {
    return await apiHelper.get<any>(`/jewellery-category/${id}`);
  },

  getEnabledSubCategories: async (categoryId: string): Promise<any[]> => {
    return await apiHelper.get<any[]>(
      `/jewellery-sub-category/${categoryId}/get-all-enabled`,
    );
  },

  getSubCategoriesById: async (id: string): Promise<any> => {
    return await apiHelper.get<any>(`/jewellery-sub-category/${id}`);
  },

  getEnabledType: async (id: string): Promise<any[]> => {
    return await apiHelper.get<any[]>(`/jewellery-type/${id}/get-all-enabled`);
  },

  getTypeByIs: async (id: string): Promise<any[]> => {
    return await apiHelper.get<any[]>(`/jewellery-type/${id}`);
  },

  getEnabledCollection: async (): Promise<any[]> => {
    return await apiHelper.get<any[]>("/collection/get-enabled");
  },

  getCollectionById: async (id: string): Promise<any> => {
    return await apiHelper.get<any>(`/collection/${id}`);
  },

  getAllProduct: async (filters?: ProductFilters): Promise<ProductResponse> => {
    const response = await apiHelper.get<ProductResponse>("/jewellery/list", {
      params: filters,
    });
    // Parse images for each product
    response.list = response.list.map((product) => ({
      ...product,
      images: parseImages(product.images),
    }));
    return response;
  },

  getProductById: async (id: string): Promise<any> => {
    const response = await apiHelper.get<any>(`/admin/jewellery/${id}`);
    // Parse images for the product
    if (response && response.images) {
      response.images = parseImages(response.images);
    }
    return response;
  },

  markProductInWishList: async (id: string): Promise<any> => {
    return await apiHelper.put<any>(
      `/jewellery/${id}/mark-wishlist`,
      undefined,
      { params: { type: "JEWELLERY" } },
    );
  },

  removeProductFromWishList: async (id: string): Promise<any> => {
    return await apiHelper.put<any>(
      `/jewellery/${id}/unmark-wishlist`,
      undefined,
      { params: { type: "JEWELLERY" } },
    );
  },

  getWishList: async (payload: any): Promise<any> => {
    return await apiHelper.get<any>(`/auth/wishlist`, { params: payload });
  },

  getPriceByMaterial: async (
    variantId: string,
    material: string,
    includeCertificate: boolean,
    diamondWeight?: number,
  ): Promise<any> => {
    const params = {
      variantId,
      material,
      includeCertificate,
      diamondWeight,
    };
    return await apiHelper.get<any>(`/jewellery/calculate-jewellery-price`, {
      params,
    });
  },
};
