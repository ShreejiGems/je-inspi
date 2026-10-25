import { Injectable, NotFoundException } from '@nestjs/common';
import { JewelleryCoreService } from 'src/core/jewellery-core/jewellery-core.service';
import { JewelleryCollectionCoreService } from 'src/core/jewellery-collection-core/jewellery-collection-core.service';
import { WishlistCoreService } from 'src/core/wishlist-core/wishlist-core.service';
import { CalculatorCoreService } from 'src/core/calculator-core/calculator-core.service';
import { JewelleryVariantCoreService } from 'src/core/jewellery-variant-core/jewellery-variant-core.service';
import { CertificateCoreService } from 'src/core/certificate-core/certificate-core.service';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import { CATEGPRY_TYPE, PRODUCT_TYPE, STATUS } from '@prisma/client';
import { CalculateJewelleryPriceDto } from './dto/calculate-price.dto';
import { JewelleryFilterDto } from './dto/jewellery.dto';
import { DiamondProductCoreService } from 'src/core/diamond-product-core/diamond-product-core.service';
import { UserSessionType } from 'src/shared/types/user-session.type';
import { CategoryCoreService } from 'src/core/category-core/category-core.service';
import e from 'express';

@Injectable()
export class JewelleryService {
  constructor(
    private readonly jewelleryCoreService: JewelleryCoreService,
    private readonly jewelleryCollectionCoreService: JewelleryCollectionCoreService,
    private readonly wishlistCoreService: WishlistCoreService,
    private readonly calculatorCoreService: CalculatorCoreService,
    private readonly jewelleryVariantCoreService: JewelleryVariantCoreService,
    private readonly certificateCoreService: CertificateCoreService,
    private readonly diamondProductCoreService: DiamondProductCoreService,
    private readonly categoryCoreService: CategoryCoreService,
  ) {}

  // async findEnabled(
  //   filterDto: JewelleryFilterDto,
  //   baseQueryCoreDto: BaseQueryCoreDto,
  //   userId: string | null,
  // ) {
  //   const {
  //     categoryId,
  //     subCategoryId,
  //     typeId,
  //     collectionId,
  //     gemOrigin,
  //     sizes,
  //     shapes,
  //     minPrice,
  //     maxPrice,
  //   } = filterDto;
  //   const jewelleryWhere: any = { isDeleted: false, status: STATUS.ENABLED };

  //   if (categoryId) {
  //     jewelleryWhere.categoryId = categoryId;
  //   }
  //   if (subCategoryId) {
  //     jewelleryWhere.subCategoryId = subCategoryId;
  //   }
  //   if (typeId) {
  //     jewelleryWhere.typeId = typeId;
  //   }

  //   // Build base filters for JewelleryVariant entity using relation to Jewellery
  //   let variantWhere: any = {
  //     isDeleted: false,
  //     status: STATUS.ENABLED,
  //     jewellery: jewelleryWhere,
  //     ...(gemOrigin && { gemOrigin }),
  //   };

  //   let availableSizesVariants =
  //     await this.jewelleryVariantCoreService.findMany({
  //       where: variantWhere,
  //       select: { size: true },
  //     });

  //   let availableSizes = [
  //     ...new Set(availableSizesVariants.map((v) => v.size)),
  //   ].sort((a, b) => a - b);

  //   if (collectionId) {
  //     const collectionJewellery =
  //       await this.jewelleryCollectionCoreService.findMany({
  //         where: {
  //           collectionId,
  //           isDeleted: false,
  //           jewellery: {
  //             isDeleted: false,
  //             status: STATUS.ENABLED,
  //           },
  //         },
  //         include: {
  //           jewellery: true,
  //         },
  //       });

  //     const jewelleryIds = collectionJewellery.map((cj) => cj.jewelleryId);

  //     jewelleryWhere.id = { in: jewelleryIds };
  //     // variantWhere = {
  //     //   ...variantWhere,
  //     //   jewellery: whereWithCollection,
  //     // };

  //     // const collectionAvailableSizesVariants =
  //     //   await this.jewelleryVariantCoreService.findMany({
  //     //     where: variantWhere,
  //     //     select: { size: true },
  //     //   });

  //     // availableSizes = [
  //     //   ...new Set(collectionAvailableSizesVariants.map((v) => v.size)),
  //     // ].sort((a, b) => a - b);
  //   }

  //   const finalWhere = { ...jewelleryWhere };

  //   if (sizes && sizes.length > 0) {
  //     finalWhere.jewelleryVariant = {
  //       some: {
  //         size: { in: sizes },
  //         isDeleted: false,
  //       },
  //     };
  //   }

