'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from "next/image";
import { LuCalculator } from "react-icons/lu";
import { IoDiamondOutline } from "react-icons/io5";
import { GiImperialCrown } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { MdContactSupport } from "react-icons/md";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isJewelleryOpen, setIsJewelleryOpen] = useState(false);
  const [isDiamondOpen, setIsDiamondOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);

  const jewellerySubItems = [
    { name: 'Home Page Media', href: '/jewellery/home-page-media' },
    { name: 'Filter & Sort', href: '/jewellery/filter-sort' },
    { name: 'Product List', href: '/jewellery/product-list' },
    { name: 'Marketing Image', href: '/jewellery/marketing-image' },
  ];

  const diamondSubItems = [
    { name: 'Diamond List', href: '/diamond/diamond-list' },
    { name: 'Certificate Pricing', href: '/diamond/certificate-pricing' },
  ];

  const userSubItems = [
    { name: 'User List', href: '/users' },
    { name: 'Pending Requests', href: '/users/pending-requests' },
  ];

  const contactUsSubItems = [
    { name: 'Catalogue', href: '/contact-us/catalogue' },
    { name: 'Event', href: '/contact-us/event' },
    { name: 'Location', href: '/contact-us/location' },
  ];

  return (
    <div className="w-64 bg-brand-50 text-brand-900 min-h-screen shadow-xl">
      {/* Logo */}
      <div className="p-6 flex justify-center items-center">
        <Image
          src="/assets/brand/je-inspi-wordmark.png"
          width={151}
          height={68}
          alt="JE-Inspi logo"
          data-aos="zoom-in"
          className="cursor-pointer"
          onClick={() => router.push('/calculator')} 
        />
      </div>

      {/* Navigation */}
      <nav className="mt-6 h-[calc(100vh-140px)] overflow-y-auto scrollbar">
        <ul className="space-y-2 px-4">
          {/* Calculator */}
          <li>
            <Link
              href="/calculator"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-brand-900 ${pathname === '/calculator'
                ? 'bg-brand-200'
                : 'hover:bg-brand-100'
                }`}
            >
              <LuCalculator className="text-brand-900" />
              <span className="text-brand-900">Calculator</span>
            </Link>
          </li>

          {/* Diamond with Dropdown */}
          <li>
            <button
              onClick={() => setIsDiamondOpen(!isDiamondOpen)}
              className={`w-full flex items-center justify-between text-brand-900 px-4 py-3 rounded-lg transition-colors duration-200 ${pathname.startsWith('/diamond')
                ? 'bg-brand-200'
                : 'hover:bg-brand-100'
                }`}
            >
              <div className="flex items-center space-x-3">
                <IoDiamondOutline className="text-brand-900" />
                <span className="text-brand-900">Diamond</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isDiamondOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Items */}
            {isDiamondOpen && (
              <ul className="mt-2 ml-8 space-y-1">
                {diamondSubItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg transition-colors text-brand-900 duration-200 ${pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'bg-brand-200'
                        : 'hover:bg-brand-100'
                        }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

          </li>

          {/* Order Management */}
          <li>
            <Link
              href="/order-management"
              className={`flex items-center space-x-3 px-4 py-3 text-white rounded-lg transition-colors duration-200 ${pathname.startsWith('/order-management')
                ? 'bg-brand-200'
                : 'hover:bg-brand-100'
                }`}
            >
              <IoCart className="text-brand-900" />
              <span className="text-brand-900">Order Management</span>
            </Link>
          </li>

          {/* Jewellery with Dropdown */}
          <li>
            <button
              onClick={() => setIsJewelleryOpen(!isJewelleryOpen)}
              className={`w-full flex items-center justify-between text-brand-900 px-4 py-3 rounded-lg transition-colors duration-200 ${pathname.startsWith('/jewellery')
                ? 'bg-brand-200'
                : 'hover:bg-brand-100'
                }`}
            >
              <div className="flex items-center space-x-3">
                <GiImperialCrown className="text-brand-900" />
                <span className="text-brand-900">Jewellery</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isJewelleryOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Items */}
            {isJewelleryOpen && (
              <ul className="mt-2 ml-8 space-y-1">
                {jewellerySubItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg transition-colors text-brand-900 duration-200 ${pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'bg-brand-200'
                        : 'hover:bg-brand-100'
                        }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

          </li>

          {/* User with Dropdown */}
          <li>
            <button
              onClick={() => setIsUserOpen(!isUserOpen)}
              className={`w-full flex items-center justify-between text-brand-900 px-4 py-3 rounded-lg transition-colors duration-200 ${pathname.startsWith('/user')
                ? 'bg-brand-200'
                : 'hover:bg-brand-100'
                }`}
            >
              <div className="flex items-center space-x-3">
                <FaUsers className="text-brand-900" />
                <span className="text-brand-900">User</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isUserOpen && (
              <ul className="mt-2 ml-8 space-y-1">
                {userSubItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg transition-colors text-brand-900 duration-200 ${pathname === item.href 
                        ? 'bg-brand-200'
                        : 'hover:bg-brand-100'
                        }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

          </li>

          {/* Contact Us with Dropdown */}
          <li className="mb-5">
            <button
              onClick={() => setIsContactUsOpen(!isContactUsOpen)}
              className={`w-full flex items-center justify-between text-brand-900 px-4 py-3 rounded-lg transition-colors duration-200 ${pathname.startsWith('/contact-us')
                ? 'bg-brand-200'
                : 'hover:bg-brand-100'
                }`}
            >
              <div className="flex items-center space-x-3">
                <MdContactSupport className="text-brand-900" />
                <span className="text-brand-900">Contact Us</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isContactUsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isContactUsOpen && (
              <ul className="mt-2 ml-8 space-y-1">
                {contactUsSubItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg transition-colors text-brand-900 duration-200 ${pathname === item.href
                        ? 'bg-brand-200'
                        : 'hover:bg-brand-100'
                        }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
