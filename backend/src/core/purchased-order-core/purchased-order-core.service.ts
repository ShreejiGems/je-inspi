import { Injectable } from '@nestjs/common';
import { PurchasedOrder, Prisma } from '@prisma/client';
import { purchasedOrderMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { PurchasedOrderCorePaginateDto } from './dto/purchased-order-core.dto';

@Injectable()
export class PurchasedOrderCoreService extends PrismaBaseRepository<
  PurchasedOrder,
  PurchasedOrderCorePaginateDto,
  Prisma.PurchasedOrderCreateArgs,
  Prisma.PurchasedOrderUpdateArgs,
  Prisma.PurchasedOrderUpdateManyArgs,
  Prisma.PurchasedOrderFindUniqueArgs,
  Prisma.PurchasedOrderFindFirstArgs,
  Prisma.PurchasedOrderFindManyArgs,
  Prisma.PurchasedOrderDeleteArgs,
  Prisma.PurchasedOrderDeleteManyArgs,
  Prisma.PurchasedOrderCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.purchasedOrder, {
      NOT_FOUND: purchasedOrderMessage.PURCHASED_ORDER_NOT_FOUND,
      DELETED: purchasedOrderMessage.PURCHASED_ORDER_IS_DELETED,
    });
  }
}
