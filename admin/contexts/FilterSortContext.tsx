'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { jewelleryCategoryAPI, JewelleryCategory } from '../src/services/filter&sort/jewellery-category.api';
import { JewellerySubCategoryAPI, JewellerySubCategory } from '../src/services/filter&sort/jewellery-sub-category.api';

interface FilterSortContextType {
  categories: JewelleryCategory[];
  subCategories: JewellerySubCategory[];
  refreshCategories: () => Promise<void>;
  refreshSubCategories: (categoryId?: string) => Promise<void>;
  notifyCategoryChange: () => void;
  notifySubCategoryChange: () => void;
  categoryChangeTrigger: number;
  subCategoryChangeTrigger: number;
}

const FilterSortContext = createContext<FilterSortContextType | undefined>(undefined);

export const useFilterSort = () => {
  const context = useContext(FilterSortContext);
  if (!context) {
    throw new Error('useFilterSort must be used within a FilterSortProvider');
  }
  return context;
};

interface FilterSortProviderProps {
  children: ReactNode;
}

export const FilterSortProvider: React.FC<FilterSortProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<JewelleryCategory[]>([]);
  const [subCategories, setSubCategories] = useState<JewellerySubCategory[]>([]);
  const [categoryChangeTrigger, setCategoryChangeTrigger] = useState(0);
  const [subCategoryChangeTrigger, setSubCategoryChangeTrigger] = useState(0);

  const refreshCategories = useCallback(async () => {
    try {
      const data = await jewelleryCategoryAPI.getAllCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to refresh categories:', error);
    }
  }, []);

  const refreshSubCategories = useCallback(async (categoryId?: string) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }
    try {
      const data = await JewellerySubCategoryAPI.getAllSubCategories(categoryId);
      setSubCategories(data || []);
    } catch (error) {
      console.error('Failed to refresh subcategories:', error);
    }
  }, []);

  const notifyCategoryChange = useCallback(() => {
    setCategoryChangeTrigger(prev => prev + 1);
  }, []);

  const notifySubCategoryChange = useCallback(() => {
    setSubCategoryChangeTrigger(prev => prev + 1);
  }, []);

  const value: FilterSortContextType = {
    categories,
    subCategories,
    refreshCategories,
    refreshSubCategories,
    notifyCategoryChange,
    notifySubCategoryChange,
    categoryChangeTrigger,
    subCategoryChangeTrigger,
  };

  return (
    <FilterSortContext.Provider value={value}>
      {children}
    </FilterSortContext.Provider>
  );
};
