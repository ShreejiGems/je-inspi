import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { STATUS } from '@prisma/client';
import { DiamondProductCoreService } from 'src/core/diamond-product-core/diamond-product-core.service';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import {
  CreateDiamondDto,
  UpdateDiamondDto,
  SearchDiamondsDto,
} from './dto/diamond.dto';
import {
  primaryShape,
  primaryColor,
  primaryClarity,
  primaryCut,
  primarySymmetry,
  primaryPolish,
  primaryFluorescence,
} from './dto/diamond.dto';
import { UserSessionCoreService } from 'src/core/user-session-core/user-session-core.service';
import { WishlistCoreService } from 'src/core/wishlist-core/wishlist-core.service';

@Injectable()
export class DiamondService {
  constructor(
    private readonly diamondProductCoreService: DiamondProductCoreService,
    private userSessionCoreService: UserSessionCoreService,
    private wishlistCoreService: WishlistCoreService,
  ) {}

  // Browsing is public. A valid session only adds the visitor's wishlist state.
  private async optionalUserId(headers?: { authorization?: string }) {
    const token = headers?.authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
    if (!token) return null;
    const session = await this.userSessionCoreService.findFirst({
      where: { authToken: token, isDeleted: false },
    });
    return session?.userId ?? null;
  }

  async create(createDiamondDto: CreateDiamondDto) {
    // Check if SKU already exists
    const existingDiamond = await this.diamondProductCoreService.findFirst({
      where: { sku: createDiamondDto.sku, isDeleted: false },
    });

    if (existingDiamond) {
      throw new BadRequestException('Diamond with this SKU already exists');
    }

    // Create diamond product
    const diamond = await this.diamondProductCoreService.create({
      data: {
        name: createDiamondDto.name,
        sku: createDiamondDto.sku,
        gemOrigin: createDiamondDto.gemOrigin,
        shape: createDiamondDto.shape,
        weight: createDiamondDto.weight,
        color: createDiamondDto.color,
        clarity: createDiamondDto.clarity,
        cut: createDiamondDto.cut || null,
        symmetry: createDiamondDto.symmetry || null,
        lab: createDiamondDto.lab || null,
        polish: createDiamondDto.polish || null,
        certificateNo: createDiamondDto.certificateNo || null,
        height: createDiamondDto.height || null,
        width: createDiamondDto.width || null,
        length: createDiamondDto.length || null,
        totalDepthInPercentage: createDiamondDto.totalDepthInPercentage || null,
        totalWidthInPercentage: createDiamondDto.totalWidthInPercentage || null,
        girdle: createDiamondDto.girdle || null,
        fluorescence: createDiamondDto.fluorescence || null,
        images: createDiamondDto.images
          ? JSON.stringify(createDiamondDto.images)
          : null,
        videos: createDiamondDto.videos
          ? JSON.stringify(createDiamondDto.videos)
          : null,
        rap: createDiamondDto.rap,
        price: createDiamondDto.price,
      },
    });

    return diamond;
  }

  async searchParams() {
    const fields = [
      'shape',
      'color',
      'clarity',
      'cut',
      'symmetry',
      'lab',
      'polish',
      'girdle',
      'fluorescence',
      'gemOrigin',
    ] as const;

    type FieldType = (typeof fields)[number];
    type ResultType = {
      [K in FieldType]?: string[];
    } & {
      weightRange: { min: number; max: number };
      priceRange: { min: number; max: number };
    };

    const result: ResultType = {
      weightRange: { min: 0, max: 0 },
      priceRange: { min: 0, max: 0 },
    };

    // Get all diamonds with required fields
    const allDiamonds = await this.diamondProductCoreService.findMany({
      where: { isDeleted: false },
      select: {
        shape: true,
        color: true,
        clarity: true,
        cut: true,
        symmetry: true,
        lab: true,
        polish: true,
        girdle: true,
        fluorescence: true,
        gemOrigin: true,
        weight: true,
        price: true,
      },
    });

    // Process each field to get distinct values
    for (const field of fields) {
      const values = allDiamonds
        .map((d) => d[field])
        .filter(
          (value): value is string =>
            value !== null && value !== undefined && typeof value === 'string',
        );

      // Get unique values and sort them
      result[field] = [...new Set(values)].sort();
    }

    // Calculate weight and price ranges
    const weights = allDiamonds
      .map((d) => d.weight)
      .filter((w): w is number => typeof w === 'number' && !isNaN(w));

    const prices = allDiamonds
      .map((d) => d.price)
      .filter((p): p is number => typeof p === 'number' && !isNaN(p));

    result.weightRange = {
      min: weights.length ? Math.min(...weights) : 0,
      max: weights.length ? Math.max(...weights) : 0,
    };

    result.priceRange = {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    };

    return result;
  }

