'use client';
import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, message, Spin, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { Roboto } from '@/src/common/fonts';
import Loader from "@/components/common/loader";
import { purchaseAPI, PurchaseOrder, ORDER_STATUS } from '@/src/services/order-management/orders.api';
import dayjs from 'dayjs';

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const OrderDetailPage: React.FC = () => {
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await purchaseAPI.getOrderById(orderId);
      setOrder(res);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ORDER_STATUS) => {
    const colors: Record<ORDER_STATUS, string> = {
      [ORDER_STATUS.PENDING]: 'default',
      [ORDER_STATUS.CONFIRMED]: '#6b8965',
      [ORDER_STATUS.PROCESSING]: '#6b8965',
      [ORDER_STATUS.SHIPPED]: '#6b8965',
      [ORDER_STATUS.DELIVERED]: '#526f4d',
      [ORDER_STATUS.CANCELLED]: 'red',
      [ORDER_STATUS.REFUNDED]: '#6b8965',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)] flex items-center justify-center">
        <Loader message="Loading order details..." size={40} color="border-brand-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)] flex items-center justify-center">
        <Empty description="Order not found" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-100 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            type="text"
            className="text-brand-700 hover:text-brand-900"
          />
          <h1 className="text-2xl font-semibold text-brand-900">Order Details</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 gap-6 flex flex-col">
        {/* Order Information */}
        <Card title={<span className={`font-semibold ${roboto.className}`}>Order Information</span>} className="shadow-sm">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Order Number" span={2}>
              <span className={`font-medium ${roboto.className}`}>{order.orderNumber}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Order Date">
              {dayjs(order.orderDate).format('DD MMM, YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Order Status">
              <Tag color={getStatusColor(order.orderStatus)}>{order.orderStatus}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {order.paymentMethod}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <Tag color={order.paymentStatus === 'PENDING' ? '#6b8965' : '#526f4d'}>
                {order.paymentStatus}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Transaction ID" span={2}>
              {order.transactionId || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Customer Information */}
        {order.user && (
          <Card title={<span className={`font-semibold ${roboto.className}`}>Customer Information</span>} className="shadow-sm">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Name">
                {order.user.firstName} {order.user.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {order.user.email}
              </Descriptions.Item>
              <Descriptions.Item label="Company">
                {order.user.companyName}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile">
                {order.user.countryCode} {order.user.mobile}
              </Descriptions.Item>
              <Descriptions.Item label="Business Type">
                {order.user.bussinessType}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Mode">
                {order.user.paymentMode}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* Shipping Information */}
        <Card title={<span className={`font-semibold ${roboto.className}`}>Shipping Information</span>} className="shadow-sm">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Address">
              {order.shippingAddress}
            </Descriptions.Item>
            <Descriptions.Item label="City">
              {order.shippingCity}
            </Descriptions.Item>
            <Descriptions.Item label="State">
              {order.shippingState}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {order.shippingCountry}
            </Descriptions.Item>
            <Descriptions.Item label="Postal Code">
              {order.shippingPostalCode}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Order Items */}
        {order.orderItems && order.orderItems.length > 0 && (
          <Card title={<span className={`font-semibold ${roboto.className}`}>Order Items</span>} className="shadow-sm">
            <div className="space-y-4">
              {order.orderItems.map((item: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-brand-50">
                  <div className="flex gap-4">
                    {/* Product Image - You may need to fetch jewellery details to get the image */}
                    <div className="w-32 h-32 bg-white rounded-lg border flex items-center justify-center">
                      <img
                        src={item.image || '/assets/brand/je-inspi-wordmark.png'}
                        alt="Product"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <Descriptions column={2} size="small">
                        <Descriptions.Item label="SKU" span={2}>
                          <span className={`font-medium ${roboto.className}`}>{item.sku}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Quantity">
                          {item.quantity}
                        </Descriptions.Item>
                        <Descriptions.Item label="Size">
                          {item.selectedSize}
                        </Descriptions.Item>
                        <Descriptions.Item label="Color">
                          {item.selectedColor}
                        </Descriptions.Item>
                        <Descriptions.Item label="Material">
                          {item.material}
                        </Descriptions.Item>
                        <Descriptions.Item label="Certificate" span={2}>
                          <Tag color={item.includeCertificate ? '#526f4d' : 'red'}>
                            {item.includeCertificate ? 'Yes' : 'No'}
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Order Summary */}
        <Card title={<span className={`font-semibold ${roboto.className}`}>Order Summary</span>} className="shadow-sm">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Subtotal">
              ${order.subtotal.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Tax">
              ${order.tax.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Shipping">
              ${order.shipping.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label={<span className="font-semibold">Total Amount</span>}>
              <span className="text-lg font-bold text-brand-700">
                ${order.totalAmount.toFixed(2)}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailPage;
