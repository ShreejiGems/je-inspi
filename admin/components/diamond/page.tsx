'use client';

import React from 'react';

const DiamondPricingPage = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm ">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-brand-100">
        <h1 className="text-2xl font-semibold text-brand-900">Diamond Pricing</h1>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-brand-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-brand-800 mb-2">Diamond Pricing</h3>
          <p className="text-brand-600">This feature is coming soon. Manage diamond pricing and rates here.</p>
        </div>
      </div>
    </div>
  );
};

export default DiamondPricingPage;
