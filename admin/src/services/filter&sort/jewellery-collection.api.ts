import api from "../api";

export interface Collection {
  id: string;
  name: string;
  marketingImages: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const CollectionAPI = {
  createCollection: async (collectionName: string): Promise<Collection> => {
    try {
      const response = await api.post<Collection>("/collection/create", {
        collectionName,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create jewellery collection: ${error}`);
    }
  },

  getAllCollections: async (): Promise<Collection[]> => {
    try {
      const response = await api.get<Collection[]>("/collection/get-all");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery collections: ${error}`);
    }
  },

  getAllEnabledCollections: async (): Promise<Collection[]> => {
    try {
      const response = await api.get<Collection[]>("/collection/get-enabled");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery collections: ${error}`);
    }
  },

  getCollectionById: async (id: string): Promise<Collection> => {
    try {
      const response = await api.get<Collection>(`/collection/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch jewellery collection: ${error}`);
    }
  },

  updateCollection: async (
    id: string,
    collectionName: string
  ): Promise<Collection> => {
    try {
      const response = await api.patch<Collection>(`/collection/${id}`, {
        collectionName,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update jewellery collection: ${error}`);
    }
  },

  deleteCollection: async (id: string): Promise<void> => {
    try {
      await api.delete(`/collection/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete jewellery collection: ${error}`);
    }
  },

  enableCollection: async (id: string): Promise<Collection> => {
    try {
      const response = await api.put<Collection>(`/collection/${id}/enable`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to enable jewellery collection: ${error}`);
    }
  },

  disableCollection: async (id: string): Promise<Collection> => {
    try {
      const response = await api.put<Collection>(`/collection/${id}/disable`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to disable jewellery collection: ${error}`);
    }
  },
};
