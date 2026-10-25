"use client";
import React, { useState } from "react";
import { garamond } from "@/src/common/helper";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';

interface DropdownItem {
  value: string;
  label: string;
  types?: { value: string; label: string }[];
}

interface NavbarDropdownProps {
  items: DropdownItem[];
  isVisible: boolean;
  isCollection?: boolean;
  categoryId?: string;
}

const NavbarDropdown: React.FC<NavbarDropdownProps> = ({ items, isVisible, isCollection = false, categoryId }) => {
  const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, hoveredItem } = useAuth();

  if (!isVisible || !items.length) return null;

  const handleSubcategoryClick = (subcategoryId: string) => {
    if (!isAuthenticated || !categoryId) {
      return; // Don't navigate if not authenticated or no category context
    }

    // Navigate to category/subcategory page
    router.push(`/jewellery/${categoryId}/${subcategoryId}`);
  };

  const handleTypeClick = (subcategoryId: string, typeId: string) => {
    if (!isAuthenticated || !categoryId) {
      return; // Don't navigate if not authenticated or no category context
    }

    // Navigate to category/subcategory/type page
    router.push(`/jewellery/${categoryId}/${subcategoryId}/${typeId}`);
  };

  const handleCollectionClick = (collectionId: string) => {
    if (!isAuthenticated) {
      return; // Don't navigate if not authenticated
    }

    // Navigate to jewellery/collection/collectionId page
    router.push(`/jewellery/collection/${collectionId}`);
  };

  return (
    <div className="absolute top-[158px] left-0 w-full bg-white shadow-xl border-t border-brand-50 z-50 animate-fade-in">
      <div className={`w-full px-16 py-8 ${garamond.className}`}>
        <div className="grid grid-cols-4 gap-16 max-w-6xl mx-auto">
          {items.map((item: any) => (
            <div
              key={item.value}
              className="space-y-6"
              onMouseEnter={() => setHoveredSubItem(item.value)}
              onMouseLeave={() => setHoveredSubItem(null)}
            >
              <h3
                className="text-[16px] font-[600] text-brand-900 uppercase tracking-wider cursor-pointer hover:text-brand-600 transition-colors duration-200"
                onClick={() => isCollection ? handleCollectionClick(item.value) : handleSubcategoryClick(item.value)}
              >
                {item.label}
              </h3>

              {item.types && item.types.length > 0 ? (
                <ul className="space-y-3">
                  {item.types.map((type: any) => (
                    <li key={type.id}>
                      <button
                        onClick={() => handleTypeClick(item.value, type.id)}
                        className="text-[16px] text-brand-700 hover:text-brand-900 hover:pl-1 cursor-pointer transition-all duration-200 block py-1 capitalize w-full text-left"
                      >
                        {type.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : !isCollection && (
                <div className="text-[14px] text-brand-400 italic">
                  Coming Soon
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavbarDropdown;
