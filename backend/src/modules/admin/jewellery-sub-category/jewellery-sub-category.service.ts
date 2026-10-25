import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJewellerySubCategoryDto } from './dto/create-jewellery-sub-category.dto';
import { UpdateJewellerySubCategoryDto } from './dto/update-jewellery-sub-category.dto';
import { SubCategoryCoreService } from 'src/core/sub-category-core/sub-category-core.service';
import { categoryMessage, subCategoryMessage } from 'src/shared/keys/user.key';
import { STATUS } from '@prisma/client';
import { CategoryCoreService } from 'src/core/category-core/category-core.service';
import { TypeCoreService } from 'src/core/type-core/type-core.service';
import { JewelleryCoreService } from 'src/core/jewellery-core/jewellery-core.service';

@Injectable()
export class JewellerySubCategoryService {
  constructor(
    private subCategoryCoreService: SubCategoryCoreService,
    private categoryCoreService: CategoryCoreService,
    private typeCoreService: TypeCoreService,
    private jewelleryCoreService: JewelleryCoreService,
  ) {}

  async create(createJewellerySubCategoryDto: CreateJewellerySubCategoryDto) {
    const { subCategoryName, categoryId } = createJewellerySubCategoryDto;

    const categoryExist = await this.categoryCoreService.findFirst({
      where: { id: categoryId, isDeleted: false },
    });

    if (!categoryExist) {
      throw new BadRequestException(categoryMessage.CATEGORY_NOT_FOUND);
    }

    return await this.subCategoryCoreService.create({
      data: {
        name: subCategoryName,
        categoryId: categoryId,
      },
    });
  }

  async findAll(categoryId: string) {
    return await this.subCategoryCoreService.findMany({
      where: { isDeleted: false, categoryId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAllEnabled(categoryId: string) {
    return await this.subCategoryCoreService.findMany({
      where: { isDeleted: false, categoryId, status: STATUS.ENABLED },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const subCategoryExist = await this.subCategoryCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!subCategoryExist) {
      throw new BadRequestException(subCategoryMessage.SUB_CATEGORY_NOT_FOUND);
    }

    return subCategoryExist;
  }

  async update(
    id: string,
    updateJewellerySubCategoryDto: UpdateJewellerySubCategoryDto,
  ) {
    const { subCategoryName } = updateJewellerySubCategoryDto;

    const subCategoryExist = await this.subCategoryCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!subCategoryExist) {
      throw new BadRequestException(subCategoryMessage.SUB_CATEGORY_NOT_FOUND);
    }

    return await this.subCategoryCoreService.update({
      where: { id },
      data: { name: subCategoryName },
    });
  }

  async enable(id: string) {
    const subCategoryExist = await this.subCategoryCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!subCategoryExist) {
      throw new BadRequestException(subCategoryMessage.SUB_CATEGORY_NOT_FOUND);
    }

    return await this.subCategoryCoreService.update({
      where: { id },
      data: { status: STATUS.ENABLED },
    });
  }

  async disable(id: string) {
    const subCategoryExist = await this.subCategoryCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!subCategoryExist) {
      throw new BadRequestException(subCategoryMessage.SUB_CATEGORY_NOT_FOUND);
    }

    return await this.subCategoryCoreService.update({
      where: { id },
      data: { status: STATUS.DISABLED },
    });
  }

  async remove(id: string) {
    const subCategoryExist = await this.subCategoryCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!subCategoryExist) {
      throw new BadRequestException(subCategoryMessage.SUB_CATEGORY_NOT_FOUND);
    }

    await this.typeCoreService.updateMany({
      where: { subCategoryId: id },
      data: { isDeleted: true },
    });

    await this.jewelleryCoreService.updateMany({
      where: { subCategoryId: id },
      data: { isDeleted: true },
    });

    return await this.subCategoryCoreService.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
