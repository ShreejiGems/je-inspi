import { apiHelper } from '@/src/libs/helper';

export interface QueryParams {
  skip?: number;
  take?: number;
  include?: string[];
  orderBy?: string[];
  search_column?: string[];
  search?: string;
}

export const contactUsAPI = {
  getEnabledCatalogs: async (params: QueryParams): Promise<any> => {
    const response = await apiHelper.get<any>('/catalogue/get-enabled', { params });
    return response;
  },

  getEnabledEvents: async (params: QueryParams): Promise<any> => {
    const response = await apiHelper.get<any>('/event/get-enabled', { params });
    return response;
  },

  getEnabledLocations: async (params: QueryParams): Promise<any> => {
    const response = await apiHelper.get<any>('/location/get-enabled', { params });
    return response;
  },
};
