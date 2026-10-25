"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { garamond } from "@/src/common/helper";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { PiHandbag } from "react-icons/pi";
import { IoIosArrowBack, IoIosArrowForward, IoIosPlay } from "react-icons/io";
import { Select, Button, Radio, Input, message } from "antd";
import Navbar from "../common/navbar";
import Footer from "../common/footer";
import Loader from "../common/loader";
import { jewelleryAPI, Product, Gem } from "@/src/services/jewellery.api";
import { cartAPI } from "@/src/services/cart.api";
import { MATERIALS_OPTION } from "@/src/libs/constants";
import { useAuth } from "@/src/contexts/AuthContext";
import LoginModal from "../auth/LoginModal";
import { FiShoppingCart } from "react-icons/fi";
import OrderConfirmationModal from "../order/order-confirmation-modal";
import { authHelper } from "@/src/libs/helper";
import { BsPatchQuestion } from "react-icons/bs";
import { diamondAPI, DesignRequest } from "@/src/services/diamond.api";

const MATERIAL_OPTION_TO_MATERIAL_MAP: Record<string, string> = {
  silver: "SILVER",
  tenKtGold: "TEN_KT_GOLD",
  forteenKtGold: "FORTEEN_KT_GOLD",
  eighteenKtGold: "EIGHTEEN_KT_GOLD",
};

const ProductDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const productId = searchParams.get("id") || "";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("WHITE");
  const [selectedDiamondWeight, setSelectedDiamondWeight] = useState<
    number | null
  >(null);
  const [includeCertificate, setIncludeCertificate] = useState<boolean>(false);
  const [userDiscount, setUserDiscount] = useState<number | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpecificationSKU, setSelectedSpecificationSKU] =
    useState<string>("");
  const { hoveredItem } = useAuth();
  const [isAutoSwiping, setIsAutoSwiping] = useState(true);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const response = await jewelleryAPI.getProductById(productId);
        setProduct(response);

        // Set default values from the first variant if available
        if (response.jewelleryVariant && response.jewelleryVariant.length > 0) {
          const firstVariant = response.jewelleryVariant[0];

          // Check if size is applicable (if there are multiple sizes or size > 0)
          const hasSizeVariations = response.jewelleryVariant.some(
            (v: any) => v.size && v.size > 0
          );

          if (hasSizeVariations) {
            setSelectedSize(firstVariant.size);
          } else {
            // For jewellery without size variations (like earrings), set size to 0
            setSelectedSize(0);
          }

          // Set default material to the first available material for this product
          const availableMaterialsForProduct = MATERIALS_OPTION.filter(material =>
            response.jewelleryVariant.some((variant: any) => {
              const materialProperty = material.value === "silver" ? "silver" :
                material.value === "tenKtGold" ? "tenKtGold" :
                  material.value === "forteenKtGold" ? "forteenKtGold" :
                    material.value === "eighteenKtGold" ? "eighteenKtGold" : null;
              return materialProperty ? variant[materialProperty] > 0 : false;
            })
          );

          if (availableMaterialsForProduct.length > 0) {
            setSelectedMaterial(availableMaterialsForProduct[0].value);
          }

          if (firstVariant.totalGemWeight && firstVariant.totalGemWeight > 0) {
            setSelectedDiamondWeight(firstVariant.totalGemWeight);
          }
          setIsWishlisted(response.whishlist);
        }

        // Fetch related products
        await fetchRelatedProducts(response.typeId, response.id);
      } catch (error) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (
      typeId: string,
      excludeProductId: string
    ) => {
      try {
        const user = authHelper.getUserData();
        const response = await jewelleryAPI.getAllProduct({
          skip: 0,
          take: 5,
          userId: user?.id,
        });
        // Filter out the current product
        const filteredProducts = response.list.filter(
          (p) => p.id !== excludeProductId
        );
        setRelatedProducts(filteredProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  // Get all product images from API data
  const productImages: any = product?.images || [];
  const allImageUrls = productImages.map((img: any) => img.image);

  // Get unique colors from images
  const availableColors: any = product?.images
    ? [...new Set(product?.images?.map((img: any) => img.color))]
    : [];

  // Set default selected color (first color) if not already set
  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors, selectedColor]);

  // Find first image index of selected color
  const findFirstImageIndexForColor = (color: string) => {
    const firstImageOfColor = productImages.find((img: any) => img.color === color);
    return firstImageOfColor ? allImageUrls.indexOf(firstImageOfColor.image) : 0;
  };

  // Jump to first image of selected color when color changes
  useEffect(() => {
    if (selectedColor && productImages.length > 0) {
      const firstIndex = findFirstImageIndexForColor(selectedColor);
      setCurrentImageIndex(firstIndex);
    }
  }, [selectedColor]);

  // Auto-scroll thumbnail to show selected image
  useEffect(() => {
    if (thumbnailContainerRef.current && allImageUrls.length > 0) {
      const container = thumbnailContainerRef.current;
      const thumbnailElements = container.querySelectorAll('button');
      const selectedThumbnail = thumbnailElements[currentImageIndex] as HTMLElement;

      if (selectedThumbnail) {
        const containerWidth = container.clientWidth;
        const thumbnailLeft = selectedThumbnail.offsetLeft;
        const thumbnailWidth = selectedThumbnail.offsetWidth;
        const scrollLeft = thumbnailLeft - (containerWidth - thumbnailWidth) / 2;

        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentImageIndex, allImageUrls.length]);

  // Auto-swiping functionality
  useEffect(() => {
    if (!isAutoSwiping || allImageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImageUrls.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoSwiping, allImageUrls.length]);

  // Touch handling for swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePrevImage();
    }
  };

  // Check if a URL is a video file
  const isVideoUrl = (url: string) => {
    return (
      url &&
      (url.includes(".mp4") || url.includes(".webm") || url.includes(".mov"))
    );
  };

  // Helper function to check if a material is available for a variant
  const isMaterialAvailable = (variant: any, material: string): boolean => {
    const materialProperty = material === "silver" ? "silver" :
      material === "tenKtGold" ? "tenKtGold" :
        material === "forteenKtGold" ? "forteenKtGold" :
          material === "eighteenKtGold" ? "eighteenKtGold" : null;

    return materialProperty ? variant[materialProperty] > 0 : false;
  };

  // Get available materials based on current selections
  const getAvailableMaterials = () => {
    if (!product?.jewelleryVariant) return [];

    const materials: typeof MATERIALS_OPTION = [];

    // Filter variants by selected size only
    let relevantVariants = product.jewelleryVariant;

    if (selectedSize !== null && selectedSize !== 0) {
      relevantVariants = relevantVariants.filter(v => v.size === selectedSize);
    }

    // Check which materials are available in relevant variants (exclude those with 0 weight)
    MATERIALS_OPTION.forEach(material => {
      const isAvailable = relevantVariants.some(variant => {
        const materialProperty = material.value === "silver" ? "silver" :
          material.value === "tenKtGold" ? "tenKtGold" :
            material.value === "forteenKtGold" ? "forteenKtGold" :
              material.value === "eighteenKtGold" ? "eighteenKtGold" : null;

        return materialProperty ? variant[materialProperty] > 0 : false;
      });

      if (isAvailable) {
        materials.push(material);
      }
    });

    return materials;
  };

  // Get available sizes based on current selections
  const getAvailableSizes = () => {
    if (!product?.jewelleryVariant) return [];

    const sizes = new Set<number>();
    let hasZeroSize = false;

    // Collect all unique sizes from all variants (no filtering)
    product.jewelleryVariant.forEach(variant => {
      if (variant.size && variant.size > 0) {
        sizes.add(variant.size);
      } else if (variant.size === 0) {
        hasZeroSize = true;
      }
    });

    const sortedSizes = Array.from(sizes).sort((a, b) => a - b);

    // Add size 0 at the beginning if it exists
    if (hasZeroSize) {
      sortedSizes.unshift(0);
    }

    return sortedSizes;
  };

  // Get available diamond weights based on current selections
  const getAvailableDiamondWeights = () => {
    if (!product?.jewelleryVariant) return [];

    const weights = new Set<number>();

    // Filter variants by selected size first
    let relevantVariants = product.jewelleryVariant;

    // Filter by size if selected
    if (selectedSize !== null && selectedSize !== 0) {
      relevantVariants = relevantVariants.filter(v => v.size === selectedSize);
    }

    // Filter by material if selected
    if (selectedMaterial) {
      relevantVariants = relevantVariants.filter(variant =>
        isMaterialAvailable(variant, selectedMaterial)
      );
    }

    // Collect total gem weights from each variant
    relevantVariants.forEach(variant => {
      if (variant.totalGemWeight && variant.totalGemWeight > 0) {
        weights.add(variant.totalGemWeight);
      }
    });

    return Array.from(weights).sort((a, b) => a - b);
  };

  // Get available sizes from variants (legacy - for backward compatibility)
  const availableSizes =
    product?.jewelleryVariant
      ?.map((variant) => variant.size)
      .filter((size) => size && size > 0) || [];

  // Get dynamic available sizes based on current selections
  const dynamicAvailableSizes = getAvailableSizes();
  const availableMaterials = getAvailableMaterials();
  const availableDiamondWeights = getAvailableDiamondWeights();

  // For variant selection, handle both cases: with size and without size
  const selectedVariant: any =
    selectedSize === 0
      ? product?.jewelleryVariant?.[0] // For size-less jewellery, use first variant
      : product?.jewelleryVariant?.find(
        (variant) => {
          // First match by size
          if (variant.size !== selectedSize) return false;

          // If diamond weight is selected, also match by total gem weight
          if (selectedDiamondWeight !== null) {
            return variant.totalGemWeight === selectedDiamondWeight;
          }

          // If no diamond weight selected, return first variant with matching size
          return true;
        }
      );

  const gemDetails = selectedVariant?.gem || [];

  // Get measurements from selected variant
  const measurements = selectedVariant?.mesurement || {};

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImageUrls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === allImageUrls.length - 1 ? 0 : prev + 1
    );
  };


  const handleAddToCart = async () => {
    // Check authentication
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    // Validate required fields
    if (!product) {
      message.error("Product not found");
      return;
    }
    if (!selectedSize && selectedSize !== 0) {
      message.error("Please select a size");
      return;
    }
    if (!selectedMaterial) {
      message.error("Please select a material");
      return;
    }
    if (!selectedColor) {
      message.error("Please select a color");
      return;
    }
    if (!selectedVariant) {
      message.error("Selected variant not found");
      return;
    }

    const material = MATERIAL_OPTION_TO_MATERIAL_MAP[selectedMaterial];

    setAddingToCart(true);
    try {
      const cartData = {
        jewelleryId: productId,
        variantId: selectedVariant.id,
        quantity: quantity,
        selectedColor: selectedColor,
        selectedSize: selectedSize || 0, // Ensure size is always sent, 0 for not applicable
        material: material,
        includeCertificate: includeCertificate,
        sku: selectedSpecificationSKU || "",
      };

      const response = await cartAPI.addToCart(cartData);

      message.success("Product added to cart successfully!");
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      console.error("Error response:", error?.response);
      message.error(
        error?.response?.data?.message ||
        "Failed to add to cart. Please try again."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    // Update UI immediately for better user experience
    const newWishlistedState = !isWishlisted;
    setIsWishlisted(newWishlistedState);

    // Call API in background
    try {
      if (newWishlistedState) {
        await jewelleryAPI.markProductInWishList(productId);
      } else {
        await jewelleryAPI.removeProductFromWishList(productId);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      // Revert UI state on error
      setIsWishlisted(!newWishlistedState);
    }
  };

  const handleCustomDesign = () => {
    router.push(`/diamond/custom`);
  };

  const handleInquiry = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!product) {
      message.error("Product not found");
      return;
    }

    setInquiryLoading(true);
    try {
      // Prepare the inquiry data
      const inquiryData: DesignRequest = {
        inquiresFor: [product.name],
        description: `I am interested in the following product: ${product.name}`,
        referenceImages: [],
        referenceLinks: [],
        title: user?.title || "Mr",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        countryCode: user?.countryCode || "+1",
        mobile: user?.mobile || "",
        streetAddress: user?.address || "",
        city: user?.city || "",
        postalCode: user?.postalCode || "",
        country: user?.country || "",
      };

      const response = await diamondAPI.submitDesignRequest(inquiryData);

      if (response) {
        message.success(
          response.message ||
          "Your inquiry has been submitted successfully! We'll get back to you soon."
        );
      } else {
        throw new Error(response || "Failed to submit inquiry");
      }
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      message.error(
        error.message || "Failed to submit inquiry. Please try again."
      );
    } finally {
      setInquiryLoading(false);
    }
  };

  console.log('calculatedPrice ====>', calculatedPrice)

  // Get user payment mode from localStorage
  const getUserPaymentMode = () => {
    // Check if we're on the client side
    if (typeof window === "undefined") {
      return "online"; // Default fallback for SSR
    }

    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        return parsedData.paymentMode || "PAYMENT_CYCLE"; // Default to 'online' if not found
      }
    } catch (error) {
      console.error("Error fetching user payment mode:", error);
    }
    return "online"; // Default fallback
  };

  const paymentMode = getUserPaymentMode();

  const calculatePrice = async () => {
    if (!selectedVariant || !selectedMaterial) return;

    setPriceLoading(true);
    try {
      const response: any = await jewelleryAPI.getPriceByMaterial(
        selectedVariant.id,
        selectedMaterial,
        includeCertificate,
        selectedDiamondWeight || undefined
      );

      if (response) {
        setCalculatedPrice(response.finalPrice);
        setUserDiscount(
          parseFloat(Number(response.discountedPrice).toFixed(2))
        );
      } else {
        // Fallback to base price if no breakdown in response
        setCalculatedPrice(selectedVariant.basePrice);
        setUserDiscount(selectedVariant.basePrice);
      }
    } catch (error) {
      console.error("Failed to calculate price:", error);
      // Fallback to base price if API fails
      setCalculatedPrice(selectedVariant.basePrice);
      setUserDiscount(selectedVariant.basePrice);
    } finally {
      setPriceLoading(false);
    }
  };

  // Generate SKU based on selected specifications
  const generateSKU = () => {
    if (!product || !selectedVariant) return "";

    // Get material code
    let materialCode = "";
    switch (selectedMaterial) {
      case "silver":
        materialCode = "925SS";
        break;
      case "tenKtGold":
        materialCode = "10KG";
        break;
      case "forteenKtGold":
        materialCode = "14KG";
        break;
      case "eighteenKtGold":
        materialCode = "18KG";
        break;
      default:
        materialCode = "";
    }

    // Get color code (first character, uppercase)
    const colorCode = selectedColor
      ? selectedColor.charAt(0).toUpperCase()
      : "";

    // Get size
    const size = selectedSize ? selectedSize.toString() : "";

    // Get diamond origin code (first character, uppercase)
    const diamondOriginCode = selectedVariant.gemOrigin
      ? selectedVariant.gemOrigin.charAt(0).toUpperCase()
      : "";

    // Get diamond weight (use selected diamond weight with decimal points preserved)
    const diamondWeight = selectedDiamondWeight
      ? selectedDiamondWeight.toString()
      : "";

    // Get certificate suffix
    const certificateSuffix = includeCertificate ? "C" : "";

    // Combine all parts
    return `${product.sku || ""
      }${materialCode}${colorCode}${size}${diamondOriginCode}${diamondWeight}${certificateSuffix}`;
  };

  // Update SKU when relevant selections change
  useEffect(() => {
    if (selectedVariant && selectedMaterial) {
      setSelectedSpecificationSKU(generateSKU());
      calculatePrice();
    }
  }, [
    selectedVariant,
    selectedMaterial,
    selectedColor,
    selectedSize,
    selectedDiamondWeight,
    includeCertificate,
    product,
  ]);

  // Reset dependent selections when material changes
  useEffect(() => {
    if (!product?.jewelleryVariant) return;

    // Check if current size is still available with new material
    if (selectedSize !== null && selectedSize !== 0) {
      const newAvailableSizes = getAvailableSizes();
      if (!newAvailableSizes.includes(selectedSize)) {
        // Reset size to first available or null
        setSelectedSize(newAvailableSizes.length > 0 ? newAvailableSizes[0] : null);
      }
    }

    // Check if current diamond weight is still available with new material
    if (selectedDiamondWeight !== null) {
      const newAvailableWeights = getAvailableDiamondWeights();
      if (!newAvailableWeights.includes(selectedDiamondWeight)) {
        // Reset diamond weight to first available or null
        setSelectedDiamondWeight(newAvailableWeights.length > 0 ? newAvailableWeights[0] : null);
      }
    }
  }, [selectedMaterial, product]);

  // Reset dependent selections when size changes
  useEffect(() => {
    if (!product?.jewelleryVariant) return;

    // Always get available materials for new size
    const newAvailableMaterials = getAvailableMaterials();

    if (newAvailableMaterials.length > 0) {
      // Always set to first available material for new size
      const firstAvailableMaterial = newAvailableMaterials[0].value;
      setSelectedMaterial(firstAvailableMaterial);
    } else {
      // No materials available for this size
      setSelectedMaterial("");
    }

    // Check if current diamond weight is still available with new size
    const newAvailableWeights = getAvailableDiamondWeights();
    if (selectedDiamondWeight !== null && !newAvailableWeights.includes(selectedDiamondWeight)) {
      setSelectedDiamondWeight(newAvailableWeights.length > 0 ? newAvailableWeights[0] : null);
    }
  }, [selectedSize, product]);

  // Reset dependent selections when diamond weight changes
  useEffect(() => {
    if (!product?.jewelleryVariant) return;

    // Check if current size is still available with new diamond weight
    if (selectedSize !== null && selectedSize !== 0) {
      const newAvailableSizes = getAvailableSizes();
      if (!newAvailableSizes.includes(selectedSize)) {
        setSelectedSize(newAvailableSizes.length > 0 ? newAvailableSizes[0] : null);
      }
    }

    // Check if current material is still available with new diamond weight
    if (selectedMaterial) {
      const newAvailableMaterials = getAvailableMaterials();
      const materialStillAvailable = newAvailableMaterials.some(m => m.value === selectedMaterial);
      if (!materialStillAvailable) {
        setSelectedMaterial(newAvailableMaterials.length > 0 ? newAvailableMaterials[0].value : "");
      }
    }
  }, [selectedDiamondWeight, product]);

  // State for related products wishlist
  const [relatedWishlist, setRelatedWishlist] = useState<Set<string>>(
    new Set()
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  // Toggle wishlist for related products
  const toggleRelatedWishlist = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    // Update UI immediately for better user experience
    const isCurrentlyWishlisted = relatedWishlist.has(product.id);
    const newWishlist = new Set(relatedWishlist);

    if (isCurrentlyWishlisted) {
      newWishlist.delete(product.id);
      try {
        await jewelleryAPI.removeProductFromWishList(product.id);
      } catch (error) {
        console.error("Failed to remove from wishlist:", error);
        newWishlist.add(product.id); // Revert on error
      }
    } else {
      newWishlist.add(product.id);
      try {
        await jewelleryAPI.markProductInWishList(product.id);
      } catch (error) {
        console.error("Failed to add to wishlist:", error);
        newWishlist.delete(product.id); // Revert on error
      }
    }

    setRelatedWishlist(newWishlist);
  };

  if (loading) {
    return (
      <div className={`w-full min-h-screen bg-white ${garamond.className}`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="small" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={`w-full min-h-screen bg-white ${garamond.className}`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-medium mb-4">Product not found</h2>
            <button
              onClick={() => router.push("/jewellery")}
              className="text-brand-900 underline hover:no-underline"
            >
              Back to Jewellery
            </button>
          </div>
        </div>
      </div>
    );
  }

  const DISPLAY_COLORS = ["WHITE", "YELLOW", "ROSE"];

  const colorsToShow =
    availableColors.length > 0
      ? availableColors.filter((color: any) => DISPLAY_COLORS.includes(color))
      : DISPLAY_COLORS;

  const discount = user?.discount || 0;
  const discountAmount = discount > 0 ? (product.basePrice * discount) / 100 : 0;
  const discountedPrice = discount > 0 ? product.basePrice - discountAmount : product.basePrice;

  return (
    <div className={`w-full min-h-screen bg-white ${garamond.className}`}>
      {/* Navbar */}
      <div className="relative">
        <Navbar />
      </div>
      <div
        className={`${hoveredItem !== null ? "blur-[4px] bg-brand-200" : ""} `}
      >
        {/* Breadcrumb */}
        <div className="px-8 py-4 text-sm text-brand-700">
          <span
            className="cursor-pointer hover:text-brand-900"
            onClick={() => router.push("/")}
          >
            Home
          </span>
          <span className="mx-2">/</span>
          <span
            className="cursor-pointer hover:text-brand-900"
            onClick={() => router.push("/jewellery")}
          >
            Jewellery
          </span>
          <span className="mx-2">/</span>
          <span className="text-brand-900">
            {product.type?.name || product.category?.name || "Jewellery"}
          </span>
        </div>

        {/* Main Product Section */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div
                className="relative aspect-square bg-brand-50 rounded-lg overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseEnter={() => setIsAutoSwiping(false)}
                onMouseLeave={() => setIsAutoSwiping(true)}
              >
                {isVideoUrl(allImageUrls[currentImageIndex]) ? (
                  <video
                    src={allImageUrls[currentImageIndex]}
                    className="w-full h-full object-contain"
                    playsInline
                    muted
                    autoPlay
                    loop
                    controls={false}
                  />
                ) : (
                  <Image
                    src={
                      allImageUrls.length > 0
                        ? allImageUrls[currentImageIndex]
                        : "/assets/brand/je-inspi-wordmark.png"
                    }
                    alt={product.name || "Product"}
                    fill
                    className="object-contain"
                    priority
                  />
                )}

                {/* Navigation Arrows - Hidden on mobile */}
                {allImageUrls.length > 1 && (
                  <>
                    {" "}
                    <button
                      onClick={handlePrevImage}
                      className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                    >
                      <IoIosArrowBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                    >
                      <IoIosArrowForward className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Wishlist Icon */}
                {isAuthenticated && (
                  <div
                    onClick={handleWishlistToggle}
                    className="absolute top-4 right-4 z-10 cursor-pointer"
                  >
                    {isWishlisted ? (
                      <IoHeart className="h-[25px] w-[25px] text-red-500 hover:scale-110 transition-transform" />
                    ) : (
                      <IoHeartOutline className="h-[25px] w-[25px] text-brand-900 hover:scale-110 transition-transform" />
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div ref={thumbnailContainerRef} className="flex space-x-2 w-full overflow-x-auto flex-nowrap"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                {allImageUrls.map((img: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${currentImageIndex === index
                      ? "border-black"
                      : "border-brand-100 hover:border-brand-400"
                      }`}
                  >
                    {isVideoUrl(img) ? (
                      <video
                        src={img}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        autoPlay
                        controls={false}
                      />
                    ) : (
                      <Image
                        src={img}
                        alt={`Product view ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    )}
                    {/* Video indicator overlay */}
                    {isVideoUrl(img) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="bg-black/60 rounded-full p-1">
                          <IoIosPlay className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                    {/* Color indicator for thumbnails */}
                    {/* {productImages[index]?.color && (
                      <div className="absolute bottom-1 left-1 right-1 flex justify-center">
                        <div className={`w-4 h-4 rounded-full border border-brand-200 text-xs ${
                          productImages[index].color.toLowerCase() === "white"
                            ? "bg-[#f8f7f1] border-brand-400"
                            : productImages[index].color.toLowerCase() === "yellow"
                              ? "bg-[#FFE091]"
                              : "bg-[#F7C5AD]"
                        }`} title={productImages[index].color} />
                      </div>
                    )} */}
                  </button>
                ))}
              </div>

              <div>
                <p className="text-brand-800 leading-relaxed">
                  {product.description ||
                    "Diamond open wing ring in 18K recycled gold handcrafted with Phoenix lab grown diamonds."}
                </p>
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="space-y-6">
              {/* Product Title and Price */}
              <div className="border-b border-brand-100 pb-6">
                <h1 className="text-3xl font-medium text-brand-900 mb-2">
                  {product.name || "Product"}
                </h1>
                <p className="text-brand-700 mb-3 text-sm">
                  {product.sku || "SKU"} {" - "} (
                  {selectedSpecificationSKU || "SKU"})
                </p>
                <p className="text-4xl font-medium text-brand-900">
                  {priceLoading ? (
                    <span className="text-brand-400">Calculating...</span>
                  ) : (selectedVariant?.basePrice || product.basePrice || 0) >
                    0 ? (
                    isAuthenticated && userDiscount !== null && userDiscount > 0 ? (
                      <div className="flex items-center gap-3">
                        {/* Discounted Price */}
                        <span className="text-[22px] font-[500] text-brand-900">
                          ${userDiscount.toLocaleString()}
                        </span>

                        {/* Original Price */}
                        <span className="text-[16px] font-[400] line-through text-brand-400">
                          $
                          {(
                            calculatedPrice || product.basePrice
                          ).toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[20px] font-[400]">
                        $
                        {(
                          calculatedPrice || selectedVariant?.basePrice || product.basePrice
                        ).toLocaleString()}
                      </span>
                    )
                  ) : (
                    <span className="text-[16px] text-brand-400">
                      Price after Inquiry
                    </span>
                  )}

                  {/* {priceLoading ? (
                    <span className="text-brand-400">Calculating...</span>
                  ) : isAuthenticated && calculatedPrice !== null ? (
                    <div className="flex items-center gap-3">
                      <span className="text-[22px] font-[500] text-brand-900">
                        ${userDiscount}
                      </span>

                      <span className="text-[16px] font-[400] line-through text-brand-400">
                        ${calculatedPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[20px] font-[400]">
                      $
                      {(
                        selectedVariant?.basePrice ||
                        product.basePrice ||
                        0
                      ).toLocaleString()}
                    </span>
                  )} */}
                </p>
              </div>

              {/* Product Description */}
              {/* <p className="text-brand-800 leading-relaxed line-clamp-2">
                {product.description ||
                  "Diamond open wing ring in 18K recycled gold handcrafted with Phoenix lab grown diamonds."}
              </p> */}

              {/* Color Options - Always show, but handle empty case */}
              <div>
                <h3 className="text-lg font-medium mb-3">Color</h3>
                <div className="flex space-x-3">
                  {colorsToShow.map((color: any) => (
                    <div key={color} className="flex flex-col items-center">
                      <button
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-2 text-base transition-all duration-200 ${selectedColor === color
                          ? "border-black scale-110 shadow-lg"
                          : "border-brand-200 hover:border-brand-600"
                          } ${color.toLowerCase() === "white"
                            ? "bg-[#f8f7f1] border-brand-400"
                            : color.toLowerCase() === "yellow"
                              ? "bg-[#FFE091]"
                              : "bg-[#F7C5AD]"
                          }`}
                        title={color}
                      />
                      <span
                        className={`text-[10px] mt-1 ${selectedColor === color
                          ? "font-medium text-brand-900"
                          : "text-brand-700"
                          }`}
                      >
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {(dynamicAvailableSizes.length > 0 || availableSizes.length > 0) && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-brand-900">Size</h3>
                  <Select
                    value={selectedSize}
                    onChange={(value) => setSelectedSize(Number(value))}
                    className={`w-full ${garamond.className}`}
                    size="large"
                    placeholder="Select size"
                    options={(dynamicAvailableSizes.length > 0 ? dynamicAvailableSizes : availableSizes).map((size) => ({
                      value: size.toString(),
                      label: size === 0 ? "NA" : size.toString(),
                    }))}
                  />
                </div>
              )}

              {/* Material Selection */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-brand-900">Material</h3>
                <Select
                  value={selectedMaterial}
                  onChange={(value) => setSelectedMaterial(value)}
                  className={`w-full ${garamond.className}`}
                  size="large"
                  placeholder="Select material"
                  options={availableMaterials.length > 0 ? availableMaterials : MATERIALS_OPTION}
                />
              </div>

              {/* Diamond Weight Selection */}
              {availableDiamondWeights.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-brand-900">
                    Diamond Weight
                  </h3>
                  <Select
                    value={selectedDiamondWeight?.toString() || ""}
                    onChange={(value) =>
                      setSelectedDiamondWeight(Number(value))
                    }
                    className={`w-full ${garamond.className}`}
                    size="large"
                    placeholder="Select diamond weight"
                    options={availableDiamondWeights.map((weight: number) => ({
                      value: weight.toString(),
                      label: `${weight} ct`,
                    }))}
                  />
                </div>
              )}

              {/* Jewellery Certificate */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-brand-900">
                  Jewellery Certificate
                </h3>
                <Radio.Group
                  value={includeCertificate}
                  onChange={(e) => setIncludeCertificate(e.target.value)}
                  className="flex space-x-8"
                >
                  <Radio
                    value={true}
                    className={`text-base ${garamond.className}`}
                  >
                    Yes
                  </Radio>
                  <Radio
                    value={false}
                    className={`text-base ${garamond.className}`}
                  >
                    No
                  </Radio>
                </Radio.Group>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-brand-900">Quantity</h3>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) {
                      setQuantity(value);
                    }
                  }}
                  min={1}
                  className={`w-full ${garamond.className}`}
                  size="large"
                  placeholder="Enter quantity"
                />
              </div>

              {/* Action Buttons */}
              <div>
                {(paymentMode === "PAYMENT_CYCLE" && (product?.basePrice || product.basePrice > 0)) ? (
                  <div className="flex flex-col md:flex-row items-center md:space-x-2 gap-2 md:gap-0 w-full">
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => {
                        if (!isAuthenticated) {
                          setIsLoginModalOpen(true);
                          return;
                        }
                        if (
                          (!selectedSize && selectedSize !== 0) ||
                          !selectedMaterial ||
                          !selectedColor ||
                          !selectedVariant
                        ) {
                          message.error("Please select all required options");
                          return;
                        }
                        setIsOrderModalOpen(true);
                      }}
                      disabled={!product?.basePrice || product.basePrice <= 0}
                      className={`button-hover-effect !rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br cursor-pointer !border-0 shadow-inner !h-11 !px-10 w-full ${garamond.className}`}
                    >
                      <span>Place Order</span>
                      <PiHandbag className="w-5 h-5" />
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleAddToCart}
                      loading={addingToCart}
                      disabled={
                        addingToCart ||
                        !product?.basePrice ||
                        product.basePrice <= 0
                      }
                      className={`!rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br cursor-pointer !border-0 shadow-inner !h-11 !px-10 w-full ${garamond.className}`}
                    >
                      <span>{addingToCart ? "Adding..." : "Add to Cart"}</span>
                      {!addingToCart && <FiShoppingCart className="w-5 h-5" />}
                    </Button>
                  </div>
                ) : !product?.basePrice || product.basePrice <= 0 ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleInquiry}
                    loading={inquiryLoading}
                    className={`!rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br cursor-pointer !border-0 shadow-inner !h-11 !px-10 w-full ${garamond.className}`}
                  >
                    <span>{inquiryLoading ? "Submitting..." : "Inquiry"}</span>
                    {!inquiryLoading && <BsPatchQuestion className="w-5 h-5" />}
                  </Button>
                ) : (
                  <div className="flex flex-col md:flex-row items-center md:space-x-2 gap-2 md:gap-0 w-full">
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => {
                        if (!isAuthenticated) {
                          setIsLoginModalOpen(true);
                          return;
                        }
                        if (
                          (!selectedSize && selectedSize !== 0) ||
                          !selectedMaterial ||
                          !selectedColor ||
                          !selectedVariant
                        ) {
                          message.error("Please select all required options");
                          return;
                        }
                        setIsOrderModalOpen(true);
                      }}
                      disabled={!product?.basePrice || product.basePrice <= 0}
                      className={`!rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br cursor-pointer !border-0 shadow-inner !h-11 !px-10 w-full ${garamond.className}`}
                    >
                      <span>Buy Now</span>
                      <PiHandbag className="w-5 h-5" />
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleAddToCart}
                      loading={addingToCart}
                      disabled={
                        addingToCart ||
                        !product?.basePrice ||
                        product.basePrice <= 0
                      }
                      className={`!rounded-full !text-white !bg-gradient-to-r !from-brand-600 !via-brand-600 !to-brand-700 hover:!bg-gradient-to-br cursor-pointer !border-0 shadow-inner !h-11 !px-10 w-full ${garamond.className}`}
                    >
                      <span>{addingToCart ? "Adding..." : "Add to Cart"}</span>
                      {!addingToCart && <FiShoppingCart className="w-5 h-5" />}
                    </Button>
                  </div>
                )}

                {/* <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                        <span className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">7</span>
                        </span>
                        <span>days delivery</span>
                    </span>
                </div> */}
              </div>

              {/* Custom Design Link */}
              <div className="pt-4">
                <p className="text-brand-800">
                  Looking for Custom Design Jewellery?{" "}
                  <button
                    onClick={handleCustomDesign}
                    className="text-brand-900 underline font-medium cursor-pointer"
                  >
                    Custom Design
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details and Specifications */}
        <div className="px-5 py-12 bg-white">
          <div className="mx-auto">
            <h2 className="text-2xl font-semibold text-center text-brand-900 mb-4">
              Product Details & Specifications
            </h2>

            {/* Diamond Details Table */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-brand-900">
                Diamond Details
              </h3>
              <h6 className="text-[12px] font-semibold text-brand-900 mb-4">
                Origin: {selectedVariant?.gemOrigin?.replace(/_/g, " ") || "-"}
              </h6>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-brand-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-brand-600 uppercase tracking-wider">
                        Shape
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-brand-600 uppercase tracking-wider">
                        MM
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-brand-600 uppercase tracking-wider">
                        Weight
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-brand-600 uppercase tracking-wider">
                        Color
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-brand-600 uppercase tracking-wider">
                        Clarity
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-brand-600 uppercase tracking-wider">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100">
                    {gemDetails.length > 0 ? (
                      gemDetails.map((gem: any, index: number) => (
                        <tr key={index} className="hover:bg-brand-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-brand-900">
                            {gem.shape || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-brand-900">
                            {gem.mm || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-brand-900">
                            {gem.weight ? `${gem.weight} ct` : "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-brand-900">
                            {gem.color || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-brand-900">
                            {gem.clarity || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-brand-900">
                            {gem.quantity || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-3 text-center text-sm text-brand-600"
                        >
                          No diamond details available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Material & Measurements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Material Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-brand-900 mb-4">
                  Material Information
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-brand-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-brand-600 uppercase tracking-wider">
                          Metal
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-brand-600 uppercase tracking-wider whitespace-nowrap">
                          <span className="hidden sm:inline">Net Weight</span>
                          <span className="sm:hidden">Wt.</span>
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-brand-600 uppercase tracking-wider">
                          Color
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-100">
                      {(() => {
                        // Use the same selectedVariant that considers both size and diamond weight
                        if (!selectedVariant) {
                          return (
                            <tr>
                              <td colSpan={3} className="px-4 py-3 text-center text-sm text-brand-600">
                                No material information available for selected size
                              </td>
                            </tr>
                          );
                        }

                        // Define material mappings
                        const materialMappings = [
                          { key: 'silver', value: 'silver' },
                          { key: 'tenKtGold', value: 'tenKtGold' },
                          { key: 'forteenKtGold', value: 'forteenKtGold' },
                          { key: 'eighteenKtGold', value: 'eighteenKtGold' }
                        ];

                        // Show only the selected material
                        if (!selectedMaterial) {
                          return (
                            <tr>
                              <td colSpan={3} className="px-4 py-3 text-center text-sm text-brand-600">
                                No material selected
                              </td>
                            </tr>
                          );
                        }

                        const materialOption = MATERIALS_OPTION.find(
                          (item) => item.value === selectedMaterial
                        );
                        const weight = selectedVariant[selectedMaterial];

                        // Check if the selected material has a valid weight
                        if (weight === undefined || weight === null || weight <= 0) {
                          return (
                            <tr>
                              <td colSpan={3} className="px-4 py-3 text-center text-sm text-brand-600">
                                No material information available for selected material
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <tr className="hover:bg-brand-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-brand-900">
                              {materialOption?.label || selectedMaterial}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-brand-900">
                              {weight.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-brand-900">
                              {selectedColor}
                            </td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Measurements */}
              {selectedVariant?.mesurement &&
                Object.keys(selectedVariant.mesurement).length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-brand-900 mb-4">
                      Measurements
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead className="bg-brand-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-brand-600 uppercase tracking-wider">
                              Measurement
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-brand-600 uppercase tracking-wider">
                              Value
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-brand-100">
                          {selectedVariant?.mesurement &&
                            Object.keys(selectedVariant.mesurement).length > 0 ? (
                            Object.entries(selectedVariant.mesurement).map(
                              ([key, value]: any) => (
                                <tr key={key} className="hover:bg-brand-50">
                                  <td className="px-4 py-3 text-sm font-medium text-brand-800 capitalize">
                                    {key}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-brand-900">
                                    {value || "N/A"}
                                  </td>
                                </tr>
                              )
                            )
                          ) : (
                            <tr>
                              <td
                                colSpan={2}
                                className="px-4 py-3 text-center text-brand-600"
                              >
                                No measurements available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>

            {/* Terms & Conditions Cards */}
            <h3 className="text-xl font-semibold text-center text-brand-900 mt-16 mb-8">
              Promise You Can See, Trust You Can Feel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Card 1 - Return Policy */}
              <div className="bg-white rounded-lg shadow-md p-5 border border-brand-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-3">
                  <svg
                    className="w-6 h-6 text-brand-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-brand-900 mb-2">
                      Guaranteed Material Provenance
                    </h4>
                    <p className="text-base text-brand-700 leading-relaxed">
                      We deliver certified fine jewelry featuring 18K/14K Gold
                      and tarnish-resistant 925 Sterling Silver. All components
                      are hypoallergenic, ensuring compliance for global market
                      acceptance. Every piece includes GIA/IGI/SGL
                      certification, carries the international CCM hallmark, and
                      uses ethically sourced, conflict-free diamonds. Secure
                      your scalable inventory supply with guaranteed material
                      authenticity and quality consistency, backed by our
                      stringent verification standards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Warranty */}
              <div className="bg-white rounded-lg shadow-md p-5 border border-brand-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-3">
                  <svg
                    className="w-6 h-6 text-brand-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-brand-900 mb-2">
                      Effortless Insured Order
                    </h4>
                    <p className="text-base text-brand-700 leading-relaxed">
                      Ensure an effortless purchasing experience. Benefit from
                      easy ordering, quantity flexibility, and tailored
                      discounts based on your previous monthly orders. We
                      provide complimentary and fully insured shipping on all
                      orders via trusted, trackable carriers like DHL, FedEx,
                      and UPS. Your investment is protected from all costs and
                      risks until the moment of safe delivery. We accept all
                      major payment methods, including bank transfers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Certification */}
              <div className="bg-white rounded-lg shadow-md p-5 border border-brand-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-3">
                  <svg
                    className="w-6 h-6 text-brand-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-brand-900 mb-2">
                      Assured Flexible Returns
                    </h4>
                    <p className="text-base text-brand-700 leading-relaxed">
                      Your complete satisfaction is our priority. We accept
                      returns or exchanges within 15 days of delivery if the
                      product does not meet your inventory requirements.
                      Following a successful return, you may choose to receive
                      an exchange or obtain a Credit Note, which will be applied
                      against the value of the returned products. This Credit
                      Note holds one year validity to secure future stock. This
                      policy provides commercial flexibility and minimizes your
                      holding risk on new items.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4 - Shipping */}
              <div className="bg-white rounded-lg shadow-md p-5 border border-brand-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-3">
                  <svg
                    className="w-6 h-6 text-brand-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-brand-900 mb-2">
                      Enduring Service Commitment
                    </h4>
                    <p className="text-base text-brand-700 leading-relaxed">
                      We commit to the enduring quality of your purchase with
                      five years of complimentary services, strictly limited to
                      the first five events per product. This comprehensive
                      package includes free product inspection, professional
                      shining, cleaning, stone maintenance, and rhodium plating
                      (on white silver). Beyond this complimentary limit, we
                      offer a full range of professional repair services,
                      subject to separate fees.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You may also like */}
        <div className="px-8 py-7">
          <h2 className="text-2xl font-medium text-center mb-8">
            You may also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-[1px] border-black">
            {relatedProducts.map((relatedProduct: any) => (
              <div
                key={relatedProduct.id}
                className="group cursor-pointer border-[1px] border-black"
                onClick={() =>
                  router.push(
                    `/jewellery/product-detail?id=${relatedProduct.id}`
                  )
                }
              >
                <div className="relative aspect-square bg-brand-50 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={
                      relatedProduct.images?.[0]?.image ||
                      "/assets/brand/je-inspi-wordmark.png"
                    }
                    alt={relatedProduct.name || "Product"}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Wishlist Icon */}
                  {isAuthenticated && (
                    <div
                      onClick={(e) => toggleRelatedWishlist(e, relatedProduct)}
                      className="absolute top-3 right-3 z-10 cursor-pointer"
                    >
                      {relatedWishlist.has(relatedProduct.id) ? (
                        <IoHeart className="h-[25px] w-[25px] text-red-500 hover:scale-110 transition-transform" />
                      ) : (
                        <IoHeartOutline className="h-[25px] w-[25px] text-brand-900 hover:scale-110 transition-transform" />
                      )}
                    </div>
                  )}
                </div>

                <div className="text-start px-5 pb-3">
                  <h3 className="text-lg font-medium text-[#526f4d] uppercase mb-1">
                    {relatedProduct.name ||
                      relatedProduct.type?.name ||
                      "Product"}
                  </h3>
                  <p className="text-brand-700 text-sm mb-1">
                    {relatedProduct.sku || "SKU"}
                  </p>
                  <p className="text-lg font-medium">
                    {relatedProduct.basePrice > 0 ? (
                      isAuthenticated && discount > 0 ? (
                        <div className="flex items-center gap-3">
                          {/* Discounted Price */}
                          <p className="text-[22px] font-[500] text-brand-900">
                            {/* ${discountedPrice.toLocaleString()} */}
                            ${(discount > 0 ? relatedProduct.basePrice - (discount > 0 ? (relatedProduct.basePrice * discount) / 100 : 0) : relatedProduct.basePrice).toFixed(2)}
                          </p>

                          {/* Original Price */}
                          <p className="text-[16px] font-[400] line-through text-brand-400">
                            ${relatedProduct.basePrice.toLocaleString()}
                          </p>

                          {/* User Discount */}
                          <p className="text-[14px] font-[500] text-brand-600">
                            {discount}% OFF
                          </p>
                        </div>
                      ) : (
                        <p className="text-[20px] font-[400]">
                          ${relatedProduct.basePrice.toLocaleString()}
                        </p>
                      )
                    ) : (
                      <p className="text-[16px] text-brand-400">Price after Inquiry</p>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false);
            router.push("/register");
          }}
        />

        {/* Order Confirmation Modal */}
        {product && selectedVariant && (
          <OrderConfirmationModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
            onSuccess={(orderData) => {
              router.push("/orders");
            }}
            paymentMethod={
              paymentMode === "INSTANT" ? "INSTANT" : "PAYMENT_CYCLE"
            }
            orderData={{
              jewelleryId: productId,
              variantId: selectedVariant.id,
              sku: selectedSpecificationSKU || product.sku || "",
              quantity: quantity,
              selectedColor: selectedColor,
              selectedSize: selectedSize || 0, // Ensure size is always sent, 0 for not applicable
              material: selectedMaterial,
              includeCertificate: includeCertificate,
              productName: product.name,
              productPrice: userDiscount || calculatedPrice || selectedVariant.basePrice,
            }}
          />
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetail;
