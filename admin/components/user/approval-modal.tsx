"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Typography,
} from "antd";
import { User, ApproveUserRequest } from "@/src/services/user/user.api";
import { Roboto } from "@/src/common/fonts";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const { Text } = Typography;
const { Option } = Select;

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onApprove: (data: ApproveUserRequest) => void;
  loading: boolean;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  user,
  onApprove,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user && isOpen) {
      form.setFieldsValue({
        password: "",
        discount: user.discount || 0,
        paymentCycle: parseInt(user.paymentCycle || "0"),
        paymentMode: user.paymentMode || "INSTANT",
      });
    }
  }, [user, isOpen, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onApprove(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  if (!user) return null;

  return (
    <Modal
      title="Approve User"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText={loading ? "Approving..." : "Approve User"}
      cancelText="Cancel"
      width={500}
      centered
      className={roboto.className}
      maskClosable={false}
      okButtonProps={{
        className: `${roboto.className} !bg-brand-500 !text-white hover:!bg-brand-600`,
      }}
      cancelButtonProps={{
        className: `${roboto.className} !bg-red-500 !text-white hover:!bg-red-600 !border-red-500`,
      }}
    >
      <div className={`mb-4 ${roboto.className}`}>
        <Text type="secondary" className={roboto.className}>
          Approving user:{" "}
          <Text strong className={roboto.className}>
            {user.firstName} {user.lastName}
          </Text>
        </Text>
        <br />
        <Text type="secondary" className={roboto.className}>
          Email:{" "}
          <Text strong className={roboto.className}>
            {user.email}
          </Text>
        </Text>
      </div>

      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          label="Password"
          name="password"
          className={roboto.className}
          rules={[
            { required: true, message: "Please enter a password for the user" },
            { min: 8, message: "Password must be at least 8 characters long" },
            {
              pattern: /[A-Z]/,
              message: "Password must contain at least one uppercase letter",
            },
            {
              pattern: /[a-z]/,
              message: "Password must contain at least one lowercase letter",
            },
            {
              pattern: /[0-9]/,
              message: "Password must contain at least one number",
            },
            {
              pattern: /[!@#$%^&*(),.?":{}|<>]/,
              message: "Password must contain at least one special character",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter password for user"
            className={roboto.className}
          />
        </Form.Item>

        <Form.Item
          label="Discount (%)"
          name="discount"
          className={roboto.className}
          rules={[
            { required: true, message: "Please enter a discount percentage" },
          ]}
        >
          <InputNumber
            min={0}
            max={100}
            style={{ width: "100%" }}
            className={roboto.className}
            placeholder="Enter discount percentage"
          />
        </Form.Item>

        <Form.Item
          label="Payment Cycle (days)"
          name="paymentCycle"
          className={roboto.className}
          rules={[
            { required: true, message: "Please enter a payment cycle in days" },
          ]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            className={roboto.className}
            placeholder="Enter payment cycle in days"
          />
        </Form.Item>

        <Form.Item
          label="Payment Mode"
          name="paymentMode"
          className={roboto.className}
          rules={[{ required: true, message: "Please select a payment mode" }]}
        >
          <Select placeholder="Select payment mode">
            <Option value="INSTANT">Instant</Option>
            <Option value="PAYMENT_CYCLE">Payment Cycle</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApprovalModal;
