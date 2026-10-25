"use client";

import React, { useState, useEffect } from "react";
import {
  jewelleryCategoryAPI,
  JewelleryCategory,
} from "../../../src/services/filter&sort/jewellery-category.api";
import {
  JewellerySubCategoryAPI,
  JewellerySubCategory,
} from "../../../src/services/filter&sort/jewellery-sub-category.api";
import {
  JewelleryTypeAPI,
  JewelleryType,
} from "../../../src/services/filter&sort/jewellery-type.api";
import { Select } from "antd";
import { FaChevronDown } from "react-icons/fa";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import Modal from "../../Modal";
import { useFilterSort } from "../../../contexts/FilterSortContext";

const TypeFilter = () => {
  const { 
    categories: contextCategories, 
    refreshCategories, 
    refreshSubCategories, 
    categoryChangeTrigger, 
    subCategoryChangeTrigger 
  } = useFilterSort();
  const [subCategories, setSubCategories] = useState<JewellerySubCategory[]>(
    []
  );
  const [types, setTypes] = useState<JewelleryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [showAddMore, setShowAddMore] = useState(false);
  const [newType, setNewType] = useState("");
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New states for hover/edit/delete
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { Option } = Select;

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  useEffect(() => {
    // Refresh categories when categoryChangeTrigger changes (when categories are updated in other components)
    if (categoryChangeTrigger > 0) {
      refreshCategories();
    }
  }, [categoryChangeTrigger, refreshCategories]);

  useEffect(() => {
    if (!selectedCategory) {
      setSubCategories([]);
      return;
    }
    const fetchSubCategories = async () => {
      setGlobalLoading(true);
      try {
        const subs = await JewellerySubCategoryAPI.getAllEnabledSubCategories(
          selectedCategory
        );
        setSubCategories(subs || []);
      } catch (e: any) {
        showError(e.message);
      }
      setGlobalLoading(false);
    };
    fetchSubCategories();
  }, [selectedCategory]);

  useEffect(() => {
    // Refresh subcategories when subCategoryChangeTrigger changes (when subcategories are updated in other components)
    if (subCategoryChangeTrigger > 0 && selectedCategory) {
      const refreshSubs = async () => {
        try {
          const subs = await JewellerySubCategoryAPI.getAllEnabledSubCategories(selectedCategory);
          setSubCategories(subs || []);
        } catch (e: any) {
          showError(e.message);
        }
      };
      refreshSubs();
    }
  }, [subCategoryChangeTrigger, selectedCategory]);

  useEffect(() => {
    if (!selectedSubCategory) {
      setTypes([]);
      return;
    }
    const fetchTypes = async () => {
      setGlobalLoading(true);
      try {
        const tys = await JewelleryTypeAPI.getAllTypes(selectedSubCategory);
        setTypes(tys || []);
      } catch (e: any) {
        showError(e.message);
      }
      setGlobalLoading(false);
    };
    fetchTypes();
  }, [selectedSubCategory]);

  const handleToggle = async (type: JewelleryType) => {
    const updated = types.map((t) =>
      t.id === type.id
        ? {
            ...t,
            status:
              t.status?.toUpperCase() === "ENABLED" ? "DISABLED" : "ENABLED",
          }
        : t
    );
    setTypes(updated);
    setLoadingIds((prev) => [...prev, type.id]);

    try {
      if (type.status?.toUpperCase() === "ENABLED") {
        await JewelleryTypeAPI.disableType(type.id);
      } else {
        await JewelleryTypeAPI.enableType(type.id);
      }
    } catch (err: any) {
      setTypes(types); // revert
      showError(err.message);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== type.id));
    }
  };

  const handleAddType = async () => {
    const trimmed = newType.trim();
    if (!trimmed) return showError("Type name cannot be empty.");
    if (!selectedSubCategory)
      return showError("Please select a sub-category first.");
    if (types.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      return showError("Type already exists.");
    }

    const tempId = `temp-${Date.now()}`;
    const newItem: any = { id: tempId, name: trimmed, status: "ENABLED" };
    setTypes((prev) => [...prev, newItem]);
    setShowAddMore(false);
    setNewType("");

    try {
      const created = await JewelleryTypeAPI.createType(
        selectedSubCategory,
        trimmed
      );
      setTypes((prev) => prev.map((t) => (t.id === tempId ? created : t)));
    } catch (err: any) {
      setTypes((prev) => prev.filter((t) => t.id !== tempId));
      showError(err.message);
    }
  };

  const handleEditSave = async (type: JewelleryType) => {
    const trimmed = editValue.trim();
    if (!trimmed) return showError("Type name cannot be empty.");
    if (
      types.some(
        (t) =>
          t.name.toLowerCase() === trimmed.toLowerCase() && t.id !== type.id
      )
    ) {
      return showError("Type already exists.");
    }

    const prevList = [...types];
    setTypes((prev) =>
      prev.map((t) => (t.id === type.id ? { ...t, name: trimmed } : t))
    );
    setEditId(null);
    setEditValue("");
    setLoadingIds((prev) => [...prev, type.id]);

    try {
      await JewelleryTypeAPI.updateType(type.id, trimmed);
    } catch (err: any) {
      setTypes(prevList);
      showError(err.message);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== type.id));
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const prevList = [...types];
    setTypes((prev) => prev.filter((t) => t.id !== deleteId));
    setDeleteId(null);
    setLoadingIds((prev) => [...prev, deleteId]);

    try {
      await JewelleryTypeAPI.deleteType(deleteId);
    } catch (err: any) {
      setTypes(prevList);
      showError(err.message);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== deleteId));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-96 border border-brand-50">
      <h2 className="font-semibold text-xl mb-4 text-brand-900">Types</h2>

      {/* Category / SubCategory Select */}
      <div className="flex flex-col gap-2">
        <Select
          value={selectedCategory || undefined}
          onChange={(value) => {
            setSelectedCategory(value);
            setSelectedSubCategory("");
          }}
          className="w-full custom-select mb-2"
          placeholder="Select Category"
          size="middle"
          allowClear
          suffixIcon={<FaChevronDown />}
        >
          {contextCategories.map((cat: JewelleryCategory) => (
            <Option key={cat.id} value={cat.id}>
              {cat.categoryName || cat.name}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedSubCategory || undefined}
          onChange={(value) => setSelectedSubCategory(value)}
          className="w-full custom-select mb-4"
          placeholder="Select Sub Category"
          size="middle"
          allowClear
          disabled={!selectedCategory}
          suffixIcon={<FaChevronDown />}
        >
          {subCategories.map((sub) => (
            <Option key={sub.id} value={sub.id}>
              {sub.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Type List */}
      <div className="flex flex-col mb-2 mt-3 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-brand-200 scrollbar-track-transparent">
        {types.map((type) => {
          const isLoading = loadingIds.includes(type.id);
          return (
            <div
              key={type.id}
              className={`flex items-center gap-2 group relative py-2 px-2 rounded-lg ${
                isLoading
                  ? "opacity-50 pointer-events-none"
                  : "hover:bg-brand-50"
              } transition`}
              onMouseEnter={() => setHoveredId(type.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Toggle */}
              <button
                className={`w-10 h-5 rounded-full flex items-center transition-colors duration-200 cursor-pointer border ${
                  type.status?.toUpperCase() === "ENABLED"
                    ? "bg-brand-400 border-brand-500"
                    : "bg-brand-100 border-brand-200"
                }`}
                onClick={() => handleToggle(type)}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                    type.status?.toUpperCase() === "ENABLED"
                      ? "translate-x-5"
                      : ""
                  }`}
                />
              </button>

              {/* Name / Edit */}
              {editId === type.id ? (
                <>
                  <input
                    type="text"
                    className="border rounded-lg px-2 py-1 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-brand-300"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-1 rounded-lg text-sm ml-1"
                    onClick={() => handleEditSave(type)}
                  >
                    Save
                  </button>
                  <button
                    className="text-brand-600 hover:text-brand-800 px-3 py-1 text-sm ml-1"
                    onClick={() => {
                      setEditId(null);
                      setEditValue("");
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <span className="text-brand-900 text-base font-medium">
                  {type.name}
                </span>
              )}

              {/* Action Buttons */}
              {hoveredId === type.id && editId !== type.id && (
                <div className="flex gap-1 absolute right-2 top-1">
                  <button
                    className="text-brand-600 hover:text-brand-600 p-1 rounded-full transition"
                    title="Edit"
                    onClick={() => {
                      setEditId(type.id);
                      setEditValue(type.name);
                    }}
                  >
                    <FaRegEdit size={18} />
                  </button>
                  <button
                    className="text-brand-600 hover:text-red-600 p-1 rounded-full transition"
                    title="Delete"
                    onClick={() => setDeleteId(type.id)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Type */}
      {showAddMore ? (
        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            className="border rounded-lg px-3 py-2 text-sm w-[180px] focus:outline-none focus:ring-2 focus:ring-brand-300"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Type name"
            autoFocus
          />
          <button
            className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-2 rounded-lg text-sm"
            onClick={handleAddType}
          >
            Add
          </button>
          <button
            className="text-brand-600 hover:text-brand-800 px-3 py-2 text-sm"
            onClick={() => {
              setShowAddMore(false);
              setNewType("");
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-4">
          <button
            className="flex items-center gap-1 border rounded-lg px-3 py-2 text-brand-800 text-sm hover:bg-brand-50 transition"
            onClick={() => setShowAddMore(true)}
          >
            <FiPlus size={18} />
            Add More
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteId}
        title="Delete Type"
        description="Are you sure you want to delete this type? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default TypeFilter;
