import api from "../api";

// Diamond enums from schema
export type DIAMOND_SHAPE =
  | "ROUND"
  | "OVAL"
  | "PRINCESS"
  | "CUSHION"
  | "EMERALD"
  | "RADIANT"
  | "ASSCHER"
  | "MARQUISE"
  | "HEART"
  | "PEAR";

export type DIAMOND_COLOR =
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "FANCY_LIGHT"
  | "FANCY"
  | "FANCY_INTENSE"
  | "FANCY_VIVID"
  | "FANCY_DEEP"
  | "FANCY_DARK";

export type DIAMOND_CLARITY =
  | "IF"
  | "VVS1"
  | "VVS2"
  | "VS1"
  | "VS2"
  | "SI1"
  | "SI2"
  | "I1"
  | "I2";

export interface Product {
  name: string;
  sku: string;
  categoryId: string;
  subCategoryId: string;
  typeId: string;
  description: string;
  variants: Variant[];
  collectionId: string[];
  images: ProductImage[];
}

export interface Variant {
  size: number | undefined;
  gemOrigin: "NATURAL" | "LAB_GROWN" | string;
  gemDetails: GemDetail[];
  materialDetails: MaterialDetails;
  measurements: Measurement[];
}

export interface GemDetail {
  id?: string; // Add unique identifier for each gem detail
  shape: DIAMOND_SHAPE | string;
  mm: string;
  weight: number | undefined;
  color: DIAMOND_COLOR | string;
  clarity: DIAMOND_CLARITY | string;
  quantity: number | undefined;
}

export interface MaterialDetails {
  silver: number | undefined;
  tenKtGold: number | undefined;
  forteenKtGold: number | undefined;
  eighteenKtGold: number | undefined;
}

export interface Measurement {
  field: string;
  value: string;
}

export interface ProductImage {
  image: string;
  color: string; // e.g., 'WHITE'
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface ProductParams {
  categoryId?: string;
  subCategoryId?: string;
  typeId?: string;
  skip?: number;
  take?: number;
  orderBy?: string[];
  include?: string[];
  search_column?: string[];
  search?: string;
}

export const jewelleryProductAPI = {
  // Get all products
  getAllProducts: async (
    params?: ProductParams
  ): Promise<{ total: number; list: Product[] }> => {
    try {
      const response = await api.get<{ total: number; list: Product[] }>(
        "/admin/jewellery/get-all",
        { params }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch jewellery products: ${error.message || error}`
      );
    }
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get<Product>(`/admin/jewellery/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery product: ${error}`);
    }
  },

  // Create product
  createProduct: async (payload: Product): Promise<Product> => {
    try {
      const response = await api.post<Product>(
        "/admin/jewellery/create",
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update product
  updateProduct: async (id: string, payload: Product): Promise<Product> => {
    try {
      const response = await api.patch<Product>(
        `/admin/jewellery/${id}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    try {
      await api.delete(`/admin/jewellery/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete jewellery product: ${error}`);
    }
  },

  // Enable product
  enableProduct: async (id: string): Promise<Product> => {
    try {
      const response = await api.put<Product>(`/admin/jewellery/${id}/enable`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to enable jewellery product: ${error}`);
    }
  },

  // Disable product
  disableProduct: async (id: string): Promise<Product> => {
    try {
      const response = await api.put<Product>(`/admin/jewellery/${id}/disable`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to disable jewellery product: ${error}`);
    }
  },

  importProduct: async (fileUrl: string): Promise<Product> => {
    try {
      const response = await api.post<Product>(`/admin/jewellery/import`, {
        fileUrl,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to import jewellery product: ${error}`);
    }
  },
};
