"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Checkbox,
  Upload,
  message,
  Select,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { garamond } from "@/src/common/helper";
import { diamondAPI, DesignRequest } from "@/src/services/diamond.api";
import { UploadFile } from "antd/lib/upload/interface";
import { countries } from "@/src/libs/constants";
import { uploadAPI } from "@/src/services/upload.api";

const { TextArea } = Input;
const { Option } = Select;

interface DesignRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: {
    name: string;
    email: string;
    phone: string;
    companyName: string;
  } | null;
}

const DesignRequestModal: React.FC<DesignRequestModalProps> = ({
  isOpen,
  onClose,
  userData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [referenceLinks, setReferenceLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [title, setTitle] = useState<string>("Mr");
  const [uploading, setUploading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      // Get country code from selected country
      const countryData = countries.find((c) => c.name === values.country);
      const countryCode = countryData ? countryData.dial_code : "";

      // Get only the successfully uploaded image URLs
      const uploadedImageUrls = fileList
        .filter((file) => file.status === "done" && file.response?.fileUrl)
        .map((file) => file.response.fileUrl) as string[];

      // Prepare the request data with only required fields
      const requestData: DesignRequest = {
        inquiresFor: Array.isArray(values.manufacturingRequirement)
          ? values.manufacturingRequirement
          : [values.manufacturingRequirement],
        description: values.description,
        referenceImages: uploadedImageUrls,
        referenceLinks: referenceLinks.filter((link) => link.trim() !== ""),
        title: title,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        countryCode: countryCode,
        mobile: values.mobile,
        streetAddress: values.streetAddress,
        city: values.city,
        postalCode: values.postalCode,
        country: values.country,
      };

      const response = await diamondAPI.submitDesignRequest(requestData);

      if (response.success) {
        message.success(
          response.message ||
            "Your design request has been submitted successfully!"
        );
        form.resetFields();
        setFileList([]);
        setReferenceLinks([]);
        onClose();
      } else {
        throw new Error(response.message || "Failed to submit design request");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      message.error(
        error.message || "Failed to submit the form. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = () => {
    if (linkInput && !referenceLinks.includes(linkInput)) {
      setReferenceLinks([...referenceLinks, linkInput]);
      setLinkInput("");
    }
  };

  const handleRemoveLink = (linkToRemove: string) => {
    setReferenceLinks(referenceLinks.filter((link) => link !== linkToRemove));
  };

  const beforeUpload = async (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }

    // Check file size (5MB max)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleChange = async (info: any) => {
    let newFileList = [...info.fileList];

    // Only keep the last 5 files
    newFileList = newFileList.slice(-5);

    // Handle file upload when a new file is added
    if (info.file.status === "uploading" && info.file.originFileObj) {
      try {
        setUploading(true);
        const file = info.file.originFileObj;
        const response: any = await uploadAPI.uploadFile(file, "DIAMOND");

        // Update file list with the uploaded file URL
        const updatedFileList = newFileList.map((item) => {
          if (item.uid === info.file.uid) {
            return {
              ...item,
              status: "done",
              response: response, // Store the full response
              url: response.outPutUrl, // Use outPutUrl for preview
              name: response.fileName,
              originFileObj: undefined, // Remove the file object to avoid memory issues
            };
          }
          return item;
        });

        setFileList(updatedFileList);
      } catch (error) {
        console.error("Error uploading file:", error);
        message.error("Failed to upload file. Please try again.");
        // Remove the failed file from the list
        setFileList(newFileList.filter((item) => item.uid !== info.file.uid));
      } finally {
        setUploading(false);
      }
    } else {
      setFileList(newFileList);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="text-center">
          <h2
            className={`text-2xl font-bold ${garamond.className}`}
            style={{ color: "#526f4d" }}
          >
            Design Your Masterpiece
          </h2>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={700}
      centered
      styles={{
        header: {
          borderBottom: "1px solid #f1f4ed",
          padding: "16px 24px",
        },
        body: {
          padding: "0",
        },
        content: {
          padding: "24px",
        },
      }}
    >
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="pr-2 h-[60vh] overflow-y-auto"
        >
          <div className="p-6">
            <h3 className={`text-lg font-semibold mb-4 ${garamond.className}`}>
              DEFINE YOUR VISION
            </h3>

            <Form.Item
              name="manufacturingRequirement"
              label={
                <span className={garamond.className}>
                  Manufacturing Requirement:
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please select at least one option",
                },
              ]}
            >
              <Checkbox.Group className={`w-full ${garamond.className}`}>
                <div
                  className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${garamond.className}`}
                >
                  <Checkbox value="lab_diamond" className={garamond.className}>
                    Lab Diamond
                  </Checkbox>
                  <Checkbox
                    value="natural_diamond"
                    className={garamond.className}
                  >
                    Natural Diamond
                  </Checkbox>
                  <Checkbox value="jewellery" className={garamond.className}>
                    Jewellery
                  </Checkbox>
                </div>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              name="description"
              label={
                <span className={garamond.className}>
                  Detailed Description Of Masterpiece:
                </span>
              }
              className={garamond.className}
            >
              <TextArea
                rows={4}
                className={garamond.className}
                placeholder="Please provide detailed description of your design requirements"
              />
            </Form.Item>

            <Form.Item
              name="referenceImages"
              label={
                <span className={garamond.className}>
                  Upload Reference Images (Max 5):
                </span>
              }
              valuePropName="fileList"
              getValueFromEvent={normFile}
              className={garamond.className}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                multiple
                maxCount={5}
              >
                {fileList.length >= 5 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              label={
                <span className={garamond.className}>Reference Links:</span>
              }
              className={garamond.className}
            >
              <div className="flex gap-2 mb-2">
                <Input
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Paste reference link here"
                  className={garamond.className}
                  onPressEnter={(e) => {
                    e.preventDefault();
                    handleAddLink();
                  }}
                />
                <Button
                  type="primary"
                  onClick={handleAddLink}
                  disabled={!linkInput}
                >
                  Add Link
                </Button>
              </div>
              <div className="space-y-2">
                {referenceLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-brand-50 rounded"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 truncate"
                    >
                      {link}
                    </a>
                    <Button
                      type="text"
                      danger
                      size="small"
                      onClick={() => handleRemoveLink(link)}
                      className="ml-2"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </Form.Item>
          </div>

          <div className="p-6">
            <h3 className={`text-lg font-semibold mb-4 ${garamond.className}`}>
              CONTACT INFORMATION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Form.Item
                label={<span className={garamond.className}>Title</span>}
                className={garamond.className}
              >
                <Select
                  defaultValue="Mr"
                  onChange={(value) => setTitle(value)}
                  className={garamond.className}
                >
                  <Option value="Mr">Mr</Option>
                  <Option value="Mrs">Mrs</Option>
                  <Option value="Ms">Ms</Option>
                  <Option value="Dr">Dr</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="firstName"
                label={<span className={garamond.className}>First Name</span>}
                rules={[
                  { required: true, message: "Please enter your first name" },
                ]}
                className={garamond.className}
              >
                <Input placeholder="First Name" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label={<span className={garamond.className}>Last Name</span>}
                rules={[
                  { required: true, message: "Please enter your last name" },
                ]}
                className={garamond.className}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label={<span className={garamond.className}>Email</span>}
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              className={garamond.className}
            >
              <Input type="email" placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="mobile"
              label={<span className={garamond.className}>Mobile Number</span>}
              rules={[
                { required: true, message: "Please enter your mobile number" },
                {
                  pattern: /^[0-9]{10,15}$/,
                  message: "Please enter a valid mobile number (10-15 digits)",
                },
              ]}
              className={garamond.className}
            >
              <Input
                placeholder="Mobile Number"
                addonBefore={
                  <Form.Item name="countryCode" noStyle initialValue="+1">
                    <Select
                      style={{ width: 120 }}
                      defaultValue="+1"
                      onChange={(value) =>
                        form.setFieldsValue({ countryCode: value })
                      }
                    >
                      {Array.from(
                        new Set(countries.map((c) => c.dial_code))
                      ).map((code) => (
                        <Option key={code} value={code}>
                          {code}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                }
              />
            </Form.Item>

            <Form.Item
              name="streetAddress"
              label={<span className={garamond.className}>Street Address</span>}
              rules={[
                { required: true, message: "Please enter your street address" },
              ]}
              className={garamond.className}
            >
              <Input placeholder="Street Address" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Form.Item
                name="city"
                label={<span className={garamond.className}>City</span>}
                rules={[{ required: true, message: "Please enter your city" }]}
                className={garamond.className}
              >
                <Input placeholder="City" />
              </Form.Item>

              <Form.Item
                name="postalCode"
                label={<span className={garamond.className}>Postal Code</span>}
                rules={[
                  { required: true, message: "Please enter your postal code" },
                ]}
                className={garamond.className}
              >
                <Input placeholder="Postal Code" />
              </Form.Item>

              <Form.Item
                name="country"
                label={<span className={garamond.className}>Country</span>}
                rules={[
                  { required: true, message: "Please select your country" },
                ]}
                className={garamond.className}
              >
                <Select
                  showSearch
                  placeholder="Select Country"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.children as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {countries.map((country) => (
                    <Option key={country.code} value={country.name}>
                      {country.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("You must agree to the terms")
                        ),
                },
              ]}
              className={`mb-6 ${garamond.className} !px-0`}
            >
              <Checkbox className={`${garamond.className}`}>
                <span className={`${garamond.className}`}>
                  By submitting, I agree to JE-Inspi's Privacy Policy and
                  Terms Of Use. <span className="text-red-500">*</span>
                </span>
              </Checkbox>
            </Form.Item>
          </div>

          <Form.Item className="text-center mb-0 p-6 border-t border-brand-50 bg-brand-50">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              className={`${
                loading ? "" : "button-hover-effect"
              } !text-white !bg-brand-600 hover:!bg-brand-700 border !border-[#526f4d] !h-10 !w-[80%] ${
                garamond.className
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default DesignRequestModal;
