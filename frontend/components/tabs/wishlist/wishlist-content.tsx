"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jewelleryAPI, ProductImage, Product } from "@/src/services/jewellery.api";
import { diamondAPI } from "@/src/services/diamond.api";
import ShreejiLoader from "@/components/common/loader";
import { IoTrashOutline } from "react-icons/io5";
import { garamond } from "@/src/common/helper";

interface DiamondProduct {
  id: string;
  gemOrigin: string;
  name: string;
  sku: string;
  shape: string;
  weight: number;
  color: string;
  clarity: string;
  cut: string;
  symmetry: string;
  lab: string;
  polish: string;
  certificateNo: string;
  height: number;
  width: number;
  length: number;
  totalDepthInPercentage: number;
  totalWidthInPercentage: number;
  girdle: string;
  fluorescence: string;
  images: string;
  videos: string;
  certificateUrl: string;
  source: string;
  rap: number;
  price: number;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WishlistItem {
  id: string;
  userId: string;
  jewelleryId: string | null;
  diamondProductId: string | null;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  jewellery: Product | null;
  diamondProduct: DiamondProduct | null;
}

interface WishlistResponse {
  total: number;
  list: WishlistItem[];
  hasMany: boolean;
  count: number;
}

const WishlistContent: React.FC = () => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const TAKE = 20;

  // Parse images helper function
  const parseImages = (imagesString: string | ProductImage[]): ProductImage[] => {
    if (Array.isArray(imagesString)) {
      return imagesString;
    }
    try {
      if (!imagesString || imagesString.trim() === "") {
        return [];
      }
      return JSON.parse(imagesString);
    } catch (error) {
      console.error("Failed to parse images:", error);
      return [];
    }
  };

