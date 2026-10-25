"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  jewelleryAPI,
  Product,
  ProductFilters,
} from "@/src/services/jewellery.api";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { garamond } from "@/src/common/helper";
import LoginModal from "../auth/LoginModal";
import Loader from "../common/loader";
import NoProductsFound from "./no-products-found";

interface JewelleryProductListProps {
  filters?: ProductFilters;
  onFilterChange?: (filters: ProductFilters) => void;
  onAvailableDataChange?: (sizes: number[], shapes: string[]) => void;
}

const JewelleryProductList: React.FC<JewelleryProductListProps> = ({
  filters = {},
  onFilterChange,
  onAvailableDataChange,
}) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [marketingImages, setMarketingImages] = useState<string[][]>([]);

  // Fetch products from API
  const fetchProducts = useCallback(
    async (currentSkip: number, isInitial = false) => {
      try {
        setLoading(true);
        const response = await jewelleryAPI.getAllProduct({
          ...filters,
          skip: currentSkip,
          take: 12,
        });

        if (isInitial) {
          setProducts(response.list);
          
          // Set marketing images from API response
          if (response.categoryMarketingImages && response.categoryMarketingImages.length > 0) {
            setMarketingImages(response.categoryMarketingImages);
          } else {
            setMarketingImages([]);
          }

          // Pass available sizes and shapes to parent component
          if (onAvailableDataChange) {
            onAvailableDataChange(
              response.availableSizes,
              response.availableShapes
            );
          }
        } else {
          // Append new products, avoiding duplicates
          setProducts((prev) => {
            const existingIds = new Set(prev.map(p => p.id));
            const newProducts = response.list.filter(p => !existingIds.has(p.id));
            return [...prev, ...newProducts];
          });
        }

        setHasMore(response.hasMany);
        setSkip(currentSkip);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    },
    [JSON.stringify(filters)]
  );

  // Initial load
  useEffect(() => {
    fetchProducts(0, true);
  }, [fetchProducts]);

  // Handle infinite scroll for authenticated users
  useEffect(() => {
    // Only allow infinite scroll for authenticated users
    if (!isAuthenticated || !hasMore || loading) return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        // Calculate next skip based on current products length
        const nextSkip = products.length;
        fetchProducts(nextSkip, false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, products.length, fetchProducts, isAuthenticated]);

  // Handle product click
  const handleProductClick = (productId: string) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    router.push(`/jewellery/product-detail?id=${productId}`);
  };

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    router.push(`/jewellery/${categoryId}`);
  };

  // Toggle wishlist
  const toggleWishlist = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    // Update UI immediately for better user experience
    const updatedProducts = products.map((p) =>
      p.id === product.id ? { ...p, isWishlisted: !p.isWishlisted } : p
    );
    setProducts(updatedProducts);

    // Update wishlist state
    const newWishlist = new Set(wishlist);
    if (product.isWishlisted) {
      newWishlist.delete(product.id);
    } else {
      newWishlist.add(product.id);
    }
    setWishlist(newWishlist);

    // Call API in background
    try {
      if (product.isWishlisted) {
        await jewelleryAPI.removeProductFromWishList(product.id);
      } else {
        await jewelleryAPI.markProductInWishList(product.id);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      // Revert UI state on error
      const revertedProducts = products.map((p) =>
        p.id === product.id ? { ...p, isWishlisted: product.isWishlisted } : p
      );
      setProducts(revertedProducts);

      const revertedWishlist = new Set(wishlist);
      if (product.isWishlisted) {
        revertedWishlist.add(product.id);
      } else {
        revertedWishlist.delete(product.id);
      }
      setWishlist(revertedWishlist);
    }
  };

  // Generate product grid with marketing image in zig-zag pattern
  const renderProductGrid = () => {
    const gridItems: JSX.Element[] = [];
    let productIndex = 0;
    let marketingImageIndex = 0;

    // Process all products and insert marketing images
    while (productIndex < products.length) {
      // Add marketing image at the 5th position and after every 12 products (positions 5, 17, 29, etc.)
      // For first marketing image: show if initial load has 12 products
      // For subsequent marketing images: only show if there are at least 12 products remaining
      const isFirstMarketingImage = productIndex === 4;
      const shouldShowMarketingImage = isFirstMarketingImage 
        ? products.length >= 12  // First image: show if total products >= 12
        : products.length - productIndex >= 12; // Subsequent images: show if enough remaining

      if ((productIndex === 4 || (productIndex > 4 && (productIndex - 4) % 12 === 0)) && 
          marketingImages.length > 0 && 
          shouldShowMarketingImage) {
        const marketingImageSet = marketingImages[marketingImageIndex % marketingImages.length];

        if (marketingImageSet && marketingImageSet.length > 0) {
          // Use the first image from the set
          const marketingImg = marketingImageSet[0];
          
          // Validate marketing image URL
          const getValidMarketingImageUrl = (image: any): string => {
            if (!image || typeof image !== 'string' || image.trim() === '' || image === 'null' || image === 'undefined' || image === 'h') {
              return "/assets/home/collection/Rings.svg";
            }
            return image;
          };

          const validMarketingImg = getValidMarketingImageUrl(marketingImg);

          // Zig-zag pattern: alternate between left and right positioning
          const isLeftPosition = marketingImageIndex % 2 === 0;

          // Add marketing image with proper grid positioning
          gridItems.push(
            <div
              key={`marketing-${productIndex}`}
              className={`
                ${isLeftPosition 
                  ? 'md:col-start-1 md:col-span-2 md:row-span-2' 
                  : 'md:col-start-3 md:col-span-2 md:row-span-2'
                }
                col-span-1 row-span-1 
                relative overflow-hidden
              `}
            >
              <Image
                src={validMarketingImg}
                alt="Marketing"
                width={600}
                height={600}  
                className="w-full h-full object-cover"
                priority={productIndex < 24}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/brand/je-inspi-logo-transparent.png";
                }}
              />
            </div>
          );

          // Add 8 products around the marketing image
          const productsToShow = Math.min(8, products.length - productIndex);
          for (let i = 0; i < productsToShow; i++) {
            if (productIndex < products.length) {
              gridItems.push(renderProductCard(products[productIndex], productIndex));
              productIndex++;
            }
          }

          marketingImageIndex++;
          continue; // Skip the regular product addition for this iteration
        }
      }

      // Add regular product card
      gridItems.push(renderProductCard(products[productIndex], productIndex));
      productIndex++;
    }

    return gridItems;
  };

  // Helper function to normalize images data
  const normalizeImages = (images: any): Array<{color: string, image: string}> => {
    if (!images) return [];
    
    // If it's already an array, return as is
    if (Array.isArray(images)) {
      return images;
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Failed to parse images JSON:', error);
        return [];
      }
    }
    
    return [];
  };

  // Render individual product card
  const renderProductCard = (product: Product, index: number) => {
    const normalizedImages = normalizeImages(product.images);
    const mainImage =
      normalizedImages.length > 0
        ? normalizedImages[0].image
        : "/assets/brand/je-inspi-logo-transparent.png"; // assets/jewellery/product-sample.svg
    const isInWishlist = product.isWishlisted;

    const userDiscount = user?.discount || 0;
    const discountAmount = (product.basePrice * userDiscount) / 100;
    const discountedPrice = product.basePrice - discountAmount;

    return (
      <div
        key={product.id}
        className="border-r-[2px] border-b-[2px] border-black p-4 flex flex-col justify-center items-start text-center relative cursor-pointer hover:shadow-lg transition-shadow duration-300"
        onClick={() => handleProductClick(product.id)}
      >
        {/* Wishlist Icon */}
        {isAuthenticated && (
          <div
            onClick={(e) => toggleWishlist(e, product)}
            className="absolute top-3 right-3 z-10 cursor-pointer"
          >
            {isInWishlist ? (
              <IoHeart className="h-[25px] w-[25px] text-red-500 hover:scale-110 transition-transform" />
            ) : (
              <IoHeartOutline className="h-[25px] w-[25px] text-brand-900 hover:scale-110 transition-transform" />
            )}
          </div>
        )}

        {/* Product Image */}
        <div className="w-full h-72 flex items-center justify-center mb-4 mt-6">
          <Image
            src={mainImage || "/assets/brand/je-inspi-logo-transparent.png"}
            alt={product.name}
            width={150}
            height={150}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Details */}
        <div className="mt-2 text-start w-full">
          <h3 className="uppercase text-[18px] text-[#526f4d] font-[500] line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[14px] text-brand-700">{product.sku}</p>
          {product.basePrice > 0 ? (
            isAuthenticated && userDiscount > 0 ? (
              <div className="flex items-center gap-3">
                {/* Discounted Price */}
                <p className="text-[22px] font-[500] text-brand-900">
                  ${discountedPrice.toLocaleString()}
                </p>

                {/* Original Price */}
                <p className="text-[16px] font-[400] line-through text-brand-400">
                  ${product.basePrice.toLocaleString()}
                </p>

                {/* User Discount */}
                <p className="text-[14px] font-[500] text-brand-600">
                  {userDiscount}% OFF
                </p>
              </div>
            ) : (
              <p className="text-[20px] font-[400]">
                ${product.basePrice.toLocaleString()}
              </p>
            )
          ) : (
            <p className="text-[16px] text-brand-400">Price after Inquiry</p>
          )}
        </div>
      </div>
    );
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Show NoProductsFound component when there are no products
  if (!loading && products.length === 0) {
    return (
      <NoProductsFound
        title="No Products Found"
        message="We couldn't find any products matching your criteria. Try adjusting your filters or browse our other collections."
      />
    );
  }

  return (
    <>
      <div className={`space-y-6 border-0 mx-5 ${garamond.className}`}>
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 border-t-[2px] border-l-[2px] border-black">
          {renderProductGrid()}
        </div>

        {/* Load more button */}
        {hasMore && products.length > 0 && (
          <div className="flex justify-center py-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  const nextSkip = products.length;
                  fetchProducts(nextSkip, false);
                }}
                disabled={loading}
                className="px-8 py-3 border-none text-brand-400 bg-transparent rounded-md hover:bg-black hover:text-white transition-colors duration-300 font-medium uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-8 py-3 border-none bg-transparent text-brand-400 rounded-md hover:bg-black hover:text-white transition-colors duration-300 font-medium uppercase tracking-wide"
              >
                Scroll to view next
              </button>
            )}
          </div>
        )}

        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false);
            router.push("/register");
          }}
        />
      </div>
      {/* No more products message */}
      {!hasMore && products.length > 0 && (
        <div className="text-center pt-10 text-brand-600">
          No more products to load
        </div>
      )}
    </>
  );
};

export default JewelleryProductList;
