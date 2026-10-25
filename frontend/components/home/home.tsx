"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { garamond } from "@/src/common/helper";
import { COLLECTION_TYPE, CATEGORY_TYPE } from "@/src/libs/constants";
import Footer from "../common/footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/src/contexts/AppContext";
import ShreejiLoader from "@/components/common/shreejiLoader";

const Home = () => {
  const [selected, setSelected] = useState("RING");
  const [hovered, setHovered] = useState("OUR_LEGACY");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentDisplayProduct, setCurrentDisplayProduct] = useState<any>(null);
  const [fadeKey, setFadeKey] = useState(0);
  const router = useRouter();
  const { loading, categories, primeProducts, getBannerImage } =
    useAppContext();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });

    // Set initial selected category (first one) when data is loaded
    if (categories.length > 0 && !selectedCategory) {
      const firstCategory = categories[0];
      setSelectedCategory(firstCategory);

      // Find product for this category - handle both data structures
      const productForCategory = primeProducts.find((p: any) => {
        // Handle nested structure: p.product?.categoryId
        if (p.product && p.product.categoryId === firstCategory.id) {
          return true;
        }
        // Handle flat structure: p.categoryId
        if (p.categoryId === firstCategory.id) {
          return true;
        }
        return false;
      });
      setSelectedProduct(productForCategory || null);
      setCurrentDisplayProduct(productForCategory || null);
    }
  }, [categories, primeProducts, selectedCategory]);

  // Utility function to check if URL is video or image
  const isVideo = (url: string): boolean => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  // Utility function to get image by type with fallback
  const getImageByType = (imageType: string, fallbackUrl: string): string => {
    const image = getBannerImage(imageType as any);
    return image?.image || fallbackUrl;
  };

  // Handle category selection with smooth transition
  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find((cat: any) => cat.id === categoryId);
    if (!category || category.id === selectedCategory?.id) return;

    setIsTransitioning(true);

    // Find product for this category - handle both data structures
    const productForCategory = primeProducts.find((p: any) => {
      // Handle nested structure: p.product?.categoryId
      if (p.product && p.product.categoryId === categoryId) {
        return true;
      }
      // Handle flat structure: p.categoryId
      if (p.categoryId === categoryId) {
        return true;
      }
      return false;
    });

    // Simulate transition delay for smooth effect
    setTimeout(() => {
      setSelectedCategory(category);
      setSelectedProduct(productForCategory || null);
      setCurrentDisplayProduct(productForCategory || null);
      setFadeKey((prev) => prev + 1); // Force re-render for fade animation
      setIsTransitioning(false);
    }, 300); // Transition duration
  };

  // Smooth transition image component
  const SmoothTransitionImage = ({
    src,
    alt,
    width,
    height,
    className,
    dataAos,
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    dataAos?: string;
  }) => {
    return (
      <div
        className={`transition-opacity h-full w-auto ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <Image
          key={fadeKey}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          data-aos={dataAos}
        />
      </div>
    );
  };

  // Responsive media component
  const ResponsiveMedia = ({
    desktopType,
    mobileType,
    fallbackDesktop,
    fallbackMobile,
    className,
    autoPlay = true,
    loop = true,
    muted = true,
  }: {
    desktopType: string;
    mobileType: string;
    fallbackDesktop: string;
    fallbackMobile: string;
    className?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
  }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const imageUrl = getImageByType(
      isMobile ? mobileType : desktopType,
      isMobile ? fallbackMobile : fallbackDesktop
    );

    if (isVideo(imageUrl)) {
      return (
        <video
          src={imageUrl}
          className={className}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <Image
        src={imageUrl}
        alt={isMobile ? mobileType : desktopType}
        fill
        className={className}
        unoptimized
      />
    );
  };

  return (
    <div
      className={`w-auto h-auto space-y-20 select-none ${garamond.className}`}
    >
      {/* Section 1: Hero Section For Video */}
      <div className="flex justify-center relative">
        <div className="relative w-screen h-screen">
          <ResponsiveMedia
            desktopType="HERO_DESKTOP"
            mobileType="HERO_MOBILE"
            fallbackDesktop="/assets/home/Hero Section.mp4"
            fallbackMobile="/assets/home/Hero Section.mp4"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="absolute py-3 my-2 px-5 backdrop-blur-md rounded-4xl border-0">
          <Link href="/">
            <Image
              src="/assets/brand/je-inspi-logo-transparent.png"
              width={151}
              height={68}
              alt="JE-Inspi logo"
              data-aos="zoom-in"
              className="cursor-pointer brand-logo-ivory"
            />
          </Link>
        </div>
      </div>

      {/* Section 2: Slogan of project */}
      <div
        className="relative flex justify-center items-center px-4"
        data-aos="fade-down"
      >
        {/* Black text on top */}
        <p className="absolute text-center text-brand-900 leading-snug text-[16px] sm:text-[20px] md:text-[24px]">
          Explore JE-Inspi Fine Jewellery and Diamonds
          <br />
          Discover pieces for your personal style.
        </p>

        {/* Light gray larger text below */}
        <p className="text-center text-[#e3ebdd] leading-snug text-[26px] sm:text-[32px] md:text-[40px]">
          Explore JE-Inspi Fine Jewellery and Diamonds
          <br />
          Discover pieces for your personal style.
        </p>
      </div>

      {/* Section 3: Jewellery and Diamond section */}
      <div className="flex flex-col md:flex-row justify-center items-center px-4 md:px-10 mx-auto gap-10 md:gap-20">
        {/* Jewellery */}
        <Link
          href="/jewellery"
          className="relative cursor-pointer w-full md:w-auto block"
          data-aos="fade-down"
        >
          <div className="relative w-full md:min-w-[40vw] h-[90vh] min-h-[300px] md:min-h-[600px]">
            <ResponsiveMedia
              desktopType="JEWELLERY_VIDEO"
              mobileType="JEWELLERY_VIDEO"
              fallbackDesktop="/assets/home/Jewellery.mp4"
              fallbackMobile="/assets/home/Jewellery.mp4"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </div>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-end mb-6 sm:mb-8 md:mb-10 text-white text-center">
            <p className="font-[400] text-[24px] sm:text-[32px] md:text-[40px]">
              Jewellery
            </p>
            <p className="font-[300] text-[16px] sm:text-[20px] md:text-[24px]">
              Exquisite Designs Inspire Trust
            </p>
          </div>
        </Link>

        {/* Diamond */}
        <Link
          href="/diamond"
          className="relative cursor-pointer w-full md:w-auto"
          data-aos="fade-down"
        >
          <div className="relative w-full md:min-w-[40vw] h-[90vh] min-h-[300px] md:min-h-[600px] cursor-pointer">
            <ResponsiveMedia
              desktopType="DIAMOND_VIDEO"
              mobileType="DIAMOND_VIDEO"
              fallbackDesktop="/assets/home/Diamond.mp4"
              fallbackMobile="/assets/home/Diamond.mp4"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </div>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-end mb-6 sm:mb-8 md:mb-10 text-white text-center">
            <p className="font-[400] text-[24px] sm:text-[32px] md:text-[40px]">
              Diamonds
            </p>
            <p className="font-[300] text-[16px] sm:text-[20px] md:text-[24px]">
              Source Your Perfect Sparkle
            </p>
          </div>
        </Link>
      </div>

      {/* Section 4: Latest Collection section */}
      <div className="flex md:flex-row flex-col md:justify-center justify-between md:px-10 px-4 mx-xuto md:space-x-10 space-x-0 h-[50vh] min-h-[500px] bg-[#f1f4ed] my-28">
        <p
          className="text-[25px] text-brand-900 font-[400] w-full justify-center items-center text-center md:hidden block mt-3"
          data-aos="zoom-in"
        >
          Our Most Coveted Artistry
        </p>
        {/* Necklace */}
        <div className="flex justify-center md:space-x-10 space-x-0">
          <div className="flex justify-center items-center">
            <div
              className={`bg-white flex flex-col justify-center items-center px-2 pb-3 md:px-6 md:pb-10 md:w-[270px] w-[170px] ${
                // Handle both nested and flat data structures for click
                currentDisplayProduct?.product?.jewellery?.id ||
                currentDisplayProduct?.jewellery?.id ||
                currentDisplayProduct?.product?.id ||
                currentDisplayProduct?.id
                  ? "cursor-pointer"
                  : ""
              }`}
              onClick={() => {
                // Handle both nested and flat data structures for navigation
                const productId =
                  currentDisplayProduct?.product?.jewellery?.id ||
                  currentDisplayProduct?.jewellery?.id ||
                  currentDisplayProduct?.product?.id ||
                  currentDisplayProduct?.id;
                if (productId)
                  router.push(`/jewellery/product-detail?id=${productId}`);
              }}
            >
              <SmoothTransitionImage
                src={
                  // Handle both nested and flat data structures
                  currentDisplayProduct?.product?.jewellery?.images?.[0]
                    ?.image ||
                  currentDisplayProduct?.jewellery?.images?.[0]?.image ||
                  currentDisplayProduct?.product?.images?.[0]?.image ||
                  currentDisplayProduct?.images?.[0]?.image ||
                  "/assets/brand/je-inspi-logo-transparent.png"
                }
                alt={
                  currentDisplayProduct?.product?.jewellery?.name ||
                  currentDisplayProduct?.jewellery?.name ||
                  currentDisplayProduct?.product?.name ||
                  currentDisplayProduct?.name ||
                  "Shreeji Necklace"
                }
                width={100}
                height={100}
                className="md:w-[155px] md:h-[201px] w-[90px] h-[120px] object-contain"
                dataAos="flip-left"
              />
              <div className="py-7 text-center w-full">
                <p className="text-brand-900 text-[14px] md:text-[16px] w-full truncate">
                  {currentDisplayProduct?.product?.jewellery?.name ||
                    currentDisplayProduct?.jewellery?.name ||
                    currentDisplayProduct?.product?.name ||
                    currentDisplayProduct?.name ||
                    "Shell and Pearl Necklace Set"}
                </p>
                <p className="text-[#73796f] text-[12px] md:text-[14px] w-full truncate">
                  {currentDisplayProduct?.product?.jewellery?.description ||
                    currentDisplayProduct?.jewellery?.description ||
                    currentDisplayProduct?.product?.description ||
                    currentDisplayProduct?.description ||
                    "18ct Gold Plated Vermeil"}
                </p>
                {/* Select Button */}
                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle both nested and flat data structures for navigation
                    const productId = 
                      currentDisplayProduct?.product?.jewellery?.id ||
                      currentDisplayProduct?.jewellery?.id ||
                      currentDisplayProduct?.product?.id ||
                      currentDisplayProduct?.id;
                    if (productId)
                      router.push(
                        `/jewellery/product-detail?id=${productId}`
                      );
                  }}
                  className="mt-3 px-4 py-2 bg-[#526f4d] text-white text-[12px] md:text-[14px] rounded-md hover:bg-[#40583c] transition-colors duration-200"
                >
                  Select
                </button> */}
              </div>
            </div>
          </div>

          {/* Modal With Necklace */}
          <div
            className="flex justify-center items-center md:-mt-[25px] h-[300px] md:h-auto"
            style={{ "--h-md": "calc(100% + 50px)" } as React.CSSProperties}
          >
            <div className="w-full h-full md:[height:var(--h-md)] flex justify-center items-center">
              <SmoothTransitionImage
                src={
                  // Handle both nested and flat data structures for prime image
                  currentDisplayProduct?.product?.primeImage ||
                  currentDisplayProduct?.primeImage ||
                  currentDisplayProduct?.product?.modalImage ||
                  currentDisplayProduct?.modalImage ||
                  "/assets/home/collection/Modal With Necklace.svg"
                }
                alt={
                  currentDisplayProduct?.product?.jewellery?.name ||
                  currentDisplayProduct?.jewellery?.name ||
                  currentDisplayProduct?.product?.name ||
                  currentDisplayProduct?.name ||
                  "Shreeji Modal With Necklace"
                }
                width={100}
                height={100}
                className="h-full md:w-auto w-[170px] max-w-[400px] object-contain"
                dataAos="flip-right"
              />
            </div>
          </div>
        </div>

        {/* Latest Collections */}
        <div className="flex flex-col justify-center">
          <p
            className="text-[48px] text-brand-900 font-[400] md:flex hidden"
            data-aos="zoom-in"
          >
            Our Most Coveted Artistry
          </p>
          <div>
            <div
              className="flex md:flex-col flex-row md:space-y-2 space-x-3 gap-3 md:gap-0 py-6 jusify-between md:items-start items-center w-full"
              data-aos="zoom-in"
            >
              {/* Show dynamic jewellery categories (max 5) or fallback to static data */}
              {categories.length > 0
                ? categories
                    .filter(
                      (category: any) =>
                        category.categoryType === "PRIME_CATEGORY" ||
                        // Fallback: show first 4 categories if no PRIME_CATEGORY type exists
                        (!category.categoryType &&
                          categories.indexOf(category) < 4)
                    )
                    .slice(0, 4)
                    .map((category: any) => (
                      <div
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`flex items-center cursor-pointer transition-all ${
                          selectedCategory?.id === category.id
                            ? "text-[#526f4d] font-[500]"
                            : "text-[#cbd9c3]"
                        } ${
                          isTransitioning &&
                          selectedCategory?.id !== category.id
                            ? "opacity-50"
                            : "opacity-100"
                        }`}
                      >
                        {/* Show bullet only if selected */}
                        {selectedCategory?.id === category.id && (
                          <span className="mr-2 text-[#526f4d] text-xl">•</span>
                        )}
                        <span className="md:text-[20px] text-[18px]">
                          {category.name}
                        </span>
                      </div>
                    ))
                : /* Fallback to static COLLECTION_TYPE if no categories available */
                  COLLECTION_TYPE.map((item) => (
                    <div
                      key={item.value}
                      onClick={() => setSelected(item.value)}
                      className={`flex items-center cursor-pointer transition-all ${
                        selected === item.value
                          ? "text-[#526f4d] font-[500]"
                          : "text-[#cbd9c3]"
                      } ${
                        isTransitioning && selected !== item.value
                          ? "opacity-50"
                          : "opacity-100"
                      }`}
                    >
                      {/* Show bullet only if selected */}
                      {selected === item.value && (
                        <span className="mr-2 text-[#526f4d] text-xl">•</span>
                      )}
                      <span className="text-[18px]">{item.label}</span>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Category */}
      <div
        className="flex flex-col md:flex-row items-stretch rounded-[10px] overflow-hidden md:h-[90vh] h-auto min-h-[600px] shadow-lg bg-[#f1f4ed] mx-3"
        data-aos="fade-up"
      >
        {CATEGORY_TYPE.map((item: any) => {
          const isActive = hovered === item.value;

          return (
            <div
              key={item.value}
              onMouseEnter={() => setHovered(item.value)}
              className={`transition-[flex] duration-400 md:pr-3 md:pl-0 p-3 ease-in-out border-[1px] rounded-[8px] m-3 ${
                isActive ? "flex-[10]" : "flex-[1]"
              } bg-[#f1f4ed] flex items-center justify-center relative overflow-hidden md:pr-3 md:py-0 md:pl-0 md:h-[calc(100%-24px)] h-auto cursor-pointer`}
            >
              {/* Expanded View */}
              {isActive ? (
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:pr-6 pr-0 text-center animate-fade-in h-full w-full">
                  <div className="flex flex-col md:items-start ite justify-center h-full">
                    <img
                      src={item.img1}
                      alt={item.label}
                      className="md:h-[50%] max-w-[800px] object-contain h-[250px] transition-transform duration-700"
                    />
                    <img
                      src={item.img2}
                      alt={item.label}
                      className="md:h-[50%] max-w-[800px] object-contain h-[250px] transition-transform duration-700"
                    />
                  </div>
                  <div className="w-auto h-auto">
                    <h3 className="md:text-[35px] text-[20px] font-[400] mb-3">
                      {item.selected_text || item.label}
                    </h3>
                    <p className="text-[14px] md:text-[18px] text-brand-800 transition-transform duration-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="transform md:-rotate-90 whitespace-nowrap md:text-[30px] text-[20px] font-[500] text-brand-900 tracking-tight">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Section 6: Footer */}
      <Footer />

      {/* Full-page loader overlay */}
      {loading && (
        <ShreejiLoader
          fullScreen={true}
          size="large"
          // text="Loading amazing content..."
          color="#526f4d"
        />
      )}
    </div>
  );
};

export default Home;
