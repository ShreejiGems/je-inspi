import { apiHelper } from '@/src/libs/helper';

// Home Page API service
export const homeAPI = {
    // Get prime products
    getPrimeProducts: async (): Promise<any[]> => {
        return await apiHelper.get<any[]>('/dynamic/prime-product');
    },

    // Get all jewellery categories
    getJewelleryCategories: async (): Promise<any[]> => {
        return await apiHelper.get<any[]>('/jewellery-category/get-enabled');
    },

    // Get section images
    getSectionImages: async (): Promise<any[]> => {
        return await apiHelper.get<any[]>('/dynamic/section-image');
    }
};