"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import { authAPI } from "@/src/services/auth.api";
import { uploadAPI } from "@/src/services/upload.api";
import { utilityHelper } from "@/src/libs/helper";
import { BUSSINESS_TYPE, REG_TYPE } from "@/src/libs/constants";
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Card,
  Typography,
  Divider,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { garamond } from "@/src/common/helper";
import { countries } from "@/src/libs/constants";
import { FaChevronDown } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { RiResetLeftLine } from "react-icons/ri";
import ShreejiLoader from "@/components/common/shreejiLoader";
import EmailVerificationModal from "./EmailVerificationModal";

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string>("");
  const [uploadKey, setUploadKey] = useState(0);
  const termsAccepted = Form.useWatch("termsAccepted", form) as boolean;

  useEffect(() => {
    // Simulate page loading time
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 100); // 0.1 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const onFileChange = (info: any) => {
    const file = info?.fileList[0]?.originFileObj;
    if (file) {
      // Validate file size
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        message.error(
          `File size must be less than ${maxSize / (1024 * 1024)}MB`
        );
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        message.error(
          "Please upload a valid file type (JPG, PNG, PDF, DOC, DOCX)"
        );
        return;
      }

      setSelectedFile(file);
      form.setFieldsValue({ registrationCopyImage: file.name });
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    if (form) {
      form.setFieldsValue({ registrationCopyImage: "" });
    }
    return true;
  };

  const resetForm = () => {
    handleFileRemove();
    setSelectedFile(null);
    if (form) {
      form.resetFields();
      form.setFieldsValue({ registrationCopyImage: "" });
    }
    // Force Upload component to re-render by changing key
    setUploadKey(prev => prev + 1);
    setUploadingFile(false);
    setIsLoading(false);
  };

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    setUploadingFile(true);

    try {
      // Validate all fields
      await form.validateFields();

      // Check if file is selected
      if (!selectedFile) {
        message.error("Please upload your business registration document");
        setIsLoading(false);
        setUploadingFile(false);
        return;
      }

      // Upload the file first
      let uploadedFileUrl = "";
      try {
        const uploadResult = await uploadAPI.uploadFile(selectedFile, "USER");
        uploadedFileUrl = uploadResult.fileUrl;
        console.log("File uploaded successfully!");
      } catch (uploadError: any) {
        console.error("File upload error:", uploadError);
        console.error(
          utilityHelper.formatErrorMessage(uploadError) ||
          "File upload failed. Please try again."
        );
        setIsLoading(false);
        setUploadingFile(false);
        return;
      }

      // Prepare signup data
      const { confirmPassword, ...signupData } = values;

      // Replace the file name with the uploaded URL
      signupData.registrationCopyImage = uploadedFileUrl;

      // Format mobile numbers with country codes
      if (signupData.mobile && signupData.countryCode) {
        signupData.mobile = `${signupData.countryCode}${signupData.mobile}`;
      }
      if (
        signupData.referenceDetail?.mobile &&
        signupData.referenceDetail?.countryCode
      ) {
        signupData.referenceDetail.mobile = `${signupData.referenceDetail.countryCode}${signupData.referenceDetail.mobile}`;
      }

      // Keep countryCode in the data as API expects it
      // Fix businessType field name to match API expectation (bussinessType)
      if (signupData.businessType) {
        signupData.bussinessType = signupData.businessType;
        delete signupData.businessType;
      }

      // Store registration data and show email verification modal
      setRegistrationData(signupData);
      setVerifiedEmail(signupData?.email);
      setShowEmailVerification(true);

    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.name === "ValidationError") {
        message.error("Please fill in all required fields correctly");
      } else {
        const errorMessage =
          utilityHelper.formatErrorMessage(error) ||
          "Registration failed. Please try again.";
        message.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setUploadingFile(false);
    }
  };

  const handleEmailVerificationSuccess = async () => {
    if (!registrationData) {
      message.error("Registration data not found. Please try again.");
      return;
    }

    try {
      // Submit registration after email verification
      const response = await authAPI.signup(registrationData);

      // Handle successful registration
      if (response) {
        message.success(
          "Registration successful! Your account is pending approval."
        );
        setShowEmailVerification(false);
        router.push("/register/thank-you");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Registration error after email verification:", error);
      const errorMessage =
        utilityHelper.formatErrorMessage(error) ||
        "Registration failed. Please try again.";
      message.error(errorMessage);
    }
  };

  const handleBackToRegister = () => {
    setShowEmailVerification(false);
    setRegistrationData(null);
    setVerifiedEmail("");
  };

  return (
    <div
      className={`min-h-screen w-full pb-8 bg-gradient-to-br from-brand-200 via-brand-100 to-brand-200 ${garamond.className}`}
    >
      {isPageLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <ShreejiLoader
            size="medium"
            color="#6b8965"
            text=""
          />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-5 py-3">
            <Link href="/">
              <Image
                src="/assets/brand/je-inspi-wordmark.png"
                width={151}
                height={68}
                alt="JE-Inspi logo"
                className="mx-auto mb-4 cursor-pointer"
              />
            </Link>
            <Title
              level={2}
              style={{
                color: "#526f4d",
                fontFamily: garamond.style.fontFamily,
              }}
            >
              Register Yourself
            </Title>
          </div>

          <Card className="shadow-lg">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onFinishFailed={(errorInfo) => {
                message.error(
                  "Oops! Please correct the highlighted fields before submitting."
                );
              }}
              initialValues={{
                registrationCopyType: "GST",
                bussinessType: "RETAILER",
              }}
            >
              <Title
                level={4}
                style={{
                  color: "#263329",
                  fontFamily: garamond.style.fontFamily,
                }}
              >
                Company Information
              </Title>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="companyName"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Company Name
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter your company name",
                    },
                    {
                      min: 2,
                      message:
                        "Company name must be at least 2 characters long",
                    },
                    {
                      max: 100,
                      message: "Company name must be less than 100 characters",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter your company name"
                  />
                </Form.Item>
                <Form.Item
                  name="companyNumber"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Company Number
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter your company number",
                    },
                    {
                      pattern: /^[A-Za-z0-9\s-]{5,20}$/,
                      message:
                        "Please enter a valid company number (5-20 characters)",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter company registration number"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name="title"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Title
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter your title" },
                    {
                      max: 50,
                      message: "Title must be less than 50 characters",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="e.g., Mr., Mrs., Dr."
                  />
                </Form.Item>
                <Form.Item
                  name="firstName"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      First Name
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter your first name" },
                    {
                      pattern: /^[A-Za-z\s]{2,30}$/,
                      message:
                        "First name must be 2-30 characters and contain only letters",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter your first name"
                  />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Last Name
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter your last name" },
                    {
                      pattern: /^[A-Za-z\s]{2,30}$/,
                      message:
                        "Last name must be 2-30 characters and contain only letters",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter your last name"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="email"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Email
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please enter a valid email address",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter your email address"
                    style={{ fontFamily: garamond.style.fontFamily }}
                  />
                </Form.Item>
                <Form.Item
                  name="website"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Website
                    </span>
                  }
                  rules={[
                    { required: false },
                    {
                      type: "url",
                      message: "Please enter a valid website URL",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="https://example.com"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="countryCode"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Country Code
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please select country code" },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Select country code"
                    showSearch
                    optionFilterProp="children"
                    suffixIcon={<FaChevronDown />}
                  >
                    {countries.map((c) => (
                      <Option key={c.code} value={c.dial_code}>
                        {c.dial_code} ({c.name})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="mobile"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Mobile
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter your mobile number",
                    },
                    {
                      pattern: /^[0-9]{7,15}$/,
                      message:
                        "Please enter a valid mobile number (7-15 digits)",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter phone number"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <Form.Item
                  name="address"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Address
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter your address" },
                    // { min: 10, message: 'Address must be at least 10 characters long' },
                    // { max: 200, message: 'Address must be less than 200 characters' }
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter your complete address"
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name="country"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Country
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please select your country" },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Select a country"
                    showSearch
                    optionFilterProp="children"
                    suffixIcon={<FaChevronDown />}
                  >
                    {countries.map((c) => (
                      <Option key={c.code} value={c.name}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="city"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      City
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter your city" },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter your city"
                  />
                </Form.Item>
                <Form.Item
                  name="postalCode"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Postal Code
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter your postal code",
                    },
                    {
                      pattern: /^[A-Za-z0-9\s-]{3,12}$/,
                      message:
                        "Please enter a valid postal code (3-12 characters)",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter postal code"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="bussinessType"
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Business Type
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please select your business type",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    suffixIcon={<FaChevronDown />}
                  >
                    {BUSSINESS_TYPE.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <Divider />

              <Title
                level={4}
                style={{
                  color: "#263329",
                  fontFamily: garamond.style.fontFamily,
                }}
              >
                Upload Business Registration Copy
              </Title>

              <Form.Item
                required={false}
                label={
                  <span style={{ fontFamily: garamond.style.fontFamily }}>
                    Business Registration Document
                  </span>
                }
              >
                <Upload
                  key={uploadKey}
                  beforeUpload={() => false}
                  onChange={onFileChange}
                  onRemove={handleFileRemove}
                  maxCount={1}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                    showDownloadIcon: false,
                  }}
                  listType="picture"
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="large"
                    loading={uploadingFile}
                    style={{
                      borderColor: "#263329",
                      color: "#263329",
                      fontFamily: garamond.style.fontFamily,
                    }}
                  >
                    {uploadingFile ? "Uploading..." : "Click to Upload"}
                  </Button>
                </Upload>
                <div
                  style={{ marginTop: "8px", fontSize: "12px", color: "#73796f" }}
                >
                  Supported formats: JPG, PNG, PDF, DOC, DOCX (Max size: 10MB)
                </div>
                {selectedFile && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "8px",
                      backgroundColor: "#f8f7f1",
                      borderRadius: "4px",
                    }}
                  >
                    <Text type="success" style={{ fontSize: "12px" }}>
                      ✓ File selected: {selectedFile.name}
                    </Text>
                  </div>
                )}
              </Form.Item>

              <Form.Item name="registrationCopyImage" hidden>
                <Input />
              </Form.Item>

              <Form.Item
                required={true}
                name="registrationCopyType"
                label={
                  <span style={{ fontFamily: garamond.style.fontFamily }}>
                    Document Type
                  </span>
                }
                rules={[
                  { required: true, message: "Please select document type" },
                ]}
              >
                <Select
                  size="large"
                  style={{ fontFamily: garamond.style.fontFamily }}
                  suffixIcon={<FaChevronDown />}
                >
                  {REG_TYPE.map((type) => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Divider />

              <Title
                level={4}
                style={{
                  color: "#263329",
                  fontFamily: garamond.style.fontFamily,
                }}
              >
                Reference Details
              </Title>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  required={true}
                  name={["referenceDetail", "companyName"]}
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Company Name
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter reference company name",
                    },
                    {
                      min: 2,
                      message:
                        "Company name must be at least 2 characters long",
                    },
                    {
                      max: 100,
                      message: "Company name must be less than 100 characters",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter reference company name"
                  />
                </Form.Item>
                <Form.Item
                  required={true}
                  name={["referenceDetail", "contactPersonName"]}
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Contact Person Name
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter contact person name",
                    },
                    {
                      pattern: /^[A-Za-z\s]{2,50}$/,
                      message:
                        "Contact person name must be 2-50 characters and contain only letters",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter contact person name"
                    style={{ fontFamily: garamond.style.fontFamily }}
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  required={true}
                  name={["referenceDetail", "email"]}
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Email
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please enter a valid email address",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter email"
                    style={{ fontFamily: garamond.style.fontFamily }}
                  />
                </Form.Item>
                <Form.Item
                  required={true}
                  name={["referenceDetail", "countryCode"]}
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Country Code
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please select country code" },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Select country code"
                    showSearch
                    optionFilterProp="children"
                    suffixIcon={<FaChevronDown />}
                  >
                    {countries.map((c) => (
                      <Option key={c.code} value={c.dial_code}>
                        {c.dial_code} ({c.name})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  required={true}
                  name={["referenceDetail", "mobile"]}
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Mobile
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter mobile number" },
                    {
                      pattern: /^[0-9]{7,15}$/,
                      message:
                        "Please enter a valid mobile number (7-15 digits)",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter phone number"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Form.Item
                  required={true}
                  name={["referenceDetail", "address"]}
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Address
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter address" },
                    // { min: 10, message: 'Address must be at least 10 characters long' },
                    // { max: 200, message: 'Address must be less than 200 characters' }
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter complete address"
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  required={true}
                  name={["referenceDetail", "country"]}
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Country
                    </span>
                  }
                  rules={[{ required: true, message: "Please select country" }]}
                >
                  <Select
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Select a country"
                    showSearch
                    optionFilterProp="children"
                    suffixIcon={<FaChevronDown />}
                  >
                    {countries.map((c) => (
                      <Option key={c.code} value={c.name}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  required={true}
                  name={["referenceDetail", "city"]}
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      City
                    </span>
                  }
                  rules={[{ required: true, message: "Please enter city" }]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter city"
                  />
                </Form.Item>
                <Form.Item
                  required={true}
                  name={["referenceDetail", "postalCode"]}
                  label={
                    <span style={{ fontFamily: garamond.style.fontFamily }}>
                      Postal Code
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter postal code" },
                    {
                      pattern: /^[A-Za-z0-9\s-]{3,12}$/,
                      message:
                        "Please enter a valid postal code (3-12 characters)",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ fontFamily: garamond.style.fontFamily }}
                    placeholder="Enter postal code"
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="termsAccepted"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_: any, value: boolean) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                          new Error(
                            "You must agree to the terms and privacy policy"
                          )
                        ),
                  },
                ]}
              >
                <Checkbox
                  className="brand-checkbox"
                  style={{ fontFamily: garamond.style.fontFamily }}
                >
                  I agree to the{" "}
                  <Link
                    href="/conditions-of-sale"
                    className="text-brand-600 hover:underline"
                    target="_blank"
                  >
                    terms & conditions
                  </Link>{" "}
                  and understand that my data will be held securely in
                  accordance with the{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-brand-600 hover:underline"
                    target="_blank"
                  >
                    privacy policy
                  </Link>
                  .
                </Checkbox>
              </Form.Item>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isLoading || uploadingFile}
                  disabled={uploadingFile || !termsAccepted}
                  className={`${isLoading || uploadingFile ? "" : "button-hover-effect"
                    } !text-white !bg-brand-600 disabled:!border-brand-300 disabled:!bg-brand-300 hover:!bg-brand-700 border !border-[#526f4d] !h-12 !px-10 w-full sm:w-auto ${garamond.className
                    }`}
                >
                  <span>
                    {isLoading
                      ? "Registering..."
                      : uploadingFile
                        ? "Uploading File..."
                        : "Register"}
                  </span>
                  {isLoading ? "" : <FiUserPlus className="icon" />}
                </Button>

                <Button
                  size="large"
                  onClick={resetForm}
                  disabled={isLoading || uploadingFile}
                  className={`${isLoading || uploadingFile ? "" : "button-hover-effect"
                    } !text-[#526f4d] !border-[#526f4d] !h-12 !px-8 w-full sm:w-auto ${garamond.className
                    }`}
                >
                  <span>Reset Form</span>
                  {isLoading ? "" : <RiResetLeftLine className="icon" />}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-6">
              <Text type="secondary" className={garamond.className}>
                Already have an account?{" "}
                <Link
                  href="/login"
                  style={{ color: "#526f4d", padding: 0 }}
                  className={`hover:!underline hover:underline-offset-1 ${garamond.className}`}
                >
                  Login here
                </Link>
              </Text>
            </div>
          </Card>

          {/* Email Verification Modal */}
          <EmailVerificationModal
            isOpen={showEmailVerification}
            onClose={() => setShowEmailVerification(false)}
            email={verifiedEmail}
            onVerificationSuccess={handleEmailVerificationSuccess}
            onBackToRegister={handleBackToRegister}
            verificationType="REGISTER"
          />
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
