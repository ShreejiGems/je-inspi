"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { jewelleryAPI } from '@/src/services/jewellery.api';
import JewelleryBase from './jewellery-base';
import { garamond } from '@/src/common/helper';

const JewellerySubcategory = () => {
    const params = useParams();
    const { isAuthenticated } = useAuth();
    const [subcategory, setSubcategory] = useState<any>(null);
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categoryId = params.categoryId as string;
    const subcategoryId = params.subcategoryId as string;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch both category and subcategory data
                const [categoryData, subcategoryData] = await Promise.all([
                    jewelleryAPI.getCategoriesById(categoryId),
                    jewelleryAPI.getSubCategoriesById(subcategoryId)
                ]);
                
                setCategory(categoryData);
                setSubcategory(subcategoryData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError('Subcategory not found');
            } finally {
                setLoading(false);
            }
        };

        if (categoryId && subcategoryId) {
            fetchData();
        }
    }, [categoryId, subcategoryId]);

    if (loading) {
        return (
            <div className={`w-full h-screen flex justify-center items-center ${garamond.className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-brand-700">Loading subcategory...</p>
                </div>
            </div>
        );
    }

    if (error || !subcategory || !category) {
        return (
            <div className={`w-full h-screen flex justify-center items-center ${garamond.className}`}>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-brand-900 mb-4">Subcategory Not Found</h1>
                    <p className="text-brand-700 mb-6">The subcategory you're looking for doesn't exist.</p>
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
            title={subcategory.name}
            subtitle={`${category.name} > ${subcategory.name}`}
            initialFilters={{
                categoryId: categoryId,
                subcategoryId: subcategoryId
            }}
        />
    );
};

export default JewellerySubcategory;
