"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaRegCircleCheck } from "react-icons/fa6";
import { HiOutlineHome } from "react-icons/hi";
import { garamond } from "@/src/common/helper";

const ThankYouPage: React.FC = () => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-brand-200 via-brand-100 to-brand-200 flex items-center justify-center p-4 sm:p-6 md:p-10 ${garamond.className}`}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[850px] p-6 sm:p-8 md:p-10 animate-fade-in">
        {/* Logo + Heading */}
        <div className="text-center mb-8 flex flex-col justify-center items-center">
          <Link href="/">
            <Image
              src="/assets/brand/je-inspi-logo-transparent.png"
              width={151}
              height={68}
              alt="JE-Inspi logo"
              priority
              className="mb-6 w-[120px] sm:w-[150px] cursor-pointer"
            />
          </Link>

          <div className="bg-brand-100 rounded-full p-3 sm:p-4 mb-4 shadow-md">
            <FaRegCircleCheck className="h-10 w-10 sm:h-12 sm:w-12 text-brand-600" />
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-900">
            Thank You for Registration!
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-6 text-center">
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-brand-800">
              Registration Successful
            </h3>
            <p className="text-sm sm:text-base text-brand-600 mt-2 leading-relaxed px-1 sm:px-4">
              Thank you for registering with JE-Inspi! Your account has been
              successfully created and is now under review by our administrative
              team.
            </p>
          </div>

          {/* Step Section */}
          <div className="bg-brand-50 border-l-4 border-brand-400 p-4 sm:p-6 rounded-lg text-left space-y-4">
            <h4 className="text-sm sm:text-base font-semibold text-brand-600">
              What Happens Next?
            </h4>

            <ul className="space-y-3 text-sm sm:text-base text-brand-700">
              <li className="flex gap-3">
                <span className="bg-brand-500 text-white rounded-full min-w-6 h-6 flex items-center justify-center text-xs sm:text-sm font-bold">
                  1
                </span>
                <span>
                  <strong>Account Review</strong> – Our admin team will
                  carefully review your registration details and business
                  documents.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="bg-brand-500 text-white rounded-full min-w-6 h-6 flex items-center justify-center text-xs sm:text-sm font-bold">
                  2
                </span>
                <span>
                  <strong>Approval Process</strong> – You will receive a
                  confirmation email once your account is approved.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="bg-brand-500 text-white rounded-full min-w-6 h-6 flex items-center justify-center text-xs sm:text-sm font-bold">
                  3
                </span>
                <span>
                  <strong>Get Started</strong> – After activation, you can log
                  in and explore our exclusive gem collection.
                </span>
              </li>
            </ul>
          </div>

          {/* Note */}
          <div className="bg-brand-50 border border-brand-200 text-brand-700 px-4 py-3 rounded-lg text-sm sm:text-base text-left leading-relaxed">
            <strong>Please Note:</strong> The review process typically takes 1–2
            business days. You'll receive an email notification once your
            account is approved.
          </div>

          {/* Button */}
          <Link
            href="/"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <HiOutlineHome className="h-5 w-5" />
            Back to Home
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs sm:text-sm text-brand-600">
            © 2025 JE-Inspi. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
