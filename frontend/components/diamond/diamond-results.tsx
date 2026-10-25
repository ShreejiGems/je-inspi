"use client";
import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import ShreejiLoader from "../common/loader";
import { garamond } from "@/src/common/helper";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { IoIosArrowRoundUp } from "react-icons/io";
import { IoIosArrowRoundDown } from "react-icons/io";
import { IoHeart } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";
import {
  diamondAPI,
  Diamond,
  DiamondSearchParams,
  DiamondFilters,
} from "@/src/services/diamond.api";
import Link from "next/link";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useAuth } from "@/src/contexts/AuthContext";
import { useWishlist } from "@/src/hooks/useWishlist";
import LoginModal from "../auth/LoginModal";

interface DiamondResultsProps {
  filters: any;
  searchParams: DiamondSearchParams | null;
}

const DiamondResults: React.FC<DiamondResultsProps> = ({
  filters,
  searchParams,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isWishlisting, toggleWishlist } = useWishlist();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Debounce filters to prevent excessive API calls
  const debouncedFilters = useDebounce(filters, 500);
  const debouncedSortField = useDebounce(sortField, 300);
  const debouncedSortOrder = useDebounce(sortOrder, 300);

  // Track previous filters to detect changes
  const [previousFilters, setPreviousFilters] = useState(filters);

  // Reset pagination when filters change
  useEffect(() => {
    if (JSON.stringify(previousFilters) !== JSON.stringify(filters)) {
      setCurrentPage(1);
      setPreviousFilters(filters);
    }
  }, [filters, previousFilters]);

  // Fetch diamonds based on debounced filters and pagination
  useEffect(() => {
    fetchDiamonds();
  }, [
    debouncedFilters,
    currentPage,
    pageSize,
    debouncedSortField,
    debouncedSortOrder,
  ]);

  // Mapping functions for short codes to full descriptions
  const getCutGradeDescription = (code: string): string => {
    const mapping: Record<string, string> = {
      EX: "Excellent",
      VG: "Very Good",
      GD: "Good",
      FR: "Fair",
      PD: "Poor",
    };
    return mapping[code] || code;
  };

  const getFluorescenceDescription = (code: string): string => {
    const mapping: Record<string, string> = {
      NON: "None",
      FNT: "Faint",
      VSL: "Very Slight",
      SLT: "Slight",
      MED: "Medium",
      STG: "Strong",
      VSTG: "Very Strong",
    };
    return mapping[code] || code;
  };

  const getPolishSymmetryDescription = (code: string): string => {
    const mapping: Record<string, string> = {
      EX: "Excellent",
      VG: "Very Good",
      GD: "Good",
      FR: "Fair",
      PR: "Poor",
    };
    return mapping[code] || code;
  };

  // Helper function to process filter values to include both code and description
  const processFilterValues = (values: string[], getDescriptionFn: (code: string) => string): string | undefined => {
    if (values.length === 0) return undefined;
    
    const processedValues: string[] = [];
    values.forEach(value => {
      // Add the short code
      processedValues.push(value);
      // Add the full description if it's different from the code
      const description = getDescriptionFn(value);
      if (description !== value) {
        processedValues.push(description);
      }
    });
    
    return processedValues.join(",");
  };

  const fetchDiamonds = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      // Helper function to process shapes for API call
      const processShapesForAPI = (shapes: string[]) => {
        if (shapes.length === 0) return undefined;

        // Get predefined shapes from constants
        const predefinedShapes = [
          "ROUND",
          "PRINCESS",
          "CUSHION",
          "ASSCHER",
          "OVAL",
          "EMERALD",
          "RADIANT",
          "MARQUISE",
          "HEART",
          "PEAR",
        ];

        // Filter out "OTHER" and keep only actual shape names
        const processedShapes = shapes.filter((shape) => {
          if (shape === "OTHER") {
            // Don't include "OTHER" in API call, actual additional shapes should already be in the array
            return false;
          }
          return true;
        });

        return processedShapes.join(",");
      };

      const apiFilters: DiamondFilters = {
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        gemOrigin: debouncedFilters.gemOrigin,
        shape: processShapesForAPI(debouncedFilters.shape),
        minWeight: debouncedFilters.weight.min,
        maxWeight: debouncedFilters.weight.max,
        color:
          debouncedFilters.color.length > 0
            ? debouncedFilters.color.join(",")
            : undefined,
        isUserApi: true,
        clarity:
          debouncedFilters.clarity.length > 0
            ? debouncedFilters.clarity.join(",")
            : undefined,
        cut: processFilterValues(debouncedFilters.cut, getCutGradeDescription),
        minPrice: debouncedFilters.price.min,
        maxPrice: debouncedFilters.price.max,
        fluorescence: processFilterValues(debouncedFilters.fluorescence, getFluorescenceDescription),
        polish: processFilterValues(debouncedFilters.polish, getPolishSymmetryDescription),
        symmetry: processFilterValues(debouncedFilters.symmetry, getPolishSymmetryDescription),
        girdle:
          debouncedFilters.girdle.length > 0
            ? debouncedFilters.girdle.join(",")
            : undefined,
        minWidthPercentage: 
          debouncedFilters.minWidthPercentage > 0 && debouncedFilters.minWidthPercentage < 100
            ? debouncedFilters.minWidthPercentage
            : undefined,
        maxWidthPercentage: 
          debouncedFilters.maxWidthPercentage > 0 && debouncedFilters.maxWidthPercentage < 100
            ? debouncedFilters.maxWidthPercentage
            : undefined,
        minDepthPercentage: 
          debouncedFilters.minDepthPercentage > 0 && debouncedFilters.minDepthPercentage < 100
            ? debouncedFilters.minDepthPercentage
            : undefined,
        maxDepthPercentage: 
          debouncedFilters.maxDepthPercentage > 0 && debouncedFilters.maxDepthPercentage < 100
            ? debouncedFilters.maxDepthPercentage
            : undefined,
        orderBy:
          debouncedSortField && debouncedSortOrder
            ? `${debouncedSortField}|${debouncedSortOrder}`
            : undefined,
      };

      const response = await diamondAPI.getAllDiamonds(apiFilters);
      setDiamonds(response.list);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch diamonds:", error);
      setLoadError('Unable to load diamonds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get shape image
  const getShapeImage = (shape: string) => {
    const shapeImages: Record<string, string> = {
      ROUND: "/assets/diamond/ROUND.svg",
      PRINCESS: "/assets/diamond/PRINCESS.svg",
      CUSHION: "/assets/diamond/CUSHION.svg",
      EMERALD: "/assets/diamond/EMERALD.svg",
      ASSCHER: "/assets/diamond/ASSCHER.svg",
      MARQUISE: "/assets/diamond/MARQUISE.svg",
      OVAL: "/assets/diamond/OVAL.svg",
      RADIANT: "/assets/diamond/RADIANT.svg",
      PEAR: "/assets/diamond/PEAR.svg",
      HEART: "/assets/diamond/HEART.svg",
    };
    return shapeImages[shape]; // "/assets/diamond/other.svg";
  };

  const columns: any = [
    {
      title: "",
      key: "wishlist",
      width: 50,
      render: (_: any, record: Diamond) => {
        const handleWishlistClick = async (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (!isAuthenticated) {
            setIsLoginModalOpen(true);
            return;
          }
          
          try {
            await toggleWishlist(record.id, 'DIAMOND', record.isWishlisted);
            setDiamonds(prevDiamonds => 
              prevDiamonds.map(diamond => 
                diamond.id === record.id 
                  ? { ...diamond, isWishlisted: !record.isWishlisted }
                  : diamond
              )
            );
          } catch (error) {
            console.error('Failed to toggle wishlist:', error);
          }
        };

        return (
          <button
            onClick={handleWishlistClick}
            disabled={isWishlisting}
            className="inline-flex items-center justify-center p-1 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={record.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {record.isWishlisted ? (
              <IoHeart
                className="w-4 h-4 text-red-500 fill-current"
              />
            ) : (
              <IoHeartOutline
                className="w-4 h-4 text-brand-400 hover:text-red-500 transition-colors"
              />
            )}
          </button>
        );
      },
    },
    {
      title: (
        <div
          className="flex items-center justify-between gap-1 cursor-pointer hover:text-brand-800"
          onClick={() => handleSort("shape")}
        >
          <span className={`font-medium ${garamond.className}`}>Cut</span>
          {sortField === "shape" ? (
            sortOrder === "asc" ? (
              <IoIosArrowRoundUp size={16} />
            ) : (
              <IoIosArrowRoundDown size={16} />
            )
          ) : (
            <HiOutlineArrowsUpDown size={16} />
          )}
        </div>
      ),
      dataIndex: "shape",
      key: "shape",
      fixed: "left",
      render: (shape: string, record: Diamond) => {
        const shapeImage = getShapeImage(shape);
        let imageSrc = shapeImage;
        
        // If shape image is not available, try to get image from record.images
        if (!shapeImage && record.images) {
          try {
            let images;
            // Handle both string and array types for record.images
            if (typeof record.images === 'string') {
              images = JSON.parse(record.images);
            } else if (Array.isArray(record.images)) {
              images = record.images;
            }
            
            if (Array.isArray(images) && images.length > 0) {
              imageSrc = images[0];
            }
          } catch (error) {
            // If parsing fails, fallback to default diamond image
            imageSrc = "/assets/diamond/diamond.svg";
          }
        }
        
        return (
          <div className="flex items-center gap-2">
            <Image
              src={imageSrc}
              alt={shape}
              width={30}
              height={30}
              className="object-contain"
            />
            <span className={`text-sm ${garamond.className}`}>{shape}</span>
          </div>
        );
      },
    },
    {
      title: (
        <div
          className="flex items-center justify-between gap-1 cursor-pointer hover:text-brand-800"
          onClick={() => handleSort("weight")}
        >
          <span className={`font-medium ${garamond.className}`}>Carat</span>
          {sortField === "weight" ? (
            sortOrder === "asc" ? (
              <IoIosArrowRoundUp size={16} />
            ) : (
              <IoIosArrowRoundDown size={16} />
            )
          ) : (
            <HiOutlineArrowsUpDown size={16} />
          )}
        </div>
      ),
      dataIndex: "weight",
      key: "weight",
      render: (weight: number) => (
        <span className={`text-sm ${garamond.className}`}>
          {weight.toFixed(2)}
        </span>
      ),
    },
    {
      title: (
        <div
          className="flex items-center justify-between gap-1 cursor-pointer hover:text-brand-800"
          onClick={() => handleSort("cut")}
        >
          <span
            className={`font-medium whitespace-nowrap ${garamond.className}`}
          >
            Cut Grade{" "}
          </span>
          {sortField === "cut" ? (
            sortOrder === "asc" ? (
              <IoIosArrowRoundUp size={16} />
            ) : (
              <IoIosArrowRoundDown size={16} />
            )
          ) : (
            <HiOutlineArrowsUpDown size={16} />
          )}
        </div>
      ),
      dataIndex: "cut",
      key: "cut",
      render: (cut: string) => (
        <span className={`text-sm ${garamond.className}`}>{cut || "-"}</span>
      ),
    },
    {
      title: (
        <div
          className="flex items-center justify-between gap-1 cursor-pointer hover:text-brand-800"
          onClick={() => handleSort("color")}
        >
          <span className={`font-medium ${garamond.className}`}>Color</span>
          {sortField === "color" ? (
            sortOrder === "asc" ? (
              <IoIosArrowRoundUp size={16} />
            ) : (
              <IoIosArrowRoundDown size={16} />
            )
          ) : (
            <HiOutlineArrowsUpDown size={16} />
          )}
        </div>
      ),
      dataIndex: "color",
      key: "color",
      render: (color: string) => (
        <span className={`text-sm ${garamond.className}`}>{color ? color : "-"}</span>
      ),
    },
    {
      title: (
        <div
          className="flex items-center justify-between gap-1 cursor-pointer hover:text-brand-800"
          onClick={() => handleSort("clarity")}
        >
          <span className={`font-medium ${garamond.className}`}>Clarity</span>
          {sortField === "clarity" ? (
            sortOrder === "asc" ? (
              <IoIosArrowRoundUp size={16} />
            ) : (
              <IoIosArrowRoundDown size={16} />
            )
          ) : (
            <HiOutlineArrowsUpDown size={16} />
          )}
        </div>
      ),
      dataIndex: "clarity",
      key: "clarity",
      render: (clarity: string) => (
        <span className={`text-sm ${garamond.className}`}>{clarity ? clarity : "-"}</span>
      ),
    },
    {
      title: (
        <div
          className="flex items-center justify-between gap-1 cursor-pointer hover:text-brand-800"
          onClick={() => handleSort("price")}
        >
          <span className={`font-medium ${garamond.className}`}>Price</span>
          {sortField === "price" ? (
            sortOrder === "asc" ? (
              <IoIosArrowRoundUp size={16} />
            ) : (
              <IoIosArrowRoundDown size={16} />
            )
          ) : (
            <HiOutlineArrowsUpDown size={16} />
          )}
        </div>
      ),
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span className={`text-sm whitespace-nowrap ${garamond.className}`}>
          $ {price.toLocaleString()}
        </span>
      ),
    },
    {
      title: (
        <span className={`font-medium ${garamond.className}`}>Origin</span>
      ),
      dataIndex: "gemOrigin",
      key: "gemOrigin",
      render: (gemOrigin: string) => (
        <span
          className={`text-sm text-brand-700 font-medium ${garamond.className}`}
        >
          {gemOrigin === "NATURAL" ? "Natural" : "Lab grown"}
        </span>
      ),
    },
    {
      title: <span className={`font-medium ${garamond.className}`}>Info</span>,
      key: "action",
      render: (_: any, record: Diamond) => (
        <Link
          href={`/diamond/detail?id=${record.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="small"
            className={`border-[#73796f] text-[#73796f] hover:bg-[#73796f] hover:text-white ${garamond.className}`}
          >
            SHOW
          </Button>
        </Link>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleRowClick = (record: Diamond) => {
    router.push(`/diamond/detail?id=${record.id}`);
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle between asc and desc
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to asc
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  return (
    <div className={`w-full md:space-y-0 space-y-6 ${garamond.className}`}>
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-brand-700 text-end w-full mb-3" aria-live="polite">
          {!loadError && (
            <span>
            {loading ? 'Loading...' : `Showing ${diamonds.length} of ${total} diamonds`}
            </span>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg border">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <ShreejiLoader size="small" fullScreen={false} />
          </div>
        ) : loadError ? (
          <div role="alert" className="p-8 text-center text-brand-900">
            <p className="mb-3">{loadError}</p>
            <button type="button" onClick={() => void fetchDiamonds()} className="rounded-full bg-brand-600 px-6 py-2 text-white hover:bg-brand-700">
              Retry
            </button>
          </div>
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={diamonds}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" },
            })}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showSizeChanger: false,
              onChange: handlePageChange,
              onShowSizeChange: (current, size) => setPageSize(size),
            }}
            scroll={{ x: true }}
          />
        )}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          router.push("/register");
        }}
      />
    </div>
  );
};

export default DiamondResults;
