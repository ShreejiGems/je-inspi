"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { homeAPI } from "@/src/services/home.api";
import { jewelleryAPI } from "@/src/services/jewellery.api";

// Interface definitions
interface SectionImage {
  id: string;
  image: string;
  imageType: string;
  mediaType: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SubCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  categoryId: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface JewelleryType {
  id: string;
  name: string;
  description?: string;
  image?: string;
  subCategoryId: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  image?: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PrimeProduct {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price?: number;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AppContextType {
  // Loading states
  loading: boolean;
  error: string | null;
  sectionImagesError: string | null;

  // Banner data
  sectionImages: SectionImage[];

  // Jewellery data
  categories: any;
  subCategories: SubCategory[];
  jewelleryTypes: JewelleryType[];
  collections: Collection[];

  // Home data
  primeProducts: PrimeProduct[];

  // Actions
  refetchData: () => Promise<void>;
  getBannerImage: (
    type:
      | "JEWELLERY_BANNER_DESKTOP"
      | "JEWELLERY_BANNER_MOBILE"
      | "HERO_DESKTOP"
      | "HERO_MOBILE"
      | "DIAMOND_BANNER_DESKTOP"
      | "DIAMOND_BANNER_MOBILE"
  ) => SectionImage | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionImagesError, setSectionImagesError] = useState<string | null>(null);

  // Banner data
  const [sectionImages, setSectionImages] = useState<SectionImage[]>([]);

  // Jewellery data
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [jewelleryTypes, setJewelleryTypes] = useState<JewelleryType[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Home data
  const [primeProducts, setPrimeProducts] = useState<PrimeProduct[]>([]);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSectionImagesError(null);

      const param: any = { skip: 0, take: 50, include: "subCategory.type" };

      // Retry a temporary connection/server failure once after an API restart.
      const recover = async <T,>(request: () => Promise<T>): Promise<T> => {
        try {
          return await request();
        } catch (err: any) {
          const status = err.response?.status;
          if (status && status < 500) throw err;
          await new Promise((resolve) => setTimeout(resolve, 500));
          return request();
        }
      };

      // Each section loads independently so optional content cannot block others.
      const [
        imagesResult,
        categoriesResult,
        collectionsResult,
        productsResult,
      ] = await Promise.allSettled([
        recover(() => homeAPI.getSectionImages()),
        recover(() => jewelleryAPI.getEnabledCategories(param)),
        recover(() => jewelleryAPI.getEnabledCollection()),
        recover(() => homeAPI.getPrimeProducts()),
      ]);

      const results = [imagesResult, categoriesResult, collectionsResult, productsResult];
      if (results.some((result) => result.status === 'rejected')) {
        setError('Some website content could not be loaded. Please try again.');
      }
      if (imagesResult.status === 'fulfilled') {
        setSectionImages(imagesResult.value);
      } else {
        setSectionImagesError('Banner could not be updated.');
      }
      if (collectionsResult.status === 'fulfilled') setCollections(collectionsResult.value);
      if (productsResult.status === 'fulfilled') setPrimeProducts(productsResult.value);
      if (categoriesResult.status === 'rejected') return;

      const rawCategories: any = categoriesResult.value;

      // Filter out disabled or deleted subcategories and types
      const categoriesData = (rawCategories?.list || [])
        .map((category: any) => ({
          ...category,
          subCategory: (category.subCategory || [])
            .filter(
              (subCat: any) => subCat.status === "ENABLED" && !subCat.isDeleted
            )
            .map((subCat: any) => ({
              ...subCat,
              type: (subCat.type || []).filter(
                (type: any) => type.status === "ENABLED" && !type.isDeleted
              ),
            }))
            .filter((subCat: any) => subCat.type.length > 0), // Only keep subcategories with valid types
        }))
        .filter((category: any) => category.subCategory.length > 0); // Only keep categories with valid subcategories

      setCategories(categoriesData || []);

      // Fetch subcategories for each category
      // const subCategoriesData: any[] = [];
      // const jewelleryTypesData: any[] = [];

      // for (const category of categoriesData || []) {
      //   try {
      //     const subCats = await jewelleryAPI.getEnabledSubCategories(
      //       category.id
      //     );
      //     subCategoriesData.push(...subCats);

      //     // Fetch types for each subcategory
      //     for (const subCat of subCats) {
      //       try {
      //         const types = await jewelleryAPI.getEnabledType(subCat.id);
      //         jewelleryTypesData.push(...types);
      //       } catch (typeErr) {
      //         console.error(
      //           `Error fetching types for subcategory ${subCat.id}:`,
      //           typeErr
      //         );
      //       }
      //     }
      //   } catch (subCatErr) {
      //     console.error(
      //       `Error fetching subcategories for category ${category.id}:`,
      //       subCatErr
      //     );
      //   }
      // }

      // Remove the entire block that makes separate API calls for subcategories and types
      // Since we already have this data in the initial response

      // Instead, process the data we already have from the initial response
      const subCategoriesData = categoriesData.flatMap(
        (category: any) => category.subCategory || []
      );

      const jewelleryTypesData = categoriesData.flatMap((category: any) =>
        (category.subCategory || []).flatMap((subCat: any) => subCat.type || [])
      );

      setSubCategories(subCategoriesData);
      setJewelleryTypes(jewelleryTypesData);
    } catch (err) {
      console.error("Error fetching app data:", err);
      setError("Failed to load application data");
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchAllData();
    window.addEventListener('online', fetchAllData);
    return () => window.removeEventListener('online', fetchAllData);
  }, []);

  // Refetch data function
  const refetchData = async () => {
    await fetchAllData();
  };

  // Get banner image by type
  const getBannerImage = (
    type:
      | "JEWELLERY_BANNER_DESKTOP"
      | "JEWELLERY_BANNER_MOBILE"
      | "HERO_DESKTOP"
      | "HERO_MOBILE"
      | "DIAMOND_BANNER_DESKTOP"
      | "DIAMOND_BANNER_MOBILE"
  ) => {
    return sectionImages.find(
      (img) => img.imageType === type && img.status === "ENABLED"
    );
  };

  const value: AppContextType = {
    loading,
    error,
    sectionImagesError,
    sectionImages,
    categories,
    subCategories,
    jewelleryTypes,
    collections,
    primeProducts,
    refetchData,
    getBannerImage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
