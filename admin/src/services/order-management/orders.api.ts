import api from "../api";

// Interface for creating purchase order
export interface CreatePurchaseOrderRequest {
  orderItems: OrderItem[];
  paymentMethod: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingPostalCode: string;
  transactionId?: string;
}

// Interface for order item
export interface OrderItem {
  jewelleryId: string;
  variantId: string;
  sku: string;
  quantity: number;
  selectedColor: string;
  selectedSize: number;
  material: string;
  includeCertificate: boolean;
  // diamondWeight?: number;
}

// Interface for creating purchase order from cart
export interface CreatePurchaseOrderFromCartRequest {
  orderItems: CartOrderItem[];
  paymentMethod: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingPostalCode: string;
  transactionId?: string;
}

// Interface for cart order item
export interface CartOrderItem {
  jewelleryId: string;
  variantId: string;
  sku: string;
  quantity: number;
  selectedColor: string;
  selectedSize: number;
  material: string;
  includeCertificate: boolean;
  // diamondWeight?: number;
}

// Interface for updating purchase order
export interface UpdatePurchaseOrderRequest {
  orderStatus?: ORDER_STATUS | string;
  paymentStatus?: PAYMENT_STATUS | string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;
  shippingPostalCode?: string;
  transactionId?: string;
}

// Interface for getting purchase orders with filters
export interface GetPurchaseOrdersParams {
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  orderStatus?: string;
  skip?: number;
  take?: number;
  orderBy?: string[];
  include?: string[];
  search_column?: string[];
  search?: string;
}

// Order status enum
export enum ORDER_STATUS {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PAYMENT_STATUS {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

// User interface
export interface User {
  id: string;
  verficationType: string;
  email: string;
  title: string;
  companyName: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  mobile: string;
  website: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  companyNumber: string;
  registrationCopyImage: string;
  registrationCopyType: string;
  bussinessType: string;
  userType: string;
  paymentMode: string;
  paymentCycle: number;
  discount: number;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Response interfaces
export interface PurchaseOrder {
  id: string;
  userId: string;
  orderNumber: string;
  orderDate: string;
  subtotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  orderStatus: ORDER_STATUS;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingPostalCode: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string | null;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  orderItems?: OrderItem[];
}

export interface PurchaseOrdersResponse {
  total: number;
  list: PurchaseOrder[];
}

export const purchaseAPI = {
  // POST /purchase-order - Create a new purchase order
  createPurchaseOrder: async (
    data: CreatePurchaseOrderRequest
  ): Promise<PurchaseOrder> => {
    try {
      const response = await api.post<PurchaseOrder>("/purchase-order", data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create purchase order: ${error}`);
    }
  },

  // POST /purchase-order/from-cart - Create purchase order from cart items
  createPurchaseOrderFromCart: async (
    data: CreatePurchaseOrderFromCartRequest
  ): Promise<PurchaseOrder> => {
    try {
      const response = await api.post<PurchaseOrder>(
        "/purchase-order/from-cart",
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create purchase order from cart: ${error}`);
    }
  },

  // GET /purchase-order/{userId} - Get all purchase orders for the user
  getPurchaseOrdersByUserId: async (
    userId: string,
    params?: GetPurchaseOrdersParams
  ): Promise<PurchaseOrdersResponse> => {
    try {
      const response = await api.get<PurchaseOrdersResponse>(
        `/purchase-order/${userId}`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch purchase orders by user ID: ${error}`);
    }
  },

  // GET /purchase-order/latest-orders - Get all purchase orders for the user (latest)
  getLatestPurchaseOrders: async (
    params?: GetPurchaseOrdersParams
  ): Promise<PurchaseOrdersResponse> => {
    try {
      const response = await api.get<PurchaseOrdersResponse>(
        "/purchase-order/admin/latest-orders", // "/purchase-order/latest-orders",
        { params }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch latest purchase orders: ${error}`);
    }
  },

  // PUT /purchase-order/{id} - Update a purchase order
  updatePurchaseOrder: async (
    id: string,
    data: UpdatePurchaseOrderRequest
  ): Promise<PurchaseOrder> => {
    try {
      const response = await api.put<PurchaseOrder>(
        `/purchase-order/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update purchase order: ${error}`);
    }
  },

  // GET /purchase-order/{id} - Get order details by ID
  getOrderById: async (id: string): Promise<PurchaseOrder> => {
    try {
      const response = await api.get<PurchaseOrder>(`/purchase-order/${id}`, {
        params: {
          include: ["user", "orderItems"],
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch purchase order: ${error}`);
    }
  },

  // DELETE /purchase-order/{id} - Delete a purchase order (soft delete)
  deletePurchaseOrder: async (id: string): Promise<void> => {
    try {
      await api.delete(`/purchase-order/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete purchase order: ${error}`);
    }
  },
};
