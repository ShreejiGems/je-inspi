"use client";

import React, { useState } from "react";
import { Modal, Button, Input, Form, Typography, Space, Avatar } from "antd";
import {
  CloseOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { User } from "@/src/services/user/user.api";
import { Roboto } from "@/src/common/fonts";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const { TextArea } = Input;
const { Title, Text } = Typography;

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onReject: (userId: string, reason?: string) => Promise<void>;
  loading: boolean;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  user,
  onReject,
  loading,
}) => {
  const [form] = Form.useForm();
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = async () => {
    if (!user) return;

    try {
      await onReject(user.id, rejectionReason);
      form.resetFields();
      setRejectionReason("");
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setRejectionReason("");
    onClose();
  };

  // Get user's full name
  const getUserName = (user: User) => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    const companyName = user?.companyName || "";

    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return companyName || "N/A";
  };

  return (
    <Modal
      title={
        <div className={`flex items-center ${roboto.className}`}>
          <ExclamationCircleOutlined className="text-red-500 mr-2 text-xl" />
          <span className="text-lg font-semibold">Reject User Request</span>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
      maskClosable={false}
      className={roboto.className}
    >
      {user && (
        <div className="pt-4">
          {/* User Info */}
          <div className="bg-brand-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <Avatar
                size={48}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#6b8965", marginRight: 12 }}
              >
                {getUserName(user).charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Title level={5} className="mb-1">
                  {getUserName(user)}
                </Title>
                <Text type="secondary" className="text-sm">
                  {user.email}
                </Text>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <Text type="secondary">User Type:</Text>
                <div className="font-medium">{user.userType}</div>
              </div>
              <div>
                <Text type="secondary">Country:</Text>
                <div className="font-medium">{user.country || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <ExclamationCircleOutlined className="text-red-500 mr-2 mt-1" />
              <div>
                <div className="text-red-700 font-medium">
                  Are you sure you want to reject this user?
                </div>
                <div className="text-red-600 text-sm mt-1">
                  This action cannot be undone. The user will be notified of the
                  rejection.
                </div>
              </div>
            </div>
          </div>

          {/* Rejection Reason Form */}
          {/* <Form form={form} layout="vertical">
                        <Form.Item
                            label={
                                <span className="font-medium">
                                    Reason for Rejection (Optional)
                                </span>
                            }
                            name="reason"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Please provide a reason for rejecting this user request..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                maxLength={500}
                                showCount
                            />
                        </Form.Item>
                    </Form> */}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              size="large"
              onClick={handleCancel}
              disabled={loading}
              className={`${roboto.className} !rounded-[6px] !h-[32px] hover:!text-white !text-red-500 hover:!bg-red-500 !border-red-500`}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              size="large"
              // icon={<CloseOutlined />}
              onClick={handleReject}
              loading={loading}
              className={`${roboto.className} !rounded-[6px] !h-[32px] !text-white !bg-red-500 hover:!bg-red-700 hover:!border-red-700 !border-red-500`}
            >
              Reject User
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RejectModal;
