import api from "../api";

export interface JewelleryCategory {
  id: string;
  name: string;
  marketingImages: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string;
}

export const jewelleryCategoryAPI = {
  createCategory: async (categoryName: string): Promise<JewelleryCategory> => {
    try {
      const response = await api.post<JewelleryCategory>(
        "/jewellery-category/create",
        { categoryName }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create jewellery category: ${error}`);
    }
  },

  getAllCategories: async (): Promise<JewelleryCategory[]> => {
    try {
      const response = await api.get<JewelleryCategory[]>(
        "/jewellery-category/get-all"
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery categories: ${error}`);
    }
  },
  getAllEnabledCategories: async (
    params?: any
  ): Promise<JewelleryCategory[]> => {
    try {
      const response = await api.get<JewelleryCategory[]>(
        "/jewellery-category/get-enabled",
        {
          params: params, // 👈 pass query parameters here
        }
      );

      console.log("Categories fetched", response);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery categories: ${error}`);
    }
  },

  getCategoryById: async (id: string): Promise<JewelleryCategory> => {
    try {
      const response = await api.get<JewelleryCategory>(
        `/jewellery-category/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery category: ${error}`);
    }
  },

  updateCategory: async (
    id: string,
    categoryName: string
  ): Promise<JewelleryCategory> => {
    try {
      const response = await api.patch<JewelleryCategory>(
        `/jewellery-category/${id}`,
        { categoryName }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update jewellery category: ${error}`);
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      await api.delete(`/jewellery-category/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete jewellery category: ${error}`);
    }
  },

  enableCategory: async (id: string): Promise<JewelleryCategory> => {
    try {
      const response = await api.put<JewelleryCategory>(
        `/jewellery-category/${id}/enable`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to enable jewellery category: ${error}`);
    }
  },

  disableCategory: async (id: string): Promise<JewelleryCategory> => {
    try {
      const response = await api.put<JewelleryCategory>(
        `/jewellery-category/${id}/disable`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to disable jewellery category: ${error}`);
    }
  },
};
