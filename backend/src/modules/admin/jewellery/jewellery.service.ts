import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient, STATUS, USER_TYPE } from '@prisma/client';
import { JewelleryCoreService } from 'src/core/jewellery-core/jewellery-core.service';
import { JewelleryCollectionCoreService } from 'src/core/jewellery-collection-core/jewellery-collection-core.service';
import { JewelleryVariantCoreService } from 'src/core/jewellery-variant-core/jewellery-variant-core.service';
import { GemCoreService } from 'src/core/gem-core/gem-core.service';
import { CalculatorCoreService } from 'src/core/calculator-core/calculator-core.service';
import {
  CreateJewelleryDto,
  JewelleryVariantDto,
  GemDetailDto,
} from './dto/create-jewellery.dto';
import { UpdateJewelleryDto } from './dto/update-jewellery.dto';
import { userMessage } from 'src/shared/keys/user.key';
import { CategoryCoreService } from 'src/core/category-core/category-core.service';
import { SubCategoryCoreService } from 'src/core/sub-category-core/sub-category-core.service';
import { TypeCoreService } from 'src/core/type-core/type-core.service';
import { CollectionCoreService } from 'src/core/collection-core/collection-core.service';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import { UserSessionType } from 'src/shared/types/user-session.type';
import { WishlistCoreService } from 'src/core/wishlist-core/wishlist-core.service';
import { DiamondProductCoreService } from 'src/core/diamond-product-core/diamond-product-core.service';
import axios from 'axios';
import * as XLSX from 'xlsx';

@Injectable()
export class JewelleryService {
  constructor(
    private readonly jewelleryCoreService: JewelleryCoreService,
    private readonly jewelleryVariantCoreService: JewelleryVariantCoreService,
    private readonly categoryCoreService: CategoryCoreService,
    private readonly subCategoryCoreService: SubCategoryCoreService,
    private readonly typeCoreService: TypeCoreService,
    private readonly collectionCoreService: CollectionCoreService,
    private readonly jewelleryCollectionCoreService: JewelleryCollectionCoreService,
    private readonly gemCoreService: GemCoreService,
    private readonly calculatorCoreService: CalculatorCoreService,
    private readonly wishlistCoreService: WishlistCoreService,
    private readonly diamondProductCoreService: DiamondProductCoreService,
  ) {}

