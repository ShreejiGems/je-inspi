"use client";
import React, { useEffect, useState } from "react";
import {
  eventAPI,
  Event,
} from "@/src/services/contact-us/contact-us-event.api";
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
import EventModal from "./event-modal";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const { Text } = Typography;

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
  onSave: (event: Event) => void;
}

const EventComponent: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventAPI.getAllEvents();
      setEvents(data);
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleSaveEvent = async (savedEvent: Event) => {
    if (editingEvent) {
      // Update existing event in the list
      setEvents((prev) =>
        prev.map((ev) => (ev.id === savedEvent.id ? savedEvent : ev))
      );
    } else {
      // Add new event to the list
      setEvents((prev) => [...prev, savedEvent]);
    }
  };

  const handleDeleteEvent = (event: Event) => {
    setDeleteId(event.id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const eventToDelete = events.find((ev) => ev.id === deleteId);
      if (!eventToDelete) return;

      if (eventToDelete.status === "ENABLED") {
        await eventAPI.disableEvent(deleteId);
      } else {
        await eventAPI.deleteEvent(deleteId);
      }
      setEvents((prev) => prev.filter((ev) => ev.id !== deleteId));
      message.success("Event deleted successfully!");
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || "Failed to delete event");
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleStatus = async (event: Event) => {
    try {
      let updatedEvent: Event;
      if (event.status === "ENABLED") {
        updatedEvent = await eventAPI.disableEvent(event.id);
      } else {
        updatedEvent = await eventAPI.enableEvent(event.id);
      }
      setEvents((prev) =>
        prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
      );
      message.success(
        `Event ${
          updatedEvent.status === "ENABLED" ? "enabled" : "disabled"
        } successfully!`
      );
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || "Failed to update event status");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-brand-700">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-100">
        <h1 className="text-2xl font-semibold text-brand-900">
          Events Management
        </h1>
        <button
          onClick={handleCreateEvent}
          className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Add Event
        </button>
      </div>

      {/* Content */}
      <div className="px-2 h-[calc(100%-65px)] overflow-y-scroll scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
              <p className="text-brand-700">Loading events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center py-12">
              <div className="text-brand-400 mb-4">
                <FiPlus className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-brand-900 mb-2">
                No events yet
              </h3>
              <p className="text-brand-600 mb-4">
                Get started by creating your first event.
              </p>
              <button
                onClick={handleCreateEvent}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg transition-colors"
              >
                Add Event
              </button>
            </div>
          </div>
        ) : (
          <Table
            dataSource={events}
            columns={[
              {
                title: (
                  <div className={`text-center ${roboto.className}`}>Image</div>
                ),
                dataIndex: "image",
                key: "image",
                width: 120,
                align: "left",
                render: (image: string) => (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-brand-50 flex items-center justify-center">
                    {image ? (
                      <img
                        src={image || "/assets/common/placeholder-image.png"}
                        alt="Event"
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
                  <div className={`text-center ${roboto.className}`}>Title</div>
                ),
                dataIndex: "title",
                key: "title",
                align: "center",
                render: (title: string) => (
                  <div
                    className={`font-medium text-brand-900 ${roboto.className}`}
                  >
                    {title}
                  </div>
                ),
              },
              {
                title: (
                  <div className={`text-center ${roboto.className}`}>
                    Description
                  </div>
                ),
                dataIndex: "description",
                key: "description",
                align: "center",
                render: (description: string) => (
                  <div
                    className={`max-w-md truncate text-brand-700 ${roboto.className}`}
                  >
                    {description}
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
                render: (_, record: Event) => (
                  <Space size="small">
                    <Tooltip title="Edit Event">
                      <Button
                        type="link"
                        icon={<FiEdit className="w-4 h-4" />}
                        onClick={() => handleEditEvent(record)}
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
                            ? "Disable Event"
                            : "Enable Event"
                        }
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                            record.status === "ENABLED" ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <Tooltip title="Delete Event">
                      <Button
                        type="link"
                        danger
                        icon={<FiTrash2 className="w-4 h-4" />}
                        onClick={() => handleDeleteEvent(record)}
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
                  message="Loading events..."
                  size={40}
                  color="border-brand-600"
                />
              ),
            }}
            pagination={{
              current: 1,
              pageSize: 10,
              total: events.length,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} events`,
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
                              Events List
                            </h3>
                            <p className="text-brand-600">No events found.</p>
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
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        event={editingEvent}
        onSave={handleSaveEvent}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <span
            className={`text-lg font-medium text-brand-900 ${roboto.className}`}
          >
            Delete Event
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
        className={`${roboto.className} rounded-xl`} // Apply font to entire modal
        width={400}
      >
        <p className={`text-brand-800 text-base ${roboto.className}`}>
          Are you sure you want to delete this event?
        </p>
      </Modal>
    </div>
  );
};

export default EventComponent;
