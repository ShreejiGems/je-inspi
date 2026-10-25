"use client";
import React, { useState } from "react";
import Image from "next/image";
import { garamond } from "@/src/common/helper";
import { CgProfile } from "react-icons/cg";
import { MdLogin } from "react-icons/md";
import { IoHeartOutline } from "react-icons/io5";
import { PiHandbag } from "react-icons/pi";
import { FiLogOut, FiUserPlus } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/src/contexts/AuthContext';
import LoginModal from '../auth/LoginModal';
import { Button } from "antd";

const Navbar = () => {
    // const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const router = useRouter();
    const { isAuthenticated, user, logout, hoveredItem, setHoveredItem } = useAuth();

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    const handleAuthClick = () => {
        setShowAuthModal(true);
    };

    const handleLogout = async () => {
        await logout();
    };

    const handleProfileClick = () => {
        setShowProfileModal(true);
    };

    return (
        <div
            className={`relative flex justify-center items-center w-full h-auto px-5 pt-1 select-none text-brand-900 backdrop-blur-sm ${garamond.className}`}
            style={{ background: "rgba(0, 0, 0, 0.20)" }}
            onMouseLeave={handleMouseLeave}
        >
            {/* Logo and Some buttons */}
            <div className="w-full flex flex-col justify-center items-center">
                <div className="relative w-full flex flex-col justify-center items-center">
                    <div className="py-3 px-5 backdrop-blur-sm rounded-4xl border-0">
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
                    </div>
                    <div className="absolute right-6 flex justify-center items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <IoHeartOutline className="h-[25px] w-auto cursor-pointer" title="Wishlist" />
                                <PiHandbag className="h-[25px] w-auto cursor-pointer" title="Cart" />
                                <div className="relative group">
                                    <CgProfile
                                        className="h-[25px] w-auto cursor-pointer"
                                        title="Profile"
                                        onClick={handleProfileClick}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="px-4 py-2 text-sm text-brand-800 border-b">
                                            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-brand-600">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full text-left px-4 py-2 text-sm text-brand-800 hover:bg-brand-50 flex items-center space-x-2"
                                        >
                                            <CgProfile className="h-4 w-4" />
                                            <span>Edit Profile</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-brand-800 hover:bg-brand-50 flex items-center space-x-2"
                                        >
                                            <FiLogOut className="h-4 w-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleAuthClick}
                                    className={`button-hover-effect !rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800 !border-0 shadow-inner !h-11 !px-10 ${garamond.className}`}
                                >
                                    <span>
                                        Login
                                    </span>
                                    <MdLogin className="icon" />
                                </Button>
                                <Link href="/register">
                                    <Button
                                        type="primary"
                                        size="large"
                                        className={`button-hover-effect !rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800 !border-0 shadow-inner !h-11 !px-10 ${garamond.className}`}
                                    >
                                        <span>Register</span>
                                        <FiUserPlus className="icon" />
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="w-full h-auto flex justify-center items-center -mr-4">
                    <Link href="/diamond">
                        <Image
                            src="/assets/diamond/diamond.svg"
                            width={151}
                            height={68}
                            alt="JE-Inspi Diamond"
                            data-aos="zoom-in"
                            className="w-[80px] h-auto hover:scale-110 ease-in-out transition-all duration-400 cursor-pointer"
                        />
                    </Link>
                    <Link href="/jewellery">
                        <Image
                            src="/assets/jewellery/jewellery.svg"
                            width={151}
                            height={68}
                            alt="JE-Inspi Jewellery"
                            data-aos="zoom-in"
                            className="w-[80px] h-auto hover:scale-110 ease-in-out transition-all duration-400 cursor-pointer"
                        />
                    </Link>
                </div>
            </div>

            {/* Auth Modal */}
            <LoginModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSwitchToRegister={() => {
                    setShowAuthModal(false);
                    router.push('/register');
                }}
            />
        </div>
    );
};

export default Navbar;
