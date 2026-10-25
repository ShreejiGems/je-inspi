import { useState, useCallback } from 'react';
import { jewelleryAPI } from '@/src/services/jewellery.api';
import { diamondAPI } from '@/src/services/diamond.api';

export type ProductType = 'JEWELLERY' | 'DIAMOND';

interface UseWishlistReturn {
  isWishlisting: boolean;
  toggleWishlist: (productId: string, productType: ProductType, currentState?: boolean) => Promise<void>;
  addToWishlist: (productId: string, productType: ProductType) => Promise<void>;
  removeFromWishlist: (productId: string, productType: ProductType) => Promise<void>;
}

export const useWishlist = (): UseWishlistReturn => {
  const [isWishlisting, setIsWishlisting] = useState(false);

  const addToWishlist = useCallback(async (productId: string, productType: ProductType) => {
    setIsWishlisting(true);
    try {
      if (productType === 'DIAMOND') {
        await diamondAPI.markDiamondInWishList(productId);
      } else {
        await jewelleryAPI.markProductInWishList(productId);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    } finally {
      setIsWishlisting(false);
    }
  }, []);

  const removeFromWishlist = useCallback(async (productId: string, productType: ProductType) => {
    setIsWishlisting(true);
    try {
      if (productType === 'DIAMOND') {
        await diamondAPI.removeDiamondFromWishList(productId);
      } else {
        await jewelleryAPI.removeProductFromWishList(productId);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    } finally {
      setIsWishlisting(false);
    }
  }, []);

  const toggleWishlist = useCallback(async (
    productId: string, 
    productType: ProductType, 
    currentState?: boolean
  ) => {
    if (currentState === undefined) {
      // If current state is not provided, we'll need to check it first
      // For now, assume it's not wishlisted and add it
      await addToWishlist(productId, productType);
    } else if (currentState) {
      await removeFromWishlist(productId, productType);
    } else {
      await addToWishlist(productId, productType);
    }
  }, [addToWishlist, removeFromWishlist]);

  return {
    isWishlisting,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
  };
};
