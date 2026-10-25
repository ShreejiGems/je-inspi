"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { jewelleryAPI } from '@/src/services/jewellery.api';
import JewelleryBase from './jewellery-base';
import { garamond } from '@/src/common/helper';

const JewelleryType = () => {
    const params = useParams();
    const { isAuthenticated } = useAuth();
    const [type, setType] = useState<any>(null);
    const [subcategory, setSubcategory] = useState<any>(null);
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categoryId = params.categoryId as string;
    const subcategoryId = params.subcategoryId as string;
    const typeId = params.typeId as string;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch category, subcategory, and type data
                const [categoryData, subcategoryData, typeData] = await Promise.all([
                    jewelleryAPI.getCategoriesById(categoryId),
                    jewelleryAPI.getSubCategoriesById(subcategoryId),
                    jewelleryAPI.getTypeByIs(typeId)
                ]);
                
                setCategory(categoryData);
                setSubcategory(subcategoryData);
                setType(typeData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError('Type not found');
            } finally {
                setLoading(false);
            }
        };

        if (categoryId && subcategoryId && typeId) {
            fetchData();
        }
    }, [categoryId, subcategoryId, typeId]);

    if (loading) {
        return (
            <div className={`w-full h-screen flex justify-center items-center ${garamond.className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-brand-700">Loading type...</p>
                </div>
            </div>
        );
    }

    if (error || !type || !subcategory || !category) {
        return (
            <div className={`w-full h-screen flex justify-center items-center ${garamond.className}`}>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-brand-900 mb-4">Type Not Found</h1>
                    <p className="text-brand-700 mb-6">The type you're looking for doesn't exist.</p>
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
            title={type.name}
            subtitle={`${category.name} > ${subcategory.name} > ${type.name}`}
            initialFilters={{
                categoryId: categoryId,
                subcategoryId: subcategoryId,
                typeId: typeId
            }}
        />
    );
};

export default JewelleryType;
