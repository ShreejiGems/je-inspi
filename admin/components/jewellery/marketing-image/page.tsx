"use client";

import React, { useState, useEffect, useRef } from "react";
import { jewelleryCategoryAPI } from "@/src/services/filter&sort/jewellery-category.api";
import { jewelleryProductAPI } from "@/src/services/product-services/jewellery-product.api";
import { marketingImageAPI } from "@/src/services/marketing-image.api";
import { uploadAPI } from "@/src/services/api";
import {
  validateFile,
  getFileType,
  generateFileName,
} from "@/src/utils/fileUtils";
import { JewelleryCategory } from "@/src/services/filter&sort/jewellery-category.api";
import { Product } from "@/src/services/product-services/jewellery-product.api";
import Loader from "@/components/common/loader";

interface CategoryWithImages extends JewelleryCategory {
  images: string[];
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
}

const MarketingImage = () => {
  const [categories, setCategories] = useState<CategoryWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  // Prime product states
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [primeImage, setPrimeImage] = useState<string | null>(null);
  const [isPrimeUploading, setIsPrimeUploading] = useState(false);
  const [primeUploadProgress, setPrimeUploadProgress] = useState(0);
  const [primeUploadError, setPrimeUploadError] = useState<string | null>(null);
  const [primeProducts, setPrimeProducts] = useState<any[]>([]);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productSaveError, setProductSaveError] = useState<string | null>(null);
  const [productSaveSuccess, setProductSaveSuccess] = useState<string | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    skip: 0,
    take: 20, // Fixed take value as per requirement
    hasMore: true,
    isLoading: false,
    totalItems: 0,
  });
  const productsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch enabled categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when category changes
  // Handle infinite scroll
  useEffect(() => {
    const container = productsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (pagination.isLoading || !pagination.hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      // Load more when user is within 100px of the bottom
      if (scrollHeight - (scrollTop + clientHeight) < 100) {
        fetchProducts(true);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [pagination.isLoading, pagination.hasMore, selectedCategory]);

  // Reset products and fetch when category changes
  useEffect(() => {
    if (selectedCategory) {
      // Reset pagination and products when category changes
      setProducts([]);
      setPagination((prev) => ({
        ...prev,
        skip: 0,
        hasMore: true,
        totalItems: 0,
      }));
      fetchProducts();
    } else {
      setProducts([]);
      setSelectedProduct(null);
      setPrimeImage(null);
      setPrimeProducts([]);
      setPagination((prev) => ({
        ...prev,
        skip: 0,
        hasMore: true,
        totalItems: 0,
      }));
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const param: any = { skip: 0, take: 50 };
      const enabledCategories: any =
        await jewelleryCategoryAPI.getAllEnabledCategories(param);
      console.log("Failed to fetch categories", enabledCategories);

      // Handle case when no categories exist
      if (!enabledCategories || enabledCategories?.list?.length === 0) {
        setCategories([]);
        setSelectedCategory(null);
        setLoading(false);
        return;
      }

      // Initialize categories with empty images array and loading state
      const categoriesWithImages: CategoryWithImages[] =
        enabledCategories.list.map((category: any) => ({
          ...category,
          images: [],
          isUploading: false,
          uploadProgress: 0,
          uploadError: null,
        }));

      setCategories(categoriesWithImages);

      // Set the first category as selected by default
      setSelectedCategory(categoriesWithImages[0].id);

      // Fetch existing marketing images for each category
      for (const category of categoriesWithImages) {
        try {
          const response: any = await marketingImageAPI.getMarketingImages(
            category.id
          );
          // Extract marketingImages array from response, set to empty array if null or undefined
          const images = response?.marketingImages || [];
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === category.id ? { ...cat, images } : cat
            )
          );
        } catch (error) {
          console.warn(
            `Failed to fetch images for category ${category.name}:`,
            error
          );
        }
      }
    } catch (error) {
      setError("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (isLoadMore = false) => {
    if (!selectedCategory || pagination.isLoading) return;

    try {
      setPagination((prev) => ({ ...prev, isLoading: true }));

      // Calculate skip value - if it's a load more, add take to the current skip, otherwise start from 0
      const skip = isLoadMore ? pagination.skip + pagination.take : 0;

      const response: any = await jewelleryProductAPI.getAllProducts({
        categoryId: selectedCategory,
        skip,
        take: pagination.take,
      });

      // If it's a load more, append new products, otherwise replace the list
      setProducts((prev) =>
        isLoadMore ? [...prev, ...response.list] : response.list
      );

      // Update pagination state
      setPagination((prev) => ({
        ...prev,
        skip,
        hasMore: response.list.length === pagination.take, // If we got a full page, there might be more
        isLoading: false,
        totalItems: isLoadMore
          ? prev.totalItems + response.list.length
          : response.list.length,
      }));

      // Only reset selected product and fetch prime products on initial load
      if (!isLoadMore) {
        setSelectedProduct(null);
        await fetchPrimeProducts();
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setPagination((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const fetchPrimeProducts = async () => {
    try {
      const response: any = await marketingImageAPI.getPrimeProducts();
      setPrimeProducts(response || []);

      // Check if there's a prime product for the selected category
      const primeProductForCategory = response?.find(
        (item: any) => item.product.categoryId === selectedCategory
      );

      if (primeProductForCategory) {
        setSelectedProduct(primeProductForCategory.product.jewellery.id);

        // Check if primeImage is valid (not null, not 'string', and not empty)
        const primeImageValue = primeProductForCategory.product.primeImage;
        const isValidPrimeImage =
          primeImageValue &&
          primeImageValue !== "string" &&
          primeImageValue.trim() !== "" &&
          primeImageValue.startsWith("http");

        if (isValidPrimeImage) {
          setPrimeImage(primeImageValue);
        } else {
          setPrimeImage(null);
        }
      } else {
        setSelectedProduct(null);
        setPrimeImage(null);
      }
    } catch (error) {
      console.error("Error fetching prime products:", error);
    }
  };

  const handleProductSelection = async (productId: string) => {
    if (!selectedCategory) return;

    // If selecting the same product, don't do anything
    if (selectedProduct === productId) return;

    setIsSavingProduct(true);
    setProductSaveError(null);
    setProductSaveSuccess(null);

    try {
      // Find the current prime product for this category
      const existingPrimeProduct = primeProducts.find(
        (item: any) => item.product.categoryId === selectedCategory
      );

      // Find the selected product details
      const selectedProductDetails = products.find((p) => p.id === productId);
      if (!selectedProductDetails) {
        throw new Error("Selected product not found");
      }

      if (existingPrimeProduct) {
        // Update existing prime product
        await marketingImageAPI.addOrEditPrimeProduct({
          categoryId: selectedCategory,
          productId: productId,
          primeImage: existingPrimeProduct.product.primeImage || "",
          productType: "JEWELLERY",
        });
      } else {
        // Create new prime product
        await marketingImageAPI.addOrEditPrimeProduct({
          categoryId: selectedCategory,
          productId: productId,
          primeImage: "",
          productType: "JEWELLERY",
        });
      }

      // Update local state
      setSelectedProduct(productId);
      setPrimeImage(existingPrimeProduct?.product.primeImage || null);
      
      // Refresh prime products data
      await fetchPrimeProducts();
      
      setProductSaveSuccess(`Prime product changed to ${selectedProductDetails.name}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setProductSaveSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error saving prime product:", error);
      setProductSaveError(error.message || "Failed to save prime product selection");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleImageUpload = async (categoryId: string, files: FileList) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    // Calculate total files that will be after upload
    const totalAfterUpload = category.images.length + fileArray.length;
    if (totalAfterUpload > 5) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                uploadError: `Cannot upload ${fileArray.length} files. Maximum 5 images allowed per category (${category.images.length} already uploaded)`,
                isUploading: false,
              }
            : cat
        )
      );
      return;
    }

    // Validate all files first
    const validFiles: File[] = [];
    const invalidFiles: { name: string; error: string }[] = [];

    fileArray.forEach((file) => {
      const validation = validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({
          name: file.name,
          error: validation.error || "Invalid file",
        });
      }
    });

    if (invalidFiles.length > 0) {
      const errorMessage = invalidFiles
        .map((f) => `${f.name}: ${f.error}`)
        .join("\n");

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, uploadError: errorMessage, isUploading: false }
            : cat
        )
      );

      // Don't return if there are valid files to upload
      if (validFiles.length === 0) return;
    }

    // Update upload state
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, isUploading: true, uploadProgress: 0, uploadError: null }
          : cat
      )
    );

    const uploadedUrls: string[] = [];
    const resourceType = "JEWELLERY";
    let successCount = 0;

    // Process files in sequence to avoid race conditions
    for (const file of validFiles) {
      try {
        // Update progress for current file
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  uploadProgress: (successCount / validFiles.length) * 100,
                }
              : cat
          )
        );

        const fileType = getFileType(file);
        const fileName = generateFileName(
          file.name,
          `marketing_${categoryId}_${Date.now()}`
        );

        // Get presigned URL and upload
        const { preSignedUrl, outPutUrl } = await uploadAPI.getPresignedUrl(
          fileName,
          fileType,
          resourceType
        );

        await uploadAPI.uploadToS3(preSignedUrl, file);
        uploadedUrls.push(outPutUrl);
        successCount++;
      } catch (error: any) {
        console.error(`Error uploading ${file.name}:`, error);
        // Continue with next file even if one fails
      }
    }

    if (uploadedUrls.length > 0) {
      try {
        // Add all successfully uploaded images at once
        const updatedImages = [...category.images, ...uploadedUrls];
        await marketingImageAPI.addMarketingImages(categoryId, updatedImages);

        // Update state with all new images
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  images: updatedImages,
                  isUploading: false,
                  uploadProgress: 100,
                  uploadError: null,
                }
              : cat
          )
        );
      } catch (error: any) {
        console.error("Error updating marketing images:", error);
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  isUploading: false,
                  uploadError:
                    "Error updating marketing images. Some files may not have been saved.",
                }
              : cat
          )
        );
      }
    } else if (validFiles.length > 0) {
      // No files were uploaded successfully
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                isUploading: false,
                uploadError: "Failed to upload any files. Please try again.",
              }
            : cat
        )
      );
    }
  };

  const handleImageDelete = async (categoryId: string, imageIndex: number) => {
    try {
      const category = categories.find((cat) => cat.id === categoryId);
      if (!category) return;

      const imageToDelete = category.images[imageIndex];

      // Extract filename from URL for S3 deletion
      const urlParts: any = imageToDelete.split("/");
      const fileName = urlParts[urlParts.length - 1].split("?")[0];

      // Delete from S3
      await uploadAPI.deleteFile(fileName, "IMAGE", "JEWELLERY");

      // Get remaining images after deletion
      const remainingImages = category.images.filter(
        (_, index) => index !== imageIndex
      );

      // Update marketing images with remaining URLs
      await marketingImageAPI.addMarketingImages(categoryId, remainingImages);

      // Update local state
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                images: cat.images.filter((_, index) => index !== imageIndex),
              }
            : cat
        )
      );
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleFileInputChange = (
    categoryId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleImageUpload(categoryId, files);
    }
    // Reset the input value so the same files can be selected again
    event.target.value = "";
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    setDragOver(null);
    if (e.dataTransfer.files.length > 0) {
      handleImageUpload(categoryId, e.dataTransfer.files);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    setDragOver(categoryId);
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  // Prime image handling functions
  const handlePrimeImageUpload = async (file: File) => {
    if (!selectedProduct) {
      setPrimeUploadError("Please select a product first");
      return;
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setPrimeUploadError(validation.error || "Invalid file");
      return;
    }

    setIsPrimeUploading(true);
    setPrimeUploadError(null);
    setPrimeUploadProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setPrimeUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Determine file type and resource type
      const fileType = getFileType(file);
      const resourceType = "JEWELLERY";

      // Generate unique filename
      const fileName = generateFileName(file.name, `prime_${selectedProduct}`);

      // Get presigned URL
      const { preSignedUrl, outPutUrl } = await uploadAPI.getPresignedUrl(
        fileName,
        fileType,
        resourceType
      );

      // Upload to S3
      await uploadAPI.uploadToS3(preSignedUrl, file);

      // Add prime image to product
      await marketingImageAPI.addOrEditPrimeProduct({
        categoryId: selectedCategory || undefined,
        productId: selectedProduct,
        primeImage: outPutUrl,
        productType: "JEWELLERY",
      });

      clearInterval(progressInterval);
      setPrimeUploadProgress(100);
      setPrimeImage(outPutUrl);

      // Refresh prime products data
      await fetchPrimeProducts();

      // Reset progress after delay
      setTimeout(() => {
        setPrimeUploadProgress(0);
        setIsPrimeUploading(false);
      }, 1000);
    } catch (error: any) {
      console.error("Prime image upload error:", error);
      setPrimeUploadError(error.message || "Upload failed");
      setIsPrimeUploading(false);
      setPrimeUploadProgress(0);
    }
  };

  const handlePrimeFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handlePrimeImageUpload(files[0]);
    }
    // Reset the input value so the same file can be selected again
    event.target.value = "";
  };

  const handlePrimeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    if (e.dataTransfer.files.length > 0) {
      handlePrimeImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePrimeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver("prime");
  };

  const handlePrimeDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm h-[calc(100%-65px)]">
        <div className="flex items-center justify-between px-6 py-2 border-b border-brand-100">
          <h1 className="text-2xl font-semibold text-brand-900">
            Marketing Image
          </h1>
        </div>
        <div className="flex items-center justify-center h-full">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm h-[calc(100%-65px)]">
        <div className="flex items-center justify-between px-6 py-2 border-b border-brand-100">
          <h1 className="text-2xl font-semibold text-brand-900">
            Marketing Image
          </h1>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCategories}
              className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-brand-100">
        <h1 className="text-2xl font-semibold text-brand-900">
          Marketing Image
        </h1>
      </div>

      {/* Content */}
      <div className="py-6 pl-6 h-[calc(100%-50px)]">
        {categories.length === 0 ? (
          // No categories available
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-brand-200 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-lg font-medium text-brand-800 mb-2">
              No Categories Available
            </h3>
            <p className="text-brand-600 mb-4">
              There are no enabled jewellery categories to manage marketing
              images for.
            </p>
            <button
              onClick={fetchCategories}
              className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-8 h-full">
            {/* Categories Column - Fixed */}
            <div className="col-span-1">
              <h2 className="text-lg font-semibold text-brand-900 mb-4">
                Categories
              </h2>
              <div className="space-y-2 h-[calc(100vh-260px)] overflow-auto scrollbar">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedCategory === category.id
                        ? "bg-brand-100 text-brand-800"
                        : "bg-brand-50 hover:bg-brand-50 text-brand-900"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="font-medium">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Images Grid - Scrollable */}
            <div className="col-span-3 h-full overflow-auto scrollbar pr-6">
              <h2 className="text-lg font-semibold text-brand-900 mb-4">
                Marketing Images
              </h2>
              {selectedCategory ? (
                <div className="grid grid-cols-3 gap-4">
                  {/* Existing Images */}
                  {categories
                    .find((cat) => cat.id === selectedCategory)
                    ?.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-brand-100 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Marketing image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() =>
                            handleImageDelete(selectedCategory, index)
                          }
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center cursor-pointer justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                  {/* Upload Field - Only show if less than 5 images */}
                  {selectedCategory &&
                    (() => {
                      const category = categories.find(
                        (cat) => cat.id === selectedCategory
                      );
                      return category && category.images.length < 5;
                    })() && (
                      <div className="relative">
                        <input
                          type="file"
                          id={`file-${selectedCategory}`}
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={(e) =>
                            handleFileInputChange(selectedCategory, e)
                          }
                          disabled={
                            categories.find(
                              (cat) => cat.id === selectedCategory
                            )?.isUploading
                          }
                        />
                        <label
                          htmlFor={`file-${selectedCategory}`}
                          className={`aspect-square bg-brand-100 rounded-lg border-2 border-dashed border-brand-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 transition-colors ${
                            categories.find(
                              (cat) => cat.id === selectedCategory
                            )?.isUploading
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          } ${
                            dragOver === selectedCategory
                              ? "border-brand-500 bg-brand-100 scale-105"
                              : ""
                          }`}
                          onDrop={(e) => handleDrop(e, selectedCategory)}
                          onDragOver={(e) =>
                            handleDragOver(e, selectedCategory)
                          }
                          onDragLeave={handleDragLeave}
                        >
                          {categories.find((cat) => cat.id === selectedCategory)
                            ?.isUploading ? (
                            <div className="text-center w-full p-2">
                              <div className="relative">
                                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-2"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-sm font-medium text-brand-600">
                                    {
                                      categories.find(
                                        (cat) => cat.id === selectedCategory
                                      )?.uploadProgress
                                    }
                                    %
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className="w-full bg-brand-100 rounded-full h-2">
                                  <div
                                    className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${
                                        categories.find(
                                          (cat) => cat.id === selectedCategory
                                        )?.uploadProgress
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <p className="text-xs text-brand-700 mt-1">
                                  Uploading{" "}
                                  {Math.ceil(
                                    (categories.find(
                                      (cat) => cat.id === selectedCategory
                                    )?.uploadProgress || 0) / 25
                                  )}{" "}
                                  of 4 files
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <svg
                                className="w-8 h-8 text-brand-400 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <span className="text-sm text-brand-600 text-center">
                                Drop files here or click to upload
                                <span className="block text-xs mt-1">
                                  (Max 5 images per category, supports multiple
                                  selection)
                                </span>
                              </span>
                            </>
                          )}
                        </label>

                        {/* Error message */}
                        {categories.find((cat) => cat.id === selectedCategory)
                          ?.uploadError && (
                          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-lg">
                            <p className="text-xs text-red-700">
                              {
                                categories.find(
                                  (cat) => cat.id === selectedCategory
                                )?.uploadError
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-brand-200 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-brand-800 mb-2">
                    Select a Category
                  </h3>
                  <p className="text-brand-600">
                    Choose a category from the left to manage its marketing
                    images.
                  </p>
                </div>
              )}

              {/* Prime Image Section */}
              <div className="mt-8 border-t border-brand-100 pt-8">
                <h2 className="text-xl font-semibold text-brand-900 mb-6">
                  Prime Product Image
                </h2>

                <div className="grid grid-cols-4 gap-6">
                  {/* Product Selection */}
                  <div className="col-span-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-brand-800">
                        Select Product
                      </h3>
                    </div>
                    <div
                      ref={productsContainerRef}
                      className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-brand-200 scrollbar-track-brand-50"
                    >
                      {products.length > 0 ? (
                        products.map((product) => (
                          <div
                            key={product.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors relative ${
                              selectedProduct === product.id
                                ? "border-brand-500 bg-brand-50"
                                : "border-brand-100 hover:border-brand-200"
                            } ${isSavingProduct && selectedProduct === product.id ? "opacity-50" : ""}`}
                            onClick={() => handleProductSelection(product.id)}
                          >
                            <div className="font-medium text-brand-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-brand-600">
                              SKU: {product.sku}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <svg
                            className="w-12 h-12 text-brand-200 mx-auto mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          <p className="text-brand-600 text-sm">
                            {selectedCategory
                              ? "No products found in this category"
                              : "Select a category to view products"}
                          </p>
                        </div>
                      )}
                      {/* Product Selection Messages */}
                      {productSaveError && (
                        <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded-lg">
                          <p className="text-xs text-red-700">{productSaveError}</p>
                        </div>
                      )}
                      {productSaveSuccess && (
                        <div className="mb-3 p-2 bg-brand-100 border border-brand-300 rounded-lg">
                          <p className="text-xs text-brand-700">{productSaveSuccess}</p>
                        </div>
                      )}
                      
                      {pagination.isLoading && (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        </div>
                      )}
                      {!pagination.hasMore && products.length > 0 && (
                        <div className="text-center py-2 text-sm text-brand-600">
                          No more products to load
                        </div>
                      )}
                      
                      {isSavingProduct && (
                        <div className="text-center py-2 text-sm text-brand-600">
                          Saving prime product selection...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prime Image Upload */}
                  <div className="col-span-3">
                    <h3 className="text-lg font-medium text-brand-800 mb-4">
                      Prime Image
                    </h3>

                    {selectedProduct ? (
                      <div className="space-y-4">
                        {/* Current Prime Image */}
                        {primeImage ? (
                          <div className="relative group">
                            <div className="aspect-square bg-brand-100 rounded-lg overflow-hidden max-w-md">
                              <img
                                src={primeImage}
                                alt="Prime product image"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="mt-2 text-sm text-brand-700">
                              Current prime image for{" "}
                              {
                                products.find((p) => p.id === selectedProduct)
                                  ?.name
                              }
                            </div>
                          </div>
                        ) : (
                          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <svg
                                className="w-5 h-5 text-brand-600 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                              </svg>
                              <span className="text-sm text-brand-800">
                                Prime product selected but no prime image
                                uploaded yet
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Upload Area */}
                        <div className="relative">
                          <input
                            type="file"
                            id="prime-file"
                            className="hidden"
                            accept="image/*"
                            onChange={handlePrimeFileInputChange}
                            disabled={isPrimeUploading}
                          />
                          <label
                            htmlFor="prime-file"
                            className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                              dragOver === "prime"
                                ? "border-brand-500 bg-brand-50"
                                : "border-brand-200 hover:border-brand-400"
                            } ${
                              isPrimeUploading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onDrop={handlePrimeDrop}
                            onDragOver={handlePrimeDragOver}
                            onDragLeave={handlePrimeDragLeave}
                          >
                            {isPrimeUploading ? (
                              <div className="space-y-3">
                                <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <div className="text-sm text-brand-700">
                                  Uploading... {primeUploadProgress}%
                                </div>
                              </div>
                            ) : (
                              <>
                                <svg
                                  className="w-12 h-12 text-brand-400 mx-auto mb-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                  />
                                </svg>
                                <div className="text-sm text-brand-700">
                                  <span className="font-medium text-brand-600">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </div>
                                <div className="text-xs text-brand-600 mt-1">
                                  PNG, JPG, GIF up to 10MB
                                </div>
                              </>
                            )}
                          </label>

                          {/* Error message */}
                          {primeUploadError && (
                            <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                              <p className="text-sm text-red-700">
                                {primeUploadError}
                              </p>
                            </div>
                          )}

                          {/* Success message */}
                          {primeImage &&
                            !isPrimeUploading &&
                            !primeUploadError && (
                              <div className="mt-3 p-3 bg-brand-100 border border-brand-300 rounded-lg">
                                <p className="text-sm text-brand-700">
                                  {primeProducts.find(
                                    (pp: any) =>
                                      pp.product.categoryId ===
                                        selectedCategory &&
                                      pp.product.primeImage
                                  )
                                    ? "Prime image updated successfully!"
                                    : "Prime image uploaded successfully!"}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg
                          className="w-16 h-16 text-brand-200 mx-auto mb-4"
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
                        <h3 className="text-lg font-medium text-brand-800 mb-2">
                          Select a Product
                        </h3>
                        <p className="text-brand-600">
                          Choose a product from the left to upload its prime
                          image.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingImage;
