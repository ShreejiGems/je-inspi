import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { categoryMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { CategoryCorePaginateDto } from './dto/category-core.dto';

@Injectable()
export class CategoryCoreService extends PrismaBaseRepository<
  Category,
  CategoryCorePaginateDto,
  Prisma.CategoryCreateArgs,
  Prisma.CategoryUpdateArgs,
  Prisma.CategoryUpdateManyArgs,
  Prisma.CategoryFindUniqueArgs,
  Prisma.CategoryFindFirstArgs,
  Prisma.CategoryFindManyArgs,
  Prisma.CategoryDeleteArgs,
  Prisma.CategoryDeleteManyArgs,
  Prisma.CategoryCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.category, {
      NOT_FOUND: categoryMessage.CATEGORY_NOT_FOUND,
      DELETED: categoryMessage.CATEGORY_IS_DELETED,
    });
  }
}
