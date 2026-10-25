import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartCoreModule } from 'src/core/cart-core/cart-core.module';
import { CartItemCoreModule } from 'src/core/cart-item-core/cart-item-core.module';
import { JewelleryModule } from '../jewellery/jewellery.module';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { CalculatorCoreModule } from 'src/core/calculator-core/calculator-core.module';
import { JewelleryVariantCoreModule } from 'src/core/jewellery-variant-core/jewellery-variant-core.module';
import { JewelleryService } from '../jewellery/jewellery.service';
import { JewelleryCoreModule } from 'src/core/jewellery-core/jewellery-core.module';
import { JewelleryCollectionCoreModule } from 'src/core/jewellery-collection-core/jewellery-collection-core.module';
import { WishlistCoreModule } from 'src/core/wishlist-core/wishlist-core.module';
import { CertificateCoreModule } from 'src/core/certificate-core/certificate-core.module';
import { DiamondProductCoreModule } from 'src/core/diamond-product-core/diamond-product-core.module';
import { UserCoreModule } from 'src/core/user-core/user-core.module';
import { CategoryCoreModule } from 'src/core/category-core/category-core.module';

@Module({
  imports: [
    CartCoreModule,
    CartItemCoreModule,
    JewelleryCoreModule,
    JewelleryModule,
    JewelleryCollectionCoreModule,
    WishlistCoreModule,
    PrismaModule,
    CertificateCoreModule,
    CalculatorCoreModule,
    JewelleryVariantCoreModule,
    DiamondProductCoreModule,
    UserCoreModule,
    CategoryCoreModule,
  ],
  controllers: [CartController],
  providers: [CartService, JewelleryService],
})
export class CartModule {}
