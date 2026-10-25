import { Injectable } from '@nestjs/common';
import { OrderItem, Prisma } from '@prisma/client';
import { orderItemMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { OrderItemCorePaginateDto } from './dto/order-item-core.dto';

@Injectable()
export class OrderItemCoreService extends PrismaBaseRepository<
  OrderItem,
  OrderItemCorePaginateDto,
  Prisma.OrderItemCreateArgs,
  Prisma.OrderItemUpdateArgs,
  Prisma.OrderItemUpdateManyArgs,
  Prisma.OrderItemFindUniqueArgs,
  Prisma.OrderItemFindFirstArgs,
  Prisma.OrderItemFindManyArgs,
  Prisma.OrderItemDeleteArgs,
  Prisma.OrderItemDeleteManyArgs,
  Prisma.OrderItemCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.orderItem, {
      NOT_FOUND: orderItemMessage.ORDER_ITEM_NOT_FOUND,
      DELETED: orderItemMessage.ORDER_ITEM_IS_DELETED,
    });
  }
}
