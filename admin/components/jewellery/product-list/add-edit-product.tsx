"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiTrash2, FiPlus, FiUpload, FiX } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import { message, Select } from "antd";
import type { SelectProps } from "antd";
import Loader from "@/components/common/loader";
import {
  jewelleryProductAPI,
  type Product,
  type Variant,
  type GemDetail,
  type Measurement,
  type ProductImage,
} from "@/src/services/product-services/jewellery-product.api";
import {
  jewelleryCategoryAPI,
  type JewelleryCategory,
} from "@/src/services/filter&sort/jewellery-category.api";
import {
  JewellerySubCategoryAPI,
  type JewellerySubCategory,
} from "@/src/services/filter&sort/jewellery-sub-category.api";
import {
  CollectionAPI,
  type Collection,
} from "@/src/services/filter&sort/jewellery-collection.api";
import {
  JewelleryTypeAPI,
  type JewelleryType,
} from "@/src/services/filter&sort/jewellery-type.api";
import { FaChevronDown } from "react-icons/fa";
import {
  validateFile,
  formatFileSize,
  getFileType,
  generateFileName,
} from "@/src/utils/fileUtils";
import { uploadAPI } from "@/src/services/api";
import {
  COLORS,
  DIAMOND_SHAPES,
  DIAMOND_COLORS,
  DIAMOND_CLARITIES,
} from "@/src/libs/constants";
import { originLabels } from "@/src/libs/constants";

// ===== Helpers =====
const newGemDetail = (): GemDetail => ({
  shape: "",
  mm: "",
  weight: undefined,
  color: "",
  clarity: "",
  quantity: undefined,
});

const newVariant = (): Variant => ({
  size: undefined,
  gemOrigin: "NATURAL",
  gemDetails: [],
  materialDetails: {
    silver: undefined,
    tenKtGold: undefined,
    forteenKtGold: undefined,
    eighteenKtGold: undefined,
  },
  measurements: [{ field: "", value: "" }],
});

// Convert File -> base64 (dataURL) so you can send right away or store temporarily
const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h3 className="text-lg font-semibold text-brand-900 mb-4 relative">
    <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-600 to-brand-500 rounded-full"></span>
    <span className="pl-4">{title}</span>
  </h3>
);

