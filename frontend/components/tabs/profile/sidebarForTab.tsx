"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUser, FiHeart, FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { garamond } from "@/src/common/helper";
import { BiLogOut } from "react-icons/bi";
import { useAuth } from "@/src/contexts/AuthContext";
import { useState, useEffect } from "react";
import Modal from "antd/es/modal";

const menuItems = [
  {
    id: "personal-info",
    label: "Profile Information",
    icon: <FiUser className="mr-3" />,
    path: "/profile",
  },
  {
    id: "wishlist",
    label: "My Wishlist",
    icon: <FiHeart className="mr-3" />,
    path: "/wishlist",
  },
  {
    id: "cart",
    label: "My Cart",
    icon: <FiShoppingCart className="mr-3" />,
    path: "/cart",
  },
  {
    id: "orders",
    label: "My Orders",
    icon: <FiShoppingBag className="mr-3" />,
    path: "/orders",
  },
];

export default function ProfileSidebar() {
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get user data from localStorage only on client side
    const userDataStr = localStorage.getItem("userData");
    setUserData(userDataStr ? JSON.parse(userDataStr) : null);
  }, []);

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
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

  return (
    <div
      className={`bg-white rounded-lg shadow md:p-6 p-3 border-2 border-[#526f4d] ${garamond.className}`}
    >
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mb-3">
          {mounted && userData?.firstName ? (
            <span className="text-2xl font-semibold text-brand-700">
              {userData.firstName.charAt(0).toUpperCase()}
              {userData.lastName?.charAt(0).toUpperCase()}
            </span>
          ) : (
            <span className="text-2xl font-semibold text-brand-700">U</span>
          )}
        </div>
        <h3 className="font-medium text-brand-900">
          {mounted && userData?.firstName
            ? `${userData.firstName} ${userData.lastName || ""}`
            : "User Name"}
        </h3>
        <p className="text-sm text-brand-600">
          {mounted && userData?.email ? userData.email : "user@example.com"}
        </p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.path}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${pathname === item.path
              ? "bg-[#e3ebdd] text-[#526f4d] font-medium"
              : "text-brand-700 hover:bg-brand-50"
              }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <div
          key="logout"
          className={`flex items-center px-4 py-3 space-x-2 rounded-lg transition-colors text-brand-700 hover:bg-brand-50 cursor-pointer`}
          onClick={handleLogoutClick}
        >
          <BiLogOut /> <span>Logout</span>
        </div>
      </nav>

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
  );
}