  //   // Only add shape filtering if shapes are provided
  //   if (shapes && shapes.length > 0) {
  //     // If we already have jewelleryVariant filter, we need to combine them
  //     if (finalWhere.jewelleryVariant) {
  //       finalWhere.jewelleryVariant.some = {
  //         ...finalWhere.jewelleryVariant.some,
  //         gem: {
  //           some: {
  //             shape: { in: shapes },
  //             isDeleted: false,
  //           },
  //         },
  //       };
  //     } else {
  //       finalWhere.jewelleryVariant = {
  //         some: {
  //           gem: {
  //             some: {
  //               shape: { in: shapes },
  //               isDeleted: false,
  //             },
  //           },
  //           isDeleted: false,
  //         },
  //       };
  //     }
  //   }

  //   // Add price filtering if minPrice or maxPrice are provided
  //   if (minPrice !== undefined || maxPrice !== undefined) {
  //     const priceFilter: any = {};

  //     if (minPrice !== undefined) {
  //       priceFilter.gte = minPrice;
  //     }

  //     if (maxPrice !== undefined) {
  //       priceFilter.lte = maxPrice;
  //     }

  //     // If we already have jewelleryVariant filter, we need to combine them
  //     if (finalWhere.jewelleryVariant) {
  //       finalWhere.jewelleryVariant.some = {
  //         ...finalWhere.jewelleryVariant.some,
  //         basePrice: priceFilter,
  //       };
  //     } else {
  //       finalWhere.jewelleryVariant = {
  //         some: {
  //           basePrice: priceFilter,
  //           isDeleted: false,
  //         },
  //       };
  //     }
  //   }

  //   const result = await this.jewelleryCoreService.findPaginate(
  //     baseQueryCoreDto,
  //     finalWhere,
  //   );

  //   result.availableSizes = availableSizes;

  //   // Get available shapes from the variants
  //   let availableShapes: string[] = [];
  //   if (result.list && result.list.length > 0) {
  //     const jewelleryIds = result.list.map((j: any) => j.id);

  //     // Get all gems for the jewellery items to collect shapes
  //     const gems = await this.jewelleryVariantCoreService.findMany({
  //       where: {
  //         jewelleryId: { in: jewelleryIds },
  //         isDeleted: false,
  //         status: STATUS.ENABLED,
  //         gem: {
  //           some: {
  //             isDeleted: false,
  //           },
  //         },
  //       },
  //       include: {
  //         gem: {
  //           where: { isDeleted: false },
  //           select: { shape: true },
  //         },
  //       },
  //     });

  //     // Extract unique shapes from all gems
  //     const allShapes = gems.flatMap((variant: any) =>
  //       (variant.gem || []).map((gem: any) => gem.shape),
  //     );
  //     availableShapes = [...new Set(allShapes)].sort();
  //   }

  //   result.availableShapes = availableShapes;

  //   if (result.list && result.list.length > 0) {
  //     const jewelleryIds = result.list.map((j: any) => j.id);

  //     // Only check wishlist if user is authenticated
  //     let wishlistedJewelleryIds: string[] = [];
  //     if (userId) {
  //       const userWishlist = await this.wishlistCoreService.findMany({
  //         where: {
  //           userId,
  //           isDeleted: false,
  //           jewelleryId: { in: jewelleryIds },
  //         },
  //       });

  //       wishlistedJewelleryIds = userWishlist.map((w) => w.jewelleryId);
  //       result.list = result.list.map((jewellery: any) => ({
  //         ...jewellery,
  //         isWishlisted: userId
  //           ? wishlistedJewelleryIds.includes(jewellery.id)
  //           : false,
  //       }));
  //     }
  //   }

  //   if (result && result.list && result.list.length > 0) {
  //     const category = await this.categoryCoreService.findFirst({
  //       where: { id: result.list[0].categoryId },
  //     });

  //     if (
  //       category &&
  //       category.marketingImages !== null &&
  //       Array.isArray(category.marketingImages) &&
  //       category.marketingImages.length > 0
  //     ) {
  //       result.categoryMarketingImages = category.marketingImages;
  //     } else {
  //       result.categoryMarketingImages = [];
  //     }
  //   } else {
  //     const category: any = await this.categoryCoreService.findMany({
  //       where: { isDeleted: false },
  //       select: { marketingImages: true },
  //     });

  //     let totalImages: string[] = [];
  //     await category.map((c: any) => totalImages.push(c.marketingImages));

  //     result.categoryMarketingImages = totalImages;
  //   }

  //   return result;
  // }

