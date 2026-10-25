"use client";
import React, { useEffect, useState } from "react";
import {
  catalogueAPI,
  Catalogue,
  CreateCatalogueRequest,
  UpdateCatalogueRequest,
} from "@/src/services/contact-us/contact-us-catalogue.api";
import { uploadAPI } from "@/src/services/api";
import { ApiError } from "@/src/types/auth";
import { FiX } from "react-icons/fi";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { Roboto } from "@/src/common/fonts";
import { UploadOutlined, FileTextOutlined } from "@ant-design/icons";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

interface CatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogue?: Catalogue | null;
  onSave: (catalogue: Catalogue) => void;
}

const CatalogueModal: React.FC<CatalogueModalProps> = ({
  isOpen,
  onClose,
  catalogue,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [pdfPreview, setPdfPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (catalogue) {
      form.setFieldsValue({
        name: catalogue.name,
      });
      setCoverImagePreview(catalogue.coverImage);
      setPdfPreview(catalogue.pdfUrl);
    } else {
      form.resetFields();
      setCoverImagePreview("");
      setPdfPreview("");
    }
  }, [catalogue, isOpen, form]);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      // Get presigned URL for image
      const { preSignedUrl, outPutUrl } = await uploadAPI.getPresignedUrl(
        file.name,
        "IMAGE",
        "OTHER"
      );

      // Upload to S3
      await uploadAPI.uploadToS3(preSignedUrl, file);

      setCoverImagePreview(outPutUrl);
      form.setFieldsValue({ coverImage: outPutUrl });
      message.success("Cover image uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload cover image");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handlePdfUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      // Get presigned URL for PDF
      const { preSignedUrl, outPutUrl } = await uploadAPI.getPresignedUrl(
        file.name,
        "FILE",
        "OTHER"
      );

      // Upload to S3
      await uploadAPI.uploadToS3(preSignedUrl, file);

      setPdfPreview(outPutUrl);
      form.setFieldsValue({ pdfUrl: outPutUrl });
      message.success("PDF uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload PDF");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      let savedCatalogue: Catalogue;

      if (catalogue) {
        // Update existing catalogue
        const updateData: UpdateCatalogueRequest = {
          name: values.name,
          coverImage: values.coverImage || coverImagePreview,
          pdfUrl: values.pdfUrl || pdfPreview,
        };
        savedCatalogue = await catalogueAPI.updateCatalogue(
          catalogue.id,
          updateData
        );
      } else {
        // Create new catalogue
        const createData: CreateCatalogueRequest = {
          name: values.name,
          coverImage: values.coverImage || coverImagePreview,
          pdfUrl: values.pdfUrl || pdfPreview,
        };
        savedCatalogue = await catalogueAPI.createCatalogue(createData);
      }

      onSave(savedCatalogue);
      onClose();
      message.success(
        catalogue
          ? "Catalogue updated successfully!"
          : "Catalogue created successfully!"
      );
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || "Failed to save catalogue");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={catalogue ? "Edit Catalogue" : "Add New Catalogue"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={saving}
      okText={saving ? "Saving..." : catalogue ? "Update" : "Create"}
      cancelText="Cancel"
      width={600}
      centered
      className={roboto.className}
      maskClosable={false}
      okButtonProps={{
        className: `${roboto.className} !bg-brand-600 !text-white hover:!bg-brand-700`,
      }}
      cancelButtonProps={{
        className: `${roboto.className} !bg-brand-600 !text-white hover:!bg-brand-700 !border-brand-600`,
      }}
    >
      <div className={`mb-4 ${roboto.className}`}>
        {catalogue
          ? "Edit the catalogue details below."
          : "Create a new catalogue by filling in the details below."}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className={`${roboto.className} max-h-[500px] overflow-y-auto scrollbar`}
      >
        <Form.Item
          label="Name"
          name="name"
          className={roboto.className}
          rules={[{ required: true, message: "Please enter catalogue name" }]}
        >
          <Input
            placeholder="Enter catalogue name"
            className={roboto.className}
          />
        </Form.Item>

        <Form.Item
          name="coverImage"
          label="Cover Image"
          className={roboto.className}
        >
          <div className="space-y-3">
            {coverImagePreview && (
              <div className="relative">
                <img
                  src={coverImagePreview}
                  alt="Cover Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="link"
                  danger
                  className={`absolute top-2 right-2 ${roboto.className}`}
                  onClick={() => {
                    setCoverImagePreview("");
                    form.setFieldsValue({ coverImage: "" });
                  }}
                >
                  <FiX className="w-4 h-4" />
                </Button>
              </div>
            )}

            <Upload
              beforeUpload={(file) => {
                handleImageUpload(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploading}
                className={`${roboto.className} !bg-brand-500 !text-white hover:!bg-brand-600 !border-brand-500`}
              >
                {uploading ? "Uploading..." : "Upload Cover Image"}
              </Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item
          name="pdfUrl"
          label="PDF Document"
          className={roboto.className}
        >
          <div className="space-y-3">
            {pdfPreview && (
              <div
                className="relative p-4 bg-brand-50 rounded-lg border cursor-pointer"
                onClick={() => {
                  window.open(pdfPreview, "_blank", "noopener,noreferrer");
                }}
              >
                <div className="flex items-center space-x-3">
                  <FileTextOutlined className="w-8 h-8 text-red-500" />
                  <div className="flex-1">
                    <p
                      className={`font-medium text-brand-900 ${roboto.className}`}
                    >
                      PDF Document Uploaded
                    </p>
                    <p className={`text-sm text-brand-600 ${roboto.className}`}>
                      Click to replace or upload a new PDF
                    </p>
                  </div>
                </div>
                <Button
                  type="link"
                  danger
                  className={`absolute top-2 right-2 ${roboto.className}`}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    setPdfPreview("");
                    form.setFieldsValue({ pdfUrl: "" });
                  }}
                >
                  <FiX className="w-4 h-4" />
                </Button>
              </div>
            )}

            <Upload
              beforeUpload={(file) => {
                handlePdfUpload(file);
                return false;
              }}
              showUploadList={false}
              accept=".pdf"
            >
              <Button
                icon={<FileTextOutlined />}
                loading={uploading}
                className={`${roboto.className} !bg-brand-500 !text-white hover:!bg-brand-600 !border-brand-500`}
              >
                {uploading ? "Uploading..." : "Upload PDF"}
              </Button>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CatalogueModal;
