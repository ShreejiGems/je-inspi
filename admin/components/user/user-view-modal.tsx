"use client";

import React from "react";
import { Modal, Button, Tag, Row, Col, Divider, Typography, Image } from "antd";
import { User } from "@/src/services/user/user.api";
import { Roboto } from "@/src/common/fonts";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const { Title, Text } = Typography;

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onApprove?: (userId: string) => Promise<void>;
  onReject?: (userId: string) => Promise<void>;
  showActions?: boolean;
}

const UserViewModal: React.FC<UserViewModalProps> = ({
  isOpen,
  onClose,
  user,
  onApprove,
  onReject,
  showActions = false,
}) => {
  const getUserName = (user: User) => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";

    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return user.companyName || "N/A";
  };

  const getFormattedMobile = (user: User) => {
    if (!user.mobile) return "N/A";
    return user.countryCode ? `${user.countryCode}${user.mobile}` : user.mobile;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ENABLED":
        return "#526f4d";
      case "DISABLED":
        return "red";
      case "PENDING":
        return "#6b8965";
      default:
        return "default";
    }
  };

  const getVerificationColor = (type: string) => {
    switch (type) {
      case "APPROVE":
        return "#526f4d";
      case "REJECT":
        return "red";
      case "PENDING":
        return "#6b8965";
      default:
        return "default";
    }
  };

  const handleApprove = async () => {
    if (onApprove && user) {
      await onApprove(user.id);
      onClose();
    }
  };

  const handleReject = async () => {
    if (onReject && user) {
      await onReject(user.id);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Modal
      title={
        <div
          className={`${roboto.className} flex items-center justify-between`}
        >
          <Title level={4} className="mb-0">
            User Details
          </Title>
          <Tag color={getStatusColor(user.status)} className="text-sm">
            {user.status}
          </Tag>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={900}
      centered
      className={roboto.className}
      footer={
        showActions
          ? [
              <Button
                key="reject"
                danger
                onClick={handleReject}
                className={roboto.className}
              >
                Reject
              </Button>,
              <Button
                key="approve"
                type="primary"
                onClick={handleApprove}
                className={roboto.className}
              >
                Approve
              </Button>,
            ]
          : [
              <Button
                key="close"
                onClick={onClose}
                className={roboto.className}
              >
                Close
              </Button>,
            ]
      }
    >
      <div className={`${roboto.className} max-h-[70vh] overflow-y-auto`}>
        {/* Basic Information */}
        <div className="mb-6">
          <Title level={5} className="mb-4 text-brand-600">
            Basic Information
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="space-y-3">
                <div>
                  <Text strong>Company Name:</Text>
                  <div className="mt-1">{user.companyName || "N/A"}</div>
                </div>
                <div>
                  <Text strong>Title:</Text>
                  <div className="mt-1">{user.title || "N/A"}</div>
                </div>
                <div>
                  <Text strong>First Name:</Text>
                  <div className="mt-1">{user.firstName || "N/A"}</div>
                </div>
                <div>
                  <Text strong>Last Name:</Text>
                  <div className="mt-1">{user.lastName || "N/A"}</div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="space-y-3">
                <div>
                  <Text strong>Email:</Text>
                  <div className="mt-1">{user.email}</div>
                </div>
                <div>
                  <Text strong>Mobile:</Text>
                  <div className="mt-1">{getFormattedMobile(user)}</div>
                </div>
                <div>
                  <Text strong>Website:</Text>
                  <div className="mt-1">{user.website || "N/A"}</div>
                </div>
                <div>
                  <Text strong>Verification Type:</Text>
                  <div className="mt-1">
                    <Tag color={getVerificationColor(user.verficationType)}>
                      {user.verficationType}
                    </Tag>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Address Information */}
        <div className="mb-6">
          <Title level={5} className="mb-4 text-brand-600">
            Address Information
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="space-y-3">
                <div>
                  <Text strong>Address:</Text>
                  <div className="mt-1">{user.address || "N/A"}</div>
                </div>
                <div>
                  <Text strong>City:</Text>
                  <div className="mt-1">{user.city || "N/A"}</div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="space-y-3">
                <div>
                  <Text strong>Postal Code:</Text>
                  <div className="mt-1">{user.postalCode || "N/A"}</div>
                </div>
                <div>
                  <Text strong>Country:</Text>
                  <div className="mt-1">{user.country || "N/A"}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Company Information */}
        <div className="mb-6">
          <Title level={5} className="mb-4 text-brand-600">
            Company Information
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="space-y-3">
                <div>
                  <Text strong>Company Number:</Text>
                  <div className="mt-1">{user.companyNumber || "N/A"}</div>
                </div>
                <div>
                  <Text strong>Business Type:</Text>
                  <div className="mt-1">
                    <Tag color="#526f4d">{user.bussinessType}</Tag>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="space-y-3">
                <div>
                  <Text strong>User Type:</Text>
                  <div className="mt-1">
                    <Tag color="#526f4d">{user.userType}</Tag>
                  </div>
                </div>
                <div>
                  <Text strong>Registration Copy Type:</Text>
                  <div className="mt-1">
                    {user.registrationCopyType || "N/A"}
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {user.registrationCopyImage && (
            <div className="mt-4">
              <Text strong>Upload Business Registration Copy:</Text>
              <div className="mt-2">
                <Image
                  width={200}
                  src={user.registrationCopyImage}
                  alt="Registration Copy"
                  className="border rounded"
                />
              </div>
            </div>
          )}
        </div>

        <Divider />

        {/* Payment Information */}
        <div className="mb-6">
          <Title level={5} className="mb-4 text-brand-600">
            Payment Information
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="space-y-3">
                <div>
                  <Text strong>Payment Mode:</Text>
                  <div className="mt-1">
                    <Tag color="#526f4d">{user.paymentMode}</Tag>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={user.paymentMode === "INSTANT"}
                      readOnly
                      className="mr-1"
                    />
                    <Text>Instant payment</Text>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={user.paymentMode === "CYCLE"}
                      readOnly
                      className="mr-1"
                    />
                    <Text>Payment Cycle</Text>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="space-y-3">
                <div>
                  <Text strong>Discount (%):</Text>
                  <div className="mt-1">{user.discount}%</div>
                </div>
                <div>
                  <Text strong>Payment Cycle Days:</Text>
                  <div className="mt-1">{user.paymentCycle || 0} days</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Additional Information */}
        <div className="mb-6">
          <Title level={5} className="mb-4 text-brand-600">
            Additional Information
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="space-y-3">
                <div>
                  <Text strong>Created At:</Text>
                  <div className="mt-1">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <Text strong>Updated At:</Text>
                  <div className="mt-1">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="space-y-3">
                <div>
                  <Text strong>Status:</Text>
                  <div className="mt-1">
                    <Tag color={getStatusColor(user.status)}>{user.status}</Tag>
                  </div>
                </div>
                <div>
                  <Text strong>Deleted:</Text>
                  <div className="mt-1">
                    <Tag color={user.isDeleted ? "red" : "#526f4d"}>
                      {user.isDeleted ? "Yes" : "No"}
                    </Tag>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default UserViewModal;