  async findAll(
    baseQueryCoreDto: BaseQueryCoreDto,
    searchDiamondsDto?: SearchDiamondsDto,
    headers?: any,
  ) {
    const where: any = { isDeleted: false };

    if (searchDiamondsDto?.isUserApi) {
      where.status = STATUS.ENABLED;
    }

    const userId = await this.optionalUserId(headers);

    // Apply search filters if provided
    if (searchDiamondsDto) {
      const {
        name,
        sku,
        gemOrigin,
        shape, // can be other
        minWeight,
        maxWeight,
        color, // can be other
        clarity, // can be other
        cut, // can be other
        lab, // can be other
        certificateNo,
        minPrice,
        maxPrice,
        fluorescence, // can be other
        minWidthPercentage,
        maxWidthPercentage,
        minDepthPercentage,
        maxDepthPercentage,
        symmetry, // can be other
        polish, // can be other
      } = searchDiamondsDto;

      // helper to apply primary/OTHER aware filters for a field
      const applyPrimaryOrOther = (
        fieldName: string,
        value?: string | string[],
        primaryList?: string[],
      ) => {
        if (!value) return;
        const arr = Array.isArray(value) ? value : [value];
        const hasOther = arr.includes('OTHER');
        const specifics = arr.filter((v) => v !== 'OTHER');

        // If primary list is not provided, fall back to old behavior
        if (!primaryList) {
          if (Array.isArray(value)) {
            where[fieldName] = { in: value };
          } else {
            where[fieldName] = value;
          }
          return;
        }

        if (hasOther && specifics.length > 0) {
          // records that are either in selected specifics OR outside primary list
          where.AND = where.AND || [];
          where.AND.push({
            OR: [
              { [fieldName]: { in: specifics } },
              { [fieldName]: { notIn: primaryList } },
            ],
          });
        } else if (hasOther) {
          // only OTHER selected -> anything not in primary list
          where[fieldName] = { notIn: primaryList };
        } else if (specifics.length > 0) {
          where[fieldName] =
            specifics.length > 1 ? { in: specifics } : specifics[0];
        }
      };

      // Text search fields
      if (name) where.name = { contains: name };
      if (sku) where.sku = { contains: sku };
      if (certificateNo) where.certificateNo = { contains: certificateNo };

      // Handle multiple values for exact match fields
      if (gemOrigin) {
        where.gemOrigin = Array.isArray(gemOrigin)
          ? { in: gemOrigin }
          : gemOrigin;
      }

      // Fields with primary lists and OTHER support
      applyPrimaryOrOther('shape', shape, primaryShape);
      applyPrimaryOrOther('color', color, primaryColor);
      applyPrimaryOrOther('clarity', clarity, primaryClarity);
      applyPrimaryOrOther('cut', cut, primaryCut);
      // Lab does not have a primary list defined; keep default behavior
      applyPrimaryOrOther('lab', lab);

      // Numeric range filters
      if (minWeight !== undefined || maxWeight !== undefined) {
        where.weight = {};
        if (minWeight !== undefined) where.weight.gte = Number(minWeight);
        if (maxWeight !== undefined) where.weight.lte = Number(maxWeight);
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = Number(minPrice);
        if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
      }

      // Fluorescence with primary list and OTHER support
      applyPrimaryOrOther('fluorescence', fluorescence, primaryFluorescence);

      if (
        minWidthPercentage !== undefined ||
        maxWidthPercentage !== undefined
      ) {
        where.totalWidthInPercentage = {};
        if (minWidthPercentage !== undefined)
          where.totalWidthInPercentage.gte = Number(minWidthPercentage);
        if (maxWidthPercentage !== undefined)
          where.totalWidthInPercentage.lte = Number(maxWidthPercentage);
      }

      if (
        minDepthPercentage !== undefined ||
        maxDepthPercentage !== undefined
      ) {
        where.totalDepthInPercentage = {};
        if (minDepthPercentage !== undefined)
          where.totalDepthInPercentage.gte = Number(minDepthPercentage);
        if (maxDepthPercentage !== undefined)
          where.totalDepthInPercentage.lte = Number(maxDepthPercentage);
      }

      // Symmetry and Polish with primary list and OTHER support
      applyPrimaryOrOther('symmetry', symmetry, primarySymmetry);
      applyPrimaryOrOther('polish', polish, primaryPolish);
    }

    let result = await this.diamondProductCoreService.findPaginate(
      baseQueryCoreDto,
      where,
    );

    if (userId) {
      result.list = await Promise.all(
        result.list.map(async (item: any) => {
          const wishlist = await this.wishlistCoreService.findFirst({
            where: { userId, diamondProductId: item.id, isDeleted: false },
          });

          return {
            ...item,
            isWishlisted: wishlist ? true : false,
          };
        }),
      );
    } else {
      result.list = result.list.map((item: any) => {
        return {
          ...item,
          isWishlisted: false,
        };
      });
    }

    return result;
  }

  async findOne(id: string, headers?: any) {
    const userId = await this.optionalUserId(headers);

    const diamond = await this.diamondProductCoreService.findFirst({
      where: { id, isDeleted: false },
    });

    if (!diamond) {
      throw new BadRequestException('Diamond not found');
    }

    if (userId) {
      const wishlist = await this.wishlistCoreService.findFirst({
        where: { userId, diamondProductId: diamond.id, isDeleted: false },
      });

      return {
        ...diamond,
        isWishlisted: wishlist ? true : false,
      };
    } else {
      return {
        ...diamond,
        isWishlisted: false,
      };
    }
  }

