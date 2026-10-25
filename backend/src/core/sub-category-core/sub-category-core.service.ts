import { Injectable } from '@nestjs/common';
import { SubCategory, Prisma } from '@prisma/client';
import { subCategoryMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { SubCategoryCorePaginateDto } from './dto/sub-category-core.dto';

@Injectable()
export class SubCategoryCoreService extends PrismaBaseRepository<
  SubCategory,
  SubCategoryCorePaginateDto,
  Prisma.SubCategoryCreateArgs,
  Prisma.SubCategoryUpdateArgs,
  Prisma.SubCategoryUpdateManyArgs,
  Prisma.SubCategoryFindUniqueArgs,
  Prisma.SubCategoryFindFirstArgs,
  Prisma.SubCategoryFindManyArgs,
  Prisma.SubCategoryDeleteArgs,
  Prisma.SubCategoryDeleteManyArgs,
  Prisma.SubCategoryCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.subCategory, {
      NOT_FOUND: subCategoryMessage.SUB_CATEGORY_NOT_FOUND,
      DELETED: subCategoryMessage.SUB_CATEGORY_IS_DELETED,
    });
  }
}
