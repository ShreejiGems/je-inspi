"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, message, Select } from "antd";
import { garamond } from "@/src/common/helper";
import {
  purchaseAPI,
  CreatePurchaseOrderRequest,
} from "@/src/services/purchase.api";
import { calculatorAPI, CalculatorData } from "@/src/services/calculator.api";
import { MATERIALS_OPTION } from "@/src/libs/constants";

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderData: any) => void;
  paymentMethod: "INSTANT" | "PAYMENT_CYCLE";
  orderData: {
    jewelleryId: string;
    variantId: string;
    sku: string;
    quantity: number;
    selectedColor: string;
    selectedSize: number;
    material: string;
    includeCertificate: boolean;
    productName?: string;
    productPrice?: number;
  };
}

type Currency = "INR" | "USD";

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  paymentMethod,
  orderData,
}) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [calculatorData, setCalculatorData] = useState<CalculatorData | null>(null);

  // Format currency based on selected currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    // Get user data from localStorage
    try {
      const userDataStr = localStorage.getItem("userData");
      if (userDataStr) {
        const parsedData = JSON.parse(userDataStr);
        setUserData(parsedData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    // Fetch calculator data
    const fetchCalculatorData = async () => {
      try {
        const data = await calculatorAPI.getCalculatorData();
        setCalculatorData(data);
      } catch (error) {
        console.error("Error fetching calculator data:", error);
      }
    };

    fetchCalculatorData();
  }, []);

  const getTotalAmount = () => {
    const baseAmount = (orderData.productPrice || 0) * orderData.quantity;

    // Apply currency conversion if INR is selected and calculator data is available
    if (currency === "INR" && calculatorData && calculatorData.dollarRupeeRate) {
      return baseAmount * calculatorData.dollarRupeeRate;
    }

    return baseAmount;
  };

  const handleRazorpaySuccess = async (response: any) => {
    try {
      // The order is already created, just update the transaction ID
      const transactionId = response.razorpay_payment_id;
      // No need to call the API again as webhook will handle the payment confirmation
      message.success("Payment successful! Your order has been placed.");
      onSuccess(response);
      onClose();
    } catch (error: any) {
      console.error("Error creating purchase order:", error);
      message.error(
        error?.response?.data?.message ||
        "Failed to create order. Please try again."
      );
    }
  };

  const handleConfirmOrder = async () => {
    if (!userData) {
      message.error("User data not found. Please login again.");
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === "INSTANT") {

        // First create the order
        const payload: CreatePurchaseOrderRequest = {
          orderItems: [
            {
              jewelleryId: orderData.jewelleryId,
              variantId: orderData.variantId,
              sku: orderData.sku,
              quantity: orderData.quantity,
              selectedColor: orderData.selectedColor,
              selectedSize: orderData.selectedSize,
              material:
                orderData.material === "silver"
                  ? "SILVER"
                  : orderData.material === "eighteenKtGold"
                    ? "EIGHTEEN_KT_GOLD"
                    : orderData.material === "forteenKtGold"
                      ? "FORTEEN_KT_GOLD"
                      : "TEN_KT_GOLD",
              includeCertificate: orderData.includeCertificate,
            },
          ],
          paymentMethod: paymentMethod,
          shippingAddress: userData.address || "N/A",
          shippingCity: userData.city || "N/A",
          shippingState: userData.state || "N/A",
          shippingCountry: userData.country || "N/A",
          shippingPostalCode: userData.postalCode || "N/A",
          transactionId: `txn_${Date.now()}`,
          checkoutCurrency: currency,
        };

        // Create the order first
        const orderResponse = await purchaseAPI.createPurchaseOrder(payload);

        // Initialize Razorpay with the order ID from the response
        const totalAmount = getTotalAmount(); 
        const options = {
          key: orderResponse.razorpayKeyId,
          amount: Math.round(totalAmount * 100),
          currency: currency,
          name: "JE-Inspi",
          description: `Order #${orderResponse.purchaseOrder.orderNumber}`,
          order_id: orderResponse.razorpayOrder.id,
          handler: async (response: any) => {
            await handleRazorpaySuccess(response);
          },
          prefill: {
            name: `${userData.firstName || ""} ${userData.lastName || ""
              }`.trim(),
            email: userData.email || "",
            contact: userData.mobile || userData.companyNumber || "",
          },
          theme: {
            color: "#6b8965",
          },
          modal: {
            ondismiss: async () => {
              setLoading(false);
              try {
                // Delete the purchase order when payment is cancelled
                await purchaseAPI.deletePurchaseOrder(orderResponse.purchaseOrder.id);
                console.log("Purchase order deleted successfully:", orderResponse.purchaseOrder.id);
              } catch (deleteError) {
                console.error("Error deleting purchase order:", deleteError);
              }
              message.warning("Payment cancelled. Please try again.");
            },
          },
        };



        const razorpayWindow = (window as any).Razorpay;
        if (razorpayWindow) {
          const rzp = new razorpayWindow(options);
          rzp.open();
        } else {
          throw new Error(
            "Razorpay script not loaded. Please refresh the page."
          );
        }
      } else {
        const payload: CreatePurchaseOrderRequest = {
          orderItems: [
            {
              jewelleryId: orderData.jewelleryId,
              variantId: orderData.variantId,
              sku: orderData.sku,
              quantity: orderData.quantity,
              selectedColor: orderData.selectedColor,
              selectedSize: orderData.selectedSize,
              material:
                orderData.material === "silver"
                  ? "SILVER"
                  : orderData.material === "eighteenKtGold"
                    ? "EIGHTEEN_KT_GOLD"
                    : orderData.material === "forteenKtGold"
                      ? "FORTEEN_KT_GOLD"
                      : "TEN_KT_GOLD",
              includeCertificate: orderData.includeCertificate,
            },
          ],
          paymentMethod: paymentMethod,
          shippingAddress: userData.address || "N/A",
          shippingCity: userData.city || "N/A",
          shippingState: userData.state || "N/A",
          shippingCountry: userData.country || "N/A",
          shippingPostalCode: userData.postalCode || "N/A",
          checkoutCurrency: currency,
        };

        const response = await purchaseAPI.createPurchaseOrder(payload);

        message.success("Order placed successfully!");
        onSuccess(response);
        onClose();
      }
    } catch (error: any) {
      console.error("Error processing order:", error);
      message.error(
        error?.message ||
        error?.response?.data?.message ||
        "Failed to process order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="text-center">
          <h2
            className="text-2xl font-bold"
            style={{ color: "#6b8965", fontFamily: garamond.style.fontFamily }}
          >
            {paymentMethod === "INSTANT" ? "Confirm Payment" : "Confirm Order"}
          </h2>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      style={{ height: "80vh" }}
      styles={{
        header: { borderBottom: "1px solid #f1f4ed", padding: "16px 24px" },
        body: { padding: 0, height: "calc(80vh - 120px)", overflow: "hidden" },
      }}
    >
      <div className={`flex flex-col h-full ${garamond.className}`}>
        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd9c3 #f8f7f1" }}
        >
          {/* Order Summary */}
          <div className="bg-brand-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              <Select
                value={currency}
                onChange={(value) => setCurrency(value as Currency)}
                className={`w-32 ${garamond.className}`}
                options={[
                  { value: "INR", label: "INR (₹)" },
                  { value: "USD", label: "USD ($)" },
                ]}
              />
            </div>

            {orderData.productName && (
              <div className="flex justify-between">
                <span className="text-brand-700">Product:</span>
                <span className="font-medium">{orderData.productName}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-brand-700">SKU:</span>
              <span className="font-medium">{orderData.sku}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-brand-700">Size:</span>
              <span className="font-medium">{orderData.selectedSize}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-brand-700">Color:</span>
              <span className="font-medium">{orderData.selectedColor}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-brand-700">Material:</span>
              <span className="font-medium">
                {MATERIALS_OPTION.find((m) => m.value === orderData.material)?.label ||
                  "N/A"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-brand-700">Certificate:</span>
              <span className="font-medium">
                {orderData.includeCertificate ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-brand-700">Quantity:</span>
              <span className="font-medium">{orderData.quantity}</span>
            </div>

            {orderData.productPrice && (
              <div className="flex justify-between">
                <span className="text-brand-700">Unit Price:</span>
                <span className="font-medium">
                  {formatCurrency(orderData.productPrice * (currency === "INR" && calculatorData?.dollarRupeeRate ? calculatorData.dollarRupeeRate : 1))}
                </span>
              </div>
            )}

            {orderData.productPrice && (
              <div className="flex justify-between pt-3 border-t border-brand-200">
                <span className="text-brand-900 font-semibold">Total:</span>
                <span className="font-bold text-lg">
                  {formatCurrency(getTotalAmount())}
                </span>
              </div>
            )}
          </div>

          {/* Shipping Address */}
          {userData && (
            <div className="bg-brand-50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-lg mb-3">Shipping Address</h3>
              <p className="text-sm text-brand-800">
                {userData.address || ""}
                <br />
                {userData.city || ""}, {userData.state || ""}{" "}
                {userData.postalCode || ""}
                <br />
                {userData.country || ""}
              </p>
            </div>
          )}

          {/* Payment Method Info */}
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
            <p className="text-sm text-brand-800">
              {paymentMethod === "INSTANT" ? (
                <>
                  <strong>Payment Method:</strong> Instant Payment
                  <br />
                  <span className="text-xs text-brand-700">
                    You will be redirected to payment gateway after
                    confirmation.
                  </span>
                </>
              ) : (
                <>
                  <strong>Payment Method:</strong> Payment Cycle
                  <br />
                  <span className="text-xs text-brand-700">
                    Your order will be confirmed and payment will be processed
                    according to your payment cycle.
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="border-t border-brand-100 px-6 py-4 bg-white">
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-11 rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleConfirmOrder}
              loading={loading}
              disabled={loading}
              className={`flex-1 h-11 rounded-full !bg-gradient-to-r !from-brand-600 !via-brand-600 !text-white !to-brand-700 hover:!bg-gradient-to-br !border-0 ${garamond.className}`}
            >
              {paymentMethod === "INSTANT" ? "Confirm & Pay" : "Confirm Order"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderConfirmationModal;
