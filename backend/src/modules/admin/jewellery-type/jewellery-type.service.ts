import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJewelleryTypeDto } from './dto/create-jewellery-type.dto';
import { UpdateJewelleryTypeDto } from './dto/update-jewellery-type.dto';
import { TypeCoreService } from 'src/core/type-core/type-core.service';
import { SubCategoryCoreService } from 'src/core/sub-category-core/sub-category-core.service';
import { subCategoryMessage, typeMessage } from 'src/shared/keys/user.key';
import { STATUS } from '@prisma/client';
import { JewelleryCoreService } from 'src/core/jewellery-core/jewellery-core.service';

@Injectable()
export class JewelleryTypeService {
  constructor(
    private typeCoreService: TypeCoreService,
    private subCategoryCoreService: SubCategoryCoreService,
    private jewelleryCoreService: JewelleryCoreService,
  ) {}

  async create(createJewelleryTypeDto: CreateJewelleryTypeDto) {
    const { typeName, subCategoryId } = createJewelleryTypeDto;

    const subCategoryExist = await this.subCategoryCoreService.findFirst({
      where: { id: subCategoryId, isDeleted: false },
    });

    if (!subCategoryExist) {
      throw new BadRequestException(subCategoryMessage.SUB_CATEGORY_NOT_FOUND);
    }

    return await this.typeCoreService.create({
      data: {
        name: typeName,
        categoryId: subCategoryExist.categoryId,
        subCategoryId: subCategoryId,
      },
    });
  }

  async findAll(subCategoryId: string) {
    return await this.typeCoreService.findMany({
      where: { isDeleted: false, subCategoryId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAllEnabled(subCategoryId: string) {
    return await this.typeCoreService.findMany({
      where: { isDeleted: false, subCategoryId, status: STATUS.ENABLED },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const typeExist = await this.typeCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!typeExist) {
      throw new BadRequestException(typeMessage.TYPE_NOT_FOUND);
    }

    return typeExist;
  }

  async update(id: string, updateJewelleryTypeDto: UpdateJewelleryTypeDto) {
    const { typeName } = updateJewelleryTypeDto;

    const typeExist = await this.typeCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!typeExist) {
      throw new BadRequestException(typeMessage.TYPE_NOT_FOUND);
    }

    return await this.typeCoreService.update({
      where: { id },
      data: { name: typeName },
    });
  }

  async enable(id: string) {
    const typeExist = await this.typeCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!typeExist) {
      throw new BadRequestException(typeMessage.TYPE_NOT_FOUND);
    }

    return await this.typeCoreService.update({
      where: { id },
      data: { status: STATUS.ENABLED },
    });
  }

  async disable(id: string) {
    const typeExist = await this.typeCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!typeExist) {
      throw new BadRequestException(typeMessage.TYPE_NOT_FOUND);
    }

    return await this.typeCoreService.update({
      where: { id },
      data: { status: STATUS.DISABLED },
    });
  }

  async remove(id: string) {
    const typeExist = await this.typeCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!typeExist) {
      throw new BadRequestException(typeMessage.TYPE_NOT_FOUND);
    }

    await this.jewelleryCoreService.updateMany({
      where: { typeId: id },
      data: { isDeleted: true },
    });

    return await this.typeCoreService.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
