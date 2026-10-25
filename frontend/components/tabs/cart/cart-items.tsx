"use client";

import { useState, useEffect } from "react";
import { cartAPI } from "@/src/services/cart.api";
import { message } from "antd";
import Image from "next/image";
import { FiMinus, FiPlus, FiTrash2, FiExternalLink } from "react-icons/fi";
import { garamond } from "@/src/common/helper";
import Loader from "@/components/common/loader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import CartOrderConfirmationModal from "@/components/order/cart-order-confirmation-modal";

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

interface CartItem {
  id: string;
  cartId: string;
  jewelleryId: string;
  variantId: string;
  quantity: number;
  sku: string;
  selectedColor: string;
  selectedSize: number;
  material: string;
  includeCertificate: boolean;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  jewellery: {
    id: string;
    name: string;
    images: string;
  };
  variant: {
    id: string;
    size: number;
    basePrice: number;
  };
  unitPrice: number;
  totalPrice: number;
}

interface CartResponse {
  id: string;
  cartItems: CartItem[];
  totalItems: number;
  subtotal: number;
}

const CartItems = () => {
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getUserCart();
      setCartData(response);
    } catch (error) {
      console.error("Error fetching cart:", error);
      message.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Toggle item selection
  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedItems.size === cartData?.cartItems.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(cartData?.cartItems.map((item) => item.id) || []);
      setSelectedItems(allIds);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (
    itemId: string,
    currentQuantity: number,
    change: number,
    includeCertificate: boolean
  ) => {
    const newQuantity = currentQuantity + change;

    // Validate quantity
    if (newQuantity < 1) {
      message.warning("Quantity cannot be less than 1");
      return;
    }

    if (newQuantity > 99) {
      message.warning("Maximum quantity is 99");
      return;
    }

    try {
      setUpdatingItems((prev) => new Set(prev).add(itemId));

      await cartAPI.updateCart({
        cartItemId: itemId,
        quantity: newQuantity,
        includeCertificate,
      });

      // Update local state
      if (cartData) {
        const updatedItems = cartData.cartItems.map((item) =>
          item.id === itemId
            ? {
              ...item,
              quantity: newQuantity,
              totalPrice: item.unitPrice * newQuantity
            }
            : item
        );
        setCartData({
          ...cartData,
          cartItems: updatedItems,
          totalItems: updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
        });
      }

      // message.success("Quantity updated");
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Failed to update quantity");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    try {
      setUpdatingItems((prev) => new Set(prev).add(itemId));

      await cartAPI.removeFromCart({ cartItemId: itemId });

      // Update local state
      if (cartData) {
        const updatedItems = cartData.cartItems.filter(
          (item) => item.id !== itemId
        );
        setCartData({
          ...cartData,
          cartItems: updatedItems,
          totalItems: updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
        });

        // Remove from selected items
        setSelectedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }

      message.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      message.error("Failed to remove item");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Get image for selected color
  const getImageForColor = (item: CartItem) => {
    const imagesRaw = item.jewellery.images;

    const images = Array.isArray(imagesRaw)
      ? imagesRaw
      : parseImages(imagesRaw);

    const colorImage = images.find(
      (img) => img.color === item.selectedColor
    );

    return (
      colorImage?.image ||
      images[0]?.image ||
      "/assets/brand/je-inspi-logo-transparent.png"
    );
  };


  // Calculate order summary
  const calculateOrderSummary = () => {
    const selectedCartItems =
      cartData?.cartItems.filter((item) => selectedItems.has(item.id)) || [];

    // Calculate subtotal from selected items only
    const subtotal = selectedCartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    return {
      subtotal,
    };
  };

  const orderSummary = calculateOrderSummary();

  // Get user payment mode
  const getUserPaymentMode = () => {
    if (typeof window === "undefined") return "PAYMENT_CYCLE";

    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        return parsedData.paymentMode || "PAYMENT_CYCLE";
      }
    } catch (error) {
      console.error("Error fetching user payment mode:", error);
    }
    return "PAYMENT_CYCLE";
  };

  const paymentMode = getUserPaymentMode();

  // Prepare cart items for order
  const prepareOrderItems = () => {
    const selectedCartItems =
      cartData?.cartItems.filter((item) => selectedItems.has(item.id)) || [];

    return selectedCartItems.map((item) => ({
      jewelleryId: item.jewelleryId,
      variantId: item.variantId,
      sku: item.sku,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.variant.size,
      material: item.material,
      includeCertificate: item.includeCertificate,
      productName: item.jewellery.name,
      productPrice: item.totalPrice,
    }));
  };

  const handleBuyNow = () => {
    if (selectedItems.size === 0) {
      message.warning("Please select at least one item to purchase");
      return;
    }
    setIsOrderModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (!cartData || cartData.cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className={`text-2xl font-semibold mb-2 ${garamond.className}`}>
          Your cart is empty
        </h3>
        <p className={`text-brand-700 mb-6 ${garamond.className}`}>
          Add some beautiful jewellery to get started!
        </p>
        <button
          onClick={() => router.push("/jewellery")}
          className={`bg-gradient-to-r cursor-pointer from-brand-600 via-brand-600 to-brand-700 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all ${garamond.className}`}
        >
          Browse Jewellery
        </button>
      </div>
    );
  }

  // Order Summary
  const subtotal = orderSummary.subtotal || 0;
  const userDiscount = user?.discount || 0;

  const discountAmount = userDiscount > 0 ? (subtotal * userDiscount) / 100 : 0;

  const totalAmount = subtotal;

  return (
    <div className={`${garamond.className}`}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items Section */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border-1 border-[#aec2a4] overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-brand-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cartData.cartItems.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer accent-brand-500"
                  />
                  <h2 className="text-base font-semibold text-brand-800">
                    Product Code
                  </h2>
                </div>
                <div className="hidden md:flex text-sm gap-4 font-semibold text-brand-800">
                  <span className="w-24 text-center">Quantity</span>
                  <span className="w-24 text-center">Total</span>
                  <span className="w-16 text-center">Action</span>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-brand-100">
              {cartData.cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-6 transition-all ${updatingItems.has(item.id) ? "opacity-50" : ""
                    }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="w-4 h-4 mt-2 cursor-pointer accent-brand-500"
                      disabled={updatingItems.has(item.id)}
                    />

                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-brand-50">
                      <Image
                        src={
                          getImageForColor(item) ||
                          "/assets/brand/je-inspi-logo-transparent.png"
                        }
                        alt={item.jewellery.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="text-base font-semibold mb-1 text-brand-900">
                            {item.jewellery.name.toUpperCase()}
                          </h3>
                          <p className="text-xs text-brand-600 mb-2">
                            {item.sku} {item.includeCertificate ? "(Included Certificate)" : ""}
                          </p>
                          <p className="text-base font-semibold text-brand-900">
                            ${item.unitPrice.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2 border border-brand-200 rounded-md px-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity,
                                  -1,
                                  item.includeCertificate
                                )
                              }
                              disabled={
                                updatingItems.has(item.id) || item.quantity <= 1
                              }
                              className="w-7 h-7 flex cursor-pointer items-center justify-center hover:bg-brand-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity,
                                  1,
                                  item.includeCertificate
                                )
                              }
                              disabled={
                                updatingItems.has(item.id) ||
                                item.quantity >= 99
                              }
                              className="w-7 h-7 cursor-pointer flex items-center justify-center hover:bg-brand-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>

                          {/* Total Price */}
                          <div className="w-24 text-center">
                            <p className="font-semibold text-base text-brand-900">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/jewellery/product-detail?id=${item?.jewelleryId}`
                                )
                              }
                              disabled={updatingItems.has(item.id)}
                              className="w-[18px] h-[18px] flex items-center cursor-pointer justify-center text-brand-700 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Go to detail"
                            >
                              <FiExternalLink size={18} />
                            </button>
                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={updatingItems.has(item.id)}
                              className="w-[18px] h-[18px] flex items-center cursor-pointer justify-center text-brand-700 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove from cart"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-96">
          <div className="bg-white rounded-lg border-1 border-[#aec2a4] overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-brand-100">
              <h2 className="text-lg font-semibold text-brand-900">
                Order Summary
              </h2>
            </div>

            <div className="p-6 space-y-3">
              {selectedItems.size === 0 ? (
                <p className="text-center text-brand-600 py-8 text-sm">
                  Select items to see order summary
                </p>
              ) : (
                <>
                  <>
                    {/* Subtotal */}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-brand-700">Sub Total</span>
                      <span className="text-base font-semibold text-brand-900">
                        $ {subtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Product Discount */}
                    {/* <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-brand-700">
                        Product Discount
                        {userDiscount > 0 && (
                          <span className="ml-1 text-brand-600">
                            ({userDiscount}%)
                          </span>
                        )}
                      </span>
                      <span className="text-base font-semibold text-brand-900">
                        {userDiscount > 0
                          ? `- $${discountAmount.toFixed(2)}`
                          : "-"}
                      </span>
                    </div> */}

                    {/* Delivery */}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-brand-700">
                        Delivery Charge
                      </span>
                      <span className="text-base font-semibold text-brand-600">
                        FREE
                      </span>
                    </div>

                    {/* Total */}
                    <div className="border-t border-brand-100 pt-3 mt-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-semibold text-brand-800">
                          TOTAL
                        </span>
                        <span className="text-lg font-bold text-brand-900">
                          $ {totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-brand-600 italic">
                        Excl. import taxes, duties, & clearance
                      </div>
                    </div>

                    {/* You Save */}
                    {/* <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-brand-700">You Save</span>
                      <span className="text-base font-semibold text-brand-700">
                        {userDiscount > 0
                          ? `$ ${discountAmount.toFixed(2)}`
                          : "-"}
                      </span>
                    </div> */}
                  </>

                  <button
                    onClick={handleBuyNow}
                    disabled={selectedItems.size === 0}
                    className="w-full cursor-pointer bg-white border border-brand-900 text-brand-900 py-2.5 rounded-md font-medium hover:bg-brand-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm"
                  >
                    Buy Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <CartOrderConfirmationModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSuccess={async (orderData) => {
          // Refresh cart after successful order
          await fetchCart();
          // Clear selected items
          setSelectedItems(new Set());
          // Navigate to orders page
          router.push("/orders");
        }}
        paymentMethod={paymentMode === "INSTANT" ? "INSTANT" : "PAYMENT_CYCLE"}
        cartItems={prepareOrderItems()}
        totalAmount={totalAmount}
      />
    </div>
  );
};

export default CartItems;
