"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { jewelleryAPI } from '@/src/services/jewellery.api';
import JewelleryBase from './jewellery-base';
import { garamond } from '@/src/common/helper';

const JewelleryCategory = () => {
    const params = useParams();
    const { isAuthenticated } = useAuth();
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categoryId = params.categoryId as string;

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                const categoryData = await jewelleryAPI.getCategoriesById(categoryId);
                setCategory(categoryData);
            } catch (error) {
                console.error('Failed to fetch category:', error);
                setError('Category not found');
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchCategory();
        }
    }, [categoryId]);

    if (loading) {
        return (
            <div className={`w-full h-screen flex justify-center items-center ${garamond.className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-brand-700">Loading category...</p>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className={`w-full h-screen flex justify-center items-center ${garamond.className}`}>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-brand-900 mb-4">Category Not Found</h1>
                    <p className="text-brand-700 mb-6">The category you're looking for doesn't exist.</p>
                    <button 
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-black text-white rounded-full hover:bg-brand-900 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <JewelleryBase
            showBanner={false}
            title={category.name}
            subtitle={`Explore our exquisite collection of ${category.name.toLowerCase()}`}
            initialFilters={{
                categoryId: categoryId
            }}
        />
    );
};

export default JewelleryCategory;
