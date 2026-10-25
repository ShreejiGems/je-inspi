import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { WishlistCoreService } from './wishlist-core.service';

@Module({
  imports: [PrismaModule],
  providers: [WishlistCoreService],
  exports: [WishlistCoreService],
})
export class WishlistCoreModule {}
