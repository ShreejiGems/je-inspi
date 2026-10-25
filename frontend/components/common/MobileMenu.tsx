"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { useAppContext } from "@/src/contexts/AppContext";
import { garamond } from "@/src/common/helper";
import { Image } from "antd";
import LoginModal from "../auth/LoginModal";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  onLoginModalClose: () => void;
  onSwitchToRegister: any;
  handleAuthClick: any;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  isLoginModalOpen,
  onLoginModalClose,
  onSwitchToRegister,
  handleAuthClick,
}) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { categories, collections, subCategories, jewelleryTypes } =
    useAppContext();
  const menuRef = useRef<HTMLDivElement>(null);
  // Keep all categories and subcategories collapsed by default
  const [openCategories, setOpenCategories] = React.useState<Set<string>>(
    new Set()
  );
  const [openSubcategories, setOpenSubcategories] = React.useState<Set<string>>(
    new Set()
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      // Lock the body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      // Return a cleanup function to restore scroll position
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setOpenSubcategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId);
      } else {
        newSet.add(subcategoryId);
      }
      return newSet;
    });
  };

  const handleNavigation = (path: string, requiresAuth: boolean = true) => {
    if (requiresAuth && !isAuthenticated) {
      onClose();
      // This will trigger the auth modal in the parent component
      return false;
    }
    onClose();
    router.push(path);
    return true;
  };

  // Group subcategories by category
  const subCategoriesByCategory = React.useMemo(() => {
    return subCategories.reduce<Record<string, any[]>>((acc, subCategory) => {
      if (!acc[subCategory.categoryId]) {
        acc[subCategory.categoryId] = [];
      }
      acc[subCategory.categoryId].push(subCategory);
      return acc;
    }, {});
  }, [subCategories]);

  // Group types by subcategory
  const typesBySubcategory = React.useMemo(() => {
    return jewelleryTypes.reduce<Record<string, any[]>>((acc, type) => {
      if (!acc[type.subCategoryId]) {
        acc[type.subCategoryId] = [];
      }
      acc[type.subCategoryId].push(type);
      return acc;
    }, {});
  }, [jewelleryTypes]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[99]"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            ref={menuRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 h-screen w-4/5 max-w-sm bg-white shadow-lg z-[100] overflow-y-auto"
          >
            <div className="pl-4 pr-2 py-2 border-b border-brand-100 flex justify-between items-center">
              <h2 className={`text-xl font-semibold ${garamond.className}`}>
                Menu
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-brand-50"
                aria-label="Close menu"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="divide-y divide-brand-100">
              {/* Categories */}
              <div className="py-2">
                <h3 className="px-4 py-2 font-medium text-brand-900">
                  Categories
                </h3>
                {categories?.map((category: any) => (
                  <div key={category.id} className="border-l-2 border-brand-50">
                    <div className="flex justify-between items-center">
                      <button
                        className="flex-1 px-4 py-1 text-left hover:bg-brand-50"
                        onClick={() => handleNavigation(`/jewellery/${category.id}`)}
                      >
                        <span className={garamond.className}>
                          {category.name}
                        </span>
                      </button>
                      <button
                        className="px-2 py-1 hover:bg-brand-50"
                        onClick={() =>
                          isAuthenticated
                            ? toggleCategory(category.id)
                            : handleAuthClick()
                        }
                      >
                        {openCategories.has(category.id) ? (
                          <FiChevronUp className="w-5 h-5" />
                        ) : (
                          <FiChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {openCategories.has(category.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-6">
                            {subCategoriesByCategory[category.id]?.map(
                              (subCategory) => (
                                <div
                                  key={subCategory.id}
                                  className="border-l-2 border-brand-50"
                                >
                                  <div className="flex justify-between items-center">
                                    <button
                                      className="flex-1 px-4 py-1 text-left hover:bg-brand-50"
                                      onClick={() => handleNavigation(`/jewellery/${category.id}/${subCategory.id}`)}
                                    >
                                      <span className={garamond.className}>
                                        {subCategory.name}
                                      </span>
                                    </button>
                                    {typesBySubcategory[subCategory.id]
                                      ?.length > 0 && (
                                        <button
                                          className="px-2 py-1 hover:bg-brand-50"
                                          onClick={() =>
                                            isAuthenticated
                                              ? toggleSubcategory(subCategory.id)
                                              : handleAuthClick()
                                          }
                                        >
                                          {openSubcategories.has(subCategory.id) ? (
                                            <FiChevronUp className="w-4 h-4" />
                                          ) : (
                                            <FiChevronDown className="w-4 h-4" />
                                          )}
                                        </button>
                                      )}
                                  </div>

                                  <AnimatePresence>
                                    {openSubcategories.has(subCategory.id) &&
                                      typesBySubcategory[subCategory.id]
                                        ?.length > 0 && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{
                                            height: "auto",
                                            opacity: 1,
                                          }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden"
                                        >
                                          <div className="pl-4">
                                            {typesBySubcategory[
                                              subCategory.id
                                            ]?.map((type) =>
                                              isAuthenticated ? (
                                                <button
                                                  key={type.id}
                                                  onClick={() => handleNavigation(`/jewellery/${category.id}/${subCategory.id}/${type.id}`)}
                                                  className="block w-full px-4 py-2 text-left text-sm text-brand-700 hover:bg-brand-50"
                                                >
                                                  <span
                                                    className={
                                                      garamond.className
                                                    }
                                                  >
                                                    {type.name}
                                                  </span>
                                                </button>
                                              ) : (
                                                <button
                                                  key={type.id}
                                                  className="w-full px-4 py-2 text-left text-sm text-brand-700 hover:bg-brand-50"
                                                  onClick={handleAuthClick}
                                                >
                                                  <span
                                                    className={
                                                      garamond.className
                                                    }
                                                  >
                                                    {type.name}
                                                  </span>
                                                </button>
                                              )
                                            )}
                                          </div>
                                        </motion.div>
                                      )}
                                  </AnimatePresence>

                                </div>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                ))}
              </div>

              {/* Collections */}
              {collections.length > 0 && (
                <div className="py-2">
                  <h3 className="px-4 py-2 font-medium text-brand-900">
                    Collections
                  </h3>
                  <div className="">
                    {collections.map((collection) =>
                      isAuthenticated ? (
                        <button
                          key={collection.id}
                          onClick={() => handleNavigation(`/jewellery/collection/${collection.id}`)}
                          className="block w-full px-4 py-1 text-left text-brand-800 hover:bg-brand-50"
                        >
                          <span className={garamond.className}>
                            {collection.name}
                          </span>
                        </button>
                      ) : (
                        <button
                          key={collection.id}
                          className="w-full px-4 py-1 text-left text-brand-800 hover:bg-brand-50"
                          onClick={handleAuthClick}
                        >
                          <span className={garamond.className}>
                            {collection.name}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Account Links */}
              <div className="py-2">
                <h3 className="px-4 py-2 font-medium text-brand-900">Account</h3>
                <div className="">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/profile"
                        className="block w-full px-4 py-1 text-left text-brand-800 hover:bg-brand-50"
                        onClick={onClose}
                      >
                        <span className={garamond.className}>My Profile</span>
                      </Link>
                      <Link
                        href="/orders"
                        className="block w-full px-4 py-1 text-left text-brand-800 hover:bg-brand-50"
                        onClick={onClose}
                      >
                        <span className={garamond.className}>My Orders</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        className="block w-full px-4 py-1 text-left text-brand-800 hover:bg-brand-50"
                        onClick={onClose}
                      >
                        <span className={garamond.className}>Wishlist</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block w-full px-4 py-1 text-left text-brand-800 hover:bg-brand-50"
                        onClick={onClose}
                      >
                        <span className={garamond.className}>Login</span>
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full px-4 py-1 text-left text-brand-800 hover:bg-brand-50"
                        onClick={onClose}
                      >
                        <span className={garamond.className}>Register</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Additional Links */}
              <div className="pt-2 pb-6">
                <Link
                  href="/diamond"
                  className="px-4 py-2 font-medium text-brand-900 flex justify-between items-center hover:bg-brand-50"
                  onClick={onClose}
                >
                  Diamond
                  <Image
                    src="/assets/diamond/diamond.svg"
                    width={50}
                    height={50}
                    alt="JE-Inspi Diamonds"
                    className="w-auto h-auto"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={onLoginModalClose}
            onSwitchToRegister={onSwitchToRegister}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
