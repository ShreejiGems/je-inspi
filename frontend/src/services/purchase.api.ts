import { apiHelper } from '@/src/libs/helper';

/* =========================
   Interfaces
========================= */

export interface PurchaseOrderItem {
  jewelleryId: string;
  variantId: string;
  sku: string;
  quantity: number;
  selectedColor: string;
  selectedSize: number;
  material: string;
  includeCertificate: boolean;
}

export interface CreatePurchaseOrderRequest {
  orderItems: PurchaseOrderItem[];
  paymentMethod: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingPostalCode: string;
  transactionId?: string;
  checkoutCurrency: string;
}

/**
 * Same payload for direct & from-cart purchase
 */
export type CreatePurchaseOrderFromCartRequest =
  CreatePurchaseOrderRequest;

/* =========================
   Query Params (Swagger based)
========================= */

export interface PurchaseOrderListParams {
  dateFrom?: string;          // ISO date-time
  dateTo?: string;            // ISO date-time
  orderStatus?: string;
  skip?: number;
  take?: number;
  orderBy?: string[] | string;
  include?: string[];
  search_column?: string[];
  search?: string;
}

/* =========================
   API Methods
========================= */

export const purchaseAPI = {
  /**
   * POST /purchase-order
   */
  createPurchaseOrder: async (
    data: CreatePurchaseOrderRequest
  ): Promise<any> => {
    return apiHelper.post('/purchase-order', data);
  },

  /**
   * POST /purchase-order/from-cart
   */
  createPurchaseOrderFromCart: async (
    data: CreatePurchaseOrderFromCartRequest
  ): Promise<any> => {
    return apiHelper.post('/purchase-order/from-cart', data);
  },

  /**
   * GET /purchase-order/latest-orders
   */
  getLatestPurchaseOrders: async (
    params?: PurchaseOrderListParams
  ): Promise<any> => {
    return apiHelper.get('/purchase-order/latest-orders', { params });
  },

  /**
   * GET /purchase-order/{userId}/list
   */
  getPurchaseOrdersByUserId: async (
    userId: string,
    params?: PurchaseOrderListParams
  ): Promise<any> => {
    return apiHelper.get(
      `/purchase-order/${userId}/list`,
      { params }
    );
  },

  /**
   * GET /purchase-order/{id}
   */
  getPurchaseOrderById: async (
    id: string
  ): Promise<any> => {
    return apiHelper.get(`/purchase-order/${id}`);
  },

  /**
   * DELETE /purchase-order/{id}
   */
  deletePurchaseOrder: async (
    id: string
  ): Promise<any> => {
    return apiHelper.delete(`/purchase-order/${id}`);
  },
};