  async update(id: string, updateDiamondDto: UpdateDiamondDto) {
    const diamond = await this.diamondProductCoreService.findFirst({
      where: { id, isDeleted: false },
    });

    if (!diamond) {
      throw new BadRequestException('Diamond not found');
    }

    // Check SKU uniqueness if being updated
    if (updateDiamondDto.sku && updateDiamondDto.sku !== diamond.sku) {
      const existingDiamond = await this.diamondProductCoreService.findFirst({
        where: {
          sku: updateDiamondDto.sku,
          isDeleted: false,
          id: { not: id },
        },
      });

      if (existingDiamond) {
        throw new BadRequestException('Diamond with this SKU already exists');
      }
    }

    const updateData: any = {};

    if (updateDiamondDto.name !== undefined)
      updateData.name = updateDiamondDto.name;
    if (updateDiamondDto.sku !== undefined)
      updateData.sku = updateDiamondDto.sku;
    if (updateDiamondDto.gemOrigin !== undefined)
      updateData.gemOrigin = updateDiamondDto.gemOrigin;
    if (updateDiamondDto.shape !== undefined)
      updateData.shape = updateDiamondDto.shape;
    if (updateDiamondDto.weight !== undefined)
      updateData.weight = updateDiamondDto.weight;
    if (updateDiamondDto.color !== undefined)
      updateData.color = updateDiamondDto.color;
    if (updateDiamondDto.clarity !== undefined)
      updateData.clarity = updateDiamondDto.clarity;
    if (updateDiamondDto.cut !== undefined)
      updateData.cut = updateDiamondDto.cut;
    if (updateDiamondDto.symmetry !== undefined)
      updateData.symmetry = updateDiamondDto.symmetry;
    if (updateDiamondDto.lab !== undefined)
      updateData.lab = updateDiamondDto.lab;
    if (updateDiamondDto.polish !== undefined)
      updateData.polish = updateDiamondDto.polish;
    if (updateDiamondDto.certificateNo !== undefined)
      updateData.certificateNo = updateDiamondDto.certificateNo;
    if (updateDiamondDto.height !== undefined)
      updateData.height = updateDiamondDto.height;
    if (updateDiamondDto.width !== undefined)
      updateData.width = updateDiamondDto.width;
    if (updateDiamondDto.length !== undefined)
      updateData.length = updateDiamondDto.length;
    if (updateDiamondDto.totalDepthInPercentage !== undefined)
      updateData.totalDepthInPercentage =
        updateDiamondDto.totalDepthInPercentage;
    if (updateDiamondDto.totalWidthInPercentage !== undefined)
      updateData.totalWidthInPercentage =
        updateDiamondDto.totalWidthInPercentage;
    if (updateDiamondDto.girdle !== undefined)
      updateData.girdle = updateDiamondDto.girdle;
    if (updateDiamondDto.fluorescence !== undefined)
      updateData.fluorescence = updateDiamondDto.fluorescence;
    if (updateDiamondDto.images !== undefined)
      updateData.images = updateDiamondDto.images
        ? JSON.stringify(updateDiamondDto.images)
        : null;
    if (updateDiamondDto.videos !== undefined)
      updateData.videos = updateDiamondDto.videos
        ? JSON.stringify(updateDiamondDto.videos)
        : null;
    if (updateDiamondDto.rap !== undefined)
      updateData.rap = updateDiamondDto.rap;
    if (updateDiamondDto.price !== undefined)
      updateData.price = updateDiamondDto.price;

    const updatedDiamond = await this.diamondProductCoreService.update({
      where: { id },
      data: updateData,
    });

    return updatedDiamond;
  }

  async remove(id: string) {
    const diamond = await this.diamondProductCoreService.findFirst({
      where: { id, isDeleted: false },
    });

    if (!diamond) {
      throw new BadRequestException('Diamond not found');
    }

    // Soft delete
    await this.diamondProductCoreService.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: 'Diamond deleted successfully' };
  }

  async enable(id: string) {
    const diamond = await this.diamondProductCoreService.findFirst({
      where: { id, isDeleted: false },
    });

    if (!diamond) {
      throw new BadRequestException('Diamond not found');
    }

    const updatedDiamond = await this.diamondProductCoreService.update({
      where: { id },
      data: { status: STATUS.ENABLED },
    });

    return updatedDiamond;
  }

  async disable(id: string) {
    const diamond = await this.diamondProductCoreService.findFirst({
      where: { id, isDeleted: false },
    });

    if (!diamond) {
      throw new BadRequestException('Diamond not found');
    }

    const updatedDiamond = await this.diamondProductCoreService.update({
      where: { id },
      data: { status: STATUS.DISABLED },
    });

    return updatedDiamond;
  }
}