  async create(createJewelleryDto: CreateJewelleryDto) {
    const { categoryId, subCategoryId, typeId, collectionId, variants } =
      createJewelleryDto;

    // Validate category exists
    const category = await this.categoryCoreService.findFirst({
      where: { id: categoryId, status: STATUS.ENABLED, isDeleted: false },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    // Validate sub-category exists
    const subCategory = await this.subCategoryCoreService.findFirst({
      where: { id: subCategoryId, status: STATUS.ENABLED, isDeleted: false },
    });
    if (!subCategory) {
      throw new BadRequestException('Sub-category not found');
    }

    // Validate type exists
    const type = await this.typeCoreService.findFirst({
      where: { id: typeId, status: STATUS.ENABLED, isDeleted: false },
    });
    if (!type) {
      throw new BadRequestException('Type not found');
    }

    // Validate collections if provided
    if (collectionId && collectionId.length > 0) {
      for (const id of collectionId) {
        const collection = await this.collectionCoreService.findFirst({
          where: { id, isDeleted: false },
        });
        if (!collection) {
          throw new BadRequestException(`Collection with ID ${id} not found`);
        }
      }
    }

    // Check if SKU already exists
    const existingJewellery = await this.jewelleryCoreService.findFirst({
      where: { sku: createJewelleryDto.sku, isDeleted: false },
    });
    if (existingJewellery) {
      throw new BadRequestException('Jewellery with this SKU already exists');
    }

    console.log(createJewelleryDto.images, 'createJewelleryDto.images');
    // Create jewellery with basic info
    let jewellery = await this.jewelleryCoreService.create({
      data: {
        name: createJewelleryDto.name,
        sku: createJewelleryDto.sku,
        description: createJewelleryDto.description,
        images: createJewelleryDto.images
          ? JSON.stringify(createJewelleryDto.images)
          : null,
        category: { connect: { id: categoryId } },
        subCategory: { connect: { id: subCategoryId } },
        type: { connect: { id: typeId } },
      },
    });

    // Create variants
    const variantPromises = variants.map(async (variantDto) => {
      // Convert measurements array to JSON object
      const measurementsJson =
        variantDto.measurements?.reduce(
          (acc, measurement) => {
            if (measurement.field && measurement.value) {
              acc[measurement.field] = measurement.value;
            }
            return acc;
          },
          {} as Record<string, string>,
        ) || {};

      // Determine if this variant has gems
      const hasGems = variantDto.gemDetails && variantDto.gemDetails.length > 0;

      const variant = await this.jewelleryVariantCoreService.create({
        data: {
          jewelleryId: jewellery.id,
          size: variantDto.size,
          gemOrigin: variantDto.gemOrigin,
          hasGems: hasGems,
          silver: variantDto.materialDetails.silver,
          tenKtGold: variantDto.materialDetails.tenKtGold,
          forteenKtGold: variantDto.materialDetails.forteenKtGold,
          eighteenKtGold: variantDto.materialDetails.eighteenKtGold,
          mesurement: measurementsJson,
        },
      });

      // Calculate basePrice for this variant (without certificate charges)
      const calculator = await this.calculatorCoreService.findFirst({
        where: { isDeleted: false, status: STATUS.ENABLED },
      });

      let basePrice = null;
      let totalGemWeight = 0;

      if (calculator) {
        // Calculate gem prices if gems exist
        let totalGemPrice = 0;
        let missingGemPrice = false;
        if (variantDto.gemDetails && variantDto.gemDetails.length > 0) {
          const gemPromises = variantDto.gemDetails.map(async (gemDetail) => {
            return await this.gemCoreService.create({
              data: {
                variant: { connect: { id: variant.id } },
                shape: (gemDetail.shape as any)?.toString().toUpperCase(),
                mm: gemDetail.mm,
                weight: gemDetail.weight,
                color: (gemDetail.color as any)?.toString().toUpperCase(),
                clarity: (gemDetail.clarity as any)?.toString().toUpperCase(),
                quantity: gemDetail.quantity,
              },
            });
          });

          const createdGems = await Promise.all(gemPromises);

          // Compute and persist total weight of all gems for this variant
          totalGemWeight = createdGems.reduce(
            (sum, g: any) => sum + (g?.weight || 0) * (g?.quantity || 0),
            0,
          );

          for (const gem of createdGems) {
            // Find diamond price for this gem's characteristics
            const diamondPrice = await this.diamondProductCoreService.findFirst(
              {
                where: {
                  shape: gem.shape,
                  weight: gem.weight,
                  color: gem.color,
                  clarity: gem.clarity,
                  isDeleted: false,
                  gemOrigin: variantDto.gemOrigin,
                  status: STATUS.ENABLED,
                },
                orderBy: { price: 'asc' },
              },
            );

            if (diamondPrice) {
              const gemTypePrice = (diamondPrice as any).price * gem.quantity;
              totalGemPrice += gemTypePrice;
            } else {
              missingGemPrice = true;
            }
          }
        }

        // Calculate prices for all materials and find the minimum
        const materialPrices = [
          {
            name: 'silver',
            price:
              (variantDto.materialDetails.silver || 0) *
              calculator.silverPerGram,
          },
          {
            name: 'tenKtGold',
            price:
              (variantDto.materialDetails.tenKtGold || 0) *
              calculator.tenKtGoldPerGram,
          },
          {
            name: 'forteenKtGold',
            price:
              (variantDto.materialDetails.forteenKtGold || 0) *
              calculator.forteenKtGoldPerGram,
          },
          {
            name: 'eighteenKtGold',
            price:
              (variantDto.materialDetails.eighteenKtGold || 0) *
              calculator.eighteenKtGoldPerGram,
          },
        ];

        // Find the minimum material price (excluding zero values)
        const validMaterialPrices = materialPrices.filter((m) => m.price > 0);
        const minMaterialPrice =
          validMaterialPrices.length > 0
            ? Math.min(...validMaterialPrices.map((m) => m.price))
            : 0;

        const inrPart =
          calculator.miscellaneous + minMaterialPrice + calculator.extraCost;

        if (missingGemPrice) {
          basePrice = 0;
        } else {
          basePrice =
            inrPart > 0 || totalGemPrice > 0
              ? Number(
                  (
                    (inrPart / calculator.usRate + totalGemPrice) /
                    calculator.duty /
                    calculator.profit
                  ).toFixed(2),
                )
              : null;
        }
      }

      // Update variant with calculated values
      await this.jewelleryVariantCoreService.update({
        where: { id: variant.id },
        data: {
          totalGemWeight: Number(totalGemWeight?.toFixed(2)),
          basePrice: basePrice ?? null,
        },
      });

      return {
        ...variant,
        basePrice: basePrice ?? null,
        totalGemWeight: Number(totalGemWeight?.toFixed(2)),
      };
    });

    const createdVariants = await Promise.all(variantPromises);

    console.log(createdVariants);

    // Calculate the lowest variant price for the jewellery basePrice
    const variantPrices = createdVariants
      .map((v) => v.basePrice)
      .filter((price) => price !== null);

    console.log(variantPrices, '[][][][][');
    const jewelleryBasePrice =
      variantPrices.length > 0
        ? Math.min(...(variantPrices as number[]))
        : null;

    console.log(jewelleryBasePrice, 'jewelleryBasePrice');

    // Update jewellery with basePrice
    jewellery = await this.jewelleryCoreService.update({
      where: { id: jewellery.id },
      data: { basePrice: jewelleryBasePrice },
    });

    // Get final variants with gems for response
    const finalVariants = await this.jewelleryVariantCoreService.findMany({
      where: { jewelleryId: jewellery.id, isDeleted: false },
      include: { gem: { where: { isDeleted: false } } },
    });

    // Create jewellery-collection relationships if collections are provided
    let createdCollections = [];
    if (collectionId && collectionId.length > 0) {
      const collectionPromises = collectionId.map(async (id) => {
        return await this.jewelleryCollectionCoreService.create({
          data: {
            jewellery: { connect: { id: jewellery.id } },
            collection: { connect: { id } },
          },
        });
      });
      createdCollections = await Promise.all(collectionPromises);
    }

    return {
      ...jewellery,
      variants: finalVariants,
      collections: createdCollections,
      images: createJewelleryDto.images || null,
    };
  }

  async findAll(
    categoryId: string,
    subCategoryId: string,
    typeId: string,
    baseQueryCoreDto: BaseQueryCoreDto,
  ) {
    const where: any = { isDeleted: false };

    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (subCategoryId) {
      where.subCategoryId = subCategoryId;
    }
    if (typeId) {
      where.typeId = typeId;
    }

    return await this.jewelleryCoreService.findPaginate(
      baseQueryCoreDto,
      where,
    );
  }

  async findEnabled(
    categoryId: string,
    subCategoryId: string,
    typeId: string,
    baseQueryCoreDto: BaseQueryCoreDto,
  ) {
    const where: any = { isDeleted: false, status: STATUS.ENABLED };

    console.log(categoryId, 'categoryId');
    console.log(subCategoryId, 'subCategoryId');
    console.log(typeId, 'typeId');

    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (subCategoryId) {
      where.subCategoryId = subCategoryId;
    }
    if (typeId) {
      where.typeId = typeId;
    }

    return await this.jewelleryCoreService.findPaginate(
      baseQueryCoreDto,
      where,
    );
  }

  async search(searchDto: any) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ...searchFilters
    } = searchDto;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };

