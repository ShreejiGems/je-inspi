"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from 'next/link';
import { garamond } from "@/src/common/helper";
import { CgProfile } from "react-icons/cg";
import { MdLogin } from "react-icons/md";
import { IoHeartOutline } from "react-icons/io5";
import { PiHandbag } from "react-icons/pi";
import { FiLogOut, FiUserPlus } from "react-icons/fi";
import NavbarDropdown from "../jewellery/navbar-dropdown";
import NavbarSkeleton from "../jewellery/navbar-skeleton";
import { useAuth } from "@/src/contexts/AuthContext";
import { useAppContext } from "@/src/contexts/AppContext";
import LoginModal from "../auth/LoginModal";
import { Button, Modal } from "antd";
import { IoReorderThreeOutline } from "react-icons/io5";
import MobileMenu from "./MobileMenu";

type NavbarVariant = "jewellery" | "diamond" | "content";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeDiamondTab, setActiveDiamondTab] = useState<string>("NATURAL");
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const { isAuthenticated, user, logout, hoveredItem, setHoveredItem } =
    useAuth();
  const { loading, categories, collections, subCategories, jewelleryTypes } =
    useAppContext();

  // Determine navbar variant based on route
  const getNavbarVariant = (): NavbarVariant => {
    if (pathname.startsWith("/diamond")) {
      return "diamond";
    } else if (
      pathname.startsWith("/fashion") ||
      pathname.startsWith("/about-us") ||
      pathname.startsWith("/contact-us") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/orders") ||
      pathname.startsWith("/wishlist") ||
      pathname.startsWith("/cart") ||
      pathname.startsWith("/conditions-of-sale") ||
      pathname.startsWith("/privacy-policy") ||
      pathname.startsWith("/returns-and-exchanges-policy") ||
      pathname.startsWith("/shipping-and-delivery-policy") ||
      pathname.startsWith("/terms-of-use")
    ) {
      return "content";
    } else {
      return "jewellery";
    }
  };

  const diamondNavItems = [
    { value: "Diamond", label: "Diamond", redirect: "diamond" },
    { value: "Jewellery", label: "Jewellery", redirect: "jewellery" },
    { value: "Fashion", label: "Fashion", redirect: "fashion" },
  ];

  const diamondTypesItems = [
    {
      value: "NATURAL",
      label: "Naturally Sourced Diamonds",
      redirect: "diamond",
    },
    {
      value: "LAB_GROWN",
      label: "Laboratory Grown Diamonds",
      redirect: "diamond",
    },
  ];

  const isFontNeedWhite = pathname === "/jewellery" || pathname === "/diamond";

  const variant = getNavbarVariant();

  // Process data for jewellery navbar
  const { subCategoriesMap, typesMap } = useMemo(() => {
    const subCategoriesMap: { [key: string]: any[] } = {};
    const typesMap: { [key: string]: any[] } = {};

    subCategories.forEach((subCategory) => {
      if (!subCategoriesMap[subCategory.categoryId]) {
        subCategoriesMap[subCategory.categoryId] = [];
      }
      subCategoriesMap[subCategory.categoryId].push(subCategory);
    });

    jewelleryTypes.forEach((type) => {
      if (!typesMap[type.subCategoryId]) {
        typesMap[type.subCategoryId] = [];
      }
      typesMap[type.subCategoryId].push(type);
    });

    return { subCategoriesMap, typesMap };
  }, [subCategories, jewelleryTypes]);

  const getDropdownItems = (itemId: string, isCollection: boolean = false) => {
    if (isCollection) {
      return collections.map((collection) => ({
        value: collection.id,
        label: collection.name,
        types: [],
      }));
    }

    const category = categories?.find((cat: any) => cat.id === itemId);
    if (!category) return [];

    const categorySubCategories = subCategoriesMap[itemId] || [];
    return categorySubCategories.map((subCategory) => ({
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
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalVisible(false);
    await logout();
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalVisible(false);
  };

  // Render action icons (common across all variants)
  const renderActionIcons = () => {
    if (loading) {
      return;
    }
    if (isAuthenticated) {
      return (
        <>
          <Link href="/wishlist">
            <IoHeartOutline
              className="md:h-[30px] h-[25px] w-auto cursor-pointer hover:scale-110 transition-transform !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br rounded-full p-1"
              title="Wishlist"
              onMouseEnter={() => setHoveredItem(null)}
            />
          </Link>
          <Link href="/cart">
            <PiHandbag
              className="md:h-[30px] h-[25px] w-auto cursor-pointer hover:scale-110 transition-transform !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br rounded-full p-1"
              title="Cart"
              onMouseEnter={() => setHoveredItem(null)}
            />
          </Link>
          <div className="relative group">
            <CgProfile
              className="md:h-[30px] h-[25px] w-auto cursor-pointer hover:scale-110 transition-transform !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br rounded-full p-1"
              title="Profile"
              onMouseEnter={() => setHoveredItem(null)}
            // onClick={handleProfileClick}
            />
            <div className="absolute right-0 mt-2 z-50 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="px-4 py-2 text-sm text-brand-800 border-b">
                <p className="font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-brand-600 truncate">{user?.email}</p>
              </div>
              <Link href="/profile">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-brand-800 hover:bg-brand-50 flex items-center space-x-2 cursor-pointer"
                >
                  <CgProfile className="h-4 w-4" />
                  <span>View Profile</span>
                </button>
              </Link>
              <button
                onClick={handleLogoutClick}
                className="w-full text-left px-4 py-2 text-sm text-brand-800 hover:bg-brand-50 flex items-center space-x-2 cursor-pointer"
              >
                <FiLogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <Button
            type="primary"
            size="large"
            onClick={handleAuthClick}
            className={`md:button-hover-effect !rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br cursor-pointer !border-0 shadow-inner !h-7 md:!h-9 !px-[6px] md:!px-4 ${garamond.className}`}
          >
            <span className="md:block hidden">Login</span>
            <MdLogin className="icon" />
          </Button>
          <Link href="/register">
            <Button
              type="primary"
              size="large"
              className={`md:button-hover-effect !rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br !border-0 shadow-inner !h-7 md:!h-9 !px-[6px] md:!px-4 ${garamond.className}`}
            >
              <span className="md:block hidden">Register</span>
              <FiUserPlus className="icon" />
            </Button>
          </Link>
        </>
      );
    }
  };

  // Jewellery Navbar (for jewellery routes)
  if (variant === "jewellery") {
    return (
      <>
        <div
          className={`relative flex justify-center z-50 items-center w-auto h-auto md:px-5 px-2 pb-2 md:pb-0 md:pt-5 pt-2 select-none text-brand-900 backdrop-blur-sm ${garamond.className}`}
          style={{
            background:
              hoveredItem !== null && isFontNeedWhite ? "#808080" : "rgba(0, 0, 0, 0.20)",
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="w-full flex flex-col justify-center items-center">
            <div className="relative w-full flex flex-col justify-center items-center">
              <IoReorderThreeOutline
                className="absolute left-0 cursor-pointer w-7 h-7 text-white md:hidden block"
                onClick={() => setIsMobileMenuOpen(true)}
              />
              <Link href="/">
                <Image
                  src="/assets/brand/je-inspi-wordmark.png"
                  width={151}
                  height={68}
                  alt="JE-Inspi logo"
                  data-aos="zoom-in"
                  className={`cursor-pointer md:w-[151px] md:h-[68px] w-[100px] h-[50px] ${isFontNeedWhite ? "brand-logo-ivory" : ""}`}
                />
              </Link>
              <div className="absolute md:right-6 right-0 z-50 flex justify-center items-center space-x-2 md:space-x-4">
                {renderActionIcons()}
              </div>
            </div>

            <div
              className={`justify-center items-center space-x-3 md:space-x-14 md:flex hidden font-[500] ${hoveredItem !== null && isFontNeedWhite ? "text-brand-900" : "text-white"
                }`}
            >
              {loading ? (
                <NavbarSkeleton />
              ) : (
                <div
                  className={`flex justify-center items-center space-x-3 md:space-x-14 animate-fade-in ${hoveredItem !== null || !isFontNeedWhite
                    ? "text-brand-900"
                    : "text-white"
                    }`}
                >
                  {categories?.map((category: any) => (
              <Link href={`/jewellery/${category.id}`}>
                <div
                  key={category.id}
                  className={`relative cursor-pointer text-[18px] font-[500] hover:scale-110 ease-in-out transition-all duration-300 ${!isAuthenticated ? "cursor-not-allowed" : ""
                    }`}
                  onMouseEnter={() =>
                    handleMouseEnter(category.id) // isAuthenticated && 
                  }
                  // onClick={(e) => {
                  //   if (!isAuthenticated) {
                  //     e.preventDefault();
                  //     handleAuthClick();
                  //     return;
                  //   }
                  // }}
                >
                  {category.name}
                </div>
              </Link>
                  ))}

                  {collections.length > 0 && (
                    <div
                      key="collections"
                      className={`relative cursor-pointer text-[18px] font-[500] hover:scale-110 ease-in-out transition-all duration-300 ${!isAuthenticated ? "cursor-not-allowed" : ""
                        }`}
                      onMouseEnter={() =>
                        handleMouseEnter("collections") // isAuthenticated && 
                      }
                      // onClick={() => {
                      //   if (!isAuthenticated) {
                      //     handleAuthClick();
                      //     return;
                      //   }
                      // }}
                    >
                      Collections
                    </div>
                  )}
                </div>
              )}
              <Link href="/fashion" className="text-[16px] md:text-[18px] font-medium hover:underline underline-offset-4">Fashion</Link>
              <Link href="/diamond">
                <Image
                  src={
                    hoveredItem !== null || !isFontNeedWhite
                      ? "/assets/diamond/diamond.svg"
                      : "/assets/diamond/diamond-white.svg"
                  }
                  width={50}
                  height={100}
                  alt="JE-Inspi Diamonds"
                  className="w-[70px] h-auto cursor-pointer hover:scale-110 ease-in-out transition-all duration-500"
                />
              </Link>
            </div>
          </div>

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

          <LoginModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSwitchToRegister={() => {
              setShowAuthModal(false);
              router.push("/register");
            }}
          />

          {/* Mobile Menu */}
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            isAuthenticated={isAuthenticated}
            handleAuthClick={handleAuthClick}
            isLoginModalOpen={showAuthModal}
            onLoginModalClose={() => setShowAuthModal(false)}
            onSwitchToRegister={() => {
              setShowAuthModal(false);
              router.push("/register");
            }}
          />

          {/* Logout Confirmation Modal */}
          <Modal
            title="Logout Confirmation"
            open={isLogoutModalVisible}
            onOk={handleLogoutConfirm}
            onCancel={handleLogoutCancel}
            okText="Logout"
            cancelText="Cancel"
            okButtonProps={{
              className: `!bg-[#526f4d] hover:!bg-[#40583c] border-[#526f4d] hover:!border-[#40583c] ${garamond.className}`,
            }}
            cancelButtonProps={{
              className: garamond.className,
            }}
            className={garamond.className}
            centered
          >
            <p>Are you sure you want to logout?</p>
          </Modal>
        </div>
      </>
    );
  }

  // Diamond Navbar (for diamond routes)
  if (variant === "diamond") {
    return (
      <>
        <div
          className={`relative flex justify-center z-50 items-center w-auto h-auto md:px-5 md:pt-5 px-2 pt-2 select-none text-brand-900 backdrop-blur-sm ${garamond.className}`}
          style={{
            background:
              hoveredItem !== null && isFontNeedWhite
                ? "rgba(0, 0, 0, 0.20)"
                : "rgba(0, 0, 0, 0.20)",
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="w-full flex flex-col justify-center items-center">
            <div className="relative w-full flex flex-col justify-center items-center">
              <Link href="/">
                <Image
                  src="/assets/brand/je-inspi-wordmark.png"
                  width={151}
                  height={68}
                  alt="JE-Inspi logo"
                  data-aos="zoom-in"
                  className={`cursor-pointer md:w-[151px] md:h-[68px] w-[100px] h-[50px] ${isFontNeedWhite ? "brand-logo-ivory" : ""}`}
                />
              </Link>
              <div className="absolute md:right-6 right-0 z-50 flex justify-center items-center space-x-2 md:space-x-4">
                {renderActionIcons()}
              </div>
            </div>

            <div
              className={`flex flex-wrap justify-center items-center gap-x-5 gap-y-3 mb-3 py-2 min-h-[50px] ${hoveredItem !== null || !isFontNeedWhite
                ? "text-brand-900"
                : "text-white"
                }`}
            >
              {diamondTypesItems.map((item) => (
                <Link href={`/${item.redirect}?gemOrigin=${item.value}`} key={item.value}>
                  <div
                    className={`cursor-pointer md:text-[18px] text-[14px] font-[500] hover:scale-110 ease-in-out transition-all duration-300 ${activeDiamondTab === item.value ? "font-[600]" : ""
                      }`}
                    onClick={() => {
                      setActiveDiamondTab(item.value);
                    }}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
              <Link href="/fashion" className="text-[16px] md:text-[18px] font-medium hover:underline underline-offset-4">Fashion</Link>
              <Link href="/jewellery">
                <Image
                  src={
                    hoveredItem !== null || !isFontNeedWhite
                      ? "/assets/jewellery/jewellery.svg"
                      : "/assets/jewellery/jewellery-white.svg"
                  }
                  width={50}
                  height={100}
                  alt="JE-Inspi Jewellery"
                  className={`${hoveredItem !== null || !isFontNeedWhite
                    ? "w-[70px]"
                    : "w-[45px]"
                    } h-auto cursor-pointer hover:scale-110 ease-in-out transition-all duration-500`}
                />
              </Link>
            </div>
          </div>
        </div>

        <LoginModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSwitchToRegister={() => {
            setShowAuthModal(false);
          }}
        />

        {/* Logout Confirmation Modal */}
        <Modal
          title="Logout Confirmation"
          open={isLogoutModalVisible}
          onOk={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
          okText="Logout"
          cancelText="Cancel"
          okButtonProps={{
            className: `!bg-[#526f4d] hover:!bg-[#40583c] border-[#526f4d] hover:!border-[#40583c] ${garamond.className}`,
          }}
          cancelButtonProps={{
            className: garamond.className,
          }}
          className={garamond.className}
          centered
        >
          <p>Are you sure you want to logout?</p>
        </Modal>
      </>
    );
  }

  // Content Navbar (for about-us, contact-us, profile, etc.)
  return (
    <>
      <div
        className={`relative flex justify-center items-center w-full h-auto px-5 pt-1 select-none text-brand-900 backdrop-blur-sm ${garamond.className}`}
        style={{
          background: hoveredItem !== null ? "#808080" : "rgba(0, 0, 0, 0.20)",
        }}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full flex flex-col justify-center items-center">
          <div className="relative w-full flex flex-col justify-center items-center">
            <div className="py-3 px-5 ">
              {" "}
              {/* backdrop-blur-sm rounded-4xl border-0 */}
              <Link href="/">
                <Image
                  src="/assets/brand/je-inspi-wordmark.png"
                  width={151}
                  height={68}
                  alt="JE-Inspi logo"
                  data-aos="zoom-in"
                  className={`cursor-pointer md:w-[151px] md:h-[68px] w-[100px] h-[50px] ${isFontNeedWhite ? "brand-logo-ivory" : ""}`}
                />
              </Link>
            </div>
            <div className="absolute md:right-6 right-0 z-50 flex justify-center items-center space-x-2 md:space-x-4">
              {renderActionIcons()}
            </div>
          </div>
          <div className="w-full h-auto flex justify-center items-center -mr-4 space-x-5 md:space-x-10 mb-2 md:mb-4">
            {/* <Image
              src="/assets/diamond/diamond.svg"
              width={151}
              height={68}
              alt="JE-Inspi Diamond"
              data-aos="zoom-in"
              className="md:w-[80px] w-[60px] h-auto hover:scale-110 ease-in-out transition-all duration-400 cursor-pointer"
              onClick={() => router.push("/diamond")}
            />
            <Image
              src="/assets/jewellery/jewellery.svg"
              width={151}
              height={68}
              alt="JE-Inspi Jewellery"
              data-aos="zoom-in"
              className="md:w-[80px] w-[60px] h-auto hover:scale-110 ease-in-out transition-all duration-400 cursor-pointer"
              onClick={() => router.push("/jewellery")}
            /> */}

            {diamondNavItems.map((item) => (
              <Link href={`/${item.redirect}`} key={item.value}>
                <div
                  className={`cursor-pointer md:text-[18px] text-[14px] font-[500] hover:scale-110 ease-in-out transition-all duration-300 ${pathname.startsWith(`/${item.redirect}`) ? "font-[600] underline underline-offset-4" : ""
                    }`}
                  onClick={() => {
                    setActiveDiamondTab(item.value);
                  }}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <LoginModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSwitchToRegister={() => {
            setShowAuthModal(false);
            router.push("/register");
          }}
        />

        {/* Logout Confirmation Modal */}
        <Modal
          title="Logout Confirmation"
          open={isLogoutModalVisible}
          onOk={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
          okText="Logout"
          cancelText="Cancel"
          okButtonProps={{
            className: `!bg-[#526f4d] hover:!bg-[#40583c] border-[#526f4d] hover:!border-[#40583c] ${garamond.className}`,
          }}
          cancelButtonProps={{
            className: garamond.className,
          }}
          className={garamond.className}
          centered
        >
          <p>Are you sure you want to logout?</p>
        </Modal>
      </div>
    </>
  );
};

export default Navbar;
