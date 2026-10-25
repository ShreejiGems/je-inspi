"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Avatar,
  Card,
  Modal,
  message,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import {
  userAPI,
  User,
  PendingRequestsParams,
  ApproveUserRequest,
} from "@/src/services/user/user.api";
import ApprovalModal from "./approval-modal";
import RejectModal from "./reject-modal";
import UserDetailsModal from "./user-details-modal";
import Empty from "antd/es/empty";
import Loader from "@/components/common/loader";
import { Roboto } from "@/src/common/fonts";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const { Search } = Input;
const { confirm } = Modal;

const PendingRequests = () => {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [approvalModal, setApprovalModal] = useState({
    isOpen: false,
    user: null as User | null,
    loading: false,
  });

  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    user: null as User | null,
    loading: false,
  });

  const [viewModal, setViewModal] = useState({
    isOpen: false,
    user: null as User | null,
  });

  // Fetch pending requests
  const fetchPendingRequests = async (params: PendingRequestsParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response: any = await userAPI.getPendingRequests({
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
        search: searchTerm || undefined,
        include: ["password", "referenceDetails"],
        search_column: searchTerm
          ? ["firstName", "lastName", "email", "mobile", "country"]
          : undefined,
        ...params,
      });

      console.log("Pending Requests Response:", response);
      setUsers(response.list || []);
      setTotalUsers(response.total);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending requests");
    } finally {
      setLoading(false);
    }
  };

  // Load pending requests on component mount and when dependencies change
  useEffect(() => {
    fetchPendingRequests();
  }, [currentPage, searchTerm]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle approve user
  const handleApproveUser = async (data: ApproveUserRequest) => {
    if (!approvalModal.user) return;

    try {
      setApprovalModal((prev) => ({ ...prev, loading: true }));
      await userAPI.approveUser(approvalModal.user.id, data);

      // Close modal and refresh list
      setApprovalModal({ isOpen: false, user: null, loading: false });
      fetchPendingRequests();
    } catch (err: any) {
      setError(err.message || "Failed to approve user");
      setApprovalModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Handle reject user
  const handleRejectUser = async (userId: string, reason?: string) => {
    try {
      setRejectModal((prev) => ({ ...prev, loading: true }));
      // Note: API currently doesn't support rejection reason, but keeping for future enhancement
      await userAPI.rejectUser(userId);
      message.success("User rejected successfully");

      // Close modal and refresh list
      setRejectModal({ isOpen: false, user: null, loading: false });
      fetchPendingRequests();
    } catch (err: any) {
      message.error(err.message || "Failed to reject user");
      setRejectModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Open reject modal
  const openRejectModal = (user: User) => {
    setRejectModal({ isOpen: true, user, loading: false });
  };

  // Get user's full name
  const getUserName = (user: User) => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const companyName = user.companyName || "";

    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return companyName || "N/A";
  };

  // Get formatted mobile number
  const getFormattedMobile = (user: User) => {
    if (!user.mobile) return "N/A";
    return user.countryCode ? `${user.mobile}` : user.mobile;
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalUsers);

  // Define table columns
  const columns: any = [
    {
      title: <div className={`text-center ${roboto.className}`}>Name</div>,
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (text: string, record: any) => (
        <div className={`flex items-center ${roboto.className}`}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#6b8965", marginRight: 12 }}
          >
            {getUserName(record).charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div className="font-medium">{getUserName(record)}</div>
            <div className="text-brand-600 text-sm">{record.userType}</div>
          </div>
        </div>
      ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Email ID</div>,
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (email: string, record: any) => (
        <div className={`flex items-center ${roboto.className}`}>
          <div>{email}</div>
        </div>
      ),
    },
    {
      title: (
        <div className={`text-center ${roboto.className}`}>
          Verfication Status
        </div>
      ),
      dataIndex: "verficationType",
      key: "verficationType",
      align: "center",
      render: (email: string, record: any) => (
        <div className={`${roboto.className}`}>
          <Tag
            color={record.verficationType === "PENDING" ? "#6b8965" : "#526f4d"}
            className="mt-1"
          >
            {record.verficationType === "PENDING" ? "Pending" : "Verified"}
          </Tag>
        </div>
      ),
    },
    {
      title: (
        <div className={`text-center ${roboto.className}`}>Mobile Number</div>
      ),
      dataIndex: "mobile",
      key: "mobile",
      align: "center",
      render: (text: string, record: any) => (
        <div className={roboto.className}>{getFormattedMobile(record)}</div>
      ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Country</div>,
      dataIndex: "country",
      key: "country",
      align: "center",
      render: (country: string) => (
        <div className={roboto.className}>{country || "N/A"}</div>
      ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>View</div>,
      key: "view",
      align: "center",
      width: 100,
      render: (text: string, record: any) => (
        <Space
          size="middle"
          className="flex items-center justify-center w-full"
        >
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setViewModal({ isOpen: true, user: record })}
            className="!px-0"
          />
        </Space>
      ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Action</div>,
      key: "action",
      align: "right",
      width: 220,
      render: (text: string, record: any) => (
        <Space
          size="middle"
          className={`${roboto.className} flex items-center justify-center w-full`}
        >
          <Button
            type="primary"
            icon={<CheckOutlined />}
            size="small"
            onClick={() =>
              setApprovalModal({ isOpen: true, user: record, loading: false })
            }
            className={`${roboto.className} !bg-brand-500`}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            size="small"
            onClick={() => openRejectModal(record)}
            className={roboto.className}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-100">
        <h1 className="text-2xl font-semibold text-brand-900">
          Pending Requests
        </h1>
        <div className="flex items-center gap-3">
          {/* Search Field */}
          <div className="flex items-center gap-2 w-[280px]">
            <Input
              placeholder={`Search by name, email, mobile, or country`}
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
          {/* <div className="text-brand-600">
                        Total: {totalUsers} pending requests
                    </div> */}
        </div>
      </div>
      <div className="px-2 h-[calc(100%-65px)] overflow-y-scroll scrollbar">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={{
            spinning: loading,
            indicator: (
              <Loader
                message="Loading pending requests..."
                size={40}
                color="border-brand-600"
              />
            ),
          }}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: totalUsers,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} pending requests`,
            onChange: (page) => setCurrentPage(page),
            className: roboto.className,
          }}
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
                            Pending Requests
                          </h3>
                          <p className="text-brand-600">
                            {searchTerm
                              ? "Try adjusting your search terms."
                              : "All user requests have been processed."}
                          </p>
                        </div>
                      }
                    />
                  ),
                }
          }
        />
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={approvalModal.isOpen}
        onClose={() =>
          setApprovalModal({ isOpen: false, user: null, loading: false })
        }
        user={approvalModal.user}
        onApprove={handleApproveUser}
        loading={approvalModal.loading}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModal.isOpen}
        onClose={() =>
          setRejectModal({ isOpen: false, user: null, loading: false })
        }
        user={rejectModal.user}
        onReject={handleRejectUser}
        loading={rejectModal.loading}
      />

      {/* User Details Drawer */}
      <UserDetailsModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, user: null })}
        user={viewModal.user}
        hideEditableFields={true}
      />
    </div>
  );
};

export default PendingRequests;
