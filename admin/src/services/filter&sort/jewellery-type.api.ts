import api from "../api";

export interface JewelleryType {
  id: string;
  name: string;
  categoryId: string;
  subCategoryId: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const JewelleryTypeAPI = {
  createType: async (
    subCategoryId: string,
    typeName: string
  ): Promise<JewelleryType> => {
    try {
      const response = await api.post<JewelleryType>("/jewellery-type/create", {
        subCategoryId,
        typeName,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create jewellery type: ${error}`);
    }
  },

  getAllTypes: async (subCategoryId: string): Promise<JewelleryType[]> => {
    try {
      const response = await api.get<JewelleryType[]>(
        `/jewellery-type/${subCategoryId}/get-all`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery types: ${error}`);
    }
  },

  getAllEnabledTypes: async (
    subCategoryId: string
  ): Promise<JewelleryType[]> => {
    try {
      const response = await api.get<JewelleryType[]>(
        `/jewellery-type/${subCategoryId}/get-all-enabled`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery types: ${error}`);
    }
  },

  getTypeById: async (id: string): Promise<JewelleryType> => {
    try {
      const response = await api.get<JewelleryType>(`/jewellery-type/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery type: ${error}`);
    }
  },

  updateType: async (id: string, typeName: string): Promise<JewelleryType> => {
    try {
      const response = await api.patch<JewelleryType>(`/jewellery-type/${id}`, {
        typeName,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update jewellery type: ${error}`);
    }
  },

  deleteType: async (id: string): Promise<void> => {
    try {
      await api.delete(`/jewellery-type/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete jewellery type: ${error}`);
    }
  },

  enableType: async (id: string): Promise<JewelleryType> => {
    try {
      const response = await api.put<JewelleryType>(
        `/jewellery-type/${id}/enable`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to enable jewellery type: ${error}`);
    }
  },

  disableType: async (id: string): Promise<JewelleryType> => {
    try {
      const response = await api.put<JewelleryType>(
        `/jewellery-type/${id}/disable`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to disable jewellery type: ${error}`);
    }
  },
};
