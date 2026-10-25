import { Injectable } from '@nestjs/common';
import { Cart, Prisma } from '@prisma/client';
import { cartMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { CartCorePaginateDto } from './dto/cart-core.dto';

@Injectable()
export class CartCoreService extends PrismaBaseRepository<
  Cart,
  CartCorePaginateDto,
  Prisma.CartCreateArgs,
  Prisma.CartUpdateArgs,
  Prisma.CartUpdateManyArgs,
  Prisma.CartFindUniqueArgs,
  Prisma.CartFindFirstArgs,
  Prisma.CartFindManyArgs,
  Prisma.CartDeleteArgs,
  Prisma.CartDeleteManyArgs,
  Prisma.CartCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.cart, {
      NOT_FOUND: cartMessage.CART_NOT_FOUND,
      DELETED: cartMessage.CART_IS_DELETED,
    });
  }
}