  // Fetch wishlist items
  const fetchWishlist = useCallback(
    async (currentSkip: number, isLoadMore: boolean = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const payload = {
          skip: currentSkip,
          take: TAKE,
          include: ["jewellery", "diamondProduct"],
        };

        const response: WishlistResponse = await jewelleryAPI.getWishList(payload);

        // Parse images for each item and handle both jewellery and diamond products
        const parsedList = response.list.map((item) => {
          const parsedItem = { ...item };
          
          // Parse jewellery images if jewellery exists
          if (item.jewellery) {
            parsedItem.jewellery = {
              ...item.jewellery,
              images: parseImages(item.jewellery.images),
            };
          }
          
          return parsedItem;
        });

        if (isLoadMore) {
          setWishlistItems((prev) => [...prev, ...parsedList]);
        } else {
          setWishlistItems(parsedList);
        }

        setHasMore(response.hasMany);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Initial fetch
  useEffect(() => {
    fetchWishlist(0, false);
  }, [fetchWishlist]);

  // Infinite scroll observer
  useEffect(() => {
    if (loadingMore || !hasMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          const newSkip = skip + TAKE;
          setSkip(newSkip);
          fetchWishlist(newSkip, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, skip, fetchWishlist]);

  // Handle move to cart (navigate to product detail)
  const handleMoveToCart = (item: WishlistItem) => {
    if (item.jewellery) {
      router.push(`/jewellery/product-detail?id=${item.jewellery.id}`);
    } else if (item.diamondProduct) {
      router.push(`/diamond/detail?id=${item.diamondProduct.id}`);
    }
  };

  // Handle delete from wishlist
  const handleDelete = async (wishlistItemId: string, item: WishlistItem) => {
    try {
      setDeletingId(wishlistItemId);

      // Call API to remove from wishlist with appropriate type
      if (item.jewellery) {
        await jewelleryAPI.removeProductFromWishList(item.jewellery.id);
      } else if (item.diamondProduct) {
        // Use diamond API for diamond products
        await diamondAPI.removeDiamondFromWishList(item.diamondProduct.id);
      }

      // Remove from local state
      setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistItemId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // Get first image from jewellery or diamond product
  const getFirstImage = (item: WishlistItem): string => {
    if (item.jewellery && item.jewellery.images && item.jewellery.images.length > 0) {
      return item.jewellery.images[0].image;
    } else if (item.diamondProduct && item.diamondProduct.images) {
      try {
        const imageArray = JSON.parse(item.diamondProduct.images);
        if (imageArray && imageArray.length > 0 && imageArray[0]) {
          return imageArray[0];
        }
      } catch (error) {
        console.error("Failed to parse diamond images:", error);
      }
    }
    return "/assets/brand/je-inspi-logo-transparent.png";
  };

  // Get product name
  const getProductName = (item: WishlistItem): string => {
    if (item.jewellery) {
      return item.jewellery.name;
    } else if (item.diamondProduct) {
      return item.diamondProduct.name;
    }
    return "Unknown Product";
  };

  // Get product price
  const getProductPrice = (item: WishlistItem): number => {
    if (item.jewellery) {
      return item.jewellery.basePrice || 0;
    } else if (item.diamondProduct) {
      return item.diamondProduct.price || 0;
    }
    return 0;
  };

  // Get product SKU
  const getProductSku = (item: WishlistItem): string => {
    if (item.jewellery) {
      return item.jewellery.sku;
    } else if (item.diamondProduct) {
      return item.diamondProduct.sku;
    }
    return "";
  };

  // Get product details for display
  const getProductDetails = (item: WishlistItem): string => {
    if (item.jewellery) {
      return item.jewellery.description || "";
    } else if (item.diamondProduct) {
      const details = [];
      if (item.diamondProduct.shape) details.push(item.diamondProduct.shape);
      if (item.diamondProduct.weight) details.push(`${item.diamondProduct.weight}ct`);
      if (item.diamondProduct.color) details.push(item.diamondProduct.color);
      if (item.diamondProduct.clarity) details.push(item.diamondProduct.clarity);
      return details.join(" ");
    }
    return "";
  };

  // Get product type for display
  const getProductType = (item: WishlistItem): string => {
    if (item.jewellery) {
      return "Jewellery";
    } else if (item.diamondProduct) {
      return "Diamond";
    }
    return "";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ShreejiLoader size="small" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-xl font-semibold text-brand-800 mb-2">Your Wishlist is Empty</h3>
        <p className="text-brand-600 mb-4">Add items to your wishlist to see them here</p>
        <button
          onClick={() => router.push("/jewellery")}
          className="px-6 py-2 bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 text-white rounded-full hover:shadow-lg transition-all"
        >
          Browse Jewellery
        </button>
      </div>
    );
  }

  return (
    <div className={`${garamond.className}`}>
      <h2 className="text-2xl font-bold mb-6 text-brand-900">Wishlist</h2>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => {
          const firstImage = getFirstImage(item);
          const productName = getProductName(item);
          const productPrice = getProductPrice(item);
          const productSku = getProductSku(item);
          const productType = getProductType(item);
          const productDetails = getProductDetails(item);

          return (
            <div
              key={item.id}
              className="relative bg-white border border-[#526f4d] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Type Badge */}
              <div className="absolute top-3 left-3 z-10 bg-white rounded-full px-3 py-1 shadow-md">
                <span className="text-xs font-semibold text-brand-800">{productType}</span>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(item.id, item)}
                disabled={deletingId === item.id}
                className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-brand-50 transition-colors cursor-pointer"
                aria-label="Remove from wishlist"
              >
                {deletingId === item.id ? (
                  <div className="w-5 h-5 border-2 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
                ) : (
                  <IoTrashOutline className="w-5 h-5 text-brand-700" />
                )}
              </button>

              {/* Product Image */}
              <div className="relative w-full h-48 bg-brand-50">
                <Image
                  src={firstImage}
                  alt={productName}
                  fill
                  className="object-contain"
                  // sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-base font-bold text-brand-900 mb-1 truncate">
                  {productName}
                </h3>
                <p className="text-sm text-brand-700 mb-1">
                  SKU: {productSku}
                </p>
                {productDetails && (
                  <p className="text-sm text-brand-600 mb-2 truncate">
                    {productDetails}
                  </p>
                )}
                <p className="text-lg font-semibold text-brand-900 mb-3">
                  {productPrice > 0 ? `$${productPrice.toFixed(2)}` : 'Price not available'}
                </p>

                {/* Move to Cart Button */}
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full py-2 px-4 bg-[#73796f] text-white rounded-md hover:bg-[#73796f] transition-colors font-medium cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center items-center py-8">
          {loadingMore && <ShreejiLoader size="small" text="Loading more..." />}
        </div>
      )}
    </div>
  );
};

export default WishlistContent;
