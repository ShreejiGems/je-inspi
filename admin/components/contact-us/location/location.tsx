"use client";
import React, { useEffect, useState } from "react";
import {
  locationAPI,
  Location,
} from "@/src/services/contact-us/contact-us-location.api";
import { ApiError } from "@/src/types/auth";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Loader from "@/components/common/loader";
import {
  Modal,
  Button,
  message,
  Typography,
  Table,
  Tag,
  Space,
  Tooltip,
  Empty,
} from "antd";
import { Roboto } from "@/src/common/fonts";
import LocationModal from "./location-modal";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const { Text } = Typography;

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: Location | null;
  onSave: (location: Location) => void;
}

const LocationComponent: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await locationAPI.getAllLocations();
      setLocations(data);
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || "Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLocation = () => {
    setEditingLocation(null);
    setModalOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setModalOpen(true);
  };

  const handleSaveLocation = async (savedLocation: Location) => {
    if (editingLocation) {
      // Update existing location in the list
      setLocations((prev) =>
        prev.map((loc) => (loc.id === savedLocation.id ? savedLocation : loc))
      );
    } else {
      // Add new location to the list
      setLocations((prev) => [...prev, savedLocation]);
    }
  };

  const handleDeleteLocation = (location: Location) => {
    setDeleteId(location.id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const locationToDelete = locations.find((loc) => loc.id === deleteId);
      if (!locationToDelete) return;

      if (locationToDelete.status === "ENABLED") {
        await locationAPI.disableLocation(deleteId);
      } else {
        await locationAPI.deleteLocation(deleteId);
      }
      setLocations((prev) => prev.filter((loc) => loc.id !== deleteId));
      message.success("Location deleted successfully!");
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || "Failed to delete location");
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleStatus = async (location: Location) => {
    try {
      let updatedLocation: Location;
      if (location.status === "ENABLED") {
        updatedLocation = await locationAPI.disableLocation(location.id);
      } else {
        updatedLocation = await locationAPI.enableLocation(location.id);
      }
      setLocations((prev) =>
        prev.map((loc) => (loc.id === updatedLocation.id ? updatedLocation : loc))
      );
      message.success(
        `Location ${
          updatedLocation.status === "ENABLED" ? "enabled" : "disabled"
        } successfully!`
      );
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || "Failed to update location status");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-brand-700">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-100">
        <h1 className="text-2xl font-semibold text-brand-900">
          Location Management
        </h1>
        <button
          onClick={handleCreateLocation}
          className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Add Location
        </button>
      </div>

      {/* Content */}
      <div className="px-2 h-[calc(100%-65px)] overflow-y-scroll scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
              <p className="text-brand-700">Loading locations...</p>
            </div>
          </div>
        ) : locations.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center py-12">
              <div className="text-brand-400 mb-4">
                <FiPlus className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-brand-900 mb-2">
                No locations yet
              </h3>
              <p className="text-brand-600 mb-4">
                Get started by creating your first location.
              </p>
              <button
                onClick={handleCreateLocation}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg transition-colors"
              >
                Add Location
              </button>
            </div>
          </div>
        ) : (
          <Table
            dataSource={locations}
            columns={[
              {
                title: (
                  <div className={`text-center ${roboto.className}`}>Country</div>
                ),
                dataIndex: "country",
                key: "country",
                align: "center",
                render: (country: string) => (
                  <div
                    className={`font-medium text-brand-900 ${roboto.className}`}
                  >
                    {country}
                  </div>
                ),
              },
              {
                title: (
                  <div className={`text-center ${roboto.className}`}>Country Code</div>
                ),
                dataIndex: "countryCode",
                key: "countryCode",
                align: "center",
                render: (countryCode: string) => (
                  <div
                    className={`font-medium text-brand-900 ${roboto.className}`}
                  >
                    {countryCode}
                  </div>
                ),
              },
              {
                title: (
                  <div className={`text-center ${roboto.className}`}>Phone</div>
                ),
                dataIndex: "phone",
                key: "phone",
                align: "center",
                render: (phone: string) => (
                  <div
                    className={`text-brand-700 ${roboto.className}`}
                  >
                    {phone}
                  </div>
                ),
              },
              {
                title: (
                  <div className={`text-center ${roboto.className}`}>Email</div>
                ),
                dataIndex: "email",
                key: "email",
                align: "center",
                render: (email: string) => (
                  <div
                    className={`text-brand-700 ${roboto.className}`}
                  >
                    {email}
                  </div>
                ),
              },
              {
                title: (
                  <div className={`text-center ${roboto.className}`}>
                    Status
                  </div>
                ),
                dataIndex: "status",
                key: "status",
                width: 100,
                align: "center",
                render: (status: string) => (
                  <Tag color={status === "ENABLED" ? "#526f4d" : "red"}>
                    {status}
                  </Tag>
                ),
              },
              {
                title: (
                  <div className={`text-center ${roboto.className}`}>
                    Created
                  </div>
                ),
                dataIndex: "createdAt",
                key: "createdAt",
                width: 120,
                align: "center",
                render: (createdAt: string) => (
                  <div className={`text-sm text-brand-600 ${roboto.className}`}>
                    {new Date(createdAt).toLocaleDateString()}
                  </div>
                ),
              },
              {
                title: (
                  <div className={`text-center ${roboto.className}`}>
                    Actions
                  </div>
                ),
                key: "actions",
                width: 180,
                align: "center",
                render: (_, record: Location) => (
                  <Space size="small">
                    <Tooltip title="Edit Location">
                      <Button
                        type="link"
                        icon={<FiEdit className="w-4 h-4" />}
                        onClick={() => handleEditLocation(record)}
                        className={`text-brand-600 hover:text-brand-800 p-0 ${roboto.className}`}
                      />
                    </Tooltip>

                    {/* Toggle Switch for Enable/Disable */}
                    <div className="flex items-center">
                      <button
                        className={`w-10 h-5 rounded-full flex items-center transition-colors duration-200 cursor-pointer border ${
                          record.status === "ENABLED"
                            ? "bg-brand-400 border-brand-400"
                            : "bg-brand-100 border-brand-200"
                        }`}
                        onClick={() => handleToggleStatus(record)}
                        title={
                          record.status === "ENABLED"
                            ? "Disable Location"
                            : "Enable Location"
                        }
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                            record.status === "ENABLED" ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <Tooltip title="Delete Location">
                      <Button
                        type="link"
                        danger
                        icon={<FiTrash2 className="w-4 h-4" />}
                        onClick={() => handleDeleteLocation(record)}
                        className={`p-0 ${roboto.className}`}
                      />
                    </Tooltip>
                  </Space>
                ),
              },
            ]}
            rowKey="id"
            loading={{
              spinning: loading,
              indicator: (
                <Loader
                  message="Loading locations..."
                  size={40}
                  color="border-brand-600"
                />
              ),
            }}
            pagination={{
              current: 1,
              pageSize: 10,
              total: locations.length,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} locations`,
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
                              Locations List
                            </h3>
                            <p className="text-brand-600">No locations found.</p>
                          </div>
                        }
                      />
                    ),
                  }
            }
          />
        )}
      </div>

      {/* Modal */}
      <LocationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        location={editingLocation}
        onSave={handleSaveLocation}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <span
            className={`text-lg font-medium text-brand-900 ${roboto.className}`}
          >
            Delete Location
          </span>
        }
        open={!!deleteId}
        centered
        onOk={async () => confirmDelete()}
        onCancel={() => {
          setDeleteId(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true, loading }}
        cancelText="Cancel"
        className={`${roboto.className} rounded-xl`}
        width={400}
      >
        <p className={`text-brand-800 text-base ${roboto.className}`}>
          Are you sure you want to delete this location?
        </p>
      </Modal>
    </div>
  );
};

export default LocationComponent;