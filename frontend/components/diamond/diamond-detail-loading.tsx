import React from 'react';
import { garamond } from '@/src/common/helper';
import Navbar from '../common/navbar';
import Footer from '../common/footer';

const DiamondDetailLoading = () => {
    return (
        <div className={`w-full min-h-screen bg-brand-50 ${garamond.className}`}>
            {/* Navbar */}
            <Navbar />

            {/* Back Button Skeleton */}
            <div className="px-8 py-4">
                <div className="w-32 h-8 bg-brand-100 rounded animate-pulse"></div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex justify-center items-center min-h-[calc(100vh-160px)] py-8">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-8">
                    {/* Header Skeleton */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-6 bg-brand-100 rounded mx-auto mb-6 animate-pulse"></div>
                        
                        {/* Diamond Image Skeleton */}
                        <div className="flex justify-center mb-6">
                            <div className="w-48 h-48 bg-brand-100 rounded animate-pulse"></div>
                        </div>
                        
                        {/* Diamond Name and Price Skeleton */}
                        <div className="w-48 h-6 bg-brand-100 rounded mx-auto mb-2 animate-pulse"></div>
                        <div className="w-32 h-4 bg-brand-100 rounded mx-auto mb-6 animate-pulse"></div>
                    </div>

                    {/* Specifications Skeleton */}
                    <div className="space-y-3 mb-8">
                        {Array.from({ length: 13 }).map((_, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div className="w-24 h-4 bg-brand-100 rounded animate-pulse"></div>
                                <div className="w-20 h-4 bg-brand-100 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                    {/* Button Skeleton */}
                    <div className="w-full h-10 bg-brand-100 rounded animate-pulse"></div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default DiamondDetailLoading;
