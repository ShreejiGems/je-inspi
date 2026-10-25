"use client";
import React, { useEffect, useState } from "react";
import {
  locationAPI,
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
} from "@/src/services/contact-us/contact-us-location.api";
import { ApiError } from "@/src/types/auth";
import { FiX } from "react-icons/fi";
import { Modal, Form, Input, Button, message } from "antd";
import { Roboto } from "@/src/common/fonts";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: Location | null;
  onSave: (location: Location) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  location,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (location) {
      form.setFieldsValue({
        country: location.country,
        countryCode: location.countryCode,
        phone: location.phone,
        email: location.email,
      });
    } else {
      form.resetFields();
    }
  }, [location, isOpen, form]);

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      let savedLocation: Location;

      if (location) {
        // Update existing location
        const updateData: UpdateLocationRequest = {
          country: values.country,
          countryCode: values.countryCode,
          phone: values.phone,
          email: values.email,
        };
        savedLocation = await locationAPI.updateLocation(location.id, updateData);
      } else {
        // Create new location
        const createData: CreateLocationRequest = {
          country: values.country,
          countryCode: values.countryCode,
          phone: values.phone,
          email: values.email,
        };
        savedLocation = await locationAPI.createLocation(createData);
      }

      onSave(savedLocation);
      onClose();
      message.success(
        location ? "Location updated successfully!" : "Location created successfully!"
      );
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || "Failed to save location");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={location ? "Edit Location" : "Add New Location"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={saving}
      okText={saving ? "Saving..." : location ? "Update" : "Create"}
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
        {location
          ? "Edit the location details below."
          : "Create a new location by filling in the details below."}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className={`${roboto.className} max-h-[500px] overflow-y-auto scrollbar`}
      >
        <Form.Item
          label="Country"
          name="country"
          className={roboto.className}
          rules={[{ required: true, message: "Please enter country name" }]}
        >
          <Input placeholder="Enter country name" className={roboto.className} />
        </Form.Item>

        <Form.Item
          label="Country Code"
          name="countryCode"
          className={roboto.className}
          rules={[{ required: true, message: "Please enter country code" }]}
        >
          <Input placeholder="Enter country code (e.g., +1, +91)" className={roboto.className} />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          className={roboto.className}
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Enter phone number" className={roboto.className} />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          className={roboto.className}
          rules={[
            { required: true, message: "Please enter email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="Enter email address" className={roboto.className} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LocationModal;
