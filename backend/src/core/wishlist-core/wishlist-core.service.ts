import { Injectable } from '@nestjs/common';
import { Prisma, Wishlist } from '@prisma/client';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { WishlistCorePaginateDto } from './dto/wishlist-core.dto';

@Injectable()
export class WishlistCoreService extends PrismaBaseRepository<
  Wishlist,
  WishlistCorePaginateDto,
  Prisma.WishlistCreateArgs,
  Prisma.WishlistUpdateArgs,
  Prisma.WishlistUpdateManyArgs,
  Prisma.WishlistFindUniqueArgs,
  Prisma.WishlistFindFirstArgs,
  Prisma.WishlistFindManyArgs,
  Prisma.WishlistDeleteArgs,
  Prisma.WishlistDeleteManyArgs,
  Prisma.WishlistCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.wishlist, {
      NOT_FOUND: 'Wishlist not found',
      DELETED: 'Wishlist is deleted',
    });
  }
}
