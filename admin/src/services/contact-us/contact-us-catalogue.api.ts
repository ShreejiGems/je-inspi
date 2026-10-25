import api from "../api";

export interface Catalogue {
  id: string;
  name: string;
  coverImage: string;
  pdfUrl: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCatalogueRequest {
  name: string;
  coverImage: string;
  pdfUrl: string;
}

export interface UpdateCatalogueRequest {
  name?: string;
  coverImage?: string;
  pdfUrl?: string;
}

export const catalogueAPI = {
  createCatalogue: async (data: CreateCatalogueRequest): Promise<Catalogue> => {
    try {
      const response = await api.post<Catalogue>("/catalogue/create", data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create catalogue: ${error}`);
    }
  },

  getAllCatalogues: async (): Promise<Catalogue[]> => {
    try {
      const response = await api.get<Catalogue[]>("/catalogue/get-all");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch catalogues: ${error}`);
    }
  },

  getAllEnabledCatalogues: async (): Promise<Catalogue[]> => {
    try {
      const response = await api.get<Catalogue[]>("/catalogue/get-enabled");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch enabled catalogues: ${error}`);
    }
  },

  getCatalogueById: async (id: string): Promise<Catalogue> => {
    try {
      const response = await api.get<Catalogue>(`/catalogue/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch catalogue: ${error}`);
    }
  },

  updateCatalogue: async (
    id: string,
    data: UpdateCatalogueRequest
  ): Promise<Catalogue> => {
    try {
      const response = await api.patch<Catalogue>(`/catalogue/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update catalogue: ${error}`);
    }
  },

  deleteCatalogue: async (id: string): Promise<void> => {
    try {
      await api.delete(`/catalogue/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete catalogue: ${error}`);
    }
  },

  enableCatalogue: async (id: string): Promise<Catalogue> => {
    try {
      const response = await api.put<Catalogue>(`/catalogue/${id}/enable`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to enable catalogue: ${error}`);
    }
  },

  disableCatalogue: async (id: string): Promise<Catalogue> => {
    try {
      const response = await api.put<Catalogue>(`/catalogue/${id}/disable`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to disable catalogue: ${error}`);
    }
  },
};
