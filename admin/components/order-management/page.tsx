"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Empty,
  Tooltip,
  Button,
  message,
  Input,
  Select,
  Tag,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  EyeOutlined,
  SearchOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Roboto } from "@/src/common/fonts";
import Loader from "@/components/common/loader";
import {
  purchaseAPI,
  PurchaseOrder,
  ORDER_STATUS,
  PAYMENT_STATUS,
} from "@/src/services/order-management/orders.api";
import dayjs from "dayjs";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

interface OrderRow {
  key: string;
  orderNumber: string;
  userName: string;
  orderDate: string;
  productsCount: number;
  paymentMethod: string;
  orderStatus: ORDER_STATUS;
  totalAmount: number;
  user: any;
}

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const router = useRouter();

  const fetchOrders = async (page: number, size: number, search?: string) => {
    setLoading(true);
    try {
      const params: any = {
        skip: (page - 1) * size,
        take: size,
        orderBy: "createdAt|desc",
        include: ["user"],
      };

      if (search && search.trim()) {
        params.search = search.trim();
        params.search_column = [
          "orderNumber",
          "user.firstName",
          "user.lastName",
          "user.email",
          "user.companyName",
        ];
      }

      const res = await purchaseAPI.getLatestPurchaseOrders(params);
      const list = res.list || [];
      const totalCount = res.total || 0;

      const mapped: OrderRow[] = list.map((item: PurchaseOrder) => ({
        key: item.id,
        orderNumber: item.orderNumber,
        userName: item.user
          ? `${item.user.firstName} ${item.user.lastName}`
          : "N/A",
        orderDate: item.orderDate,
        productsCount: item.orderItems?.length || 0,
        paymentMethod: item.paymentMethod,
        orderStatus: item.orderStatus,
        totalAmount: item.totalAmount,
        user: item.user,
        paymentStatus: item.paymentStatus,
        shippingAddress: item.shippingAddress,
        shippingCity: item.shippingCity,
        shippingState: item.shippingState,
        shippingCountry: item.shippingCountry,
        shippingPostalCode: item.shippingPostalCode,
        transactionId: item.transactionId,
      }));

      setOrders(mapped);
      setTotal(totalCount);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setCurrentPage(1);
      fetchOrders(1, pageSize, term);
    }, 300),
    [pageSize]
  );

  useEffect(() => {
    fetchOrders(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setCurrentPage(1);
      fetchOrders(1, pageSize);
    }
  }, [searchTerm, debouncedSearch, pageSize]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setCurrentPage(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: ORDER_STATUS,
    record: any
  ) => {
    try {
      setUpdatingOrderId(orderId);
      await purchaseAPI.updatePurchaseOrder(orderId, {
        orderStatus: newStatus,
        paymentStatus: record.paymentStatus,
        shippingAddress: record.shippingAddress,
        shippingCity: record.shippingCity,
        shippingState: record.shippingState,
        shippingCountry: record.shippingCountry,
        shippingPostalCode: record.shippingPostalCode,
        transactionId: record.transactionId || undefined,
      });
      message.success("Order status updated successfully");
      fetchOrders(currentPage, pageSize, searchTerm);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handlePaymentStatusChange = async (
    orderId: string,
    newPaymentStatus: PAYMENT_STATUS,
    record: any
  ) => {
    try {
      setUpdatingOrderId(orderId);
      await purchaseAPI.updatePurchaseOrder(orderId, {
        orderStatus: record.orderStatus,
        paymentStatus: newPaymentStatus,
        shippingAddress: record.shippingAddress,
        shippingCity: record.shippingCity,
        shippingState: record.shippingState,
        shippingCountry: record.shippingCountry,
        shippingPostalCode: record.shippingPostalCode,
        transactionId: record.transactionId || undefined,
      });
      message.success("Payment status updated successfully");
      fetchOrders(currentPage, pageSize, searchTerm);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Failed to update payment status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Simple debounce function
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const getStatusColor = (status: ORDER_STATUS) => {
    const colors: Record<ORDER_STATUS, string> = {
      [ORDER_STATUS.PENDING]: "default",
      [ORDER_STATUS.CONFIRMED]: "#6b8965",
      [ORDER_STATUS.PROCESSING]: "#6b8965",
      [ORDER_STATUS.SHIPPED]: "#6b8965",
      [ORDER_STATUS.DELIVERED]: "#526f4d",
      [ORDER_STATUS.CANCELLED]: "red",
      [ORDER_STATUS.REFUNDED]: "#6b8965",
    };
    return colors[status] || "default";
  };

  const getPaymentIcon = (method: string) => {
    if (method === "INSTANT") {
      return (
        <div className="flex items-center gap-2">
          <img
            src="/assets/common/payment_instant.svg"
            alt="Instant Payment"
            className="w-5 h-5"
          />
          <span className={`text-brand-800 ${roboto.className}`}>Instant</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <img
          src="/assets/common/payment_cycle.svg"
          alt="Payment Cycle"
          className="w-5 h-5"
        />
        <span className={`text-brand-800 ${roboto.className}`}>
          Payment Cycle
        </span>
      </div>
    );
  };

  const formatStatus = (text: any) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  const columns: ColumnsType<OrderRow> = [
    {
      title: <div className={`text-center ${roboto.className}`}>Name</div>,
      dataIndex: "userName",
      key: "userName",
      align: "center",
      render: (text) => (
        <span className={`font-medium text-brand-900 ${roboto.className}`}>
          {text}
        </span>
      ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Date</div>,
      dataIndex: "orderDate",
      key: "orderDate",
      align: "center",
      render: (date) => (
        <span className={`text-brand-700 ${roboto.className}`}>
          {dayjs(date).format("DD MMM, YYYY")}
        </span>
      ),
    },
    {
      title: (
        <div className={`text-center ${roboto.className}`}>
          Products (Types)
        </div>
      ),
      dataIndex: "productsCount",
      key: "productsCount",
      align: "center",
      render: (count) => (
        <span className={`text-brand-700 ${roboto.className}`}>
          {count || 1}
        </span>
      ),
    },
    {
      title: (
        <div className={`text-center ${roboto.className}`}>Payment Mode</div>
      ),
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "center",
      render: (method) => (
        <div className="flex justify-center items-center gap-2">
          {getPaymentIcon(method)}
        </div>
      ),
    },
    {
      title: (
        <div className={`text-center ${roboto.className}`}>Delivery Status</div>
      ),
      dataIndex: "orderStatus",
      key: "orderStatus",
      align: "center",
      render: (status: ORDER_STATUS, record) => (
        <Select
          value={formatStatus(status)}
          onChange={(value) => handleStatusChange(record.key, value, record)}
          loading={updatingOrderId === record.key}
          disabled={updatingOrderId === record.key}
          className={`w-32 ${roboto.className}`}
          suffixIcon={<CaretDownOutlined />}
          size="small"
        >
          {Object.values(ORDER_STATUS).map((statusValue) => (
            <Select.Option key={statusValue} value={statusValue}>
              {formatStatus(statusValue)}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: (
        <div className={`text-center ${roboto.className}`}>Payment Status</div>
      ),
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center",
      render: (status: PAYMENT_STATUS, record) =>
        record?.paymentMethod === "PAYMENT_CYCLE" ? (
          <Select
            value={formatStatus(status)}
            onChange={(value) =>
              handlePaymentStatusChange(record.key, value, record)
            }
            loading={updatingOrderId === record.key}
            disabled={updatingOrderId === record.key}
            className={`w-32 ${roboto.className}`}
            suffixIcon={<CaretDownOutlined />}
            size="small"
          >
            {Object.values(PAYMENT_STATUS).map((statusValue) => (
              <Select.Option key={statusValue} value={statusValue}>
                {formatStatus(statusValue)}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <p className={`text-center ${roboto.className}`}>{formatStatus(status)}</p>
        ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Action</div>,
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center">
          <Button
            type="link"
            onClick={() =>
              router.push(`/order-management/detail/${record.key}`)
            }
            className={`text-brand-900 underline ${roboto.className}`}
          >
            <EyeOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-100">
        <h1 className="text-2xl font-semibold text-brand-900">Order List</h1>
        <div className="flex items-center gap-3">
          {/* Search Field */}
          <div className="flex items-center gap-2 w-[280px]">
            <Input
              placeholder="Search by order number or user"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full h-10 ${roboto.className}`}
              size="middle"
              allowClear
              suffix={<SearchOutlined />}
            />
            {/* {searchTerm && (
              <Button
                icon={<ClearOutlined />}
                onClick={handleClearSearch}
                size="middle"
                type="text"
                className="text-brand-600 hover:text-brand-800 h-10"
              />
            )} */}
          </div>
        </div>
      </div>
      <div className="px-2 h-[calc(100%-65px)] overflow-y-scroll scrollbar">
        <Table
          columns={columns}
          dataSource={orders}
          loading={{
            spinning: loading,
            indicator: (
              <Loader
                message="Loading orders..."
                size={40}
                color="border-brand-600"
              />
            ),
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
          }}
          onChange={handleTableChange}
          locale={
            loading
              ? { emptyText: null }
              : {
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <div>
                          <h3 className="text-lg font-medium text-brand-800 mb-2">
                            Order List
                          </h3>
                          <p className="text-brand-600">No orders found.</p>
                        </div>
                      }
                    />
                  ),
                }
          }
        />
      </div>
    </div>
  );
};

export default OrderManagementPage;
