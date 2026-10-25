"use client";

import { useState, useEffect, useRef } from "react";
import { purchaseAPI } from "@/src/services/purchase.api";
import { message, Tag, Pagination } from "antd";
import Image from "next/image";
import { garamond } from "@/src/common/helper";
import Loader from "@/components/common/loader";
import { FiPackage, FiCalendar, FiDollarSign } from "react-icons/fi";

interface OrderItem {
  id: string;
  jewelleryId: string;
  variantId: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedColor: string;
  selectedSize: number;
  material: string;
  includeCertificate: boolean;
  jewellery?: {
    id: string;
    name: string;
    images: string;
  };
}

interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  orderDate: string;
  subtotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  orderStatus: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingPostalCode: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string | null;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}

interface OrdersListResponse {
  list: Order[];
  total: number;
  count: number;
  hasMany: boolean;
}

const OrdersList = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState<Set<string>>(
    new Set()
  );
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Helper function to parse images string to JSON
  const parseImages = (imagesString: string): any[] => {
    try {
      if (!imagesString || imagesString.trim() === "") {
        return [];
      }
      return JSON.parse(imagesString);
    } catch (error) {
      console.error("Failed to parse images:", error);
      return [];
    }
  };

  // Fetch orders
  const fetchOrders = async (page: number, append: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const userData = localStorage.getItem("userData");
      if (!userData) {
        message.error("User not found. Please login again.");
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.id;

      const skip = (page - 1) * pageSize;
      const response: OrdersListResponse =
        await purchaseAPI.getLatestPurchaseOrders({
          skip,
          take: pageSize,
          orderBy: "createdAt|desc",
        });

      setOrders(prevOrders => {
        // If it's the first page or not appending, replace the orders
        if (!append || page === 1) {
          return response.list || [];
        }
        // Otherwise, append the new orders to the existing ones
        return [...prevOrders, ...(response.list || [])];
      });

      setHasMore(response.hasMany || false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreOrders = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchOrders(nextPage, true);
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleOrderExpansion = async (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
      setExpandedOrders(newExpanded);
    } else {
      newExpanded.add(orderId);
      setExpandedOrders(newExpanded);

      // Fetch order details if not already loaded
      const order = orders.find((o) => o.id === orderId);
      if (order && !order.orderItems) {
        await fetchOrderDetails(orderId);
      }
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setLoadingOrderDetails((prev) => new Set(prev).add(orderId));
      const orderDetails = await purchaseAPI.getPurchaseOrderById(orderId);

      // Update the order with fetched details
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, orderItems: orderDetails.orderItems || [] }
            : order
        )
      );
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Failed to load order details");
    } finally {
      setLoadingOrderDetails((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      PENDING: "#6b8965",
      CONFIRMED: "#6b8965",
      PROCESSING: "#6b8965",
      SHIPPED: "#6b8965",
      DELIVERED: "#526f4d",
      CANCELLED: "red",
      REFUNDED: "#526f4d",
    };
    return statusColors[status] || "default";
  };

  const getPaymentStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      PENDING: "#6b8965",
      PAID: "#526f4d",
      FAILED: "red",
      REFUNDED: "#526f4d",
    };
    return statusColors[status] || "default";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getImageForColor = (item: OrderItem) => {
    const rawImages = item?.jewellery?.images;

    if (!rawImages) return "/assets/brand/je-inspi-logo-transparent.png";

    const images = Array.isArray(rawImages)
      ? rawImages
      : parseImages(rawImages);

    const colorImage = images.find(
      (img) => img.color === item.selectedColor
    );

    return (
      colorImage?.image ||
      images[0]?.image ||
      "/assets/brand/je-inspi-logo-transparent.png"
    );
  };


  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <div className={`text-center py-12 ${garamond.className}`}>
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-2xl font-semibold mb-2">No orders yet</h3>
        <p className="text-brand-700 mb-6">
          Start shopping to see your orders here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="px-2 md:px-0">
        <h1 className="text-xl md:text-2xl font-bold">My Orders</h1>
        <p className="text-xs md:text-sm mt-1">Track and manage your orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="bg-white border border-brand-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Order Header */}
            <div className="bg-brand-50 px-3 md:px-6 py-3 md:py-4 border-b border-brand-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs text-brand-600 mb-1">Order Number</p>
                    <p className="font-semibold text-sm">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-600 mb-1">Order Date</p>
                    <p className="text-sm flex items-center gap-1">
                      <FiCalendar className="text-brand-400" />
                      {formatDate(order.orderDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-600 mb-1">Total Amount</p>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      <FiDollarSign className="text-brand-400" />{order?.checkoutCurrency === "USD" ? "$" : "₹"}
                      {order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div>
                    <p className="text-xs text-brand-600 mb-1">Order Status</p>
                    <Tag color={getStatusColor(order.orderStatus)}>
                      {order.orderStatus}
                    </Tag>
                  </div>
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
                  >
                    {expandedOrders.has(order.id)
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="px-3 md:px-6 py-3 md:py-4">
              <div className="flex items-center gap-2 mb-3">
                <FiPackage className="text-brand-400" />
                <span className="text-sm font-medium text-brand-800">
                  Order Items
                </span>
              </div>
              {order.orderItems && order.orderItems.length > 0 ? (
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
                  {order.orderItems.slice(0, 4).map((item: any) => (
                    <div
                      key={item.id}
                      className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden bg-brand-50 border border-brand-100"
                    >
                      <Image
                        src={getImageForColor(item) || "/assets/brand/je-inspi-logo-transparent.png"}
                        alt={item.jewellery?.name || "Product"}
                        width={80}
                        height={80}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  ))}
                  {order.orderItems.length > 4 && (
                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md bg-brand-50 border border-brand-100 flex items-center justify-center">
                      <span className="text-xs md:text-sm font-medium text-brand-700">
                        +{order.orderItems.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-brand-600">
                  Click "View Details" to see order items
                </p>
              )}
            </div>

            {/* Expanded Order Details */}
            {expandedOrders.has(order.id) && (
              <div className="border-t border-brand-100 bg-brand-50">
                <div className="px-3 md:px-6 py-3 md:py-4">
                  {loadingOrderDetails.has(order.id) ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader />
                    </div>
                  ) : order.orderItems && order.orderItems.length > 0 ? (
                    <>
                      <h4 className="font-semibold text-sm mb-4">
                        Order Items
                      </h4>
                      <div className="space-y-4">
                        {order.orderItems.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex flex-col md:flex-row gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-lg border border-brand-100"
                          >
                            <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-md overflow-hidden bg-brand-50 mx-auto md:mx-0">
                              <Image
                                src={getImageForColor(item)}
                                alt={item.jewellery?.name || "Product"}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                              <h5 className="font-semibold text-sm mb-2">
                                {item.jewellery?.name || "Product"}
                              </h5>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-brand-700">
                                <div>SKU: {item.sku}</div>
                                <div>Size: {item.selectedSize}</div>
                                <div>Color: {item.selectedColor}</div>
                                <div>Material: {item.material}</div>
                                <div>Quantity: {item.quantity}</div>
                                <div>
                                  Certificate: {" "}
                                  {item.includeCertificate ? "Yes" : "No"}
                                </div>
                              </div>
                            </div>
                            <div className="text-center md:text-right">
                              <p className="text-xs text-brand-600 mb-1">
                                Unit Price
                              </p>
                              <p className="font-semibold text-sm">
                                {order?.checkoutCurrency === "USD" ? "$" : "₹"}
                                {item.unitPrice.toFixed(2)}
                              </p>
                              <p className="text-xs text-brand-600 mt-2 mb-1">
                                Total
                              </p>
                              <p className="font-bold text-base">
                                {order?.checkoutCurrency === "USD" ? "$" : "₹"}{item.totalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Address */}
                      <div className="mt-4 md:mt-6 bg-white p-3 md:p-4 rounded-lg border border-brand-100">
                        <h4 className="font-semibold text-sm mb-2 md:mb-3">
                          Shipping Address
                        </h4>
                        <p className="text-sm text-brand-800">
                          {order.shippingAddress}
                          <br />
                          {order.shippingCity}, {order.shippingState}{" "}
                          {order.shippingPostalCode}
                          <br />
                          {order.shippingCountry}
                        </p>
                      </div>

                      {/* Payment Info */}
                      <div className="mt-3 md:mt-4 bg-white p-3 md:p-4 rounded-lg border border-brand-100">
                        <h4 className="font-semibold text-sm mb-2 md:mb-3">
                          Payment Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
                          <div>
                            <p className="text-brand-600">Payment Method</p>
                            <p className="font-medium">{order.paymentMethod === "INSTANT" ? "Instant" : "Payment Cycle"}</p>
                          </div>
                          {order.transactionId && (
                            <div>
                              <p className="text-brand-600">Transaction ID</p>
                              <p className="font-medium break-all">
                                {order.transactionId}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-brand-600">Subtotal</p>
                            <p className="font-medium">
                              {order?.checkoutCurrency === "USD" ? "$" : "₹"}{order.subtotal.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-brand-600">Tax</p>
                            <p className="font-medium">
                              {order?.checkoutCurrency === "USD" ? "$" : "₹"}{order.tax.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-brand-600">Shipping</p>
                            <p className="font-medium">
                              {order?.checkoutCurrency === "USD" ? "$" : "₹"}{order.shipping.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-brand-600">Total Amount</p>
                            <p className="font-bold text-base">
                              {order?.checkoutCurrency === "USD" ? "$" : "₹"}{order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-brand-600">No order items found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMoreOrders}
            disabled={loadingMore}
            className="px-6 py-2 border border-brand-200 rounded-md text-sm font-medium text-brand-800 bg-white hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'See More Orders'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
