"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Avatar,
  Pagination,
  Card,
  message,
  Empty,
  Modal,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  EditOutlined,
  EyeOutlined,
  ClearOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { userAPI, User, UserListParams } from "@/src/services/user/user.api";
import UserDetailsModal from "./user-details-modal";
import { Roboto } from "@/src/common/fonts";
import Loader from "@/components/common/loader";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const { Search } = Input;

const UserList = () => {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    user: null as User | null,
  });

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = async (params: UserListParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response: any = await userAPI.getUserList({
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
        search: searchTerm || undefined,
        include: ["password", "referenceDetails"],
        orderBy: "createdAt|desc",
        search_column: searchTerm
          ? ["firstName", "lastName", "email", "mobile", "country"]
          : undefined,
        ...params,
      });

      setUsers(response.list);
      setTotalUsers(response.total);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount and when dependencies change
  useEffect(() => {
    fetchUsers();
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

  // Handle save user details
  const handleSaveUserDetails = async (updatedData: {
    discount: number;
    password?: string;
    paymentCycle: number;
    paymentMode: string;
  }) => {
    try {
      if (detailsModal.user) {
        const payload = { ...updatedData };
        if (!payload.password) {
          delete payload.password;
        }

        await userAPI.approveUser(detailsModal.user.id, payload);

        // Update the user in the local state
        const updatedUser = {
          ...detailsModal.user,
          discount: updatedData.discount,
          paymentCycle: updatedData.paymentCycle,
          paymentMode: updatedData.paymentMode,
          // Note: password is not stored in local state for security
        };

        setUsers((prev: any[]) =>
          prev.map((user: any) =>
            user.id === detailsModal.user?.id ? updatedUser : user
          )
        );

        // Close the modal
        setDetailsModal({ isOpen: false, user: null });
      }
    } catch (error: any) {
      console.error("Failed to update user:", error);
      message.error(error.message || "Failed to update user details");
      throw error;
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    try {
      if (deleteId) {
        await userAPI.deleteUser(deleteId);

        // Show success message
        message.success("User deleted successfully");

        // Close the modal
        setDeleteModalVisible(false);
        setDeleteId(null);

        // Reset pagination to first page and fetch users again
        setCurrentPage(1);
        fetchUsers();
      }
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      message.error(error.message || "Failed to delete user");
      throw error;
    }
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
      align: "center",
      render: (text: string, record: any) => (
        <div className={`flex items-center justify-start ${roboto.className}`}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#6b8965", marginRight: 12 }}
          >
            {getUserName(record).charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div className="font-medium">{getUserName(record)}</div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className={`text-center ${roboto.className}`}>Company Name</div>
      ),
      dataIndex: "companyName",
      key: "companyName",
      align: "center",
      render: (companyName: string, record: any) => (
        <div className={`${roboto.className}`}>
          <div>{companyName}</div>
        </div>
      ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Email ID</div>,
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (email: string, record: any) => (
        <div className={`${roboto.className}`}>
          <div>{email}</div>
        </div>
      ),
    },
    // {
    //   title: <div className={`text-center ${roboto.className}`}>Verfication Status</div>,
    //   dataIndex: 'verficationType',
    //   key: 'verficationType',
    //   align: 'center',
    //   render: (email: string, record: any) => (
    //     <div className={`${roboto.className}`}>
    //       <Tag color={record.verficationType ? '#526f4d' : '#6b8965'} className="mt-1">
    //         {record.verficationType ? 'Verified' : 'Pending'}
    //       </Tag>
    //     </div>
    //   ),
    // },
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
      title: <div className={`text-center ${roboto.className}`}>Action</div>,
      key: "action",
      align: "right",
      width: 100,
      render: (text: string, record: any) => (
        <div className="flex items-center justify-end w-full">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setDetailsModal({ isOpen: true, user: record })}
            className="px-0!"
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setDeleteId(record.id);
              setDeleteModalVisible(true);
            }}
            className="px-0!"
          />
          {/* <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              // Handle edit user
              console.log('Edit user:', record.id);
            }}
          >
            Edit
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-100">
        <h1 className="text-2xl font-semibold text-brand-900">User List</h1>
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
            Total: {totalUsers} users
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
                message="Loading users..."
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
              `${range[0]}-${range[1]} of ${total} users`,
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
                          User List
                        </h3>
                        <p className="text-brand-600">
                          {searchTerm
                            ? "Try adjusting your search terms."
                            : "No users have been registered yet."}
                        </p>
                      </div>
                    }
                  />
                ),
              }
          }
        />
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, user: null })}
        user={detailsModal.user}
        onSave={handleSaveUserDetails}
        hideEditableFields={false}
      />

      {/* Delete User Modal */}
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
        onOk={async () => handleDeleteUser()}
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
          Are you sure you want to delete this user?
        </p>
      </Modal>
    </div>
  );
};

export default UserList;
