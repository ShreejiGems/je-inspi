"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Empty,
  Tooltip,
  Button,
  message,
  Popconfirm,
  Modal,
  Input,
  Select,
  Upload,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ClearOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Roboto } from "@/src/common/fonts";
import Loader from "@/components/common/loader";
import {
  jewelleryProductAPI,
  Product as APIProduct,
} from "@/src/services/product-services/jewellery-product.api";
import { uploadAPI } from "@/src/services/api";
import { IoWarning } from "react-icons/io5";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

interface ProductRow {
  key: string;
  image: string;
  name: string;
  type: string;
  sku: string;
  typeName: string;
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const getFirstImage = (
    images: string | Array<{ image: string }> | null | undefined
  ) => {
    if (!images) return null;

    // If already an array → return directly
    if (Array.isArray(images)) {
      return images[0]?.image || null;
    }

    // If string → try parsing
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed[0]?.image || null : null;
    } catch {
      return null;
    }
  };

  const fetchProducts = async (page: number, size: number, search?: string) => {
    setLoading(true);
    try {
      const params: any = {
        skip: (page - 1) * size,
        take: size,
        orderBy: "createdAt|desc",
        include: ["type", "subCategory", "category"],
      };

      if (search && search.trim()) {
        params.search = search.trim();
        params.search_column = [
          "name",
          "sku",
          "type.name",
          "subCategory.name",
          "category.name",
        ];
      }
      const res = await jewelleryProductAPI.getAllProducts(params);
      const list = (res as any).list || [];
      const totalCount = (res as any).total || 0;

      const mapped: ProductRow[] = list.map((item: any) => ({
        key: item.id,
        image:
          getFirstImage(item.images) || "/assets/brand/je-inspi-wordmark.png", // fallback if no image field
        name: item.name,
        type: item.typeId || "N/A",
        sku: item.sku || "N/A",
        typeName: item.type?.name || "N/A",
        subCategoryName: item.subCategory?.name || "N/A",
        categoryName: item.category?.name || "N/A",
        basePrice: item.basePrice,
      }));

      setProducts(mapped);
      setTotal(totalCount);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string, column: string) => {
      setCurrentPage(1); // Reset to first page on search
      fetchProducts(1, pageSize, term);
    }, 300),
    [pageSize]
  );

  useEffect(() => {
    fetchProducts(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setCurrentPage(1);
      fetchProducts(1, pageSize);
    }
  }, [searchTerm, debouncedSearch, pageSize]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setCurrentPage(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await jewelleryProductAPI.deleteProduct(id);
      message.success("Product deleted successfully");
      setDeleteModalVisible(false);
      fetchProducts(currentPage, pageSize);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Failed to delete product");
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

  const handleImportProduct = async () => {
    if (!uploadedFile) {
      message.error("Please select an Excel file to upload");
      return;
    }

    setUploading(true);
    try {
      // Step 1: Get presigned URL from API
      const { preSignedUrl, outPutUrl } = await uploadAPI.getPresignedUrl(
        uploadedFile.name,
        "FILE",
        "JEWELLERY"
      );

      // Step 2: Upload file to S3
      await uploadAPI.uploadToS3(preSignedUrl, uploadedFile);

      // Step 3: Call import API with the output URL
      await jewelleryProductAPI.importProduct(outPutUrl);

      message.success("Products imported successfully!");

      // Step 4: Refresh product list
      fetchProducts(currentPage, pageSize, searchTerm);

      // Close modal and reset state
      setImportModalVisible(false);
      setUploadedFile(null);
    } catch (error: any) {
      console.error("Import error:", error);
      message.error(error.message || "Failed to import products");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (info: any) => {
    const file = info.file;

    // Validate file type
    const isExcel =
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".xlsx");

    if (!isExcel) {
      message.error("You can only upload Excel files (.xls, .xlsx)!");
      return;
    }

    // Validate file size (max 10MB)
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("File must be smaller than 10MB!");
      return;
    }

    setUploadedFile(file);
    message.success(`${file.name} selected successfully`);
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

  const columns: ColumnsType<ProductRow> = [
    {
      title: <div className={`text-center ${roboto.className}`}></div>,
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (src: any, record: any) =>
        !record?.basePrice && (
          <Tooltip
            title="Need to take action, base price is 0"
            placement="topLeft"
            arrow={false}
          >
            <div className="flex justify-center items-center gap-2 cursor-pointer">
              <IoWarning className="text-red-500 w-6 h-6" />
            </div>
          </Tooltip>
        ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Image</div>,
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (src: any, record: any) => (
        <div className="flex justify-center items-center gap-2">
          <img
            src={src}
            alt="Product"
            className="w-9 h-9 object-cover rounded-lg transition-transform duration-200 hover:scale-110"
          />
          <p className={`font-medium text-brand-900 ${roboto.className}`}>
            {record.sku}
          </p>
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
      title: <div className={`text-center ${roboto.className}`}>Type</div>,
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (text: any, record: any) => (
        <span className={`text-brand-700 ${roboto.className}`}>
          {record.categoryName}-{record.subCategoryName}-{record.typeName}
        </span>
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
                  `/jewellery/product-list/add-product?id=${record.key}&mode=view`
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
                  `/jewellery/product-list/add-product?id=${record.key}&mode=edit`
                )
              }
            />
          </Tooltip>
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
          Jewellery Product List
        </h1>
        <div className="flex items-center gap-3">
          {/* Search Field */}
          <div className="flex items-center gap-2 w-[280px]">
            <Input
              placeholder={`Search by name, type and sku`}
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
            onClick={() => setImportModalVisible(true)}
            disabled={loading}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white rounded-lg transition-colors duration-200 cursor-pointer flex items-center gap-2"
          >
            <UploadOutlined />
            Import Products
          </button>
          <button
            onClick={() => router.push("/jewellery/product-list/add-product")}
            disabled={loading}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Add Products
          </button>
        </div>
      </div>
      <div className="px-2 h-[calc(100%-65px)] overflow-y-scroll scrollbar">
        <Table
          columns={columns}
          dataSource={products}
          loading={{
            spinning: loading,
            indicator: (
              <Loader
                message="Loading products..."
                size={40}
                color="border-brand-600"
              />
            ),
          }}
          rowClassName={(record: any) => (record?.basePrice ? "" : "row-error")}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            // showSizeChanger: true,
            // pageSizeOptions: ['5', '10', '20', '50'],
          }}
          onChange={handleTableChange}
          locale={
            loading
              ? { emptyText: null } // 👈 hide "No Data" while loading
              : {
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <div>
                          <h3 className="text-lg font-medium text-brand-800 mb-2">
                            Product List
                          </h3>
                          <p className="text-brand-600">No products found.</p>
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
        onOk={async () => handleDelete(deleteId || "")}
        onCancel={() => {
          setDeleteModalVisible(false);
          setDeleteId(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true, loading }}
        cancelText="Cancel"
        className={`${roboto.className} rounded-xl`} // Apply font to entire modal
        width={400}
      >
        <p className={`text-brand-800 text-base ${roboto.className}`}>
          Are you sure you want to delete this product?
        </p>
      </Modal>

      <Modal
        title={
          <span
            className={`text-lg font-medium text-brand-900 ${roboto.className}`}
          >
            Import Products
          </span>
        }
        open={importModalVisible}
        centered
        onOk={handleImportProduct}
        onCancel={() => {
          setImportModalVisible(false);
          setUploadedFile(null);
        }}
        okText="Import"
        okButtonProps={{ loading: uploading, disabled: !uploadedFile }}
        cancelText="Cancel"
        className={`${roboto.className} rounded-xl`}
        width={500}
      >
        <div className="py-4">
          <p className={`text-brand-800 text-base mb-4 ${roboto.className}`}>
            Upload an Excel file (.xls or .xlsx) to import products in bulk.
          </p>
          <Upload.Dragger
            name="file"
            multiple={false}
            beforeUpload={() => false}
            onChange={handleFileChange}
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            maxCount={1}
            className={roboto.className}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#526f4d" }} />
            </p>
            <p className={`ant-upload-text ${roboto.className}`}>
              Click or drag Excel file to this area to upload
            </p>
            <p className={`ant-upload-hint ${roboto.className}`}>
              Support for .xls and .xlsx files. Maximum file size: 10MB
            </p>
          </Upload.Dragger>
          {uploadedFile && (
            <div
              className={`mt-4 p-3 bg-brand-50 border border-brand-200 rounded-lg ${roboto.className}`}
            >
              <p className="text-brand-700 text-sm">
                <strong>Selected file:</strong> {uploadedFile.name}
              </p>
              <p className="text-brand-600 text-xs mt-1">
                Size: {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProductListPage;
