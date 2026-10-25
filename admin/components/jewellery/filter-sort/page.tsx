'use client';

import React from 'react';
import Category from './category';
import Collection from './collection';
import SubCategory from './sub-category';
import Type from './type';
import PriceLimit from './price-limit';
import { FilterSortProvider } from '../../../contexts/FilterSortContext';

const FilterSortPage = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-100">
        <h1 className="text-2xl font-semibold text-brand-900">Filter & Sort</h1>
      </div>

      {/* Content */}
      <FilterSortProvider>
        <div className="p-6 grid grid-cols-3 gap-4 h-[calc(100%-65px)] overflow-y-auto scrollbar">
          {/* <div className="text-center py-12">
            <svg className="w-16 h-16 text-brand-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-lg font-medium text-brand-800 mb-2">Filter & Sort</h3>
            <p className="text-brand-600">This feature is coming soon. Configure filtering and sorting options for jewelry items.</p>
          </div> */}
          <Category />
          <SubCategory />
          <Type />
          <Collection />
          <PriceLimit />
        </div>
      </FilterSortProvider>
    </div>
  );
};

export default FilterSortPage;
