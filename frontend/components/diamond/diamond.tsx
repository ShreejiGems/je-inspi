"use client";
import React, { useState } from "react";
import Image from "next/image";
import { garamond } from "@/src/common/helper";
import Navbar from "../common/navbar";
import Footer from "../common/footer";
import DiamondFilters from "./diamond-filters";
import DiamondResults from "./diamond-results";
import DiamondDynamicBanner from "./diamond-dynamic-banner";
import { diamondAPI, DiamondSearchParams } from "@/src/services/diamond.api";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const DiamondPage = () => {
  const [searchParams, setSearchParams] = useState<DiamondSearchParams | null>(
    null
  );
  const [filters, setFilters] = useState({
    shape: [],
    weight: { min: 0, max: 31 },
    clarity: [],
    color: [],
    cut: [],
    fluorescence: [],
    polish: [],
    symmetry: [],
    price: { min: 0, max: 4098600 },
    tableWidth: { min: 0, max: 100 },
    depth: { min: 0, max: 100 },
    lab: [],
    girdle: [],
    gemOrigin: undefined,
    minWidthPercentage: 0,
    maxWidthPercentage: 100,
    minDepthPercentage: 0,
    maxDepthPercentage: 100,
  });

  const queryParams = useSearchParams();

  // Fetch search parameters on mount
  useEffect(() => {
    const fetchSearchParams = async () => {
      try {
        const params = await diamondAPI.getSearchParams();
        setSearchParams(params);
        // Update filter ranges based on API response
        setFilters((prev) => ({
          ...prev,
          weight: { min: params.weightRange.min, max: params.weightRange.max },
          price: { min: params.priceRange.min, max: params.priceRange.max },
        }));
      } catch (error) {
        console.error("Failed to fetch search params:", error);
      }
    };
    fetchSearchParams();
  }, []);

  // Sync gemOrigin from URL query to filters
  useEffect(() => {
    const origin = queryParams.get("gemOrigin");
    setFilters((prev: any) => {
      const prevOrigin = prev.gemOrigin;
      if (origin === "NATURAL" || origin === "LAB_GROWN") {
        if (prevOrigin === origin) return prev;
        return { ...prev, gemOrigin: origin };
      } else {
        if (typeof prevOrigin === "undefined") return prev;
        const { gemOrigin, ...rest } = prev;
        return rest;
      }
    });
  }, [queryParams]);

  return (
    <div className={`w-auto h-auto select-none ${garamond.className}`}>
      {/* Section 1: Hero Section with Dynamic Banner */}
      <div className="relative w-full h-[90vh]">
        {/* Diamond Navbar */}
        <div className="absolute top-0 left-0 w-full z-10">
          <Navbar />
        </div>

        {/* Dynamic Banner */}
        <DiamondDynamicBanner />
      </div>

      {/* Section 2: Diamond Filters */}
      <div className="md:px-12 md:py-8 px-4 pt-5 bg-white">
        <DiamondFilters
          filters={filters}
          setFilters={setFilters}
          searchParams={searchParams}
        />
      </div>

      {/* Section 3: Diamond Results */}
      <div className="md:px-12 px-4 md:py-5 md:pb-5 pt-0 pb-5 bg-white">
        <DiamondResults filters={filters} searchParams={searchParams} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DiamondPage;
