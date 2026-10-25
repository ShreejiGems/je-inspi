'use client';

import React, { useEffect, useState } from 'react';
import Modal from '../../Modal';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { FaRegEdit } from 'react-icons/fa';
import { jewelleryCategoryAPI, JewelleryCategory } from '../../../src/services/filter&sort/jewellery-category.api';
import { JewellerySubCategoryAPI, JewellerySubCategory } from '../../../src/services/filter&sort/jewellery-sub-category.api';
import { FaChevronDown } from "react-icons/fa";
import { Select } from 'antd';
import { useFilterSort } from '../../../contexts/FilterSortContext';

const SubCategoryManager = () => {
    const { categories: contextCategories, refreshCategories, notifySubCategoryChange, categoryChangeTrigger } = useFilterSort();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [subCategories, setSubCategories] = useState<JewellerySubCategory[]>([]);
    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [globalLoading, setGlobalLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showAdd, setShowAdd] = useState(false);
    const [newSubCategory, setNewSubCategory] = useState('');
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
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
        if (selectedCategory) {
            fetchSubCategories();
        } else {
            setSubCategories([]);
        }
    }, [selectedCategory]);

    useEffect(() => {
        // Refresh categories when categoryChangeTrigger changes (when categories are updated in other components)
        if (categoryChangeTrigger > 0) {
            refreshCategories();
        }
    }, [categoryChangeTrigger, refreshCategories]);

    const fetchSubCategories = async () => {
        setGlobalLoading(true);
        try {
            const data = await JewellerySubCategoryAPI.getAllSubCategories(selectedCategory);
            setSubCategories(data || []);
        } catch (err: any) {
            showError(err.message);
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleToggle = async (subCat: JewellerySubCategory) => {
        const updated = subCategories.map(sc =>
            sc.id === subCat.id ? { ...sc, status: sc.status?.toUpperCase() === 'ENABLED' ? 'DISABLED' : 'ENABLED' } : sc
        );
        setSubCategories(updated);
        setLoadingIds(prev => [...prev, subCat.id]);

        try {
            if (subCat.status?.toUpperCase() === 'ENABLED') {
                await JewellerySubCategoryAPI.disableSubCategory(subCat.id);
            } else {
                await JewellerySubCategoryAPI.enableSubCategory(subCat.id);
            }
        } catch (err: any) {
            setSubCategories(subCategories); // revert
            showError(err.message);
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== subCat.id));
        }
    };

    const handleAdd = async () => {
        const trimmed = newSubCategory.trim();
        if (!trimmed) return showError('Sub-category name cannot be empty.');
        if (!selectedCategory) return showError('Please select a category first.');
        if (subCategories.some(sc => sc.name.toLowerCase() === trimmed.toLowerCase())) {
            return showError('Sub-category already exists.');
        }

        const tempId = `temp-${Date.now()}`;
        const newSubCat: any = { id: tempId, name: trimmed, status: 'ENABLED' };
        setSubCategories(prev => [...prev, newSubCat]);
        setShowAdd(false);
        setNewSubCategory('');

        try {
            const created = await JewellerySubCategoryAPI.createSubCategory(selectedCategory, trimmed);
            setSubCategories(prev => prev.map(sc => sc.id === tempId ? created : sc));
            // Notify other components that subcategories have changed
            notifySubCategoryChange();
        } catch (err: any) {
            setSubCategories(prev => prev.filter(sc => sc.id !== tempId));
            showError(err.message);
        }
    };

    const handleEditSave = async (subCat: JewellerySubCategory) => {
        const trimmed = editValue.trim();
        if (!trimmed) return showError('Sub-category name cannot be empty.');
        if (subCategories.some(sc => sc.name.toLowerCase() === trimmed.toLowerCase() && sc.id !== subCat.id)) {
            return showError('Sub-category already exists.');
        }

        const prevList = [...subCategories];
        setSubCategories(prev => prev.map(sc => sc.id === subCat.id ? { ...sc, name: trimmed } : sc));
        setEditId(null);
        setEditValue('');
        setLoadingIds(prev => [...prev, subCat.id]);

        try {
            await JewellerySubCategoryAPI.updateSubCategory(subCat.id, trimmed);
            // Notify other components that subcategories have changed
            notifySubCategoryChange();
        } catch (err: any) {
            setSubCategories(prevList);
            showError(err.message);
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== subCat.id));
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        const prevList = [...subCategories];
        setSubCategories(prev => prev.filter(sc => sc.id !== deleteId));
        setDeleteId(null);
        setLoadingIds(prev => [...prev, deleteId]);

        try {
            await JewellerySubCategoryAPI.deleteSubCategory(deleteId);
            // Notify other components that subcategories have changed
            notifySubCategoryChange();
        } catch (err: any) {
            setSubCategories(prevList);
            showError(err.message);
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== deleteId));
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-96 border border-brand-50">
            <h2 className="font-semibold text-xl mb-4 text-brand-900">Sub Categories</h2>
            {/* {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded mb-3 text-sm">{error}</div>}
            {globalLoading && subCategories.length === 0 && (
                <div className="text-brand-600 text-sm mb-3">Loading sub-categories...</div>
            )} */}

            {/* Category Selector */}
            <Select
                value={selectedCategory || undefined}
                onChange={(value) => setSelectedCategory(value)}
                className="w-full custom-select"
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

            {/* SubCategory List */}
            <div className="flex flex-col mb-2 mt-3 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-brand-200 scrollbar-track-transparent">
                {subCategories.map(subCat => {
                    const isLoading = loadingIds.includes(subCat.id);
                    return (
                        <div
                            key={subCat.id}
                            className={`flex items-center gap-2 group relative py-2 px-2 rounded-lg ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:bg-brand-50'} transition`}
                            onMouseEnter={() => setHoveredId(subCat.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Toggle */}
                            <button
                                className={`w-10 h-5 rounded-full flex items-center transition-colors duration-200 cursor-pointer border ${subCat.status?.toUpperCase() === 'ENABLED'
                                    ? 'bg-brand-400 border-brand-500'
                                    : 'bg-brand-100 border-brand-200'
                                    }`}
                                onClick={() => handleToggle(subCat)}
                            >
                                <span
                                    className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${subCat.status?.toUpperCase() === 'ENABLED' ? 'translate-x-5' : ''}`}
                                />
                            </button>

                            {/* Name / Edit */}
                            {editId === subCat.id ? (
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
                                        onClick={() => handleEditSave(subCat)}
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
                                <span className="text-brand-900 text-base font-medium">{subCat.name}</span>
                            )}

                            {/* Action Buttons */}
                            {hoveredId === subCat.id && editId !== subCat.id && (
                                <div className="flex gap-1 absolute right-2 top-1">
                                    <button
                                        className="text-brand-600 hover:text-brand-600 p-1 rounded-full transition"
                                        title="Edit"
                                        onClick={() => { setEditId(subCat.id); setEditValue(subCat.name); }}
                                    >
                                        <FaRegEdit size={18} />
                                    </button>
                                    <button
                                        className="text-brand-600 hover:text-red-600 p-1 rounded-full transition"
                                        title="Delete"
                                        onClick={() => setDeleteId(subCat.id)}
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add SubCategory */}
            {showAdd ? (
                <div className="flex items-center gap-2 mt-3">
                    <input
                        type="text"
                        className="border rounded-lg px-3 py-2 text-sm w-[180px] focus:outline-none focus:ring-2 focus:ring-brand-300"
                        value={newSubCategory}
                        onChange={e => setNewSubCategory(e.target.value)}
                        placeholder="Sub-category name"
                        autoFocus
                    />
                    <button
                        className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-2 rounded-lg text-sm"
                        onClick={handleAdd}
                    >
                        Add
                    </button>
                    <button
                        className="text-brand-600 hover:text-brand-800 px-3 py-2 text-sm"
                        onClick={() => { setShowAdd(false); setNewSubCategory(''); }}
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
                title="Delete Sub-Category"
                description="Are you sure you want to delete this sub-category? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default SubCategoryManager;
