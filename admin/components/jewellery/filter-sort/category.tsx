'use client';

import React, { useEffect, useState } from 'react';
import { jewelleryCategoryAPI, JewelleryCategory } from '../../../src/services/filter&sort/jewellery-category.api';
import Modal from '../../Modal';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { FaRegEdit } from "react-icons/fa";
import { useFilterSort } from '../../../contexts/FilterSortContext';

const Category = () => {
  const { refreshCategories, notifyCategoryChange } = useFilterSort();
  const [categories, setCategories] = useState<JewelleryCategory[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]); // track specific actions
  const [globalLoading, setGlobalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setGlobalLoading(true);
    try {
      const data = await jewelleryCategoryAPI.getAllCategories();
      setCategories(data);
    } catch (err: any) {
      showError(err.message);
    } finally {
      setGlobalLoading(false);
    }
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggle = async (cat: JewelleryCategory) => {
    const updated = categories.map(c =>
      c.id === cat.id ? { ...c, status: c.status?.toUpperCase() === 'ENABLED' ? 'DISABLED' : 'ENABLED' } : c
    );
    setCategories(updated);
    setLoadingIds(prev => [...prev, cat.id]);

    try {
      if (cat.status?.toUpperCase() === 'ENABLED') {
        await jewelleryCategoryAPI.disableCategory(cat.id);
      } else {
        await jewelleryCategoryAPI.enableCategory(cat.id);
      }
    } catch (err: any) {
      // revert if failed
      setCategories(categories);
      showError(err.message);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== cat.id));
    }
  };

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return showError('Category name cannot be empty.');
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      return showError('Category already exists.');
    }

    // Optimistic UI
    const tempId = `temp-${Date.now()}`;
    const newCat: any = { id: tempId, name: trimmed, status: 'ENABLED' };
    setCategories(prev => [...prev, newCat]);
    setShowAdd(false);
    setNewCategory('');

    try {
      const created = await jewelleryCategoryAPI.createCategory(trimmed);
      // Replace temp with real data from API
      setCategories(prev => prev.map(c => c.id === tempId ? created : c));
      // Notify other components that categories have changed
      notifyCategoryChange();
      await refreshCategories();
    } catch (err: any) {
      // revert if failed
      setCategories(prev => prev.filter(c => c.id !== tempId));
      showError(err.message);
    }
  };

  const handleEditSave = async (cat: JewelleryCategory) => {
    const trimmed = editValue.trim();
    if (!trimmed) return showError('Category name cannot be empty.');
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== cat.id)) {
      return showError('Category already exists.');
    }

    const prevCategories = [...categories];
    setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, name: trimmed } : c));
    setEditId(null);
    setEditValue('');
    setLoadingIds(prev => [...prev, cat.id]);

    try {
      await jewelleryCategoryAPI.updateCategory(cat.id, trimmed);
      // Notify other components that categories have changed
      notifyCategoryChange();
      await refreshCategories();
    } catch (err: any) {
      setCategories(prevCategories); // revert
      showError(err.message);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== cat.id));
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const prevCategories = [...categories];
    setCategories(prev => prev.filter(c => c.id !== deleteId));
    setDeleteId(null);
    setLoadingIds(prev => [...prev, deleteId]);

    try {
      await jewelleryCategoryAPI.deleteCategory(deleteId);
      // Notify other components that categories have changed
      notifyCategoryChange();
      await refreshCategories();
    } catch (err: any) {
      setCategories(prevCategories); // revert
      showError(err.message);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== deleteId));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-96 border border-brand-50">
      <h2 className="font-semibold text-xl mb-4 text-brand-900">Categories</h2>
      {/* {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded mb-3 text-sm">{error}</div>} */}
      {/* {globalLoading && categories.length === 0 && (
        <div className="text-brand-600 text-sm mb-3">Loading categories...</div>
      )} */}

      <div className="flex flex-col mb-2 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-brand-200 scrollbar-track-transparent">
        {categories.map((cat) => {
          const isLoading = loadingIds.includes(cat.id);
          return (
            <div
              key={cat.id}
              className={`flex items-center gap-2 group relative py-2 px-2 rounded-lg ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:bg-brand-50'} transition`}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Toggle */}
              <button
                className={`w-10 h-5 rounded-full flex items-center transition-colors duration-200 cursor-pointer border ${cat.status?.toUpperCase() === 'ENABLED'
                  ? 'bg-brand-400 border-brand-500'
                  : 'bg-brand-100 border-brand-200'
                  }`}
                onClick={() => handleToggle(cat)}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${cat.status?.toUpperCase() === 'ENABLED' ? 'translate-x-5' : ''}`}
                />
              </button>

              {/* Name / Edit */}
              {editId === cat.id ? (
                <>
                  <input
                    type="text"
                    className="border rounded-lg px-2 py-1 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-brand-300"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-1 rounded-lg text-sm ml-1"
                    onClick={() => handleEditSave(cat)}
                  >
                    Save
                  </button>
                  <button
                    className="text-brand-600 hover:text-brand-800 px-3 py-1 text-sm ml-1"
                    onClick={() => { setEditId(null); setEditValue(''); }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <span className="text-brand-900 text-base font-medium">{cat.name}</span>
              )}

              {/* Action Buttons */}
              {hoveredId === cat.id && editId !== cat.id && (
                <div className="flex gap-1 absolute right-2 top-1">
                  <button
                    className="text-brand-600 hover:text-brand-600 p-1 rounded-full transition"
                    title="Edit"
                    onClick={() => { setEditId(cat.id); setEditValue(cat.name); }}
                  >
                    <FaRegEdit size={18} />
                  </button>
                  <button
                    className="text-brand-600 hover:text-red-600 p-1 rounded-full transition"
                    title="Delete"
                    onClick={() => setDeleteId(cat.id)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Category */}
      {showAdd ? (
        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            className="border rounded-lg px-3 py-2 text-sm w-[180px] focus:outline-none focus:ring-2 focus:ring-brand-300"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Category name"
            autoFocus
          />
          <button
            className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-2 rounded-lg text-sm"
            onClick={handleAddCategory}
          >
            Add
          </button>
          <button
            className="text-brand-600 hover:text-brand-800 px-3 py-2 text-sm"
            onClick={() => { setShowAdd(false); setNewCategory(''); }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className='flex items-center justify-center mt-4'>
          <button
            className="flex items-center gap-1 border rounded-lg px-3 py-2 text-brand-800 text-sm hover:bg-brand-50 transition"
            onClick={() => setShowAdd(true)}
          >
            <FiPlus size={18} />
            Add More
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteId}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Category;
