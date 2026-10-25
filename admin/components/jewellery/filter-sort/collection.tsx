'use client';

import React, { useEffect, useState } from 'react';
import { CollectionAPI } from '../../../src/services/filter&sort/jewellery-collection.api';
import type { Collection } from '../../../src/services/filter&sort/jewellery-collection.api';
import Modal from '../../Modal';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { FaRegEdit } from "react-icons/fa";

const Collection = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [globalLoading, setGlobalLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [newCollection, setNewCollection] = useState('');
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 4000);
    };

    const fetchCollections = async () => {
        setGlobalLoading(true);
        try {
            const data = await CollectionAPI.getAllCollections();
            setCollections(data);
        } catch (err: any) {
            showError(err.message);
        } finally {
            setGlobalLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleToggle = async (col: Collection) => {
        const updated = collections.map(c =>
            c.id === col.id ? { ...c, status: c.status?.toUpperCase() === 'ENABLED' ? 'DISABLED' : 'ENABLED' } : c
        );
        setCollections(updated);
        setLoadingIds(prev => [...prev, col.id]);

        try {
            if (col.status?.toUpperCase() === 'ENABLED') {
                await CollectionAPI.disableCollection(col.id);
            } else {
                await CollectionAPI.enableCollection(col.id);
            }
        } catch (err: any) {
            setCollections(collections); // revert on failure
            showError(err.message);
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== col.id));
        }
    };

    const handleAddCollection = async () => {
        const trimmed = newCollection.trim();
        if (!trimmed) return showError('Collection name cannot be empty.');
        if (collections.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
            return showError('Collection already exists.');
        }

        const tempId = `temp-${Date.now()}`;
        const newCol: any = { id: tempId, name: trimmed, status: 'ENABLED' };
        setCollections(prev => [...prev, newCol]);
        setShowAdd(false);
        setNewCollection('');

        try {
            const created = await CollectionAPI.createCollection(trimmed);
            setCollections(prev => prev.map(c => c.id === tempId ? created : c));
        } catch (err: any) {
            setCollections(prev => prev.filter(c => c.id !== tempId));
            showError(err.message);
        }
    };

    const handleEditSave = async (col: Collection) => {
        const trimmed = editValue.trim();
        if (!trimmed) return showError('Collection name cannot be empty.');
        if (collections.some(c => c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== col.id)) {
            return showError('Collection already exists.');
        }

        const prevCollections = [...collections];
        setCollections(prev => prev.map(c => c.id === col.id ? { ...c, name: trimmed } : c));
        setEditId(null);
        setEditValue('');
        setLoadingIds(prev => [...prev, col.id]);

        try {
            await CollectionAPI.updateCollection(col.id, trimmed);
        } catch (err: any) {
            setCollections(prevCollections); // revert on failure
            showError(err.message);
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== col.id));
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        const prevCollections = [...collections];
        setCollections(prev => prev.filter(c => c.id !== deleteId));
        setDeleteId(null);
        setLoadingIds(prev => [...prev, deleteId]);

        try {
            await CollectionAPI.deleteCollection(deleteId);
        } catch (err: any) {
            setCollections(prevCollections); // revert on failure
            showError(err.message);
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== deleteId));
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-96 border border-brand-50">
            <h2 className="font-semibold text-xl mb-4 text-brand-900">Collections</h2>
            {/* {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded mb-3 text-sm">{error}</div>} */}
            {/* {globalLoading && collections.length === 0 && (
        <div className="text-brand-600 text-sm mb-3">Loading collections...</div>
      )} */}

            <div className="flex flex-col mb-2 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-brand-200 scrollbar-track-transparent">
                {collections.map((col) => {
                    const isLoading = loadingIds.includes(col.id);
                    return (
                        <div
                            key={col.id}
                            className={`flex items-center gap-2 group relative py-2 px-2 rounded-lg ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:bg-brand-50'} transition`}
                            onMouseEnter={() => setHoveredId(col.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Toggle */}
                            <button
                                className={`w-10 h-5 rounded-full flex items-center transition-colors duration-200 cursor-pointer border ${col.status?.toUpperCase() === 'ENABLED'
                                    ? 'bg-brand-400 border-brand-500'
                                    : 'bg-brand-100 border-brand-200'
                                    }`}
                                onClick={() => handleToggle(col)}
                            >
                                <span
                                    className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${col.status?.toUpperCase() === 'ENABLED' ? 'translate-x-5' : ''}`}
                                />
                            </button>

                            {/* Name / Edit */}
                            {editId === col.id ? (
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
                                        onClick={() => handleEditSave(col)}
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
                                <span className="text-brand-900 text-base font-medium">{col.name}</span>
                            )}

                            {/* Action Buttons */}
                            {hoveredId === col.id && editId !== col.id && (
                                <div className="flex gap-1 absolute right-2 top-1">
                                    <button
                                        className="text-brand-600 hover:text-brand-600 p-1 rounded-full transition"
                                        title="Edit"
                                        onClick={() => { setEditId(col.id); setEditValue(col.name); }}
                                    >
                                        <FaRegEdit size={18} />
                                    </button>
                                    <button
                                        className="text-brand-600 hover:text-red-600 p-1 rounded-full transition"
                                        title="Delete"
                                        onClick={() => setDeleteId(col.id)}
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add Collection */}
            {showAdd ? (
                <div className="flex items-center gap-2 mt-3">
                    <input
                        type="text"
                        className="border rounded-lg px-3 py-2 text-sm w-[180px] focus:outline-none focus:ring-2 focus:ring-brand-300"
                        value={newCollection}
                        onChange={e => setNewCollection(e.target.value)}
                        placeholder="Collection name"
                        autoFocus
                    />
                    <button
                        className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-2 rounded-lg text-sm"
                        onClick={handleAddCollection}
                    >
                        Add
                    </button>
                    <button
                        className="text-brand-600 hover:text-brand-800 px-3 py-2 text-sm"
                        onClick={() => { setShowAdd(false); setNewCollection(''); }}
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
                title="Delete Collection"
                description="Are you sure you want to delete this collection? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default Collection;