const AddEditProduct: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const productId = params.get("id") || undefined; // Edit when id present
  const mode = params.get("mode") as "view" | "edit" | null;
  let isViewMode = mode === "view";
  let isEditMode = mode === "edit";
  let isAddMode = !productId && !mode;

  // ======= Core Product State =======
  const [product, setProduct] = useState<Product>({
    name: "",
    sku: "",
    categoryId: "",
    subCategoryId: "",
    typeId: "",
    description: "",
    variants: [newVariant()],
    collectionId: [],
    images: [],
  });

  // Store original product data for reset functionality
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);

  // ======= UI State =======
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeColor, setActiveColor] =
    useState<(typeof COLORS)[number]>("WHITE");
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>(
    {},
  );
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const [variantSizeInputs, setVariantSizeInputs] = useState<Record<string, string>>({});

  // ======= Options (Selects) =======
  const [categories, setCategories] = useState<JewelleryCategory[]>([]);
  const [subCategories, setSubCategories] = useState<JewellerySubCategory[]>(
    [],
  );
  const [types, setTypes] = useState<JewelleryType[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // ===== Fetch Options & Existing Product (if editing) =====
  useEffect(() => {
    (async () => {
      try {
        setFetching(true);
        const param: any = { skip: 0, take: 50 };

        const [catRes, colRes]: any = await Promise.all([
          jewelleryCategoryAPI.getAllEnabledCategories(param),
          CollectionAPI.getAllEnabledCollections(),
        ]);
        setCategories(catRes.list);
        setCollections(colRes);

        if (productId) {
          const existing = await jewelleryProductAPI.getProductById(productId);
          const mapped: any = mapApiToForm(existing);
          setProduct(mapped);
          setOriginalProduct(mapped); // Store original data

          if (existing.categoryId) {
            const subs =
              await JewellerySubCategoryAPI.getAllEnabledSubCategories(
                existing.categoryId,
              );
            setSubCategories(subs);
          }
          if (existing.subCategoryId) {
            const typeRes = await JewelleryTypeAPI.getAllEnabledTypes(
              existing.subCategoryId,
            );
            setTypes(typeRes);
          }
        }
      } catch (e: any) {
        let errorMessage = "";
        if (e?.response?.data?.message) {
          if (Array.isArray(e.response.data.message)) {
            errorMessage = e.response.data.message.join(", ");
          } else {
            errorMessage = e.response.data.message;
          }
        } else if (e?.response?.data) {
          errorMessage = typeof e.response.data === 'string'
            ? e.response.data
            : JSON.stringify(e.response.data);
        } else if (e?.message) {
          errorMessage = e.message;
        } else {
          errorMessage = e?.toString() || "Failed to load data";
        }
        setError(errorMessage);
      } finally {
        setFetching(false);
      }
    })();
  }, [productId]);

  const normalizeImages = (images: string | any[] | null | undefined) => {
    if (!images) return [];

    // If already an array
    if (Array.isArray(images)) return images;

    // If string → parse it
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  };

  const mapApiToForm = (data: any): Product => {
    const mappedProduct: Product = {
      // id: data.id,
      name: data.name || "",
      sku: data.sku || "",
      categoryId: data.categoryId || "",
      subCategoryId: data.subCategoryId || "",
      typeId: data.typeId || "",
      description: data.description || "",
      // isPrime: data.isPrime || false,
      // status: data.status || "ENABLED",

      // collections (extract IDs)
      collectionId: (data.jewelleryCollection || []).map(
        (c: any) => c.collectionId,
      ),

      // variants: normalize to match newVariant() shape
      variants: (data.jewelleryVariant || []).map((v: any) => ({
        id: v.id,
        size: v.size !== null && v.size !== undefined ? Number(v.size) : undefined,
        gemOrigin: v.gemOrigin || "NATURAL",
        gemDetails: Array.isArray(v.gem) ? v.gem : [newGemDetail()],
        materialDetails: {
          silver: v.silver !== null && v.silver !== undefined ? Number(v.silver) : undefined,
          tenKtGold: v.tenKtGold !== null && v.tenKtGold !== undefined ? Number(v.tenKtGold) : undefined,
          forteenKtGold: v.forteenKtGold !== null && v.forteenKtGold !== undefined ? Number(v.forteenKtGold) : undefined,
          eighteenKtGold: v.eighteenKtGold !== null && v.eighteenKtGold !== undefined ? Number(v.eighteenKtGold) : undefined,
        },
        measurements: v.mesurement
          ? Object.entries(v.mesurement).map(([field, value]) => ({
            field,
            value: value || "",
          }))
          : [{ field: "", value: "" }],
        status: v.status || "ENABLED",
      })),

      // images (map from API structure to form structure)
      images: normalizeImages(data.images).map((img: any) => ({
        image: img.image,
        color: img.color,
      })),
    };

    // Initialize variantSizeInputs for existing variants
    const sizeInputs: Record<string, string> = {};
    mappedProduct.variants.forEach((variant, index) => {
      if (variant.size !== undefined) {
        sizeInputs[`variant-${index}`] = String(variant.size);
      }
    });
    setVariantSizeInputs(sizeInputs);

    return mappedProduct;
  };

  // ======= Derived =======
  const imagesByColor: any = useMemo(() => {
    const map: Record<string, ProductImage[]> = {};
    for (const c of COLORS) map[c] = [];
    for (const img of product.images) {
      if (!map[img.color]) map[img.color] = [];
      map[img.color].push(img);
    }
    return map;
  }, [product.images]);

  // ======= Reset Function =======
  const resetToOriginal = () => {
    if (originalProduct) {
      setProduct({ ...originalProduct });

      // Reset variant size inputs
      const sizeInputs: Record<string, string> = {};
      originalProduct.variants.forEach((variant, index) => {
        if (variant.size !== undefined) {
          sizeInputs[`variant-${index}`] = String(variant.size);
        }
      });
      setVariantSizeInputs(sizeInputs);

      // Clear any error/success messages
      setError("");
      setSuccess("");

      // Clear upload states
      setUploadingFiles({});
      setUploadErrors({});
      setUploadProgress({});
    }
  };

  // ======= General Handlers =======
  const setField = (key: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleCategoryChange: SelectProps["onChange"] = async (val) => {
    setField("categoryId", String(val));
    setField("subCategoryId", "");
    setField("typeId", "");
    setTypes([]); // clear types when category changes
    try {
      const subs = await JewellerySubCategoryAPI.getAllEnabledSubCategories(
        String(val),
      );
      setSubCategories(subs);
    } catch (e: any) {
      let errorMessage = "";
      if (e?.response?.data?.message) {
        if (Array.isArray(e.response.data.message)) {
          errorMessage = e.response.data.message.join(", ");
        } else {
          errorMessage = e.response.data.message;
        }
      } else if (e?.response?.data) {
        errorMessage = typeof e.response.data === 'string'
          ? e.response.data
          : JSON.stringify(e.response.data);
      } else if (e?.message) {
        errorMessage = e.message;
      } else {
        errorMessage = e?.toString() || "Failed to fetch sub categories";
      }
      setError(errorMessage);
    }
  };

  const handleSubCategoryChange: SelectProps["onChange"] = async (val) => {
    setField("subCategoryId", String(val));
    setField("typeId", "");
    try {
      const typeRes = await JewelleryTypeAPI.getAllEnabledTypes(String(val));
      setTypes(typeRes);
    } catch (e: any) {
      let errorMessage = "";
      if (e?.response?.data?.message) {
        if (Array.isArray(e.response.data.message)) {
          errorMessage = e.response.data.message.join(", ");
        } else {
          errorMessage = e.response.data.message;
        }
      } else if (e?.response?.data) {
        errorMessage = typeof e.response.data === 'string'
          ? e.response.data
          : JSON.stringify(e.response.data);
      } else if (e?.message) {
        errorMessage = e.message;
      } else {
        errorMessage = e?.toString() || "Failed to fetch types";
      }
      setError(errorMessage);
      setTypes([]);
    }
  };

  const handleTypeChange: SelectProps["onChange"] = (val) =>
    setField("typeId", String(val));
  const handleCollectionChange: SelectProps["onChange"] = (vals) => {
    const ids = Array.isArray(vals) ? vals : [vals];
    setField("collectionId", ids as string[]);
  };

  // ======= Variant Handlers =======
  const updateVariant = (idx: number, patch: Partial<Variant>) => {
    setProduct((prev) => {
      const variants = [...prev.variants];
      variants[idx] = { ...variants[idx], ...patch } as Variant;
      return { ...prev, variants };
    });
  };

  const setVariantMaterial = (
    idx: number,
    key: keyof Variant["materialDetails"],
    value: number | any,
  ) => {
    updateVariant(idx, {
      materialDetails: {
        ...product.variants[idx].materialDetails,
        [key]: value,
      },
    });
  };

  const setGemDetail = (
    vIdx: number,
    gIdx: number,
    patch: Partial<GemDetail>,
  ) => {
    const variant = product.variants[vIdx];
    const gemDetails = [...variant.gemDetails];
    gemDetails[gIdx] = { ...gemDetails[gIdx], ...patch } as GemDetail;
    updateVariant(vIdx, { gemDetails });
  };

  const addGemDetailRow = (vIdx: number) => {
    const variant = product.variants[vIdx];
    updateVariant(vIdx, {
      gemDetails: [...variant.gemDetails, newGemDetail()],
    });
  };

  const removeGemDetailRow = (vIdx: number, gIdx: number) => {
    const variant = product.variants[vIdx];
    const gemDetails: any = variant.gemDetails.filter((_, i) => i !== gIdx);
    updateVariant(vIdx, { gemDetails: gemDetails });
  };

  const setMeasurement = (
    vIdx: number,
    mIdx: number,
    patch: Partial<Measurement>,
  ) => {
    const variant = product.variants[vIdx];
    const measurements = [...variant.measurements];
    measurements[mIdx] = { ...measurements[mIdx], ...patch } as Measurement;
    updateVariant(vIdx, { measurements });
  };

  const addMeasurementRow = (vIdx: number) => {
    const variant = product.variants[vIdx];
    updateVariant(vIdx, {
      measurements: [...variant.measurements, { field: "", value: "" }],
    });
  };

  const removeMeasurementRow = (vIdx: number, mIdx: number) => {
    const variant = product.variants[vIdx];
    const measurements: any = variant.measurements.filter((_, i) => i !== mIdx);
    updateVariant(vIdx, {
      measurements: measurements.length
        ? measurements
        : [{ field: "", value: "" }],
    });
  };

  const addVariant = () =>
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant()],
    }));
  const removeVariant = (idx: number) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
    
    // Update variantSizeInputs to reflect the new variant indices
    setVariantSizeInputs((prev) => {
      const newInputs: Record<string, string> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const variantIndex = parseInt(key.split('-')[1]);
        if (variantIndex < idx) {
          // Keep variants before the removed one
          newInputs[key] = value;
        } else if (variantIndex > idx) {
          // Shift variants after the removed one up by one index
          newInputs[`variant-${variantIndex - 1}`] = value;
        }
        // If variantIndex === idx, it's the removed variant, so skip it
      });
      return newInputs;
    });
  };

  // ======= Size Expansion Handlers =======
  const handleSizeInputChange = (vIdx: number, value: string) => {
    setVariantSizeInputs((prev) => ({
      ...prev,
      [`variant-${vIdx}`]: value,
    }));

    // Update the variant's size to the first size in the comma-separated list
    const sizes = value.split(',').map(s => s.trim()).filter(s => s);
    const firstSize = sizes.length > 0 ? (isNaN(Number(sizes[0])) ? undefined : Number(sizes[0])) : undefined;
    updateVariant(vIdx, { size: firstSize });
  };

  const expandVariantSizes = (variant: Variant, sizeInput: string): Variant[] => {
    const sizes = sizeInput.split(',').map(s => s.trim()).filter(s => s);

    if (sizes.length <= 1) {
      return [variant];
    }

    // Create multiple variants with different sizes but same other details
    return sizes.map(size => ({
      ...variant,
      size: isNaN(Number(size)) ? undefined : Number(size),
    }));
  };

  // ======= Image Handlers =======
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const triggerFileSelect = (color: string) =>
    fileInputs.current[color]?.click();

  const onFilePicked = async (
    color: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Upload all selected files
    const uploadPromises = Array.from(files).map(file => handleFileUpload(file, color));
    await Promise.all(uploadPromises);

    e.target.value = "";
  };

  const handleFileUpload = async (file: File, color: string) => {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setUploadErrors((prev) => ({
        ...prev,
        [`${color}_${file.name}`]: validation.error || "Invalid file",
      }));
      return;
    }

    // Clear any previous errors for this specific file
    setUploadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${color}_${file.name}`];
      return newErrors;
    });

    // Set uploading state for this specific file
    const uploadKey = `${color}_${file.name}`;
    setUploadingFiles((prev) => ({ ...prev, [uploadKey]: true }));
    setUploadProgress((prev) => ({ ...prev, [uploadKey]: 0 }));

    try {
      // Always use S3 upload for new images
      await handleS3Upload(file, color);
    } catch (error: any) {
      setUploadErrors((prev) => ({
        ...prev,
        [uploadKey]: (() => {
          let errorMessage = "";
          if (error?.response?.data?.message) {
            if (Array.isArray(error.response.data.message)) {
              errorMessage = error.response.data.message.join(", ");
            } else {
              errorMessage = error.response.data.message;
            }
          } else if (error?.response?.data) {
            errorMessage = typeof error.response.data === 'string'
              ? error.response.data
              : JSON.stringify(error.response.data);
          } else if (error?.message) {
            errorMessage = error.message;
          } else {
            errorMessage = error?.toString() || "Failed to upload file. Please try again.";
          }
          return errorMessage;
        })(),
      }));
    } finally {
      setUploadingFiles((prev) => {
        const newUploading = { ...prev };
        delete newUploading[uploadKey];
        return newUploading;
      });
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[uploadKey];
        return newProgress;
      });
    }
  };

  const handleS3Upload = async (file: File, color: string) => {
    const uploadKey = `${color}_${file.name}`;

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => ({
        ...prev,
        [uploadKey]: Math.min((prev[uploadKey] || 0) + 10, 90),
      }));
    }, 200);

    try {
      // Determine file type and resource type
      const fileType = getFileType(file);
      const resourceType = "JEWELLERY";

      // Generate unique filename
      const fileName = generateFileName(file.name, `PRODUCT_${color}`);

      // Get presigned URL
      const { preSignedUrl, outPutUrl } = await uploadAPI.getPresignedUrl(
        fileName,
        fileType,
        resourceType,
      );

      // Upload to S3
      await uploadAPI.uploadToS3(preSignedUrl, file);

      clearInterval(progressInterval);
      setUploadProgress((prev) => ({ ...prev, [uploadKey]: 100 }));

      // Add the uploaded image with S3 URL to product - only store color and image URL
      setProduct((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            color,
            image: outPutUrl,
            fileName: fileName, // Store filename for potential deletion
          },
        ],
      }));
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  };

  // Remove base64 upload function as we're always using S3 now

  const removeImage = async (color: string, indexInColor: number) => {
    // Find the image to remove
    const list = product.images.filter((img) => img.color === color);
    const target = list[indexInColor];

    if (!target) return;

    // Check if this is an S3 uploaded file (has fileName and is a URL)
    const isS3File =
      target.fileName &&
      target.image &&
      (target.image.startsWith("http://") ||
        target.image.startsWith("https://"));

    if (isS3File && target.fileName) {
      try {
        // Extract filename from the stored fileName
        const fileName = target.fileName;
        const fileType = getFileTypeFromFileName(fileName);
        const resourceType = "JEWELLERY";

        // Delete from S3
        await uploadAPI.deleteFile(fileName, fileType, resourceType);
      } catch (error: any) {
        console.error("Failed to delete file from S3:", error);
        // Continue with local removal even if S3 deletion fails
      }
    }

    // Remove from local state using a more reliable comparison
    setProduct((prev) => {
      const newImages = [...prev.images];
      let foundIndex = -1;

      // Find the exact index of the image to remove by comparing color and image URL
      for (let i = 0; i < newImages.length; i++) {
        if (newImages[i].color === target.color && newImages[i].image === target.image) {
          foundIndex = i;
          break;
        }
      }

      // Remove the image at the found index
      if (foundIndex !== -1) {
        newImages.splice(foundIndex, 1);
      }

      return {
        ...prev,
        images: newImages,
      };
    });
  };

  // Helper function to get file type from filename
  const getFileTypeFromFileName = (fileName: string): "IMAGE" | "VIDEO" => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
    const videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".mkv"];

    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf("."));

    if (imageExtensions.includes(ext)) return "IMAGE";
    if (videoExtensions.includes(ext)) return "VIDEO";

    // Default to IMAGE
    return "IMAGE";
  };

  // Helper function to detect if URL is a video
  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".mkv"];
    const urlLower = url.toLowerCase();
    return videoExtensions.some((ext) => urlLower.includes(ext));
  };

  const handleDragOver = (e: React.DragEvent, color: string) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent, color: string) => {
    e.preventDefault();
    e.stopPropagation();

    const files: any = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Upload all dropped files
    const uploadPromises = files.map((file: any) => handleFileUpload(file, color));
    await Promise.all(uploadPromises);
  };

  // ======= Validation & Save =======
  const validate = (): string | null => {
    if (!product.name?.trim()) return "Name is required";
    if (!product.sku?.trim()) return "SKU is required";
    if (!product.categoryId) return "Category is required";
    if (!product.subCategoryId) return "Sub Category is required";
    if (!product.typeId) return "Type is required";
    if (!product.variants.length) return "At least one variation is required";

    for (let i = 0; i < product.variants.length; i++) {
      const v = product.variants[i];
      const sizeInput = variantSizeInputs[`variant-${i}`] !== undefined ? variantSizeInputs[`variant-${i}`] : (v.size !== undefined ? String(v.size) : "");

      // Validate comma-separated sizes
      if (sizeInput.trim()) {
        const sizes = sizeInput.split(',').map(s => s.trim()).filter(s => s);
        for (const size of sizes) {
          if (isNaN(Number(size)) || Number(size) < 0) {
            return `Variation ${i + 1}: "${size}" is not a valid size`;
          }
        }
      } else {
        return `Variation ${i + 1}: size is required`;
      }

      if (!["NATURAL", "LAB_GROWN"].includes(String(v.gemOrigin)))
        return `Variation ${i + 1}: invalid gem origin`;

      // Validate that at least one gem detail exists
      // if (!v.gemDetails || v.gemDetails.length === 0) {
      //     return `Variation ${i + 1}: At least one gem detail is required`;
      // }

      // Validate gem details
      for (let j = 0; j < v.gemDetails.length; j++) {
        const g = v.gemDetails[j];
        if (g.weight !== undefined && g.weight < 0)
          return `Variation ${i + 1}, Gem ${j + 1}: weight cannot be negative`;
        if (g.quantity !== undefined && g.quantity < 0)
          return `Variation ${i + 1}, Gem ${j + 1
            }: quantity cannot be negative`;
        if (g.quantity !== undefined && g.quantity > 1000)
          return `Variation ${i + 1}, Gem ${j + 1}: quantity seems too high`;
      }
    }
    return null;
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const problem = validate();
    if (problem) {
      setLoading(false);
      setError(problem);
      return;
    }

    // Expand variants with comma-separated sizes
    let expandedVariants: Variant[] = [];
    product.variants.forEach((variant, vIdx) => {
      const sizeInput = variantSizeInputs[`variant-${vIdx}`] !== undefined ? variantSizeInputs[`variant-${vIdx}`] : (variant.size !== undefined ? String(variant.size) : "");
      const expanded = expandVariantSizes(variant, sizeInput);
      expandedVariants = [...expandedVariants, ...expanded];
    });

    // Coerce some numeric fields explicitly
    const normalized: Product = {
      ...product,
      variants: expandedVariants?.map((v) => ({
        ...v,
        size: v.size !== undefined ? Number(v.size) : undefined,
        gemDetails: v.gemDetails?.map((g) => ({
          ...g,
          weight: g.weight !== undefined ? Number(g.weight) : undefined,
          quantity: g.quantity !== undefined ? Number(g.quantity) : undefined,
        })),
        materialDetails: {
          silver:
            v.materialDetails.silver !== undefined && v.materialDetails.silver !== 0
              ? Number(v.materialDetails.silver)
              : 0,
          tenKtGold:
            v.materialDetails.tenKtGold !== undefined && v.materialDetails.tenKtGold !== 0
              ? Number(v.materialDetails.tenKtGold)
              : 0,
          forteenKtGold:
            v.materialDetails.forteenKtGold !== undefined && v.materialDetails.forteenKtGold !== 0
              ? Number(v.materialDetails.forteenKtGold)
              : 0,
          eighteenKtGold:
            v.materialDetails.eighteenKtGold !== undefined && v.materialDetails.eighteenKtGold !== 0
              ? Number(v.materialDetails.eighteenKtGold)
              : 0,
        },
      })),
    };

    try {
      if (productId) {
        await jewelleryProductAPI.updateProduct(productId, normalized);
        setSuccess("Product updated successfully!");
      } else {
        await jewelleryProductAPI.createProduct(normalized);
        setSuccess("Product created successfully!");
      }
      router.push("/jewellery/product-list");
    } catch (e: any) {
      let errorMessage = "";

      // Extract detailed error message from API response
      if (e?.response?.data?.message) {
        if (Array.isArray(e.response.data.message)) {
          errorMessage = e.response.data.message.join(", ");
        } else {
          errorMessage = e.response.data.message;
        }
      } else if (e?.response?.data) {
        errorMessage = typeof e.response.data === 'string'
          ? e.response.data
          : JSON.stringify(e.response.data);
      } else if (e?.message) {
        errorMessage = e.message;
      } else {
        errorMessage = e?.toString() || "Failed to save product.";
      }

      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ======= Render Helpers =======
  const renderInput = (
    label: string,
    value: any,
    onChange: (v: string) => void,
    props?: React.InputHTMLAttributes<HTMLInputElement>,
    isRequired?: boolean,
  ) => (
    <div>
      <label className="block text-sm font-medium text-brand-800 mb-2">
        {label}{isRequired && <span className="text-brand-800 ml-0.5">*</span>}
      </label>
      <input
        {...props}
        value={value}
        onChange={(e) => !isViewMode && onChange(e.target.value)}
        placeholder={label}
        className={`peer w-full px-4 py-2 border border-brand-200 rounded-lg transition-all duration-200`}
        readOnly={isViewMode}
        disabled={isViewMode}
      />
    </div>
  );

  const selectCommonCls =
    "custom-select w-full bg-white !h-[41px] flex items-center";

  // ======= UI =======
  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
      {/* Header */}
      <div
        className={`flex items-center justify-between px-6 ${isViewMode ? "py-2" : "py-2"
          }  border-b border-brand-100`}
      >
        <div className="flex items-center gap-2">
          <IoMdArrowRoundBack
            className="text-[20px] cursor-pointer hover:text-brand-600"
            onClick={() => router.push("/jewellery/product-list")}
          />
          <h1 className="text-2xl font-semibold text-brand-900">
            {isEditMode ? "Edit" : isAddMode ? "Add" : "View"} Jewellery Product
          </h1>
        </div>
        {isViewMode && !isEditMode && (
          <button
            onClick={() => {
              const newParams = new URLSearchParams(params.toString());
              newParams.set("mode", "edit"); // 👈 update mode param
              router.push(`?${newParams.toString()}`); // updates URL
            }}
            disabled={loading || fetching}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white rounded-lg transition-colors duration-200"
          >
            Edit
          </button>
        )}
        {!isViewMode && (
          <div className="flex items-center gap-2">
            {isEditMode && (
              <button
                onClick={() => {
                  // Reset to original data before switching to view mode
                  resetToOriginal();
                  const newParams = new URLSearchParams(params.toString());
                  newParams.set("mode", "view");
                  router.push(`?${newParams.toString()}`);
                }}
                disabled={loading || fetching}
                className="px-4 py-2 text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={loading || fetching}
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white rounded-lg transition-colors duration-200"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 h-[calc(100%-65px)] overflow-y-scroll scrollbar space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <FiX className="text-red-500" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-brand-50 border border-brand-200 text-brand-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            {success}
          </div>
        )}

        {fetching ? (
          <Loader />
        ) : (
          <>
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <SectionTitle title="Basic Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput("Name", product.name, (v) => setField("name", v), {}, true)}
                {renderInput("SKU ID", product.sku, (v) => setField("sku", v), {}, true)}
              </div>

              {/* Category / Sub / Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">
                    Category<span className="text-brand-800 ml-0.5">*</span>
                  </label>
                  <Select
                    className={`${selectCommonCls} normal-disabled-select`}
                    value={product.categoryId || undefined}
                    options={categories.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    onChange={handleCategoryChange}
                    placeholder="Select Category"
                    suffixIcon={<FaChevronDown />}
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">
                    Sub Category<span className="text-brand-800 ml-0.5">*</span>
                  </label>
                  <Select
                    className={`${selectCommonCls} normal-disabled-select`}
                    value={product.subCategoryId || undefined}
                    options={subCategories.map((s) => ({
                      value: s.id,
                      label: s.name,
                    }))}
                    onChange={handleSubCategoryChange}
                    placeholder="Select Sub Category"
                    suffixIcon={<FaChevronDown />}
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">
                    Type<span className="text-brand-800 ml-0.5">*</span>
                  </label>
                  <Select
                    className={`${selectCommonCls} normal-disabled-select`}
                    value={product.typeId || undefined}
                    options={types.map((t) => ({ value: t.id, label: t.name }))}
                    onChange={handleTypeChange}
                    placeholder="Select Type"
                    suffixIcon={<FaChevronDown />}
                    disabled={isViewMode}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-brand-800 mb-2">
                  Description<span className="text-brand-800 ml-0.5">*</span>
                </label>
                <textarea
                  value={product.description}
                  readOnly={isViewMode}
                  disabled={isViewMode}
                  onChange={(e) => setField("description", e.target.value)}
                  className="w-full min-h-[120px] px-4 py-3 border border-brand-200 rounded-lg"
                />
              </div>

              {/* Collections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">
                    Collections
                  </label>
                  <Select
                    mode="multiple"
                    className={`${selectCommonCls} normal-disabled-select`}
                    value={product.collectionId}
                    options={collections.map((c) => ({
                      value: (c as any)._id || (c as any).id,
                      label: c.name,
                    }))}
                    onChange={handleCollectionChange}
                    placeholder="Select one or more collections"
                    suffixIcon={<FaChevronDown />}
                    disabled={isViewMode}
                    maxTagCount="responsive"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                  {/* {product.collectionId.length > 0 && (
                                        <p className="text-xs text-brand-600 mt-1">
                                            Selected: {product.collectionId.length} collection{product.collectionId.length !== 1 ? 's' : ''}
                                        </p>
                                    )} */}
                </div>
              </div>
            </div>

            {/* Photos & Video (Images by Color) */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <SectionTitle title="Photos & Video" />

              {/* Color selector */}
              <div className="flex items-center gap-4 mb-4">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setActiveColor(c)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${activeColor === c
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-brand-100 hover:border-brand-200"
                      }`}
                    style={{
                      backgroundColor: activeColor === c ? "#f1f4ed" : "white",
                      borderColor: activeColor === c ? "#526f4d" : "#cbd9c3",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{
                          backgroundColor:
                            c === "WHITE"
                              ? "#ddd"
                              : c === "YELLOW"
                                ? "#f4d12f"
                                : "#f4b6c2",
                        }}
                      />
                      <span className="font-medium">{c}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Upload area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${!isViewMode ? "hover:border-brand-400 hover:bg-brand-50" : ""
                  } ${uploadingFiles[activeColor]
                    ? "border-brand-500 bg-brand-50"
                    : "border-brand-200"
                  }`}
                onDragOver={(e) => handleDragOver(e, activeColor)}
                onDrop={(e) => handleDrop(e, activeColor)}
              >
                <div className="text-center">
                  {Object.entries(uploadingFiles)
                    .filter(([key]) => key.startsWith(activeColor))
                    .length > 0 ? (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-medium text-brand-600">
                            {Object.entries(uploadProgress)
                              .filter(([key]) => key.startsWith(activeColor))
                              .reduce((acc, [, progress]) => acc + progress, 0) /
                              Object.entries(uploadingFiles)
                                .filter(([key]) => key.startsWith(activeColor))
                                .length || 0}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-brand-700 font-medium">
                        Uploading {Object.entries(uploadingFiles).filter(([key]) => key.startsWith(activeColor)).length} file(s)...
                      </p>
                      <p className="text-xs text-brand-600 mt-1">Please wait</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FiUpload className="text-3xl text-brand-400 mb-2" />
                      <p className="text-sm font-medium text-brand-800 mb-1">
                        Drop files here or click to upload multiple files
                      </p>
                      <p className="text-xs text-brand-600 mb-3">
                        Supports: JPG, PNG, GIF, WebP, MP4, MOV, AVI, WebM (Max:
                        50MB each) - Select multiple files at once
                      </p>
                      {!isViewMode && (
                        <button
                          type="button"
                          onClick={() => triggerFileSelect(activeColor)}
                          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors duration-200"
                        >
                          Choose Multiple Files
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Error messages */}
              {Object.entries(uploadErrors)
                .filter(([key]) => key.startsWith(activeColor))
                .map(([key, error]) => (
                  <div key={key} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                ))}

              {/* Image grid for the active color */}
              {imagesByColor[activeColor].length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-brand-800 mb-3">
                    Uploaded Media ({imagesByColor[activeColor].length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {imagesByColor[activeColor].map((img: any, idx: any) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-brand-100">
                          {img.image ? (
                            <>
                              {isVideoUrl(img.image) ? (
                                <video
                                  src={img.image}
                                  className="w-full h-full object-cover"
                                  controls={false}
                                  muted
                                  autoPlay
                                  loop
                                  preload="metadata"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={img.image}
                                  alt={`${activeColor}-${idx}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full bg-brand-50 flex items-center justify-center">
                              <span className="text-brand-400 text-xs">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>

                        {/* File info overlay */}
                        {/* <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center text-white">
                            <p className="text-xs font-medium truncate px-2">
                              {img.fileName ||
                                `${activeColor} Image ${idx + 1}`}
                            </p>
                            {img.fileSize ? (
                              <p className="text-xs opacity-75">
                                {formatFileSize(img.fileSize)}
                              </p>
                            ) : (
                              <p className="text-xs opacity-75">
                                Existing Image
                              </p>
                            )}
                          </div>
                        </div> */}

                        {/* Remove button */}
                        {!isViewMode && (
                          <button
                            type="button"
                            onClick={() => {
                              // Show loading state for this specific image
                              const imgElement = document.querySelector(
                                `[data-image-index="${idx}"]`,
                              ) as HTMLElement;
                              if (imgElement) {
                                imgElement.style.opacity = "0.5";
                                imgElement.style.pointerEvents = "none";
                              }

                              removeImage(activeColor, idx).finally(() => {
                                if (imgElement) {
                                  imgElement.style.opacity = "1";
                                  imgElement.style.pointerEvents = "auto";
                                }
                              });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-200"
                            aria-label="remove image"
                            data-image-index={idx}
                          >
                            <FiX className="text-xs" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* hidden input per color */}
              {COLORS.map((c) => (
                <input
                  key={c}
                  ref={(el) => {
                    fileInputs.current[c] = el;
                  }}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onFilePicked(c, e)}
                />
              ))}
            </div>

            {/* Variations */}
            {product.variants?.map((v, vIdx) => (
              <div
                key={vIdx}
                className="bg-white rounded-xl shadow-sm p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs text-brand-700">
                      {vIdx + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-brand-900">
                      Variation
                    </h3>
                  </div>
                  {vIdx > 0 && !isViewMode && (
                    <button
                      type="button"
                      onClick={() => removeVariant(vIdx)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <FiTrash2 /> Remove
                    </button>
                  )}
                </div>

                {/* Size & Gem Origin */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">
                      Size
                      <span className="text-xs text-brand-600 ml-1">(comma-separated for multiple sizes)</span><span className="text-brand-800 ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={variantSizeInputs[`variant-${vIdx}`] !== undefined ? variantSizeInputs[`variant-${vIdx}`] : (v.size !== undefined ? String(v.size) : "")}
                      onChange={(e) => handleSizeInputChange(vIdx, e.target.value)}
                      placeholder="e.g., 6, 7, 8 or 6.5"
                      className="w-full px-4 py-2 border border-brand-200 rounded-lg transition-all duration-200"
                      readOnly={isViewMode}
                      disabled={isViewMode}
                    />
                    {variantSizeInputs[`variant-${vIdx}`] && variantSizeInputs[`variant-${vIdx}`].includes(',') && (
                      <p className="text-xs text-brand-600 mt-1">
                        Will create {variantSizeInputs[`variant-${vIdx}`].split(',').filter(s => s.trim()).length} variants
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-800 mb-2">
                      Gems Origin<span className="text-brand-800 ml-0.5">*</span>
                    </label>
                    <div className="flex items-center gap-6">
                      {["LAB_GROWN", "NATURAL"].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="radio"
                            name={`gemOrigin-${vIdx}`}
                            checked={v.gemOrigin === opt}
                            onChange={() =>
                              updateVariant(vIdx, {
                                gemOrigin: opt as Variant["gemOrigin"],
                              })
                            }
                            disabled={isViewMode}
                          />
                          <span>{originLabels[opt] ?? opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gem Details */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-brand-800">
                      Gem Details
                    </label>
                    <div className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded">
                      Diamond specifications
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-3 text-[11px] text-brand-600 font-medium">
                      <div className="col-span-2 flex items-center gap-1">
                        Shape
                        {/* <span title="Diamond cut shape (Round, Oval, Princess, etc.)" className="cursor-help">ⓘ</span> */}
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        Dimensions
                        {/* <span title="Length x Width in mm (e.g., 1.5 x 1.5)" className="cursor-help">ⓘ</span> */}
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        Weight (ct)
                        {/* <span title="Carat weight of the diamond" className="cursor-help">ⓘ</span> */}
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        Color
                        {/* <span title="Diamond color grade (D-Z or Fancy colors)" className="cursor-help">ⓘ</span> */}
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        Clarity
                        {/* <span title="Diamond clarity grade (IF, VVS1, VS1, etc.)" className="cursor-help">ⓘ</span> */}
                      </div>
                      <div className="col-span-1 flex items-center gap-1">
                        Qty
                        {/* <span title="Number of diamonds with these specifications" className="cursor-help">ⓘ</span> */}
                      </div>
                      <div className="col-span-1"></div>
                    </div>
                    {v.gemDetails.map((g, gIdx) => (
                      <div
                        key={gIdx}
                        className="grid grid-cols-12 gap-3 items-center"
                      >
                        {/* Shape Dropdown */}
                        <div className="col-span-2">
                          <Select
                            className={`${selectCommonCls} normal-disabled-select`}
                            value={g.shape || undefined}
                            options={DIAMOND_SHAPES}
                            onChange={(val) => {
                              // Handles clear and normal selection
                              setGemDetail(vIdx, gIdx, { shape: val || "" });
                            }}
                            placeholder="Select shape"
                            suffixIcon={<FaChevronDown />}
                            disabled={isViewMode}
                            showSearch
                            allowClear
                            onSearch={(val) => {
                              // Allow custom input not in options
                              if (
                                val &&
                                !DIAMOND_SHAPES.some(
                                  (s) =>
                                    s.value.toLowerCase() === val.toLowerCase(),
                                )
                              ) {
                                setGemDetail(vIdx, gIdx, { shape: val });
                              }
                            }}
                          />
                        </div>

                        {/* Dimensions */}
                        <div className="col-span-2">
                          <input
                            className="w-full px-3 py-2 border border-brand-200 rounded-md"
                            value={g.mm}
                            onChange={(e) =>
                              setGemDetail(vIdx, gIdx, { mm: e.target.value })
                            }
                            placeholder="1.5 x 1.5"
                            readOnly={isViewMode}
                            disabled={isViewMode}
                          />
                        </div>

                        {/* Weight */}
                        <div className="col-span-2">
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-brand-200 rounded-md"
                            value={g.weight !== undefined ? g.weight : ""}
                            onChange={(e) =>
                              setGemDetail(vIdx, gIdx, {
                                weight:
                                  e.target.value === ""
                                    ? undefined
                                    : parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder="1.2"
                            readOnly={isViewMode}
                            disabled={isViewMode}
                            min="0"
                            step="0.01"
                          />
                        </div>

                        {/* Color Dropdown */}
                        <div className="col-span-2">
                          <Select
                            className={`${selectCommonCls} normal-disabled-select`}
                            value={g.color || undefined}
                            options={DIAMOND_COLORS}
                            placeholder="Select color"
                            suffixIcon={<FaChevronDown />}
                            disabled={isViewMode}
                            showSearch
                            allowClear
                            onChange={(val) => {
                              // Handle select & clear
                              setGemDetail(vIdx, gIdx, { color: val || "" });
                            }}
                            onSearch={(val) => {
                              // Allow custom color input
                              if (
                                val &&
                                !DIAMOND_COLORS.some(
                                  (c) =>
                                    c.value.toLowerCase() === val.toLowerCase(),
                                )
                              ) {
                                setGemDetail(vIdx, gIdx, { color: val });
                              }
                            }}
                          />
                        </div>

                        {/* Clarity Dropdown */}
                        <div className="col-span-2">
                          <Select
                            className={`${selectCommonCls} normal-disabled-select`}
                            value={g.clarity || undefined}
                            options={DIAMOND_CLARITIES}
                            placeholder="Select clarity"
                            suffixIcon={<FaChevronDown />}
                            disabled={isViewMode}
                            showSearch
                            allowClear
                            onChange={(val) => {
                              // Handle select & clear
                              setGemDetail(vIdx, gIdx, { clarity: val || "" });
                            }}
                            onSearch={(val) => {
                              // Allow custom clarity input
                              if (
                                val &&
                                !DIAMOND_CLARITIES.some(
                                  (c) =>
                                    c.value.toLowerCase() === val.toLowerCase(),
                                )
                              ) {
                                setGemDetail(vIdx, gIdx, { clarity: val });
                              }
                            }}
                          />
                        </div>

                        {/* Quantity */}
                        <div className="col-span-1">
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-brand-200 rounded-md"
                            value={g.quantity !== undefined ? g.quantity : ""}
                            onChange={(e) =>
                              setGemDetail(vIdx, gIdx, {
                                quantity:
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value) || undefined,
                              })
                            }
                            placeholder="1"
                            min="0"
                            readOnly={isViewMode}
                            disabled={isViewMode}
                          />
                        </div>

                        {/* Remove button */}
                        <div className="col-span-1 flex justify-end">
                          {v.gemDetails.length && !isViewMode && (
                            <button
                              type="button"
                              onClick={() => removeGemDetailRow(vIdx, gIdx)}
                              className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                              aria-label="remove gem"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={() => addGemDetailRow(vIdx)}
                        className="mt-2 text-brand-700 hover:text-brand-800 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors"
                      >
                        <FiPlus className="text-sm" /> Add Gem Row
                      </button>
                    )}
                  </div>
                </div>

                {/* Material Details */}
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">
                    Material Details<span className="text-brand-800 ml-0.5">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(
                      [
                        ["silver", "925 Silver"],
                        ["tenKtGold", "10KT"],
                        ["forteenKtGold", "14KT"],
                        ["eighteenKtGold", "18KT"],
                      ] as Array<[keyof Variant["materialDetails"], string]>
                    ).map(([key, label]) => (
                      <div key={String(key)}>
                        <label className="block text-[12px] text-brand-700 mb-1">
                          {label}
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-brand-200 rounded-md"
                          value={
                            v.materialDetails[key] !== undefined
                              ? v.materialDetails[key]
                              : ""
                          }
                          onChange={(e) =>
                            setVariantMaterial(
                              vIdx,
                              key,
                              e.target.value === ""
                                ? undefined
                                : parseFloat(e.target.value) || 0, // Number(e.target.value) || undefined,
                            )
                          }
                          min="0"
                          placeholder="0.1"
                          readOnly={isViewMode}
                          disabled={isViewMode}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Measurements */}
                <div>
                  <label className="block text-sm font-medium text-brand-800 mb-2">
                    Measurement
                  </label>
                  <div className="space-y-2">
                    {v.measurements.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="grid grid-cols-12 gap-2 items-center"
                      >
                        <input
                          className="col-span-5 px-3 py-2 border border-brand-200 rounded-md"
                          placeholder="Inner Diameter"
                          value={m.field}
                          onChange={(e) =>
                            setMeasurement(vIdx, mIdx, {
                              field: e.target.value,
                            })
                          }
                          readOnly={isViewMode}
                          disabled={isViewMode}
                        />
                        <input
                          className="col-span-6 px-3 py-2 border border-brand-200 rounded-md"
                          placeholder="15.70 mm"
                          value={m.value}
                          onChange={(e) =>
                            setMeasurement(vIdx, mIdx, {
                              value: e.target.value,
                            })
                          }
                          readOnly={isViewMode}
                          disabled={isViewMode}
                        />
                        <div className="col-span-1 flex justify-end">
                          {v.measurements.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMeasurementRow(vIdx, mIdx)}
                              className="text-red-600 hover:text-red-700"
                              aria-label="remove measurement"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={() => addMeasurementRow(vIdx)}
                        className="mt-1 text-brand-700 hover:text-brand-800 flex items-center gap-1"
                      >
                        <FiPlus /> Add Measurement
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add another variation */}
            {!isViewMode && (
              <button
                type="button"
                onClick={addVariant}
                className="text-brand-700 hover:text-brand-800 flex items-center gap-1"
              >
                <FiPlus /> Add Variation
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddEditProduct;
