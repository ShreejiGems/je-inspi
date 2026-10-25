"use client";
import React from "react";

const NavbarSkeleton = () => {
  // Create array of 6 skeleton items (typical number of nav items)
  const skeletonItems = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="flex justify-center items-center space-x-14">
      {skeletonItems.map((index) => (
        <div
          key={index}
          className="relative animate-pulse"
        >
          <div className="h-6 w-20 bg-brand-200 rounded-lg opacity-70"></div>
        </div>
      ))}
    </div>
  );
};

export default NavbarSkeleton;
