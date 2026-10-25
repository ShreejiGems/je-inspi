"use client";
import React, { useEffect, useState } from "react";
import {
  eventAPI,
  Event,
  CreateEventRequest,
  UpdateEventRequest,
} from "@/src/services/contact-us/contact-us-event.api";
import { uploadAPI } from "@/src/services/api";
import { ApiError } from "@/src/types/auth";
import { FiX } from "react-icons/fi";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { Roboto } from "@/src/common/fonts";
import { UploadOutlined } from "@ant-design/icons";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
  onSave: (event: Event) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event) {
      form.setFieldsValue({
        title: event.title,
        description: event.description,
      });
      setImagePreview(event.image);
    } else {
      form.resetFields();
      setImagePreview("");
    }
  }, [event, isOpen, form]);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Check image dimensions before upload
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = async () => {
      const targetRatio = 600 / 400; // 3:2 ratio
      const currentRatio = img.width / img.height;
      
      // Allow small tolerance for floating point precision
      const tolerance = 0.01;
      
      if (Math.abs(currentRatio - targetRatio) > tolerance) {
        message.error(`Image must have a 3:2 aspect ratio (like 600x400, 900x600, 1200x800, etc.). Current ratio: ${img.width}:${img.height}`);
        return;
      }

      // Proceed with upload if ratio is correct
      await performUpload(file);
    };

    img.onerror = () => {
      message.error("Failed to load image for dimension validation");
    };

    reader.readAsDataURL(file);
  };

  const performUpload = async (file: File) => {
    setUploading(true);
    try {
      // Get presigned URL
      const { preSignedUrl, outPutUrl } = await uploadAPI.getPresignedUrl(
        file.name,
        "IMAGE",
        "OTHER"
      );

      // Upload to S3
      await uploadAPI.uploadToS3(preSignedUrl, file);

      setImagePreview(outPutUrl);
      form.setFieldsValue({ image: outPutUrl });
    } catch (error) {
      message.error("Failed to upload image");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      let savedEvent: Event;

      if (event) {
        // Update existing event
        const updateData: UpdateEventRequest = {
          title: values.title,
          image: values.image || imagePreview,
          description: values.description,
        };
        savedEvent = await eventAPI.updateEvent(event.id, updateData);
      } else {
        // Create new event
        const createData: CreateEventRequest = {
          title: values.title,
          image: values.image || imagePreview,
          description: values.description,
        };
        savedEvent = await eventAPI.createEvent(createData);
      }

      onSave(savedEvent);
      onClose();
      message.success(
        event ? "Event updated successfully!" : "Event created successfully!"
      );
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={event ? "Edit Event" : "Add New Event"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={saving}
      okText={saving ? "Saving..." : event ? "Update" : "Create"}
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
        {event
          ? "Edit the event details below."
          : "Create a new event by filling in the details below."}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className={`${roboto.className} max-h-[500px]  overflow-y-auto scrollbar`}
      >
        <Form.Item
          label="Title"
          name="title"
          className={roboto.className}
          rules={[{ required: true, message: "Please enter event title" }]}
        >
          <Input placeholder="Enter event title" className={roboto.className} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          className={roboto.className}
          rules={[
            { required: true, message: "Please enter event description" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter event description"
            className={roboto.className}
          />
        </Form.Item>

        <Form.Item 
          name="image" 
          label="Image" 
          className={roboto.className}
          extra="Required aspect ratio: 3:2 (e.g., 600x400, 900x600, 1200x800, etc.)"
        >
          <div className="space-y-3">
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-auto h-48 object-cover rounded-lg"
                />
                <Button
                  type="link"
                  danger
                  className={`absolute top-2 right-2 ${roboto.className}`}
                  onClick={() => {
                    setImagePreview("");
                    form.setFieldsValue({ image: "" });
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
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EventModal;