  async findEnabled(
    filterDto: JewelleryFilterDto,
    baseQueryCoreDto: BaseQueryCoreDto,
    userId: string | null,
  ) {
    const {
      categoryId,
      subCategoryId,
      typeId,
      collectionId,
      gemOrigin,
      sizes,
      shapes,
      minPrice,
      maxPrice,
      material,
    } = filterDto;

    /** -------------------------------
     * STEP 1: Jewellery base filter
     -------------------------------- */
    const jewelleryWhere: any = {
      isDeleted: false,
      status: STATUS.ENABLED,
    };

    if (categoryId) jewelleryWhere.categoryId = categoryId;
    if (subCategoryId) jewelleryWhere.subCategoryId = subCategoryId;
    if (typeId) jewelleryWhere.typeId = typeId;

    /** -------------------------------
     * STEP 2: Collection filter
     -------------------------------- */
    if (collectionId) {
      const collectionJewellery =
        await this.jewelleryCollectionCoreService.findMany({
          where: {
            collectionId,
            isDeleted: false,
            jewellery: {
              isDeleted: false,
              status: STATUS.ENABLED,
            },
          },
          select: { jewelleryId: true },
        });

      const jewelleryIds = collectionJewellery.map((cj) => cj.jewelleryId);

      jewelleryWhere.id = jewelleryIds.length
        ? { in: jewelleryIds }
        : '__NO_MATCH__';
    }

    /** -------------------------------
     * STEP 3: Variant filter
     -------------------------------- */
    const variantSome: any = {
      isDeleted: false,
      status: STATUS.ENABLED,
    };

    // ✅ gemOrigin
    if (gemOrigin) {
      variantSome.gemOrigin = gemOrigin;
    }

    // ✅ size
    if (sizes?.length) {
      variantSome.size = { in: sizes };
    }

    // ✅ shapes (UPPERCASE)
    if (shapes?.length) {
      const normalizedShapes = shapes.map((s) => s.trim().toUpperCase());

      variantSome.gem = {
        some: {
          shape: { in: normalizedShapes },
          isDeleted: false,
          status: STATUS.ENABLED,
        },
      };
    }

    // ✅ price
    if (minPrice !== undefined || maxPrice !== undefined) {
      variantSome.basePrice = {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      };
    }

    // ✅ MATERIAL FILTER
    if (material?.length) {
      const materialArray = Array.isArray(material) ? material : [material];

      const materialFieldMap = {
        SILVER: 'silver',
        TEN_KT_GOLD: 'tenKtGold',
        FORTEEN_KT_GOLD: 'forteenKtGold',
        EIGHTEEN_KT_GOLD: 'eighteenKtGold',
      };

      variantSome.OR = materialArray.map((mat) => ({
        [materialFieldMap[mat]]: {
          not: null,
          gt: 0,
        },
      }));
    }

    /** -------------------------------
     * STEP 4: Final WHERE
     -------------------------------- */
    const finalWhere: any = {
      ...jewelleryWhere,
      jewelleryVariant: {
        some: variantSome,
      },
    };

    /** -------------------------------
     * STEP 5: Fetch result
     -------------------------------- */
    const result = await this.jewelleryCoreService.findPaginate(
      baseQueryCoreDto,
      finalWhere,
    );

    /** -------------------------------
     * STEP 6: Available Sizes
     -------------------------------- */
    const sizeVariants = await this.jewelleryVariantCoreService.findMany({
      where: {
        ...variantSome,
        jewellery: jewelleryWhere,
      },
      select: { size: true },
    });

    result.availableSizes = [...new Set(sizeVariants.map((v) => v.size))].sort(
      (a, b) => a - b,
    );

    /** -------------------------------
     * STEP 7: Available Shapes
     -------------------------------- */
    let availableShapes: string[] = [];

    if (result.list?.length) {
      const jewelleryIds = result.list.map((j: any) => j.id);

      const variants = await this.jewelleryVariantCoreService.findMany({
        where: {
          jewelleryId: { in: jewelleryIds },
          isDeleted: false,
          status: STATUS.ENABLED,
        },
        include: {
          gem: {
            where: {
              isDeleted: false,
              status: STATUS.ENABLED,
            },
            select: { shape: true },
          },
        },
      });

      const allShapes = variants.flatMap((v: any) =>
        (v.gem || []).map((g) => g.shape),
      );

      availableShapes = [...new Set(allShapes)].sort();
    }

    result.availableShapes = availableShapes;

    /** -------------------------------
     * STEP 8: Wishlist
     -------------------------------- */
    if (result.list?.length && userId) {
      const jewelleryIds = result.list.map((j: any) => j.id);

      const userWishlist = await this.wishlistCoreService.findMany({
        where: {
          userId,
          isDeleted: false,
          jewelleryId: { in: jewelleryIds },
        },
      });

      const wishlistedIds = userWishlist.map((w) => w.jewelleryId);

      result.list = result.list.map((j: any) => ({
        ...j,
        isWishlisted: wishlistedIds.includes(j.id),
      }));
    }

    /** -------------------------------
     * STEP 9: Category Marketing Images
     -------------------------------- */
    if (result.list?.length) {
      const category = await this.categoryCoreService.findFirst({
        where: { id: result.list[0].categoryId },
      });

      result.categoryMarketingImages = category?.marketingImages
        ? category.marketingImages
        : [];
    } else {
      const categories = await this.categoryCoreService.findMany({
        where: { isDeleted: false },
        select: { marketingImages: true },
      });

      result.categoryMarketingImages = categories.flatMap(
        (c: any) => c.marketingImages || [],
      );
    }

    return result;
  }

