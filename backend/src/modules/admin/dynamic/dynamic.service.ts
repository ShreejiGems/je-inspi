import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AddPrimeProductDto,
  AddSectionImageDto,
  MarketingImagesDto,
  PriceFilterDto,
  PRODUCT_TYPE,
} from './dto/dynamic.dto';
import { SectionImageCoreService } from 'src/core/section-image-core/section-image-core.service';
import { CalculatorCoreService } from 'src/core/calculator-core/calculator-core.service';
import {
  calculatorMessage,
  categoryMessage,
  diamondProductMessage,
  jewelleryMessage,
} from 'src/shared/keys/user.key';
import { CategoryCoreService } from 'src/core/category-core/category-core.service';
import { DiamondProductCoreService } from 'src/core/diamond-product-core/diamond-product-core.service';
import { JewelleryCoreService } from 'src/core/jewellery-core/jewellery-core.service';
import { PrimeProductCoreService } from 'src/core/prime-product-core/prime-product-core.service';

@Injectable()
export class DynamicService {
  constructor(
    private sectionImageCoreService: SectionImageCoreService,
    private calculatorCoreService: CalculatorCoreService,
    private categoryCoreService: CategoryCoreService,
    private diamondProductCoreService: DiamondProductCoreService,
    private jewelleryCoreService: JewelleryCoreService,
    private primeProductCoreService: PrimeProductCoreService,
  ) {}

  async AddEditSectionImage(addSectionImageDto: AddSectionImageDto) {
    const { image, imageType, mediaType } = addSectionImageDto;

    const imageTypeExist = await this.sectionImageCoreService.findFirst({
      where: { imageType, isDeleted: false },
    });

    let updatedImage;
    if (imageTypeExist) {
      updatedImage = await this.sectionImageCoreService.update({
        where: { id: imageTypeExist.id },
        data: { image, mediaType },
      });
    } else {
      updatedImage = await this.sectionImageCoreService.create({
        data: { image, imageType, mediaType },
      });
    }

    return updatedImage;
  }

  async getSectionImage() {
    return await this.sectionImageCoreService.findMany({
      where: { isDeleted: false },
    });
  }

  async AddPrimeProduct(addPrimeProductDto: AddPrimeProductDto) {
    const { categoryId, productId, productType, primeImage } =
      addPrimeProductDto;

    if (productType === PRODUCT_TYPE.DIAMOND) {
      const diamondProductExist =
        await this.diamondProductCoreService.findFirst({
          where: { id: productId, isDeleted: false },
        });

      if (!diamondProductExist) {
        throw new BadRequestException(
          diamondProductMessage.DIAMOND_PRODUCT_NOT_FOUND,
        );
      }

      const diamondPrimeExist = await this.primeProductCoreService.findFirst({
        where: { productType: PRODUCT_TYPE.DIAMOND, isDeleted: false },
      });

      let diamondPrime;
      if (diamondPrimeExist) {
        diamondPrime = await this.primeProductCoreService.update({
          where: { id: diamondPrimeExist.id },
          data: { diamondProductId: productId, primeImage },
        });
      } else {
        diamondPrime = await this.primeProductCoreService.create({
          data: {
            diamondProductId: productId,
            primeImage,
            productType: PRODUCT_TYPE.DIAMOND,
          },
        });
      }

      return diamondPrime;
    } else {
      const jewelleryProductExist = await this.jewelleryCoreService.findFirst({
        where: { id: productId, categoryId, isDeleted: false },
      });

      if (!jewelleryProductExist) {
        throw new BadRequestException(jewelleryMessage.JEWELLERY_NOT_FOUND);
      }

      const categoryJewelleryPrimeExist =
        await this.primeProductCoreService.findFirst({
          where: {
            productType: PRODUCT_TYPE.JEWELLERY,
            categoryId,
            isDeleted: false,
          },
        });

      let jewelleryPrime;
      if (categoryJewelleryPrimeExist) {
        jewelleryPrime = await this.primeProductCoreService.update({
          where: { id: categoryJewelleryPrimeExist.id },
          data: { jewelleryId: productId, primeImage },
        });

        return jewelleryPrime;
      } else {
        if (
          jewelleryProductExist &&
          jewelleryProductExist.categoryId !== categoryId
        ) {
          throw new BadRequestException(
            'Product has different category assigned',
          );
        }

        jewelleryPrime = await this.primeProductCoreService.create({
          data: {
            jewelleryId: productId,
            primeImage,
            categoryId,
            productType: PRODUCT_TYPE.JEWELLERY,
          },
        });

        return jewelleryPrime;
      }
    }
  }

  async AddEditPriceFilter(priceFilterDto: PriceFilterDto) {
    const { min, max } = priceFilterDto;

    const calculatorExist = await this.calculatorCoreService.findFirst({
      where: { isDeleted: false },
    });

    if (!calculatorExist) {
      throw new BadRequestException(calculatorMessage.CALCULATOR_NOT_FOUND);
    }

    return await this.calculatorCoreService.update({
      where: { id: calculatorExist.id },
      data: { filterMin: min, filterMax: max },
    });
  }

  async marketingImages(
    categoryId: string,
    marketingImagesDto: MarketingImagesDto,
  ) {
    const categoryExist = await this.categoryCoreService.findFirst({
      where: { id: categoryId, isDeleted: false },
    });

    if (!categoryExist) {
      throw new BadRequestException(categoryMessage.CATEGORY_NOT_FOUND);
    }

    return await this.categoryCoreService.update({
      where: { id: categoryId },
      data: { marketingImages: marketingImagesDto.images },
    });
  }

  async getPrimeProduct() {
    const [primeJewellery, primeDiamond] = await Promise.all([
      this.primeProductCoreService.findMany({
        where: { productType: PRODUCT_TYPE.JEWELLERY, isDeleted: false },
        include: { category: true, jewellery: true },
      }),
      this.primeProductCoreService.findFirst({
        where: { productType: PRODUCT_TYPE.DIAMOND, isDeleted: false },
      }),
    ]);

    const jewelleryItems = primeJewellery.map((j: any) => ({
      productType: PRODUCT_TYPE.JEWELLERY,
      product: j,
    }));

    const diamondItems = primeDiamond
      ? [
          {
            productType: PRODUCT_TYPE.DIAMOND,
            product: primeDiamond.id,
          },
        ]
      : [];

    return [...jewelleryItems, ...diamondItems];
  }
}
