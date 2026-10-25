import { Injectable } from '@nestjs/common';
import { CartItem, Prisma } from '@prisma/client';
import { cartItemMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { CartItemCorePaginateDto } from './dto/cart-item-core.dto';

@Injectable()
export class CartItemCoreService extends PrismaBaseRepository<
  CartItem,
  CartItemCorePaginateDto,
  Prisma.CartItemCreateArgs,
  Prisma.CartItemUpdateArgs,
  Prisma.CartItemUpdateManyArgs,
  Prisma.CartItemFindUniqueArgs,
  Prisma.CartItemFindFirstArgs,
  Prisma.CartItemFindManyArgs,
  Prisma.CartItemDeleteArgs,
  Prisma.CartItemDeleteManyArgs,
  Prisma.CartItemCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.cartItem, {
      NOT_FOUND: cartItemMessage.CART_ITEM_NOT_FOUND,
      DELETED: cartItemMessage.CART_ITEM_IS_DELETED,
    });
  }
}