    // Apply search filters
    if (searchFilters.name) {
      where.name = { contains: searchFilters.name, mode: 'insensitive' };
    }
    if (searchFilters.sku) {
      where.sku = { contains: searchFilters.sku, mode: 'insensitive' };
    }
    if (searchFilters.categoryId) {
      where.categoryId = searchFilters.categoryId;
    }
    if (searchFilters.subCategoryId) {
      where.subCategoryId = searchFilters.subCategoryId;
    }
    if (searchFilters.typeId) {
      where.typeId = searchFilters.typeId;
    }
    if (searchFilters.collectionId) {
      where.collectionId = searchFilters.collectionId;
    }

    // Search in variants for color and gem origin
    if (searchFilters.color || searchFilters.gemOrigin) {
      where.jewelleryVariant = {
        some: {
          isDeleted: false,
          // Note: The actual schema doesn't have color field, so this might need adjustment
        },
      };
    }

    const [jewellery, total] = await Promise.all([
      this.jewelleryCoreService.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: true,
          subCategory: true,
          type: true,
          jewelleryCollection: {
            where: { isDeleted: false },
            include: {
              collection: true,
            },
          },
          jewelleryVariant: {
            where: { isDeleted: false },
          },
        },
      }),
      this.jewelleryCoreService.getCount({ where }),
    ]);

    return {
      data: jewellery,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, sessionData: UserSessionType) {
    const jewellery: any = await this.jewelleryCoreService.findFirst({
      where: { id, isDeleted: false },
      include: {
        category: true,
        subCategory: true,
        type: true,
        jewelleryCollection: {
          where: { isDeleted: false },
          include: {
            collection: true,
          },
        },
        jewelleryVariant: {
          where: { isDeleted: false },
          include: { gem: { where: { isDeleted: false } } },
        },
      },
    });

    if (!jewellery) {
      throw new BadRequestException('Jewellery not found');
    }

    if (sessionData?.user?.userType === USER_TYPE.USER) {
      const whishlistedByUser = await this.wishlistCoreService.findFirst({
        where: {
          userId: sessionData.user.id,
          jewelleryId: jewellery.id,
          isDeleted: false,
        },
      });

      jewellery.whishlist = whishlistedByUser ? true : false;
    }

    return jewellery;
  }

  async update(id: string, updateJewelleryDto: UpdateJewelleryDto) {
    const jewellery = await this.jewelleryCoreService.findFirst({
      where: { id, isDeleted: false },
    });

    if (!jewellery) {
      throw new BadRequestException('Jewellery not found');
    }

    // Validate references if they're being updated
    if (updateJewelleryDto.categoryId) {
      const category = await this.categoryCoreService.findFirst({
        where: { id: updateJewelleryDto.categoryId, isDeleted: false },
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    if (updateJewelleryDto.subCategoryId) {
      const subCategory = await this.subCategoryCoreService.findFirst({
        where: { id: updateJewelleryDto.subCategoryId, isDeleted: false },
      });
      if (!subCategory) {
        throw new BadRequestException('Sub-category not found');
      }
    }

    if (updateJewelleryDto.typeId) {
      const type = await this.typeCoreService.findFirst({
        where: { id: updateJewelleryDto.typeId, isDeleted: false },
      });
      if (!type) {
        throw new BadRequestException('Type not found');
      }
    }

    if (updateJewelleryDto.collectionId) {
      for (const id of updateJewelleryDto.collectionId) {
        const collection = await this.collectionCoreService.findFirst({
          where: { id, isDeleted: false },
        });
        if (!collection) {
          throw new BadRequestException(`Collection with ID ${id} not found`);
        }
      }
    }

    // Check SKU uniqueness if being updated
    if (updateJewelleryDto.sku && updateJewelleryDto.sku !== jewellery.sku) {
      const existingJewellery = await this.jewelleryCoreService.findFirst({
        where: {
          sku: updateJewelleryDto.sku,
          isDeleted: false,
          id: { not: id },
        },
      });
      if (existingJewellery) {
        throw new BadRequestException('Jewellery with this SKU already exists');
      }
    }

    // Update jewellery basic info
    const updateData: any = {};

    // Only include fields that are actually being updated
    if (updateJewelleryDto.name !== undefined)
      updateData.name = updateJewelleryDto.name;
    if (updateJewelleryDto.sku !== undefined)
      updateData.sku = updateJewelleryDto.sku;
    if (updateJewelleryDto.description !== undefined)
      updateData.description = updateJewelleryDto.description;
    if (updateJewelleryDto.images !== undefined)
      updateData.images = updateJewelleryDto.images as any;

    // Handle relation updates properly
    if (updateJewelleryDto.categoryId !== undefined) {
      updateData.category = { connect: { id: updateJewelleryDto.categoryId } };
    }
    if (updateJewelleryDto.subCategoryId !== undefined) {
      updateData.subCategory = {
        connect: { id: updateJewelleryDto.subCategoryId },
      };
    }
    if (updateJewelleryDto.typeId !== undefined) {
      updateData.type = { connect: { id: updateJewelleryDto.typeId } };
    }
    // Note: Collection updates are handled separately after jewellery update

    const updatedJewellery = await this.jewelleryCoreService.update({
      where: { id },
      data: updateData,
    });

    // Update variants if provided
    if (updateJewelleryDto.variants) {
      // Get existing variants
      const existingVariants = await this.jewelleryVariantCoreService.findMany({
        where: { jewelleryId: id, isDeleted: false },
      });

      // Create maps for efficient lookup
      const existingVariantsById = new Map(
        existingVariants.map((variant) => [variant.id, variant]),
      );

      const newVariantsById = new Map();
      const newVariantsToCreate = [];
      const newVariantsBySize = new Map(); // Needed for gems management later

      for (const variant of updateJewelleryDto.variants) {
        newVariantsBySize.set(variant.size.toString(), variant);
        if (variant.id) {
          newVariantsById.set(variant.id, variant);
        } else {
          newVariantsToCreate.push(variant);
        }
      }

      // Update existing variants, delete removed ones, and add new ones
      const updatePromises: Promise<any>[] = [];
      const deletePromises: Promise<any>[] = [];
      const createPromises: Promise<any>[] = [];

      // Process existing variants
      for (const [variantId, existingVariant] of existingVariantsById) {
        if (newVariantsById.has(variantId)) {
          // Update existing variant
          const newVariantData = newVariantsById.get(variantId)!;

          // Convert measurements array to JSON object
          const measurementsJson =
            newVariantData.measurements?.reduce(
              (acc, measurement) => {
                if (measurement.field && measurement.value) {
                  acc[measurement.field] = measurement.value;
                }
                return acc;
              },
              {} as Record<string, string>,
            ) || {};

          // Determine if this variant has gems
          const hasGems =
            newVariantData.gemDetails && newVariantData.gemDetails.length > 0;

          // If hasGems is false, delete all existing gems for this variant
          if (!hasGems) {
            updatePromises.push(
              this.gemCoreService.updateMany({
                where: { variantId: existingVariant.id, isDeleted: false },
                data: { isDeleted: true },
              }),
            );
          }

          updatePromises.push(
            this.jewelleryVariantCoreService.update({
              where: { id: existingVariant.id },
              data: {
                size: newVariantData.size,
                gemOrigin: newVariantData.gemOrigin,
                hasGems: hasGems,
                silver: newVariantData.materialDetails.silver,
                tenKtGold: newVariantData.materialDetails.tenKtGold,
                forteenKtGold: newVariantData.materialDetails.forteenKtGold,
                eighteenKtGold: newVariantData.materialDetails.eighteenKtGold,
                mesurement: measurementsJson,
              },
            }),
          );
        } else {
          // Delete variant that no longer exists
          deletePromises.push(
            this.jewelleryVariantCoreService.update({
              where: { id: existingVariant.id },
              data: { isDeleted: true },
            }),
          );
        }
      }

      // Create new variants that don't exist
      for (const newVariantData of newVariantsToCreate) {
        // Convert measurements array to JSON object
        const measurementsJson =
          newVariantData.measurements?.reduce(
            (acc, measurement) => {
              if (measurement.field && measurement.value) {
                acc[measurement.field] = measurement.value;
              }
              return acc;
            },
            {} as Record<string, string>,
          ) || {};

        // Determine if this variant has gems
        const hasGems =
          newVariantData.gemDetails && newVariantData.gemDetails.length > 0;

        createPromises.push(
          this.jewelleryVariantCoreService.create({
            data: {
              jewelleryId: id,
              size: newVariantData.size,
              gemOrigin: newVariantData.gemOrigin,
              hasGems: hasGems,
              silver: newVariantData.materialDetails.silver,
              tenKtGold: newVariantData.materialDetails.tenKtGold,
              forteenKtGold: newVariantData.materialDetails.forteenKtGold,
              eighteenKtGold: newVariantData.materialDetails.eighteenKtGold,
              mesurement: measurementsJson,
            },
          }),
        );
      }

      // Execute update and delete operations
      await Promise.all([...updatePromises, ...deletePromises]);

      // Execute create operations and capture the created variants
      const createdVariants = await Promise.all(createPromises);

      // Assign the newly created variant IDs back to the source objects
      for (let i = 0; i < newVariantsToCreate.length; i++) {
        newVariantsToCreate[i].id = createdVariants[i].id;
      }

      // Handle gems for each variant
      for (const newVariantData of updateJewelleryDto.variants) {
        if (newVariantData.gemDetails && newVariantData.gemDetails.length > 0) {
          const variant = await this.jewelleryVariantCoreService.findFirst({
            where: { id: newVariantData.id, isDeleted: false },
          });

          if (variant) {
            // Get existing gems for this variant
            const existingGems = await this.gemCoreService.findMany({
              where: { variantId: variant.id, isDeleted: false },
            });

            // Create maps for efficient gem lookup by composite key
            // Key: shape + mm + weight + color + clarity
            const makeGemKey = (g: any) =>
              `${g.shape}__${g.mm ?? ''}__${Number(g.weight)}__${g.color ?? ''}__${g.clarity ?? ''}`;
            const existingGemsByKey = new Map(
              existingGems.map((gem: any) => [makeGemKey(gem), gem]),
            );
            const newGemsByKey = new Map(
              newVariantData.gemDetails.map((gem: any) => [
                makeGemKey(gem),
                gem,
              ]),
            );

            const gemUpdatePromises: Promise<any>[] = [];
            const gemDeletePromises: Promise<any>[] = [];
            const gemCreatePromises: Promise<any>[] = [];

            // Process existing gems
            for (const [key, existingGem] of existingGemsByKey) {
              if (newGemsByKey.has(key)) {
                // Update existing gem
                const newGemData: any = newGemsByKey.get(key)!;
                gemUpdatePromises.push(
                  this.gemCoreService.update({
                    where: { id: existingGem.id },
                    data: {
                      mm: newGemData.mm,
                      weight: newGemData.weight,
                      color: newGemData.color,
                      clarity: newGemData.clarity,
                      quantity: newGemData.quantity,
                    },
                  }),
                );
              } else {
                // Delete gem that no longer exists
                gemDeletePromises.push(
                  this.gemCoreService.update({
                    where: { id: existingGem.id },
                    data: { isDeleted: true },
                  }),
                );
              }
            }

            // Create new gems
            for (const [key1, data] of newGemsByKey) {
              const key: any = key1;
              const newGemData: any = data;
              if (!existingGemsByKey.has(key)) {
                gemCreatePromises.push(
                  this.gemCoreService.create({
                    data: {
                      variant: { connect: { id: variant.id } },
                      shape: newGemData.shape,
                      mm: newGemData.mm,
                      weight: newGemData.weight,
                      color: newGemData.color,
                      clarity: newGemData.clarity,
                      quantity: newGemData.quantity,
                    },
                  }),
                );
              }
            }

            // Execute gem operations
            await Promise.all([
              ...gemUpdatePromises,
              ...gemDeletePromises,
              ...gemCreatePromises,
            ]);

            // Recompute and persist total weight of all gems for this variant
            const currentGems = await this.gemCoreService.findMany({
              where: { variantId: variant.id, isDeleted: false },
            });
            const totalGemWeight = currentGems.reduce(
              (sum, g: any) => sum + (g?.weight || 0) * (g?.quantity || 0),
              0,
            );

            // Recalculate basePrice for this variant (without certificate charges)
            const calculator = await this.calculatorCoreService.findFirst({
              where: { isDeleted: false, status: STATUS.ENABLED },
            });

            let basePrice = null;
            if (calculator) {
              // Get current variant data to calculate material costs
              const currentVariant =
                await this.jewelleryVariantCoreService.findFirst({
                  where: { id: variant.id, isDeleted: false },
                });

              if (currentVariant) {
                // Calculate gem prices
                let totalGemPrice = 0;
                let missingGemPrice = false;
                for (const gem of currentGems) {
                  // Find diamond price for this gem's characteristics
                  const diamondPrice =
                    await this.diamondProductCoreService.findFirst({
                      where: {
                        shape: gem.shape,
                        weight: gem.weight,
                        color: gem.color,
                        clarity: gem.clarity,
                        isDeleted: false,
                        gemOrigin: variant.gemOrigin,
                        status: STATUS.ENABLED,
                      },
                      orderBy: { price: 'asc' },
                    });

                  if (diamondPrice) {
                    const gemTypePrice =
                      (diamondPrice as any).price * gem.quantity;
                    totalGemPrice += gemTypePrice;
                  } else {
                    missingGemPrice = true;
                  }
                }

                // Calculate prices for all materials and find the minimum
                const materialPrices = [
                  {
                    name: 'silver',
                    price:
                      (currentVariant.silver || 0) * calculator.silverPerGram,
                  },
                  {
                    name: 'tenKtGold',
                    price:
                      (currentVariant.tenKtGold || 0) *
                      calculator.tenKtGoldPerGram,
                  },
                  {
                    name: 'forteenKtGold',
                    price:
                      (currentVariant.forteenKtGold || 0) *
                      calculator.forteenKtGoldPerGram,
                  },
                  {
                    name: 'eighteenKtGold',
                    price:
                      (currentVariant.eighteenKtGold || 0) *
                      calculator.eighteenKtGoldPerGram,
                  },
                ];

                // Find the minimum material price (excluding zero values)
                const validMaterialPrices = materialPrices.filter(
                  (m) => m.price > 0,
                );
                const minMaterialPrice =
                  validMaterialPrices.length > 0
                    ? Math.min(...validMaterialPrices.map((m) => m.price))
                    : 0;

                const inrPart =
                  calculator.miscellaneous +
                  minMaterialPrice +
                  calculator.extraCost;

                if (missingGemPrice) {
                  basePrice = 0;
                } else {
                  basePrice = Number(
                    (
                      (inrPart / calculator.usRate + totalGemPrice) /
                      calculator.duty /
                      calculator.profit
                    ).toFixed(2),
                  );
                }
              }
            }

            await this.jewelleryVariantCoreService.update({
              where: { id: variant.id },
              data: {
                totalGemWeight: Number(totalGemWeight?.toFixed(2)),
                basePrice,
              },
            });
          }
        }
      }

      // Get updated variants for response
      const updatedVariants = await this.jewelleryVariantCoreService.findMany({
        where: { jewelleryId: id, isDeleted: false },
        include: { gem: { where: { isDeleted: false } } },
      });

      // Calculate the lowest variant price for the jewellery basePrice
      const variantPrices = updatedVariants
        .map((v) => v.basePrice)
        .filter((price) => price !== null);
      const jewelleryBasePrice =
        variantPrices.length > 0
          ? Math.min(...(variantPrices as number[]))
          : null;

      // Update jewellery with new basePrice
      await this.jewelleryCoreService.update({
        where: { id },
        data: { basePrice: jewelleryBasePrice },
      });

      // Handle collection updates if provided
      if (updateJewelleryDto.collectionId !== undefined) {
        // Get existing jewellery-collection relationships
        const existingCollections =
          await this.jewelleryCollectionCoreService.findMany({
            where: { jewelleryId: id, isDeleted: false },
          });

        // Create maps for efficient lookup
        const existingCollectionsByCollectionId = new Map(
          existingCollections.map((ec) => [ec.collectionId, ec]),
        );
        const newCollectionIds = new Set(updateJewelleryDto.collectionId || []);

        // Collections to keep (existing ones that are still needed)
        const collectionsToKeep = existingCollections.filter((ec) =>
          newCollectionIds.has(ec.collectionId),
        );

        // Collections to remove (existing ones that are no longer needed)
        const collectionsToRemove = existingCollections.filter(
          (ec) => !newCollectionIds.has(ec.collectionId),
        );

        // Collections to add (new ones that don't exist yet)
        const collectionsToAdd = (updateJewelleryDto.collectionId || []).filter(
          (collectionId) =>
            !existingCollectionsByCollectionId.has(collectionId),
        );

        // Remove collections that are no longer needed
        for (const collectionToRemove of collectionsToRemove) {
          await this.jewelleryCollectionCoreService.update({
            where: { id: collectionToRemove.id },
            data: { isDeleted: true },
          });
        }

        // Add new collections that don't exist yet
        if (collectionsToAdd.length > 0) {
          const collectionPromises = collectionsToAdd.map(
            async (collectionId) => {
              return await this.jewelleryCollectionCoreService.create({
                data: {
                  jewellery: { connect: { id } },
                  collection: { connect: { id: collectionId } },
                },
              });
            },
          );
          await Promise.all(collectionPromises);
        }

        // Get updated collections for response
        const updatedCollections =
          await this.jewelleryCollectionCoreService.findMany({
            where: { jewelleryId: id, isDeleted: false },
            include: { collection: true },
          });

        // Get the updated jewellery with new basePrice
        const jewelleryWithBasePrice =
          await this.jewelleryCoreService.findFirst({
            where: { id, isDeleted: false },
          });

        return {
          ...jewelleryWithBasePrice,
          variants: updatedVariants,
          collections: updatedCollections,
        };
      }

      // Get the updated jewellery with new basePrice
      const jewelleryWithBasePrice = await this.jewelleryCoreService.findFirst({
        where: { id, isDeleted: false },
      });

      return {
        ...jewelleryWithBasePrice,
        variants: updatedVariants,
      };
    }

    return updatedJewellery;
  }

  async enable(id: string) {
    const jewellery = await this.jewelleryCoreService.findFirst({
      where: { id, isDeleted: false },
    });

    if (!jewellery) {
      throw new BadRequestException('Jewellery not found');
    }

    return await this.jewelleryCoreService.update({
      where: { id },
      data: { status: STATUS.ENABLED },
    });
  }

  async disable(id: string) {
    const jewellery = await this.jewelleryCoreService.findFirst({
      where: { id, isDeleted: false },
    });

    if (!jewellery) {
      throw new BadRequestException('Jewellery not found');
    }

    return await this.jewelleryCoreService.update({
      where: { id },
      data: { status: STATUS.DISABLED },
    });
  }

  async remove(id: string) {
    const jewellery = await this.jewelleryCoreService.findFirst({
      where: { id, isDeleted: false },
    });

    if (!jewellery) {
      throw new BadRequestException('Jewellery not found');
    }

    // Soft delete jewellery and all its variants
    await Promise.all([
      this.jewelleryCoreService.update({
        where: { id },
        data: { isDeleted: true },
      }),
      this.jewelleryVariantCoreService.updateMany({
        where: { jewelleryId: id },
        data: { isDeleted: true },
      }),
      this.jewelleryCollectionCoreService.updateMany({
        where: { jewelleryId: id },
        data: { isDeleted: true },
      }),
    ]);

    return { message: 'Jewellery deleted successfully' };
  }

  private async findOrCreateCategory(name: string) {
    if (!name) return null;

    const nameLower = name.trim().toLowerCase();

    // Try to find existing category (case insensitive)
    const categories = await this.categoryCoreService.findMany({
      where: {
        isDeleted: false,
      },
    });

    const existing = categories.find(
      (cat) => cat.name.toLowerCase() === nameLower,
    );

    if (existing) return existing.id;

    // Create new category if not found
    const newCategory = await this.categoryCoreService.create({
      data: {
        name: name.trim(),
        status: 'ENABLED' as const,
        isDeleted: false,
      },
    });

    return newCategory.id;
  }

  private async findOrCreateSubcategory(name: string, categoryId: string) {
    if (!name || !categoryId) return null;

    const nameLower = name.trim().toLowerCase();

    // Get all subcategories for the category
    const subcategories = await this.subCategoryCoreService.findMany({
      where: {
        categoryId,
        isDeleted: false,
      },
    });

    // Find case-insensitive match
    const existing = subcategories.find(
      (sub) => sub.name.toLowerCase() === nameLower,
    );

    if (existing) return existing.id;

    // Create new subcategory if not found
    const newSubcategory = await this.subCategoryCoreService.create({
      data: {
        name: name.trim(),
        categoryId,
        status: 'ENABLED' as const,
        isDeleted: false,
      },
    });

    return newSubcategory.id;
  }

  private async findOrCreateType(
    name: string,
    categoryId?: string,
    subCategoryId?: string,
  ) {
    if (!name) return null;

    const nameLower = name.trim().toLowerCase();

    // Get all types
    const types = await this.typeCoreService.findMany({
      where: {
        isDeleted: false,
        ...(categoryId ? { categoryId } : {}),
        ...(subCategoryId ? { subCategoryId } : {}),
      },
    });

    // Find case-insensitive match
    const existing = types.find(
      (type) => type.name.toLowerCase() === nameLower,
    );

    if (existing) return existing.id;

    // Create new type if not found
    const createData: {
      name: string;
      status: 'ENABLED';
      isDeleted: boolean;
      category?: { connect: { id: string } };
      subCategory?: { connect: { id: string } };
    } = {
      name: name.trim(),
      status: 'ENABLED',
      isDeleted: false,
    };

    if (categoryId) {
      createData.category = { connect: { id: categoryId } };
    }

    if (subCategoryId) {
      createData.subCategory = { connect: { id: subCategoryId } };
    }

    const newType = await this.typeCoreService.create({
      data: createData as any, // Using type assertion as a last resort
    });

    return newType.id;
  }

  private async createOrUpdateJewellery(jewelleryData: any) {
    const {
      name,
      sku,
      description,
      categoryName,
      subCategoryName,
      typeName,
      variants = [],
    } = jewelleryData;

    interface MaterialDetails {
      silver?: number;
      tenKtGold?: number;
      forteenKtGold?: number; // Note: This is the correct spelling used in the schema
      eighteenKtGold?: number;
    }

    interface GemDetails {
      shape: string;
      color: string;
      clarity: string;
      weight: number;
      mm: string;
      quantity: number;
      origin: string;
    }

    // Find category (do not create on import)
    let categoryId = '';
    if (categoryName) {
      const category = await this.categoryCoreService.findFirst({
        where: {
          name: categoryName,
        },
      });
      if (!category) {
        throw new BadRequestException(
          `Category not found for name: ${categoryName}`,
        );
      }
      categoryId = category.id;
    }

    // Find subcategory (do not create on import)
    let subCategoryId = '';
    if (subCategoryName) {
      const subCategory = await this.subCategoryCoreService.findFirst({
        where: {
          name: subCategoryName,
          ...(categoryId ? { categoryId } : {}),
        },
      });
      if (!subCategory) {
        throw new BadRequestException(
          `Sub-category not found for name: ${subCategoryName}`,
        );
      }
      subCategoryId = subCategory.id;
    }

    // Find type (do not create on import)
    let typeId = '';
    if (typeName) {
      const type = await this.typeCoreService.findFirst({
        where: {
          name: typeName,
          ...(categoryId ? { categoryId } : {}),
          ...(subCategoryId ? { subCategoryId } : {}),
        },
      });
      if (!type) {
        throw new BadRequestException(`Type not found for name: ${typeName}`);
      }
      typeId = type.id;
    }

    // Check if jewellery with this SKU already exists
    const existingJewellery = await this.jewelleryCoreService.findFirst({
      where: { sku },
    });

    const jewelleryDataToUpsert = {
      name: name || 'Unnamed Jewellery',
      sku: sku || `JWL-${Date.now()}`,
      description: description || '',
      categoryId: categoryId || undefined,
      subCategoryId: subCategoryId || undefined,
      typeId: typeId || undefined,
      status: 'ENABLED' as const,
      isDeleted: false,
    };

    let jewellery;
    if (existingJewellery) {
      // Update existing jewellery
      jewellery = await this.jewelleryCoreService.update({
        where: { id: existingJewellery.id },
        data: jewelleryDataToUpsert,
      });

      // Soft delete existing variants
      await this.jewelleryVariantCoreService.updateMany({
        where: { jewelleryId: jewellery.id },
        data: { isDeleted: true },
      });
    } else {
      // Create new jewellery
      jewellery = await this.jewelleryCoreService.create({
        data: jewelleryDataToUpsert,
      });
    }

    // Create variants
    for (const variant of variants) {
      const {
        gemDetails = [],
        materialDetails,
        size,
        gemOrigin,
        measurements,
      } = variant as {
        gemDetails?: GemDetails[];
        materialDetails?: MaterialDetails;
        size?: number;
        gemOrigin?: string;
        measurements?: any;
      };

      const variantData: any = {
        jewelleryId: jewellery.id,
        size: size || 0,
        gemOrigin: gemOrigin || 'NATURAL',
        isDeleted: false,
      };

      // Add material details as separate fields if they exist
      if (materialDetails) {
        variantData.silver = materialDetails.silver || 0;
        variantData.tenKtGold = materialDetails.tenKtGold || 0;
        variantData.forteenKtGold = materialDetails.forteenKtGold || 0; // Using correct property name
        variantData.eighteenKtGold = materialDetails.eighteenKtGold || 0;
      }

      // Set mesurement field with the measurements object
      variantData.mesurement = {
        width: measurements?.width || '0cm',
        height: measurements?.height || '0cm',
        length: measurements?.length || '0cm',
      };

      const createdVariant = await this.jewelleryVariantCoreService.create({
        data: variantData,
      });

      // Create gem details (normalized to uppercase) and calculate pricing like create/update
      let createdGems: any[] = [];
      if (gemDetails && gemDetails.length > 0) {
        createdGems = await Promise.all(
          gemDetails.map((gem) => {
            const gemData: any = {
              variantId: createdVariant.id,
              shape: (gem.shape || 'ROUND').toString().toUpperCase(),
              color: (gem.color || 'D').toString().toUpperCase(),
              clarity: (gem.clarity || 'IF').toString().toUpperCase(),
              weight: gem.weight || 0,
              mm: gem.mm || '0',
              quantity: gem.quantity || 1,
              isDeleted: false,
            };
            return this.gemCoreService.create({ data: gemData });
          }),
        );
      }

      // Compute totalGemWeight and basePrice similar to create/update
      const calculator = await this.calculatorCoreService.findFirst({
        where: { isDeleted: false, status: STATUS.ENABLED },
      });

      let totalGemWeight = 0;
      let basePrice: number | null = null;

      if (createdGems.length > 0) {
        totalGemWeight = createdGems.reduce(
          (sum, g: any) => sum + (g?.weight || 0) * (g?.quantity || 0),
          0,
        );
      }

      if (calculator) {
        // Calculate gem prices
        let totalGemPrice = 0;
        let missingGemPrice = false;
        for (const gem of createdGems) {
          const diamondPrice = await this.diamondProductCoreService.findFirst({
            where: {
              shape: gem.shape,
              weight: gem.weight,
              color: gem.color,
              clarity: gem.clarity,
              isDeleted: false,
              gemOrigin: variantData.gemOrigin,
            },
            orderBy: { price: 'asc' },
          });

          if (diamondPrice) {
            totalGemPrice += (diamondPrice as any).price * (gem.quantity || 1);
          } else {
            missingGemPrice = true;
          }
        }

        // Material min price
        const materialPrices = [
          {
            name: 'silver',
            price: (variantData.silver || 0) * calculator.silverPerGram,
          },
          {
            name: 'tenKtGold',
            price: (variantData.tenKtGold || 0) * calculator.tenKtGoldPerGram,
          },
          {
            name: 'forteenKtGold',
            price:
              (variantData.forteenKtGold || 0) *
              calculator.forteenKtGoldPerGram,
          },
          {
            name: 'eighteenKtGold',
            price:
              (variantData.eighteenKtGold || 0) *
              calculator.eighteenKtGoldPerGram,
          },
        ];

        const validMaterialPrices = materialPrices.filter((m) => m.price > 0);
        const minMaterialPrice =
          validMaterialPrices.length > 0
            ? Math.min(...validMaterialPrices.map((m) => m.price))
            : 0;

        const inrPart =
          calculator.miscellaneous + minMaterialPrice + calculator.extraCost;

        if (missingGemPrice) {
          basePrice = 0;
        } else {
          basePrice =
            inrPart > 0 || totalGemPrice > 0
              ? Number(
                  (
                    (inrPart / calculator.usRate + totalGemPrice) /
                    calculator.duty /
                    calculator.profit
                  ).toFixed(2),
                )
              : null;
        }
      }

      await this.jewelleryVariantCoreService.update({
        where: { id: createdVariant.id },
        data: {
          hasGems:
            (gemDetails && gemDetails.length > 0) || createdGems.length > 0,
          totalGemWeight: Number(totalGemWeight?.toFixed(2)),
          basePrice: basePrice ?? null,
        },
      });
      console.log('Variant created successfully:', {
        id: createdVariant.id,
        basePrice,
        totalGemWeight,
      });
    }

    // After creating variants, compute jewellery basePrice as min of variant basePrice
    const finalVariants = await this.jewelleryVariantCoreService.findMany({
      where: { jewelleryId: jewellery.id, isDeleted: false },
    });

    const variantPrices = finalVariants
      .map((v: any) => v.basePrice)
      .filter((price: any) => price !== null && price > 0);

    const jewelleryBasePrice =
      variantPrices.length > 0 ? Math.min(...variantPrices) : null;

    jewellery = await this.jewelleryCoreService.update({
      where: { id: jewellery.id },
      data: { basePrice: jewelleryBasePrice },
    });

    return jewellery;
  }

  async importFromExcel(fileUrl: string) {
    const results = [];

    try {
      // Download and parse the Excel file
      const response = await axios.get(fileUrl, {
        responseType: 'arraybuffer',
      });
      const workbook = XLSX.read(response.data, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Track current product being processed
      let currentProduct: any = null;
      let currentVariants = [];

      // Process each row
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        const hasProductName = !!row['Product Name']?.toString().trim();

        // If we hit a new product or end of file
        if ((hasProductName || i === jsonData.length - 1) && currentProduct) {
          try {
            // Process the completed product
            const jewellery = await this.createOrUpdateJewellery({
              ...currentProduct,
              variants: currentVariants,
            });

            results.push({
              success: true,
              jewelleryId: jewellery.id,
              sku: currentProduct.sku,
              variantsCount: currentVariants.length,
            });
          } catch (error) {
            results.push({
              success: false,
              error: error.message,
              rowData: currentProduct.originalRow,
            });
          }

          // Reset for next product
          currentProduct = null;
          currentVariants = [];
        }

        // If this is a new product row
        if (hasProductName) {
          const transformed = this.transformExcelRowToJewellery(row);
          currentProduct = {
            name: transformed.name,
            sku: transformed.sku,
            categoryName: transformed.categoryName,
            subCategoryName: transformed.subCategoryName,
            typeName: transformed.typeName,
            description: transformed.description,
            originalRow: row, // Keep original row for error reporting
          };

          if (transformed.variants[0]) {
            currentVariants.push(transformed.variants[0]);
          }
        }
        // If this is a variant row for current product
        else if (currentProduct) {
          const variant = this.transformExcelRowToJewellery(row).variants[0];
          if (variant) {
            // Check if we already have this variant size
            const existingVariantIndex = currentVariants.findIndex(
              (v) => v.size === variant.size,
            );

            if (existingVariantIndex >= 0) {
              // Add gem to existing variant
              if (variant.gemDetails.length > 0) {
                currentVariants[existingVariantIndex].gemDetails.push(
                  ...variant.gemDetails,
                );
              }
            } else {
              // Add new variant
              currentVariants.push(variant);
            }
          }
        }
      }

      return {
        total: results.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      };
    } catch (error) {
      throw new Error(`Failed to import from Excel: ${error.message}`);
    }
  }

  private transformExcelRowToJewellery(row: any) {
    // Helper function to safely parse measurements
    const parseMeasurements = (measurementsStr: string) => {
      if (!measurementsStr) return { length: '0', width: '0', height: '0' };

      return measurementsStr.split(',').reduce(
        (acc, item) => {
          const [key, value] = item.split(':');
          if (key && value) {
            const field = key.trim().toLowerCase();
            acc[field] = value.trim();
          }
          return acc;
        },
        {} as Record<string, string>,
      );
    };

    // Extract measurements and convert to object format
    const measures = parseMeasurements(row['MESUREMENTS'] || '');
    const measurements = {
      length: measures.length || '0cm',
      width: measures.width || '0cm',
      height: measures.height || '0cm',
    };

    // Extract gem details if they exist
    const gemDetails = [];
    if (
      row.Shape ||
      row['Size (MM)'] ||
      row.Carat ||
      row.Color ||
      row.Clarity ||
      row.Quantity
    ) {
      gemDetails.push({
        shape: (row.Shape || 'ROUND').toString().toUpperCase(),
        mm: (row['Size (MM)'] || '0').toString(),
        weight: parseFloat(row.Carat || '0'),
        color: (row.Color || 'D').toString().toUpperCase(),
        clarity: (row.Clarity || 'IF').toString().toUpperCase(),
        quantity: parseInt(row.Quantity || '1', 10),
      });
    }

    // Extract variant data
    const variant = {
      size: parseFloat(row['Size(Variation)'] || row.size || '0'),
      gemOrigin: (row.gemOrigin || 'NATURAL').toString().toUpperCase(),
      gemDetails,
      materialDetails: {
        silver: parseFloat(row.Material_925 || '0'),
        tenKtGold: parseFloat(row.Material_10KT || '0'),
        forteenKtGold: parseFloat(row.Material_14KT || '0'),
        eighteenKtGold: parseFloat(row.Material_18KT || '0'),
      },
      measurements,
    };

    return {
      name: (row['Product Name'] || '').trim(),
      sku: (row['SKU'] || '').trim(),
      categoryName: (row['Category'] || '').trim(),
      subCategoryName: (row['SubCategory'] || '').trim(),
      typeName: (row['Type'] || '').trim(),
      description: (row['DESCRIPTION:'] || row['Description'] || '').trim(),
      variants: [variant],
      collectionId: [],
      images: [],
    };
  }

  async getVariants(id: string) {
    const jewellery = await this.jewelleryCoreService.findFirst({
      where: { id, isDeleted: false },
    });

    if (!jewellery) {
      throw new BadRequestException('Jewellery not found');
    }

    return await this.jewelleryVariantCoreService.findMany({
      where: { jewelleryId: id, isDeleted: false },
    });
  }

  async getVariant(id: string, variantId: string) {
    const jewellery = await this.jewelleryCoreService.findFirst({
      where: { id, isDeleted: false },
    });

    if (!jewellery) {
      throw new BadRequestException('Jewellery not found');
    }

    const variant = await this.jewelleryVariantCoreService.findFirst({
      where: { id: variantId, jewelleryId: id, isDeleted: false },
      include: { gem: { where: { isDeleted: false } } },
    });

    if (!variant) {
      throw new BadRequestException('Variant not found');
    }

    return variant;
  }
}