  async calculateJewelleryPrice(
    calculatePriceDto: CalculateJewelleryPriceDto,
    sessionData?: UserSessionType,
  ) {
    const { variantId, material, includeCertificate } = calculatePriceDto;

    const calculator = await this.calculatorCoreService.findFirst({
      where: { isDeleted: false, status: STATUS.ENABLED },
    });
    if (!calculator) {
      throw new NotFoundException('Calculator parameters not found');
    }

    const variant = await this.jewelleryVariantCoreService.findFirst({
      where: { id: variantId },
      include: {
        gem: { where: { isDeleted: false } },
      },
    });
    if (!variant) {
      throw new NotFoundException('Jewellery variant not found');
    }

    let materialWeight = 0;
    let pricePerGram = 0;
    let discountedPrice = 0;

    switch (material) {
      case 'silver':
        materialWeight = variant.silver || 0;
        pricePerGram = calculator.silverPerGram;
        break;
      case 'tenKtGold':
        materialWeight = variant.tenKtGold || 0;
        pricePerGram = calculator.tenKtGoldPerGram;
        break;
      case 'forteenKtGold':
        materialWeight = variant.forteenKtGold || 0;
        pricePerGram = calculator.forteenKtGoldPerGram;
        break;
      case 'eighteenKtGold':
        materialWeight = variant.eighteenKtGold || 0;
        pricePerGram = calculator.eighteenKtGoldPerGram;
        break;

      case 'SILVER':
        materialWeight = variant.silver || 0;
        pricePerGram = calculator.silverPerGram;
        break;
      case 'TENKTGOLD':
        materialWeight = variant.tenKtGold || 0;
        pricePerGram = calculator.tenKtGoldPerGram;
        break;
      case 'FOURTEENKTGOLD':
        materialWeight = variant.forteenKtGold || 0;
        pricePerGram = calculator.forteenKtGoldPerGram;
        break;
      case 'EIGHTEENKTGOLD':
        materialWeight = variant.eighteenKtGold || 0;
        pricePerGram = calculator.eighteenKtGoldPerGram;
        break;

      case 'TEN_KT_GOLD':
        materialWeight = variant.tenKtGold || 0;
        pricePerGram = calculator.tenKtGoldPerGram;
        break;

      case 'FORTEEN_KT_GOLD':
        materialWeight = variant.forteenKtGold || 0;
        pricePerGram = calculator.forteenKtGoldPerGram;
        break;

      case 'EIGHTEEN_KT_GOLD':
        materialWeight = variant.eighteenKtGold || 0;
        pricePerGram = calculator.eighteenKtGoldPerGram;
        break;
    }

    // Calculate material cost
    const materialCost = materialWeight * pricePerGram;

    // Calculate gem prices if variant has gems
    let totalGemPrice = 0;
    const variantWithGems = variant as any; // Type assertion for include
    if (variantWithGems.hasGems && variantWithGems.gem.length > 0) {
      for (const gem of variantWithGems.gem) {
        // Find diamond price for this gem's characteristics
        const diamondPrice = await this.diamondProductCoreService.findFirst({
          where: {
            shape: gem.shape,
            weight: gem.weight,
            color: gem.color,
            clarity: gem.clarity,
            isDeleted: false,
            gemOrigin: variantWithGems.gemOrigin,
          },
        });

        if (diamondPrice) {
          // Calculate price for this gem type based on quantity
          const gemTypePrice = (diamondPrice as any).price * gem.quantity;
          totalGemPrice += gemTypePrice;
        }
      }
    }

    console.log(materialCost);

    // Calculate certificate cost if requested
    let totalCertificateCost = 0;
    if (
      includeCertificate &&
      variantWithGems.hasGems &&
      variantWithGems.gem.length > 0
    ) {
      // Use the already stored totalGemWeight from the variant
      const totalGemWeight = variant.totalGemWeight || 0;

      // Find certificate price based on total gem weight
      const certificate = await this.certificateCoreService.findFirst({
        where: {
          weightStartsAt: { lte: totalGemWeight },
          weightEndsAt: { gte: totalGemWeight },
          isDeleted: false,
        },
      });

      if (certificate) {
        // Certificate cost is based on total gem weight, not per gem
        const certificateCostPerCaret = (certificate as any).price;

        totalCertificateCost = certificateCostPerCaret * totalGemWeight;
      }
    }

    // Calculate base price
    let basePrice =
      calculator.miscellaneous +
      materialCost +
      totalGemPrice +
      totalCertificateCost +
      calculator.extraCost;

    const inPart =
      calculator.miscellaneous +
      materialCost +
      totalCertificateCost +
      calculator.extraCost;

    // Apply duty, profit, and US rate calculations
    // const afterDuty = basePrice / calculator.duty;
    // const afterProfit = afterDuty / calculator.profit;
    // const finalPrice = afterProfit / calculator.usRate;

    const finalPrice = Number(
      (inPart / calculator.usRate + totalGemPrice) /
        calculator.duty /
        calculator.profit,
    ).toFixed(2);

    if (
      sessionData &&
      sessionData.user.id &&
      sessionData.user.discount !== null &&
      sessionData.user.discount !== 0
    ) {
      discountedPrice =
        Number(finalPrice) -
        (Number(finalPrice) * sessionData.user.discount) / 100;
    }

    return {
      variantId,
      material,
      includeCertificate,
      breakdown: {
        miscellaneous: calculator.miscellaneous,
        materialCost,
        materialWeight,
        pricePerGram,
        totalGemPrice,
        totalCertificateCost,
        extraCost: calculator.extraCost,
        basePrice,
        duty: calculator.duty,
        afterDuty: inPart / calculator.duty,
        profit: calculator.profit,
        afterProfit: inPart / calculator.duty / calculator.profit,
        usRate: calculator.usRate,
      },
      finalPrice,
      discountedPrice,
    };
  }

