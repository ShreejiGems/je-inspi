import api from "../api";

export interface Location {
  id: string;
  country: string;
  countryCode: string;
  phone: string;
  email: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLocationRequest {
  country: string;
  countryCode: string;
  phone: string;
  email: string;
}

export interface UpdateLocationRequest {
  country?: string;
  countryCode?: string;
  phone?: string;
  email?: string;
}

export const locationAPI = {
  createLocation: async (data: CreateLocationRequest): Promise<Location> => {
    try {
      const response = await api.post<Location>("/location/create", data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create location: ${error}`);
    }
  },

  getAllLocations: async (): Promise<Location[]> => {
    try {
      const response = await api.get<Location[]>("/location/get-all");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch locations: ${error}`);
    }
  },

  getAllEnabledLocations: async (): Promise<Location[]> => {
    try {
      const response = await api.get<Location[]>("/location/get-enabled");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch enabled locations: ${error}`);
    }
  },

  getLocationById: async (id: string): Promise<Location> => {
    try {
      const response = await api.get<Location>(`/location/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch location: ${error}`);
    }
  },

  updateLocation: async (
    id: string,
    data: UpdateLocationRequest
  ): Promise<Location> => {
    try {
      const response = await api.patch<Location>(`/location/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update location: ${error}`);
    }
  },

  deleteLocation: async (id: string): Promise<void> => {
    try {
      await api.delete(`/location/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete location: ${error}`);
    }
  },

  enableLocation: async (id: string): Promise<Location> => {
    try {
      const response = await api.put<Location>(`/location/${id}/enable`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to enable location: ${error}`);
    }
  },

  disableLocation: async (id: string): Promise<Location> => {
    try {
      const response = await api.put<Location>(`/location/${id}/disable`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to disable location: ${error}`);
    }
  },
};
