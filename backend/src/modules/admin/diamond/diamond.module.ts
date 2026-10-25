import { Module } from '@nestjs/common';
import { DiamondService } from './diamond.service';
import { DiamondController } from './diamond.controller';
import { DiamondProductCoreModule } from 'src/core/diamond-product-core/diamond-product-core.module';
import { UserSessionCoreModule } from 'src/core/user-session-core/user-session-core.module';
import { WishlistCoreModule } from 'src/core/wishlist-core/wishlist-core.module';

@Module({
  imports: [
    DiamondProductCoreModule,
    UserSessionCoreModule,
    WishlistCoreModule,
  ],
  controllers: [DiamondController],
  providers: [DiamondService],
})
export class DiamondModule {}