  async markWishlist(userId: string, id: string, type: PRODUCT_TYPE) {
    // Ensure jewellery exists and is enabled
    let product;
    if (type === PRODUCT_TYPE.JEWELLERY) {
      product = await this.jewelleryCoreService.findFirst({
        where: { id, isDeleted: false, status: STATUS.ENABLED },
      });
    } else if (type === PRODUCT_TYPE.DIAMOND) {
      product = await this.diamondProductCoreService.findFirst({
        where: { id, isDeleted: false, status: STATUS.ENABLED },
      });
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Avoid duplicates
    let existing;
    if (type === PRODUCT_TYPE.JEWELLERY) {
      existing = await this.wishlistCoreService.findFirst({
        where: { userId, jewelleryId: id, isDeleted: false },
      });
    } else if (type === PRODUCT_TYPE.DIAMOND) {
      existing = await this.wishlistCoreService.findFirst({
        where: { userId, diamondProductId: id, isDeleted: false },
      });
    }

    if (existing) {
      return existing;
    }

    if (type === PRODUCT_TYPE.JEWELLERY) {
      return await this.wishlistCoreService.create({
        data: { userId, jewelleryId: id },
      });
    } else if (type === PRODUCT_TYPE.DIAMOND) {
      return await this.wishlistCoreService.create({
        data: { userId, diamondProductId: id },
      });
    }
  }

  async unmarkWishlist(userId: string, id: string, type: PRODUCT_TYPE) {
    if (type === PRODUCT_TYPE.JEWELLERY) {
      const existing = await this.wishlistCoreService
        .findFirst({
          where: { userId, jewelleryId: id, isDeleted: false },
        })
        .catch(() => null);

      if (!existing) {
        return { success: true };
      }

      return await this.wishlistCoreService.delete({
        where: { id: existing.id },
      });
    } else if (type === PRODUCT_TYPE.DIAMOND) {
      const existing = await this.wishlistCoreService
        .findFirst({
          where: { userId, diamondProductId: id, isDeleted: false },
        })
        .catch(() => null);

      if (!existing) {
        return { success: true };
      }

      return await this.wishlistCoreService.delete({
        where: { id: existing.id },
      });
    }
  }
}
