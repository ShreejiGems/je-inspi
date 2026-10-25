"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Button,
  Tag,
  Row,
  Col,
  Space,
  Divider,
  Typography,
  Image,
  message,
  Descriptions,
  Radio,
} from "antd";
import { User, UserReferenceDetails, userAPI } from "@/src/services/user/user.api";
import { Roboto } from "@/src/common/fonts";
import Link from "next/link";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const { Title, Text } = Typography;

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave?: (updatedData: {
    discount: number;
    password?: string;
    paymentCycle: number;
    paymentMode: string;
  }) => Promise<void>;
  hideEditableFields?: boolean;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
  hideEditableFields = false,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setDrawerVisible(true);
      form.setFieldsValue({
        discount: user.discount || 0,
        password: "",
        paymentCycle: user?.paymentCycle || 0,
        paymentMode: user?.paymentMode || "INSTANT",
      });
      setShowPasswordField(false);
    } else {
      setDrawerVisible(false);
    }
  }, [user, isOpen, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (values.password === "") {
        message.error("Password is required");
        return;
      }

      if (onSave) {
        await onSave({
          discount: values.discount,
          password:
            showPasswordField && values.password ? values.password : undefined,
          paymentCycle: values.paymentCycle,
          paymentMode: values.paymentMode,
        });

        const params: any = {
          email: user?.email,
          name: user?.firstName || user?.companyName,
          password:
            showPasswordField && values.password ? values.password : undefined,
        };
        await userAPI.sendCredentials(params);
        message.success("User details updated successfully");
        setDrawerVisible(false);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDrawerVisible(false);
  };

  const handleAfterClose = () => {
    form.resetFields();
    setShowPasswordField(false);
    onClose();
  };

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
    return user.countryCode ? user.mobile : `${user.countryCode}${user.mobile}`;
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

  if (!user) return null;

  return (
    <Drawer
      title={
        <div
          className={`${roboto.className} flex items-center justify-between`}
        >
          <p className="flex justify-center items-center text-[25px]">
            User Details
          </p>
          {/* <Tag color={getStatusColor(user.status)} className="text-sm">
            {user.status}
          </Tag> */}
        </div>
      }
      open={drawerVisible}
      onClose={handleCancel}
      afterOpenChange={(open) => {
        if (!open) {
          handleAfterClose();
        }
      }}
      width={800}
      placement="right"
      className={roboto.className}
      destroyOnClose={false}
      maskClosable={true}
      keyboard={true}
      footer={
        hideEditableFields ? (
          <div className="flex justify-end">
            <Button onClick={handleCancel} className={roboto.className}>
              Close
            </Button>
          </div>
        ) : (
          <div className="flex justify-end space-x-2">
            <Button onClick={handleCancel} className={roboto.className}>
              Cancel
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={handleSave}
              className={`${roboto.className} !bg-brand-700 hover:!bg-brand-800 disabled:!bg-brand-400 !text-white !rounded-lg !transition-colors !duration-200 !cursor-pointer`}
            >
              Save
            </Button>
          </div>
        )
      }
    >
      <div
        className={`${roboto.className} overflow-y-auto scrollbar-hide overflow-x-hidden`}
      >
        <Form form={form} layout="vertical">
          {/* Basic Information */}
          <div className="mb-6">
            <Title
              level={5}
              className={`mb-4 text-brand-600 ${roboto.className}`}
            >
              Basic Information
            </Title>
            <Descriptions
              bordered
              size="small"
              column={2}
              className={roboto.className}
            >
              <Descriptions.Item label="Company Name">
                {user.companyName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Title">
                {user.title || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile">
                {getFormattedMobile(user)}
              </Descriptions.Item>
              <Descriptions.Item label="First Name">
                {user.firstName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Website">
                <Link href={user.website || "N/A"}>
                  {user.website || "N/A"}
                </Link>
              </Descriptions.Item>
              <Descriptions.Item label="Last Name">
                {user.lastName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Verification Type">
                <Tag color={getVerificationColor(user.verficationType)}>
                  {user.verficationType}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          {/* Address Information */}
          <div className="mb-6">
            <Title
              level={5}
              className={`mb-4 text-brand-600 ${roboto.className}`}
            >
              Address Information
            </Title>
            <Descriptions
              bordered
              size="small"
              column={2}
              className={roboto.className}
            >
              <Descriptions.Item label="Address">
                {user.address || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Postal Code">
                {user.postalCode || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {user.city || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {user.country || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          {/* Company Information */}
          <div className="mb-6">
            <Title
              level={5}
              className={`mb-4 text-brand-600 ${roboto.className}`}
            >
              Company Information
            </Title>
            <Descriptions
              bordered
              size="small"
              column={2}
              className={roboto.className}
            >
              <Descriptions.Item label="Company Number">
                {user.companyNumber || "N/A"}
              </Descriptions.Item>
              {/* <Descriptions.Item label="User Type">
                <Tag color="#526f4d">{user.userType}</Tag>
              </Descriptions.Item> */}
              <Descriptions.Item label="Business Type">
                <Tag color="#526f4d">{user.bussinessType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Registration Copy Type">
                {user.registrationCopyType || "N/A"}
              </Descriptions.Item>
              {user.registrationCopyImage && (
                <Descriptions.Item label="Business Registration Copy" span={2}>
                  <Image
                    width={200}
                    src={user.registrationCopyImage}
                    alt="Registration Copy"
                    className="border rounded"
                  />
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>

          <Divider />

          {/* Reference Details */}
          <div className="mb-6">
            <Title
              level={5}
              className={`mb-4 text-brand-600 ${roboto.className}`}
            >
              Reference Details
            </Title>
            {user.referenceDetails ? (
              <Descriptions
                bordered
                size="small"
                column={2}
                className={roboto.className}
              >
                <Descriptions.Item label="Contact Person Name">
                  {user.referenceDetails.contactPersonName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Reference Email">
                  {user.referenceDetails.email || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Reference Mobile">
                  {user.referenceDetails.mobile || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Reference Company">
                  {user.referenceDetails.companyName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Reference Address" span={2}>
                  {user.referenceDetails.address || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Reference City">
                  {user.referenceDetails.city || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Reference Postal Code">
                  {user.referenceDetails.postalCode || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Reference Country" span={2}>
                  {user.referenceDetails.country || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <div className="text-center py-4">
                <span className="text-brand-600">No reference details available</span>
              </div>
            )}
          </div>

          <Divider />

          {/* Payment Information */}
          <div className="mb-6">
            <Title
              level={5}
              className={`mb-4 text-brand-600 ${roboto.className}`}
            >
              Payment Information
            </Title>
            <Descriptions
              bordered
              size="small"
              column={1}
              className={roboto.className}
            >
              <Descriptions.Item label="Current Payment Mode">
                <Tag color="#526f4d">{user.paymentMode}</Tag>
              </Descriptions.Item>
              {!hideEditableFields && (
                <Descriptions.Item label="Change Payment Mode" span={2}>
                  <Form.Item
                    name="paymentMode"
                    rules={[
                      { required: true, message: "Please select payment mode" },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <Radio.Group>
                      <Radio value="INSTANT">Instant Payment</Radio>
                      <Radio value="PAYMENT_CYCLE">Payment Cycle</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>

          {!hideEditableFields && (
            <>
              <Divider />

              {/* Editable Fields */}
              <div className="mb-6">
                <Title
                  level={5}
                  className={`mb-4 text-brand-600 ${roboto.className}`}
                >
                  Editable Settings
                </Title>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item
                      label={
                        <Text strong className={roboto.className}>
                          Discount (%)
                        </Text>
                      }
                      name="discount"
                      rules={[
                        {
                          required: true,
                          message: "Please enter discount percentage",
                        },
                        {
                          type: "number",
                          min: 0,
                          max: 100,
                          message: "Discount must be between 0-100%",
                        },
                      ]}
                    >
                      <InputNumber<number>
                        style={{ width: "100%" }}
                        placeholder="Enter discount percentage"
                        min={0}
                        max={100}
                        formatter={(value) => `${value}%`}
                        parser={(value) => {
                          const parsed = parseFloat(
                            value?.replace("%", "") || "0"
                          );
                          return isNaN(parsed) ? 0 : parsed;
                        }}
                        className={roboto.className}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text strong className={roboto.className}>
                        Password
                      </Text>
                      <div className="mt-2">
                        {!showPasswordField ? (
                          <Button
                            type="dashed"
                            onClick={() => setShowPasswordField(true)}
                            className={roboto.className}
                            style={{ width: "100%" }}
                          >
                            Edit Password
                          </Button>
                        ) : (
                          <div>
                            <Form.Item
                              name="password"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter new password",
                                },
                                {
                                  min: 8,
                                  message:
                                    "Password must be at least 8 characters long",
                                },
                                {
                                  pattern: /[A-Z]/,
                                  message:
                                    "Password must contain at least one uppercase letter",
                                },
                                {
                                  pattern: /[a-z]/,
                                  message:
                                    "Password must contain at least one lowercase letter",
                                },
                                {
                                  pattern: /[0-9]/,
                                  message:
                                    "Password must contain at least one number",
                                },
                                {
                                  pattern: /[!@#$%^&*(),.?":{}|<>]/,
                                  message:
                                    "Password must contain at least one special character",
                                },
                              ]}
                              style={{ marginBottom: 8 }}
                            >
                              <Input.Password
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                className={roboto.className}
                              />
                            </Form.Item>
                            <Button
                              size="small"
                              onClick={() => {
                                setShowPasswordField(false);
                                form.setFieldValue("password", "");
                              }}
                              className={roboto.className}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={
                        <Text strong className={roboto.className}>
                          Days
                        </Text>
                      }
                      name="paymentCycle"
                      rules={[
                        {
                          required: true,
                          message: "Please enter number of days",
                        },
                        {
                          type: "number",
                          min: 0,
                          message: "Days must be a positive number",
                        },
                      ]}
                    >
                      <InputNumber<number>
                        style={{ width: "100%" }}
                        placeholder="Enter days"
                        min={0}
                        className={roboto.className}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </Form>
      </div>
    </Drawer>
  );
};

export default UserDetailsModal;
