import { Injectable } from '@nestjs/common';
import { PrimeProduct, Prisma } from '@prisma/client';
import { primeProductMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { PrimeProductCorePaginateDto } from './dto/prime-product-core.dto';

@Injectable()
export class PrimeProductCoreService extends PrismaBaseRepository<
  PrimeProduct,
  PrimeProductCorePaginateDto,
  Prisma.PrimeProductCreateArgs,
  Prisma.PrimeProductUpdateArgs,
  Prisma.PrimeProductUpdateManyArgs,
  Prisma.PrimeProductFindUniqueArgs,
  Prisma.PrimeProductFindFirstArgs,
  Prisma.PrimeProductFindManyArgs,
  Prisma.PrimeProductDeleteArgs,
  Prisma.PrimeProductDeleteManyArgs,
  Prisma.PrimeProductCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.primeProduct, {
      NOT_FOUND: primeProductMessage.PRIME_PRODUCT_NOT_FOUND,
      DELETED: primeProductMessage.PRIME_PRODUCT_IS_DELETED,
    });
  }
}
