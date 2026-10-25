"use client";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import Footer from "../common/footer";
import Navbar from "../common/navbar";
import JewelleryProductList from "./jewellery-product-list";
import Loader from "../../components/common/loader";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { garamond } from "@/src/common/helper";
import { IoIosArrowDown } from "react-icons/io";
import SearchBar from "../common/searchBar";
import { debounce, includes } from "lodash";
import { Modal, Slider, Badge, Drawer } from "antd";
import { CATEGORIES, SORT_OPTIONS } from "@/src/libs/constants";
import { useAuth } from "@/src/contexts/AuthContext";
import { jewelleryAPI, ProductFilters } from "@/src/services/jewellery.api";
import { calculatorAPI, CalculatorData } from "@/src/services/calculator.api";
import { authHelper } from "@/src/libs/helper";
import DynamicBanner from "./dynamic-banner";

interface JewelleryBaseProps {
  showBanner?: boolean;
  title?: string;
  subtitle?: string;
  initialFilters?: Partial<ProductFilters>;
}

const JewelleryBase: React.FC<JewelleryBaseProps> = ({
  showBanner = false,
  title = "Our Featured Collection",
  subtitle = "Discover our handpicked selection of exquisite jewellery pieces",
  initialFilters = {},
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, hoveredItem, setHoveredItem } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(search);
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [availableSizes, setAvailableSizes] = useState<number[]>([]);
  const [availableShapes, setAvailableShapes] = useState<string[]>([]);
  const [calculatorData, setCalculatorData] = useState<CalculatorData | null>(null);

  // Dynamic title and subtitle states
  const [dynamicTitle, setDynamicTitle] = useState(title);
  const [dynamicSubtitle, setDynamicSubtitle] = useState(subtitle);

  // Modal states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  // Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState<any>(
    initialFilters.categoryId || ""
  );
  const [selectedTypeId, setSelectedTypeId] = useState<any>(
    initialFilters.typeId || ""
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 10000]);
  const [selectedShapes, setSelectedShapes] = useState<any>(
    initialFilters.shapes || ""
  );
  const [selectedSizes, setSelectedSizes] = useState<any>(
    initialFilters.sizes || ""
  );
  const [selectedGemOrigin, setSelectedGemOrigin] = useState<any>(
    initialFilters.gemOrigin || ""
  );
  const [selectedMaterial, setSelectedMaterial] = useState<string[]>(
    initialFilters.material || []
  );

  // Applied filter states (for API calls)
  const [appliedCategoryId, setAppliedCategoryId] = useState<any>(
    initialFilters.categoryId || ""
  );
  const [appliedTypeId, setAppliedTypeId] = useState<any>(
    initialFilters.typeId || ""
  );
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([
    1, 10000,
  ]);
  const [appliedShapes, setAppliedShapes] = useState<any>(
    initialFilters.shapes || ""
  );
  const [appliedSizes, setAppliedSizes] = useState<any>(
    initialFilters.sizes || ""
  );
  const [appliedGemOrigin, setAppliedGemOrigin] = useState<any>(
    initialFilters.gemOrigin || ""
  );
  const [appliedMaterial, setAppliedMaterial] = useState<string[]>(
    initialFilters.material || []
  );
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>("");

  // Sort state
  const [selectedSort, setSelectedSort] = useState<string>("DATE_NEW_TO_OLD");

  // Update dynamic title and subtitle based on applied filters
  useEffect(() => {
    const updateTitleAndSubtitle = () => {
      // Check if we have all three parameters (categoryId, subcategoryId, and typeId)
      if (initialFilters.categoryId && initialFilters.subcategoryId && initialFilters.typeId) {
        const category = dynamicCategories.find(cat => cat.id === initialFilters.categoryId);
        const subcategory = dynamicCategories.flatMap(cat => cat.subCategory || []).find(subCat => subCat.id === initialFilters.subcategoryId);
        const type = dynamicCategories
          .filter(cat => cat.type === "COLLECTION")
          .find(cat => cat.id === initialFilters.typeId);
        
        if (category && subcategory && type) {
          setDynamicTitle(type.name);
          setDynamicSubtitle(`${category.name} > ${subcategory.name} > ${type.name}`);
        }
      }
      // Check if we have a subcategoryId from URL (initialFilters)
      else if (initialFilters.subcategoryId) {
        const selectedSubcategory = dynamicCategories.flatMap(cat => cat.subCategory || []).find(subCat => subCat.id === initialFilters.subcategoryId);
        const parentCategory = dynamicCategories.find(cat => 
          cat.subCategory?.some((subCat: any) => subCat.id === initialFilters.subcategoryId)
        );
        
        if (selectedSubcategory && parentCategory) {
          setDynamicTitle(selectedSubcategory.name);
          setDynamicSubtitle(`${parentCategory.name} > ${selectedSubcategory.name}`);
        }
      } else if (appliedCategoryId) {
        const selectedCategory = dynamicCategories.find(cat => cat.id === appliedCategoryId);
        const selectedSubcategory = dynamicCategories.flatMap(cat => cat.subCategory || []).find(subCat => subCat.id === appliedCategoryId);
        
        if (selectedSubcategory) {
          const parentCategory = dynamicCategories.find(cat => 
            cat.subCategory?.some((subCat: any) => subCat.id === appliedCategoryId)
          );
          if (parentCategory) {
            setDynamicTitle(selectedSubcategory.name);
            setDynamicSubtitle(`${parentCategory.name} > ${selectedSubcategory.name}`);
          }
        } else if (selectedCategory) {
          setDynamicTitle(selectedCategory.name);
          setDynamicSubtitle(`Explore our exquisite collection of ${selectedCategory.name.toLowerCase()}`);
        }
      } else if (appliedTypeId || initialFilters.typeId) {
        const typeIdToCheck = appliedTypeId || initialFilters.typeId;
        const selectedType = dynamicCategories
          .filter(cat => cat.type === "COLLECTION")
          .find(cat => cat.id === typeIdToCheck);
        if (selectedType) {
          setDynamicTitle(selectedType.name);
          setDynamicSubtitle(`Explore our exquisite ${selectedType.name.toLowerCase()} collection`);
        }
      } else {
        // Reset to original props when no filters are applied
        setDynamicTitle(title);
        setDynamicSubtitle(subtitle);
      }
    };

    updateTitleAndSubtitle();
  }, [appliedCategoryId, appliedTypeId, dynamicCategories, title, subtitle, initialFilters.subcategoryId, initialFilters.typeId, initialFilters.categoryId]);

  // Fetch calculator data and dynamic categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch calculator data
        const calculatorResponse = await calculatorAPI.getCalculatorData();
        setCalculatorData(calculatorResponse);
        
        // Set initial price range based on calculator data
        const initialMin = calculatorResponse.filterMin || 1;
        const initialMax = calculatorResponse.filterMax || 10000;
        setPriceRange([initialMin, initialMax]);
        setAppliedPriceRange([initialMin, initialMax]);
        
        // Fetch categories
        const param: any = { skip: 0, take: 50, include: "subCategory.type" };
        const response: any = await jewelleryAPI.getEnabledCategories(param);

        // Filter out disabled or deleted subcategories and types
        const filteredCategories = (response?.list || [])
          .map((category: any) => ({
            ...category,
            subCategory: (category.subCategory || [])
              .filter(
                (subCat: any) =>
                  subCat.status === "ENABLED" && !subCat.isDeleted
              )
              .map((subCat: any) => ({
                ...subCat,
                type: (subCat.type || []).filter(
                  (type: any) => type.status === "ENABLED" && !type.isDeleted
                ),
              }))
              .filter((subCat: any) => subCat.type.length > 0), // Only keep subcategories with valid types
          }))
          .filter((category: any) => category.subCategory.length > 0 || category.type === "COLLECTION"); // Keep categories with subcategories OR collections

        setDynamicCategories(filteredCategories);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = useCallback(
    debounce((query: any) => {
      setDebouncedSearchQuery(query);
    }, 500),
    []
  );

  // Apply search immediately when user types (search is real-time)
  useEffect(() => {
    setAppliedSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  // Check if any filters are selected (for button enable/disable)
  const hasActiveFilters = () => {
    // Enable buttons if there are pending changes OR if there are applied user filters that can be reset
    const hasPendingChanges =
      selectedCategoryId !== appliedCategoryId ||
      selectedTypeId !== initialFilters.typeId ||
      selectedShapes !== appliedShapes ||
      selectedSizes !== appliedSizes ||
      selectedMaterial !== appliedMaterial ||
      priceRange[0] !== appliedPriceRange[0] ||
      priceRange[1] !== appliedPriceRange[1] ||
      selectedGemOrigin !== appliedGemOrigin;

    const hasAppliedUserFilters =
      appliedCategoryId !== "" ||
      selectedTypeId !== (initialFilters.typeId || "") ||
      appliedShapes !== "" ||
      appliedSizes !== "" ||
      appliedMaterial.length > 0 ||
      appliedGemOrigin !== "" ||
      appliedPriceRange[0] > (calculatorData?.filterMin || 1) ||
      appliedPriceRange[1] < (calculatorData?.filterMax || 10000);

    return hasPendingChanges || hasAppliedUserFilters;
  };

  // Check if any user-selected filters are currently applied (for red dot display)
  const hasUserAppliedFilters = () => {
    return (
      appliedCategoryId !== "" ||
      appliedShapes !== "" ||
      appliedSizes !== "" ||
      appliedMaterial.length > 0 ||
      appliedGemOrigin !== "" ||
      appliedPriceRange[0] > (calculatorData?.filterMin || 1) ||
      appliedPriceRange[1] < (calculatorData?.filterMax || 10000)
    );
  };

  // Check if any filters are currently applied (for display purposes)
  const hasAppliedFilters = () => {
    return (
      appliedCategoryId !== "" ||
      appliedShapes !== "" ||
      appliedSizes !== "" ||
      appliedMaterial.length > 0 ||
      appliedGemOrigin !== "" ||
      appliedPriceRange[0] > (calculatorData?.filterMin || 1) ||
      appliedPriceRange[1] < (calculatorData?.filterMax || 10000) ||
      initialFilters.subcategoryId !== undefined ||
      initialFilters.typeId !== undefined ||
      initialFilters.collectionId !== undefined
    );
  };

  // Check if sort is applied (not default)
  const hasActiveSort = () => {
    return selectedSort !== "DATE_NEW_TO_OLD";
  };

  // Apply selected sort
  const applySort = () => {
    // Sort is applied immediately since it's handled locally
    setIsSortModalOpen(false);
  };

  // Reset sort to default
  const resetSort = () => {
    setSelectedSort("DATE_NEW_TO_OLD");
    setIsSortModalOpen(false);
  };

  // Reset all user-selected filters (not URL-based filters)
  const resetFilters = () => {
    setSelectedCategoryId("");
    setSelectedTypeId("");
    setSelectedShapes("");
    setSelectedSizes("");
    setSelectedMaterial([]);
    setSelectedGemOrigin("");
    const defaultMin = calculatorData?.filterMin || 1;
    const defaultMax = calculatorData?.filterMax || 10000;
    setPriceRange([defaultMin, defaultMax]);

    // Apply the reset immediately
    setAppliedCategoryId("");
    setAppliedTypeId("");
    setAppliedShapes("");
    setAppliedSizes("");
    setAppliedMaterial([]);
    setAppliedGemOrigin("");
    setAppliedPriceRange([defaultMin, defaultMax]);

    // Navigate back to main jewellery page
    router.push('/jewellery');

    // Close filter drawer
    setIsFilterModalOpen(false);
  };

  // Apply filters (copy current states to applied states and close modal)
  const applyFilters = () => {
    const previousCategoryId = appliedCategoryId;
    const previousTypeId = appliedTypeId;
    
    setAppliedCategoryId(selectedCategoryId);
    setAppliedTypeId(selectedTypeId);
    setAppliedShapes(selectedShapes);
    setAppliedSizes(selectedSizes);
    setAppliedMaterial(selectedMaterial);
    setAppliedGemOrigin(selectedGemOrigin);
    setAppliedPriceRange(priceRange);
    setAppliedSearchQuery(debouncedSearchQuery);
    setIsFilterModalOpen(false);

    // Navigate to new category if changed
    if (selectedCategoryId && selectedCategoryId !== previousCategoryId) {
      // Check if it's a subcategory or category
      const selectedCategory = dynamicCategories.find(cat => cat.id === selectedCategoryId);
      const selectedSubcategory = dynamicCategories.flatMap(cat => cat.subCategory || []).find(subCat => subCat.id === selectedCategoryId);
      
      if (selectedSubcategory) {
        // It's a subcategory, navigate to subcategory page
        const parentCategory = dynamicCategories.find(cat => 
          cat.subCategory?.some((subCat: any) => subCat.id === selectedCategoryId)
        );
        if (parentCategory) {
          router.push(`/jewellery/${parentCategory.id}/${selectedCategoryId}`);
        }
      } else if (selectedCategory) {
        // It's a category, navigate to category page
        router.push(`/jewellery/${selectedCategoryId}`);
      }
    } else if (selectedTypeId && selectedTypeId !== previousTypeId) {
      // Navigate to collection page if type changed
      router.push(`/jewellery/collection/${selectedTypeId}`);
    }
  };

  // Build filters object for API call
  const filters = useMemo((): ProductFilters => {
    const user = authHelper.getUserData();
    const orderBy = selectedSort
      ? SORT_OPTIONS.find((option) => option.value === selectedSort)?.orderBy
      : undefined;

    const filters: ProductFilters = {
      search: appliedSearchQuery || undefined,
      categoryId: appliedCategoryId || undefined,
      subcategoryId: initialFilters.subcategoryId || undefined,
      typeId: appliedTypeId || undefined,
      collectionId: initialFilters.collectionId || undefined,
      shapes: appliedShapes || undefined,
      sizes: appliedSizes || undefined,
      material: appliedMaterial.length > 0 ? appliedMaterial : undefined,
      gemOrigin: appliedGemOrigin || undefined,
      minPrice: appliedPriceRange[0] !== (calculatorData?.filterMin || 1) ? appliedPriceRange[0] : undefined,
      maxPrice:
        appliedPriceRange[1] !== (calculatorData?.filterMax || 10000) ? appliedPriceRange[1] : undefined,
      orderBy: orderBy,
      userId: user?.id,
      ...(appliedSearchQuery ? { search_column: ["name", "sku"] } : {}),
    };

    return filters;
  }, [
    appliedSearchQuery,
    appliedCategoryId,
    appliedTypeId,
    appliedShapes,
    appliedSizes,
    appliedMaterial,
    appliedGemOrigin,
    appliedPriceRange,
    initialFilters,
    selectedSort,
    calculatorData,
  ]);

  // Handle filter changes from child components (only update selection states, not applied states)
  const handleFilterChange = (newFilters: ProductFilters) => {
    if (newFilters.categoryId) {
      setSelectedCategoryId(newFilters.categoryId);
    }
    if (newFilters.shapes) {
      setSelectedShapes(newFilters.shapes);
    }
    if (newFilters.sizes) {
      setSelectedSizes(newFilters.sizes);
    }
    if (newFilters.material) {
      setSelectedMaterial(newFilters.material);
    }
    if (newFilters.gemOrigin) {
      setSelectedGemOrigin(newFilters.gemOrigin);
    }
    if (
      newFilters.minPrice !== undefined ||
      newFilters.maxPrice !== undefined
    ) {
      setPriceRange([newFilters.minPrice || (calculatorData?.filterMin || 1), newFilters.maxPrice || (calculatorData?.filterMax || 10000)]);
    }
  };

  return (
    <div className={`w-auto h-auto select-none z-0 ${garamond.className}`}>
      {/* Section 1: Hero Section - Only if showBanner is true */}
      {showBanner && (
        <div className="relative w-full h-[90vh]">
          {/* Navbar on top of image */}
          <div className="absolute top-0 left-0 w-full">
            <Navbar />
          </div>
          <DynamicBanner />
        </div>
      )}

      {/* Navbar if no banner */}
      {!showBanner && (
        <div className="w-full">
          <Navbar />
        </div>
      )}

      <div
        className={`w-full h-auto md:space-y-14 space-y-8 pt-10 md:pt-14 select-none z-0 ${
          hoveredItem !== null ? "blur-[1px] bg-brand-200" : ""
        }`}
      >
        {/* Section 2: Page Title - Only if no banner */}
        {!showBanner && (
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-brand-900 mb-2">{dynamicTitle}</h1>
            <p className="text-brand-700">{dynamicSubtitle}</p>
          </div>
        )}

        {/* Section 3: Filter, Search & Sort - Conditional based on authentication */}
        <div
          className={`w-full h-auto transition-all duration-300 flex justify-between px-3 md:px-5`}
        >
          {isAuthenticated ? (
            <div className="flex flex-col justify-center items-center w-full">
              <div className="w-full md:h-[52px] h-[40px] border-2 border-black rounded-[50px] px-3 py-0 mb-2 justify-center items-center flex md:hidden">
                <SearchBar
                  {...{ search, setSearch, handleSearch, hoveredItem }}
                />
              </div>

              <div className="flex justify-between items-center w-full">
                {/* Filter */}
                <Badge dot={hasUserAppliedFilters()} offset={[-5, 5]}>
                  <div
                    className="flex border-2 md:h-[52px] h-[40px] border-black rounded-[50px] px-3 justify-center items-center cursor-pointer hover:bg-brand-50 transition-colors"
                    onClick={() => setIsFilterModalOpen(true)}
                  >
                    <Image
                      src="/assets/jewellery/filter-icon.svg"
                      alt="Filter"
                      width={24}
                      height={24}
                      className=""
                    />
                    <p className={`px-2 font-[500] text-[16px] ${garamond.className}`}>
                      Filter
                    </p>
                    <IoIosArrowDown className="h-[20px] w-auto cursor-pointer mt-1" />
                  </div>
                </Badge>

                {/* Search */}
                <div className="min-w-[550px] md:h-[52px] h-[40px] border-2 border-black rounded-[50px] px-3 py-1 justify-center items-center md:flex hidden">
                  <SearchBar
                    {...{ search, setSearch, handleSearch, hoveredItem }}
                  />
                </div>

                {/* Sort */}
                <Badge dot={hasActiveSort()} offset={[-5, 5]}>
                  <div
                    className="flex border-2  md:h-[52px] h-[40px] border-black rounded-[50px] px-5 justify-center items-center cursor-pointer hover:bg-brand-50 transition-colors"
                    onClick={() => setIsSortModalOpen(true)}
                  >
                    <Image
                      src="/assets/jewellery/filter-icon.svg"
                      alt="Sort"
                      width={24}
                      height={24}
                      className=""
                    />
                    <p className={`px-2 font-[500] text-[16px] ${garamond.className}`}>
                      Sort
                    </p>
                    <IoIosArrowDown className="h-[20px] w-auto cursor-pointer mt-1" />
                  </div>
                </Badge>
              </div>
            </div>
          ) : (
            // <div className="flex-1 text-center py-4">
            //   <h2 className="text-2xl font-semibold text-brand-900 mb-2">
            //     {dynamicTitle}
            //   </h2>
            //   <p className="text-brand-700">{dynamicSubtitle}</p>
            // </div>
            ""
          )}
        </div>

        {/* Section 4: Jewellery Items */}
        <div>
          <JewelleryProductList
            filters={filters}
            onFilterChange={handleFilterChange}
            onAvailableDataChange={(sizes, shapes) => {
              setAvailableSizes(sizes);
              setAvailableShapes(shapes);
            }}
          />
        </div>

        {/* Section 5: More loader */}
        {/* <Loader /> */}

        {/* Section 6: Footer Section */}
        <Footer />

        {/* Filter Drawer */}
        <Drawer
          title={
            <div className="text-brand-900 text-[18px] font-[500] text-start">
              FILTER
            </div>
          }
          open={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          placement="left"
          width={400}
          className={`text-brand-900 text-[14px] font-[500] text-start ${garamond.className}`}
          closable={true}
          maskClosable={false}
          styles={{
            body: { paddingBottom: 0 },
          }}
        >
          <div className="max-h-[calc(100vh-85px)] overflow-y-scroll scrollbar">
            <div className="space-y-6">
              {/* Type */}
              {/* <div>
                <h3 className="text-[14px] font-[500] text-brand-900 mb-3 border-b border-black pb-2">
                  TYPE
                </h3>
                <div className="space-y-2">
                  {dynamicCategories
                    .filter((cat: any) => cat.type === "COLLECTION")
                    .map((collection: any) => (
                      <label key={collection.id} className="flex items-center text-[14px]">
                        <input
                          type="radio"
                          name="type"
                          className="mr-3 w-4 h-4"
                          checked={selectedTypeId === collection.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTypeId(collection.id);
                              setSelectedCategoryId(""); // Clear category selection when type is selected
                            } else {
                              setSelectedTypeId("");
                            }
                          }}
                        />
                        {collection.name}
                      </label>
                    ))}
                </div>
              </div> */}

              {/* Categories */}
              <div>
                <h3 className="text-[14px] font-[500] text-brand-900 mb-3 border-b border-black pb-2">
                  CATEGORIES
                </h3>
                <div className="space-y-2">
                  {dynamicCategories.map((category) => {
                    // Show categories that are not collections OR if type is selected, show matching subcategories
                    const shouldShowCategory = category.type !== "COLLECTION" || !selectedTypeId;
                    const subCategoriesToShow = selectedTypeId 
                      ? category.subCategory?.filter((subCat: any) => 
                          subCat.type?.some((type: any) => type.id === selectedTypeId)
                        ) || []
                      : category.subCategory || [];

                    return shouldShowCategory ? (
                      <div key={category.id}>
                        <label className="flex items-center text-[14px] font-[500]">
                          <input
                            type="radio"
                            name="category"
                            className="mr-3 w-4 h-4"
                            checked={selectedCategoryId === category.id}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategoryId(category.id);
                                setSelectedTypeId(""); // Clear type selection when category is selected
                              } else {
                                setSelectedCategoryId("");
                              }
                            }}
                          />
                          {category.name}
                        </label>
                        
                        {/* Show subcategories if type is selected */}
                        {/* {selectedTypeId && subCategoriesToShow.length > 0 && (
                          <div className="ml-6 space-y-2">
                            {subCategoriesToShow.map((subCat: any) => (
                              <label key={subCat.id} className="flex items-center text-[14px]">
                                <input
                                  type="radio"
                                  name="subcategory"
                                  className="mr-3 w-4 h-4"
                                  checked={selectedCategoryId === subCat.id}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedCategoryId(subCat.id);
                                    } else {
                                      setSelectedCategoryId("");
                                    }
                                  }}
                                />
                                {subCat.name}
                              </label>
                            ))}
                          </div>
                        )} */}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-[14px] font-[500] text-brand-900 mb-3 border-b border-black pb-2">
                  PRICE
                </h3>
                <div className="px-2">
                  <Slider
                    range
                    min={calculatorData?.filterMin || 1}
                    max={calculatorData?.filterMax || 10000}
                    step={100}
                    value={priceRange}
                    onChange={(value) =>
                      setPriceRange(value as [number, number])
                    }
                    tooltip={{
                      formatter: (value) => `$${value}`,
                    }}
                  />
                  <div className="flex justify-between text-[14px] font-[400] text-brand-900 mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Gem Origin */}
              <div>
                <h3 className="text-[14px] font-[500] text-brand-900 mb-3 border-b border-black pb-2">
                  GEM ORIGIN
                </h3>
                <div className="space-y-2">
                  {["LAB_GROWN", "NATURAL"].map((origin) => (
                    <label key={origin} className="flex items-center text-[14px]">
                      <input
                        type="radio"
                        name="gemOrigin"
                        className="mr-3 w-4 h-4"
                        checked={selectedGemOrigin === origin}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGemOrigin(origin);
                          }
                        }}
                      />
                      <span>{origin.replaceAll("_", " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Diamond Shapes */}
              <div>
                <h3 className="text-[14px] font-[500] text-brand-900 mb-3 border-b border-black pb-2">
                  DIAMOND SHAPES
                </h3>
                <div className="space-y-2">
                  {availableShapes.map((shape) => (
                    <label
                      key={shape}
                      className="flex items-center text-[14px]"
                    >
                      <input
                        type="checkbox"
                        className="mr-3 w-4 h-4"
                        checked={selectedShapes
                          .split(",")
                          .includes(shape)}
                        onChange={(e) => {
                          const currentShapes = selectedShapes
                            .split(",")
                            .filter((s: string) => s);
                          if (e.target.checked) {
                            setSelectedShapes(
                              [...currentShapes, shape].join(",")
                            );
                          } else {
                            setSelectedShapes(
                              currentShapes
                                .filter((s: string) => s !== shape)
                                .join(",")
                            );
                          }
                        }}
                      />
                      {shape}
                    </label>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div>
                <h3 className="text-[14px] font-[500] text-brand-900 mb-3 border-b border-black pb-2">
                  MATERIAL
                </h3>
                <div className="space-y-2">
                  {["SILVER", "TEN_KT_GOLD", "FORTEEN_KT_GOLD", "EIGHTEEN_KT_GOLD"].map((material) => (
                    <label key={material} className="flex items-center text-[14px]">
                      <input
                        type="checkbox"
                        className="mr-3 w-4 h-4"
                        checked={selectedMaterial.includes(material)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMaterial(
                              [...selectedMaterial, material]
                            );
                          } else {
                            setSelectedMaterial(
                              selectedMaterial.filter((s: string) => s !== material)
                            );
                          }
                        }}
                      />
                      <span>
                        {material.replaceAll("_", " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Colour */}
              <div>
                <h3 className="text-[14px] font-[500] text-brand-900 mb-3 border-b border-black pb-2">
                  COLOUR
                </h3>
                <div className="space-y-2">
                  {["WHITE", "YELLOW", "ROSE"].map((color) => (
                    <label key={color} className="flex items-center text-[14px]">
                      <input
                        type="checkbox"
                        className="mr-3 w-4 h-4"
                        checked={selectedSizes
                          .split(",")
                          .includes(color)}
                        onChange={(e) => {
                          const currentSizes = selectedSizes
                            .split(",")
                            .filter((s: string) => s);
                          if (e.target.checked) {
                            setSelectedSizes(
                              [...currentSizes, color].join(",")
                            );
                          } else {
                            setSelectedSizes(
                              currentSizes
                                .filter((s: string) => s !== color)
                                .join(",")
                            );
                          }
                        }}
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              
              {/* Size */}
              <div>
                <h3 className="text-[14px] font-[500] text-brand-900 mb-3 border-b border-black pb-2">
                  SIZE
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableSizes.map((size) => (
                    <label key={size} className="flex items-center text-[14px]">
                      <input
                        type="checkbox"
                        className="mr-2 w-4 h-4"
                        checked={selectedSizes
                          .split(",")
                          .includes(size.toString())}
                        onChange={(e) => {
                          const currentSizes = selectedSizes
                            .split(",")
                            .filter((s: string) => s);
                          if (e.target.checked) {
                            setSelectedSizes(
                              [...currentSizes, size.toString()].join(",")
                            );
                          } else {
                            setSelectedSizes(
                              currentSizes
                                .filter((s: string) => s !== size.toString())
                                .join(",")
                            );
                          }
                        }}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="py-4 space-y-3">
                <button
                  onClick={resetFilters}
                  disabled={!hasActiveFilters()}
                  className={`w-full py-3 border rounded-full text-[14px] font-medium transition-colors ${
                    !hasActiveFilters()
                      ? "border-brand-200 text-brand-400 cursor-not-allowed"
                      : "border-black text-brand-900 hover:bg-brand-50"
                  }`}
                >
                  Reset Filters
                </button>
                <button
                  onClick={applyFilters}
                  disabled={!hasActiveFilters()}
                  className={`w-full py-3 rounded-full text-[14px] font-medium transition-colors ${
                    !hasActiveFilters()
                      ? "bg-brand-200 text-brand-600 cursor-not-allowed"
                      : "bg-black text-white hover:bg-brand-900"
                  }`}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </Drawer>
      </div>

      {/* Sort Modal */}
      <Modal
        title="Sort Options"
        open={isSortModalOpen}
        onCancel={() => setIsSortModalOpen(false)}
        footer={null}
        width={400}
        className={`text-brand-900 ${garamond.className}`}
        centered
        closable={true}
        maskClosable={true}
      >
        <div className="">
          {SORT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-1 hover:bg-brand-50 rounded cursor-pointer"
            >
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={selectedSort === option.value}
                onChange={() => {
                  setSelectedSort(option.value);
                  setIsSortModalOpen(false);
                }}
                className="text-brand-900"
              />
              <span className="text-brand-900">{option.label}</span>
            </label>
          ))}

          {hasActiveSort() && (
            <button
              onClick={resetSort}
              className="w-full mt-4 py-2 px-4 border border-brand-500 text-brand-800 hover:bg-brand-50 transition-colors rounded-full cursor-pointer"
            >
              Reset to Default
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default JewelleryBase;
