"use client";
import React, { useEffect, useState } from "react";
import {
  catalogueAPI,
  Catalogue,
} from "@/src/services/contact-us/contact-us-catalogue.api";
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
import CatalogueModal from "./catalogue-modal";
import { FaFilePdf } from "react-icons/fa6";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const { Text } = Typography;

interface CatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogue?: Catalogue | null;
  onSave: (catalogue: Catalogue) => void;
}

const CatalogueComponent: React.FC = () => {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCatalogue, setEditingCatalogue] = useState<Catalogue | null>(
    null
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCatalogues();
  }, []);

  const fetchCatalogues = async () => {
    try {
      setLoading(true);
      const data = await catalogueAPI.getAllCatalogues();
      setCatalogues(data);
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || "Failed to fetch catalogues");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCatalogue = () => {
    setEditingCatalogue(null);
    setModalOpen(true);
  };

  const handleEditCatalogue = (catalogue: Catalogue) => {
    setEditingCatalogue(catalogue);
    setModalOpen(true);
  };

  const handleSaveCatalogue = async (savedCatalogue: Catalogue) => {
    if (editingCatalogue) {
      setCatalogues((prev) =>
        prev.map((cat) => (cat.id === savedCatalogue.id ? savedCatalogue : cat))
      );
    } else {
      setCatalogues((prev) => [...prev, savedCatalogue]);
    }
  };

  const handleDeleteCatalogue = (catalogue: Catalogue) => {
    setDeleteId(catalogue.id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const catalogueToDelete = catalogues.find((cat) => cat.id === deleteId);
      if (!catalogueToDelete) return;

      if (catalogueToDelete.status === "ENABLED") {
        await catalogueAPI.disableCatalogue(deleteId);
      } else {
        await catalogueAPI.deleteCatalogue(deleteId);
      }
      setCatalogues((prev) => prev.filter((cat) => cat.id !== deleteId));
      message.success("Catalogue deleted successfully!");
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || "Failed to delete catalogue");
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleStatus = async (catalogue: Catalogue) => {
    try {
      let updatedCatalogue: Catalogue;
      if (catalogue.status === "ENABLED") {
        updatedCatalogue = await catalogueAPI.disableCatalogue(catalogue.id);
      } else {
        updatedCatalogue = await catalogueAPI.enableCatalogue(catalogue.id);
      }
      setCatalogues((prev) =>
        prev.map((cat) =>
          cat.id === updatedCatalogue.id ? updatedCatalogue : cat
        )
      );
      message.success(
        `Catalogue ${
          updatedCatalogue.status === "ENABLED" ? "enabled" : "disabled"
        } successfully!`
      );
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || "Failed to update catalogue status");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-brand-700">Loading catalogues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-100">
        <h1 className="text-2xl font-semibold text-brand-900">
          Catalogue Management
        </h1>
        <button
          onClick={handleCreateCatalogue}
          className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Add Catalogue
        </button>
      </div>

      {/* Content */}
      <div className="px-2 h-[calc(100%-65px)] overflow-y-scroll scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
              <p className="text-brand-700">Loading catalogues...</p>
            </div>
          </div>
        ) : catalogues.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center py-12">
              <div className="text-brand-400 mb-4">
                <FiPlus className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-brand-900 mb-2">
                No catalogues yet
              </h3>
              <p className="text-brand-600 mb-4">
                Get started by creating your first catalogue.
              </p>
              <button
                onClick={handleCreateCatalogue}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg transition-colors"
              >
                Add Catalogue
              </button>
            </div>
          </div>
        ) : (
          <Table
            dataSource={catalogues}
            columns={[
              {
                title: (
                  <div className={`text-center ${roboto.className}`}>
                    Cover Image
                  </div>
                ),
                dataIndex: "coverImage",
                key: "coverImage",
                width: 120,
                align: "left",
                render: (coverImage: string) => (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-brand-50 flex items-center justify-center">
                    {coverImage ? (
                      <img
                        src={
                          coverImage || "/assets/common/placeholder-image.png"
                        }
                        alt="Catalogue Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full text-brand-400">
                        No Image
                      </div>
                    )}
                  </div>
                ),
              },
              {
                title: (
                  <div className={`text-center ${roboto.className}`}>Name</div>
                ),
                dataIndex: "name",
                key: "name",
                align: "center",
                render: (name: string) => (
                  <div
                    className={`font-medium text-brand-900 ${roboto.className}`}
                  >
                    {name}
                  </div>
                ),
              },
              {
                title: (
                  <div className={`text-center ${roboto.className}`}>
                    PDF Document
                  </div>
                ),
                dataIndex: "pdfUrl",
                key: "pdfUrl",
                align: "center",
                render: (pdfUrl: string) => (
                  <div className="flex items-center justify-center">
                    {/* <Tag color={pdfUrl ? "#526f4d" : "red"}>
                      {pdfUrl ? "Available" : "No PDF"}
                    </Tag> */}
                    <FaFilePdf
                      className="w-6 h-6 text-red-500 cursor-pointer"
                      onClick={() => {
                        window.open(pdfUrl, "_blank", "noopener,noreferrer");
                      }}
                    />
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
                render: (_, record: Catalogue) => (
                  <Space size="small">
                    <Tooltip title="Edit Catalogue">
                      <Button
                        type="link"
                        icon={<FiEdit className="w-4 h-4" />}
                        onClick={() => handleEditCatalogue(record)}
                        className={`text-brand-600 hover:text-brand-800 p-0 ${roboto.className}`}
                      />
                    </Tooltip>

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
                            ? "Disable Catalogue"
                            : "Enable Catalogue"
                        }
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                            record.status === "ENABLED" ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <Tooltip title="Delete Catalogue">
                      <Button
                        type="link"
                        danger
                        icon={<FiTrash2 className="w-4 h-4" />}
                        onClick={() => handleDeleteCatalogue(record)}
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
                  message="Loading catalogues..."
                  size={40}
                  color="border-brand-600"
                />
              ),
            }}
            pagination={{
              current: 1,
              pageSize: 10,
              total: catalogues.length,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} catalogues`,
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
                              Catalogue List
                            </h3>
                            <p className="text-brand-600">
                              No catalogues found.
                            </p>
                          </div>
                        }
                      />
                    ),
                  }
            }
          />
        )}
      </div>

      <CatalogueModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        catalogue={editingCatalogue}
        onSave={handleSaveCatalogue}
      />

      <Modal
        title={
          <span
            className={`text-lg font-medium text-brand-900 ${roboto.className}`}
          >
            Delete Catalogue
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
          Are you sure you want to delete this catalogue?
        </p>
      </Modal>
    </div>
  );
};

export default CatalogueComponent;
