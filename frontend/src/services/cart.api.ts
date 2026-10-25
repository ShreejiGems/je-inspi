import { apiHelper } from '@/src/libs/helper';

// Interface for adding item to cart
export interface AddToCartRequest {
    jewelleryId: string;
    variantId: string;
    quantity: number;
    selectedColor: string;
    selectedSize: number;
    material: string;
    includeCertificate: boolean;
    sku: string;
}

// Interface for updating cart item
export interface UpdateCartRequest {
    cartItemId: string;
    quantity: number;
    includeCertificate: boolean;
}

// Interface for removing cart item
export interface RemoveFromCartRequest {
    cartItemId: string;
}

export const cartAPI = {
    // POST /cart/add - Add item to cart
    addToCart: async (data: AddToCartRequest): Promise<any> => {
        const response = await apiHelper.post('/cart/add', data);
        return response;
    },

    // PUT /cart/update - Update cart item quantity
    updateCart: async (data: UpdateCartRequest): Promise<any> => {
        const response = await apiHelper.put('/cart/update', data);
        return response;
    },

    // DELETE /cart/remove - Remove item from cart
    removeFromCart: async (data: RemoveFromCartRequest): Promise<any> => {
        const response = await apiHelper.delete('/cart/remove', { data });
        return response;
    },

    // GET /cart - Get user cart
    getUserCart: async (): Promise<any> => {
        const response = await apiHelper.get('/cart');
        return response;
    },
}
