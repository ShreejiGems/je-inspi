import { Injectable } from '@nestjs/common';
import { DiamondProduct, Prisma } from '@prisma/client';
import { diamondProductMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { DiamondProductCorePaginateDto } from './dto/diamond-product-core.dto';
import { saveDiamondBatch } from 'src/shared/libs/diamond-feed';

@Injectable()
export class DiamondProductCoreService extends PrismaBaseRepository<
  DiamondProduct,
  DiamondProductCorePaginateDto,
  Prisma.DiamondProductCreateArgs,
  Prisma.DiamondProductUpdateArgs,
  Prisma.DiamondProductUpdateManyArgs,
  Prisma.DiamondProductFindUniqueArgs,
  Prisma.DiamondProductFindFirstArgs,
  Prisma.DiamondProductFindManyArgs,
  Prisma.DiamondProductDeleteArgs,
  Prisma.DiamondProductDeleteManyArgs,
  Prisma.DiamondProductCountArgs
> {
  async importBatch(rows: Prisma.DiamondProductCreateManyInput[]) {
    return saveDiamondBatch(this.prisma.prisma, rows);
  }
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.diamondProduct, {
      NOT_FOUND: diamondProductMessage.DIAMOND_PRODUCT_NOT_FOUND,
      DELETED: diamondProductMessage.DIAMOND_PRODUCT_IS_DELETED,
    });
  }
}
