import api from "../api";

export const jewelleryCategoryAPI = {
  updatePriceLimit: async (min: number, max: number): Promise<any> => {
    try {
      const response = await api.put<any>(`/dynamic/price-filter`, {
        min,
        max,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to enable jewellery category: ${error}`);
    }
  },
};
