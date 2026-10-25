import api from "../api";

export interface JewellerySubCategory {
  id: string;
  name: string;
  categoryId: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const JewellerySubCategoryAPI = {
  createSubCategory: async (
    categoryId: string,
    subCategoryName: string
  ): Promise<JewellerySubCategory> => {
    try {
      const response = await api.post<JewellerySubCategory>(
        "/jewellery-sub-category/create",
        { categoryId, subCategoryName }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create jewellery sub category: ${error}`);
    }
  },

  getAllSubCategories: async (
    categoryId: string
  ): Promise<JewellerySubCategory[]> => {
    try {
      const response = await api.get<JewellerySubCategory[]>(
        `/jewellery-sub-category/${categoryId}/get-all`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery sub categories: ${error}`);
    }
  },

  getAllEnabledSubCategories: async (
    categoryId: string
  ): Promise<JewellerySubCategory[]> => {
    try {
      const response = await api.get<JewellerySubCategory[]>(
        `/jewellery-sub-category/${categoryId}/get-all-enabled`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery sub categories: ${error}`);
    }
  },

  getSubCategoryById: async (id: string): Promise<JewellerySubCategory> => {
    try {
      const response = await api.get<JewellerySubCategory>(
        `/jewellery-sub-category/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery sub category: ${error}`);
    }
  },

  updateSubCategory: async (
    id: string,
    subCategoryName: string
  ): Promise<JewellerySubCategory> => {
    try {
      const response = await api.patch<JewellerySubCategory>(
        `/jewellery-sub-category/${id}`,
        { subCategoryName }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update jewellery sub category: ${error}`);
    }
  },

  deleteSubCategory: async (id: string): Promise<void> => {
    try {
      await api.delete(`/jewellery-sub-category/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete jewellery sub category: ${error}`);
    }
  },

  enableSubCategory: async (id: string): Promise<JewellerySubCategory> => {
    try {
      const response = await api.put<JewellerySubCategory>(
        `/jewellery-sub-category/${id}/enable`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to enable jewellery sub category: ${error}`);
    }
  },

  disableSubCategory: async (id: string): Promise<JewellerySubCategory> => {
    try {
      const response = await api.put<JewellerySubCategory>(
        `/jewellery-sub-category/${id}/disable`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to disable jewellery sub category: ${error}`);
    }
  },
};
