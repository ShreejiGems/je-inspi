"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Empty,
  Tooltip,
  Button,
  message,
  Modal,
  Input,
  Tag,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Roboto } from "@/src/common/fonts";
import Loader from "@/components/common/loader";
import {
  diamondAPI,
  Diamond,
  GetDiamondsParams,
} from "@/src/services/diamond/diamond.api";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

interface DiamondRow {
  key: string;
  image: string;
  name: string;
  sku: string;
  clarity: string;
  color: string;
  status: string;
  source: "API" | "MANUAL";
}

const DiamondListPage: React.FC = () => {
  const [diamonds, setDiamonds] = useState<DiamondRow[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const getFirstImage = (images: string | null | undefined) => {
    if (!images) return null;
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed[0] || null : null;
    } catch {
      return null;
    }
  };

  const fetchDiamonds = async (page: number, size: number, search?: string) => {
    setLoading(true);
    try {
      const params: GetDiamondsParams = {
        skip: (page - 1) * size,
        take: size,
        orderBy: "createdAt|desc",
      };

      if (search && search.trim()) {
        params.search = search.trim();
        params.search_column = ["name", "sku", "color", "clarity", "shape"];
      }

      const res = await diamondAPI.getAllDiamonds(params);
      const list = res.list || [];
      const totalCount = res.total || 0;

      const mapped: DiamondRow[] = list.map((item: Diamond) => ({
        key: item.id,
        image:
          getFirstImage(item.images) || "/assets/brand/je-inspi-logo-transparent.png",
        name: item.name,
        sku: item.sku || "N/A",
        clarity: item.clarity || "N/A",
        color: item.color || "N/A",
        status: item.status,
        source: item.source,
      }));

      setDiamonds(mapped);
      setTotal(totalCount);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Failed to fetch diamonds");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setCurrentPage(1);
      fetchDiamonds(1, pageSize, term);
    }, 300),
    [pageSize]
  );

  useEffect(() => {
    fetchDiamonds(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setCurrentPage(1);
      fetchDiamonds(1, pageSize);
    }
  }, [searchTerm, debouncedSearch, pageSize]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setCurrentPage(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await diamondAPI.deleteDiamond(id);
      message.success("Diamond deleted successfully");
      setDeleteModalVisible(false);
      setDeleteId(null);
      fetchDiamonds(currentPage, pageSize, searchTerm);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Failed to delete diamond");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      setLoading(true);
      if (currentStatus === "ENABLED") {
        await diamondAPI.disableDiamond(id);
        message.success("Diamond disabled successfully");
      } else {
        await diamondAPI.enableDiamond(id);
        message.success("Diamond enabled successfully");
      }
      fetchDiamonds(currentPage, pageSize, searchTerm);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Failed to update diamond status");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
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

  const columns: ColumnsType<DiamondRow> = [
    {
      title: <div className={`text-center ${roboto.className}`}>Image</div>,
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (src: any, record: any) => (
        <div className="flex justify-center items-center gap-2">
          <img
            src={src}
            alt="Diamond"
            className="w-9 h-9 object-cover rounded-lg transition-transform duration-200 hover:scale-110"
          />
        </div>
      ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Name</div>,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text) => (
        <span className={`font-medium text-brand-900 ${roboto.className}`}>
          {text}
        </span>
      ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Clarity</div>,
      dataIndex: "clarity",
      key: "clarity",
      align: "center",
      render: (text) => (
        <span className={`text-brand-700 ${roboto.className}`}>{text}</span>
      ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Color</div>,
      dataIndex: "color",
      key: "color",
      align: "center",
      render: (text) => (
        <span className={`text-brand-700 ${roboto.className}`}>{text}</span>
      ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Status</div>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => (
        <Tag color={status === "ENABLED" ? "#526f4d" : "red"}>{status}</Tag>
      ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Action</div>,
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center space-x-2">
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() =>
                router.push(
                  `/diamond/diamond-list/add-diamond?id=${record.key}&mode=view`
                )
              }
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              ghost
              onClick={() =>
                router.push(
                  `/diamond/diamond-list/add-diamond?id=${record.key}&mode=edit`
                )
              }
              style={{
                display: record.source === "MANUAL" ? "inline-flex" : "none"
              }}
            />
          </Tooltip>
          <button
            className={`w-10 h-5 rounded-full flex items-center transition-colors duration-200 cursor-pointer border ${
              record.status === "ENABLED"
                ? "bg-brand-400 border-brand-400"
                : "bg-brand-100 border-brand-200"
            }`}
            onClick={() => handleToggleStatus(record.key, record.status)}
            title={record.status === "ENABLED" ? "Disable" : "Enable"}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                record.status === "ENABLED" ? "translate-x-5" : ""
              }`}
            />
          </button>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => {
                setDeleteId(record.key);
                setDeleteModalVisible(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-100">
        <h1 className="text-2xl font-semibold text-brand-900">
          Diamond Listing
        </h1>
        <div className="flex items-center gap-3">
          {/* Search Field */}
          <div className="flex items-center gap-2 w-[280px]">
            <Input
              placeholder={`Search by name, sku, color, clarity`}
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
          <button
            onClick={() => router.push("/diamond/diamond-list/add-diamond")}
            disabled={loading}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Add Diamond
          </button>
        </div>
      </div>
      <div className="px-2 h-[calc(100%-65px)] overflow-y-scroll scrollbar">
        <Table
          columns={columns}
          dataSource={diamonds}
          loading={{
            spinning: loading,
            indicator: (
              <Loader
                message="Loading diamonds..."
                size={40}
                color="border-brand-600"
              />
            ),
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: false,
            showQuickJumper: false,
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
                            Diamond List
                          </h3>
                          <p className="text-brand-600">No diamonds found.</p>
                        </div>
                      }
                    />
                  ),
                }
          }
        />
      </div>

      <Modal
        title={
          <span
            className={`text-lg font-medium text-brand-900 ${roboto.className}`}
          >
            Confirm Delete
          </span>
        }
        open={deleteModalVisible}
        centered
        onOk={() => deleteId && handleDelete(deleteId)}
        onCancel={() => {
          setDeleteModalVisible(false);
          setDeleteId(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true, loading }}
        cancelText="Cancel"
        className={`${roboto.className} rounded-xl`}
        width={400}
      >
        <p className={`text-brand-800 text-base ${roboto.className}`}>
          Are you sure you want to delete this diamond?
        </p>
      </Modal>
    </div>
  );
};

export default DiamondListPage;
