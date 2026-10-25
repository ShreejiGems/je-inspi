import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJewelleryCategoryDto } from './dto/create-jewellery-category.dto';
import { UpdateJewelleryCategoryDto } from './dto/update-jewellery-category.dto';
import { CategoryCoreService } from 'src/core/category-core/category-core.service';
import { categoryMessage } from 'src/shared/keys/user.key';
import { STATUS } from '@prisma/client';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import { SubCategoryCoreService } from 'src/core/sub-category-core/sub-category-core.service';
import { TypeCoreService } from 'src/core/type-core/type-core.service';
import { JewelleryCoreService } from 'src/core/jewellery-core/jewellery-core.service';

@Injectable()
export class JewelleryCategoryService {
  constructor(
    private categoryCoreService: CategoryCoreService,
    private subCategoryCoreService: SubCategoryCoreService,
    private typeCoreService: TypeCoreService,
    private jewelleryCoreService: JewelleryCoreService,
  ) {}

  async create(createJewelleryCategoryDto: CreateJewelleryCategoryDto) {
    const { categoryName } = createJewelleryCategoryDto;

    return await this.categoryCoreService.create({
      data: { name: categoryName },
    });
  }

  async findAll() {
    return await this.categoryCoreService.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAllEnabled(baseQueryCoreDto: BaseQueryCoreDto) {
    return await this.categoryCoreService.findPaginate(baseQueryCoreDto, {
      isDeleted: false,
      status: STATUS.ENABLED,
    });
  }

  async findOne(id: string) {
    const categoryExist = await this.categoryCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!categoryExist) {
      throw new BadRequestException(categoryMessage.CATEGORY_NOT_FOUND);
    }

    return categoryExist;
  }

  async update(
    id: string,
    updateJewelleryCategoryDto: UpdateJewelleryCategoryDto,
  ) {
    const { categoryName, categoryType } = updateJewelleryCategoryDto;

    const categoryExist = await this.categoryCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!categoryExist) {
      throw new BadRequestException(categoryMessage.CATEGORY_NOT_FOUND);
    }

    return await this.categoryCoreService.update({
      where: { id },
      data: {
        name: categoryName,
        ...(categoryType && { categoryType }),
      },
    });
  }

  async enable(id: string) {
    const categoryExist = await this.categoryCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!categoryExist) {
      throw new BadRequestException(categoryMessage.CATEGORY_NOT_FOUND);
    }

    return await this.categoryCoreService.update({
      where: { id },
      data: { status: STATUS.ENABLED },
    });
  }

  async disable(id: string) {
    const categoryExist = await this.categoryCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!categoryExist) {
      throw new BadRequestException(categoryMessage.CATEGORY_NOT_FOUND);
    }

    return await this.categoryCoreService.update({
      where: { id },
      data: { status: STATUS.DISABLED },
    });
  }

  async remove(id: string) {
    const categoryExist = await this.categoryCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!categoryExist) {
      throw new BadRequestException(categoryMessage.CATEGORY_NOT_FOUND);
    }

    await this.subCategoryCoreService.updateMany({
      where: { categoryId: id },
      data: { isDeleted: true },
    });

    await this.typeCoreService.updateMany({
      where: { categoryId: id },
      data: { isDeleted: true },
    });

    await this.jewelleryCoreService.updateMany({
      where: { categoryId: id },
      data: { isDeleted: true },
    });

    return await this.categoryCoreService.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
