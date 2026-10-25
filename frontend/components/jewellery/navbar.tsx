"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { garamond } from "@/src/common/helper";
import { CgProfile } from "react-icons/cg";
import { MdLogin } from "react-icons/md";
import { IoHeartOutline } from "react-icons/io5";
import { PiHandbag } from "react-icons/pi";
import { FiLogOut, FiUserPlus } from "react-icons/fi";
import NavbarDropdown from "./navbar-dropdown";
import NavbarSkeleton from "./navbar-skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import { useAppContext } from "@/src/contexts/AppContext";
import LoginModal from "../auth/LoginModal";
import { Button } from "antd";

const Navbar = () => {
  // const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, logout, hoveredItem, setHoveredItem } =
    useAuth();
  const { loading, categories, collections, subCategories, jewelleryTypes } =
    useAppContext();

  // Process data to create the required structure
  const { subCategoriesMap, typesMap } = useMemo(() => {
    const subCategoriesMap: { [key: string]: any[] } = {};
    const typesMap: { [key: string]: any[] } = {};

    // Group subcategories by category
    subCategories.forEach((subCategory) => {
      if (!subCategoriesMap[subCategory.categoryId]) {
        subCategoriesMap[subCategory.categoryId] = [];
      }
      subCategoriesMap[subCategory.categoryId].push(subCategory);
    });

    // Group types by subcategory
    jewelleryTypes.forEach((type) => {
      if (!typesMap[type.subCategoryId]) {
        typesMap[type.subCategoryId] = [];
      }
      typesMap[type.subCategoryId].push(type);
    });

    return { subCategoriesMap, typesMap };
  }, [subCategories, jewelleryTypes]);

  // Function to get dropdown items based on category or collection
  const getDropdownItems = (itemId: string, isCollection: boolean = false) => {
    if (isCollection) {
      return collections.map((collection) => ({
        value: collection.id,
        label: collection.name,
        types: [],
      }));
    }

    const category = categories.find((cat: any) => cat.id === itemId);
    if (!category) return [];

    const categorySubCategories = subCategoriesMap[itemId] || [];
    return categorySubCategories.map((subCategory: any) => ({
      value: subCategory.id,
      label: subCategory.name,
      types: typesMap[subCategory.id] || [],
    }));
  };

  const handleMouseEnter = (itemValue: string) => {
    setHoveredItem(itemValue);
  };
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <div
        className={`relative flex justify-center z-50 items-center w-auto h-auto px-5 pt-5 select-none text-brand-900 backdrop-blur-sm ${garamond.className}`}
        style={{ background: "rgba(0, 0, 0, 0.20)" }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo and Some buttons */}
        <div className="w-full flex flex-col justify-center items-center">
          <div className="relative w-full flex flex-col justify-center items-center">
            <Link href="/">
              <Image
                src="/assets/brand/je-inspi-wordmark.png"
                width={151}
                height={68}
                alt="JE-Inspi logo"
                data-aos="zoom-in"
                className="cursor-pointer"
              />
            </Link>
            <div className="absolute right-6 flex justify-center items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/wishlist" title="Wishlist">
                    <IoHeartOutline className="h-[25px] w-auto cursor-pointer" />
                  </Link>
                  <Link href="/cart" title="Cart">
                    <PiHandbag className="h-[25px] w-auto cursor-pointer" />
                  </Link>
                  <div className="relative group">
                    <Link href="/profile" title="profile">
                      <CgProfile className="h-[25px] w-auto cursor-pointer" />
                    </Link>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="px-4 py-2 text-sm text-brand-800 border-b">
                        <p className="font-medium">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-brand-600">{user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="w-full text-left px-4 py-2 text-sm text-brand-800 hover:bg-brand-50 flex items-center space-x-2 cursor-pointer"
                      >
                        <CgProfile className="h-4 w-4" />
                        <span>View Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-brand-800 hover:bg-brand-50 flex items-center space-x-2 cursor-pointer"
                      >
                        <FiLogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      type="primary"
                      size="large"
                      className={`button-hover-effect !rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br cursor-pointer !border-0 shadow-inner !h-11 !px-10 ${garamond.className}`}
                    >
                      <span>Login</span>
                      <MdLogin className="icon" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      type="primary"
                      size="large"
                      className={`button-hover-effect !rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br !border-0 shadow-inner !h-11 !px-10 ${garamond.className}`}
                    >
                      <span>Register</span>
                      <FiUserPlus className="icon" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center space-x-14 text-brand-900">
            {loading ? (
              <NavbarSkeleton />
            ) : (
              <div className="flex justify-center items-center space-x-14 text-brand-900 animate-fade-in">
                {/* Dynamic Categories */}
                {categories.map((category: any) =>
                  !isAuthenticated ? (
                    <div
                      key={category.id}
                      className="relative cursor-not-allowed text-[16px] font-[400] opacity-50"
                      onClick={handleAuthClick}
                    >
                      {category.name}
                    </div>
                  ) : (
                    <Link
                      key={category.id}
                      href={`/jewellery/${category.id}`}
                      className="relative cursor-pointer text-[16px] font-[400] hover:scale-110 ease-in-out transition-all duration-300"
                      onMouseEnter={() => handleMouseEnter(category.id)}
                    >
                      {category.name}
                    </Link>
                  )
                )}

                {/* Collections Tab */}
                {collections.length > 0 && (
                  <div
                    key="collections"
                    className={`relative cursor-pointer text-[16px] font-[400] hover:scale-110 ease-in-out transition-all duration-300 ${
                      !isAuthenticated ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onMouseEnter={() =>
                      isAuthenticated && handleMouseEnter("collections")
                    }
                    onClick={() => {
                      if (!isAuthenticated) {
                        handleAuthClick();
                        return;
                      }
                    }}
                  >
                    Collections
                  </div>
                )}
              </div>
            )}
            <Image
              src="/assets/diamond/diamond.svg"
              width={50}
              height={100}
              alt="JE-Inspi Diamonds"
              className="w-[70px] h-auto cursor-pointer  hover:scale-110 ease-in-out transition-all duration-500"
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        <NavbarDropdown
          items={
            hoveredItem
              ? getDropdownItems(hoveredItem, hoveredItem === "collections")
              : []
          }
          isVisible={hoveredItem !== null && !loading}
          isCollection={hoveredItem === "collections"}
          categoryId={
            hoveredItem && hoveredItem !== "collections"
              ? hoveredItem
              : undefined
          }
        />

        {/* Auth Modal */}
        <LoginModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSwitchToRegister={() => {
            setShowAuthModal(false);
            router.push("/register");
          }}
        />
      </div>
    </>
  );
};

export default Navbar;
