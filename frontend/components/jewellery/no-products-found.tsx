"use client";
import React from "react";
import { garamond } from "@/src/common/helper";
import { BiBlock } from "react-icons/bi";

const NoProductsFound = ({ 
  title = "No Products Found", 
  message = "We couldn't find any products matching your criteria. Try adjusting your filters or browse our other collections.",
  icon = "/assets/jewellery/no-products-icon.svg"
}: {
  title?: string;
  message?: string;
  icon?: string;
}) => {
  return (
    <div className={`flex flex-col justify-center items-center py-16 px-4 ${garamond.className}`}>
      {/* Icon */}
      <div className="mb-6">
        <div className="w-24 h-24 flex items-center justify-center bg-brand-50 rounded-full">
        <BiBlock className="w-12 h-12 text-brand-600" />
        </div>
      </div>
      
      {/* Title */}
      <h2 className="text-2xl font-bold text-brand-900 mb-4 text-center">
        {title}
      </h2>
      
      {/* Message */}
      <p className="text-brand-700 text-center max-w-md mb-8 leading-relaxed">
        {message}
      </p>
      
      {/* Optional: Add action buttons if needed */}
      {/* <div className="flex gap-4">
        <button 
          onClick={() => router.push("/jewellery")}
          className="px-6 py-2 rounded-full cursor-pointer !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br"
        >
          Go Back
        </button>
      </div> */}
    </div>
  );
};

export default NoProductsFound;
