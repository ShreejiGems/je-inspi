'use client';
import React, { useState, useRef, useEffect } from 'react';
import { User } from '@/src/types/auth';
import { authUtils } from '@/src/utils/auth';
import { usePathname } from "next/navigation";

interface NavbarProps {
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const handleLogout = () => {
    authUtils.logout();
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const getPageTitle = (pathname: string): string => {
    if (pathname === "/calculator") return "Jewellery Calculator";
    if (pathname === "/diamond-pricing") return "Diamond Pricing";

    // Jewellery sub-pages
    if (pathname === "/jewellery/home-page-media") return "Home Page Media";
    if (pathname === "/jewellery/filter-sort") return "Filter & Sort";
    if (pathname === "/jewellery/product-list") return "Product List";
    if (pathname === "/jewellery/marketing-image") return "Marketing Image";

    // Fallback
    return "Dashboard";
  };


  return (
    <header className="bg-brand-50 shadow-sm border-b border-brand-100">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Page Title */}
        <div>
          {/* <h1 className="text-2xl font-semibold text-brand-900">{getPageTitle(pathname)}</h1> */}
          <h1 className="text-2xl font-semibold text-brand-900">Welcome @Admin!!!</h1>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-brand-50 transition-colors duration-200 cursor-pointer"
            >
              <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-brand-800">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email
                  }
                </p>
                <p className="text-xs text-brand-600">{user.userType}</p>
              </div>
              <svg
                className={`w-4 h-4 text-brand-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-brand-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-brand-50">
                  <p className="text-sm font-medium text-brand-800">{user.email}</p>
                  {/* <p className="text-xs text-brand-600">Status: {user.status}</p> */}
                </div>

                {/* <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm text-brand-800 hover:bg-brand-50 transition-colors duration-200"
                >
                  Profile Settings
                </button> */}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
