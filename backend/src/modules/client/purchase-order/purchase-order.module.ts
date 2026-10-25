import { Module } from '@nestjs/common';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';
import { OrderItemCoreModule } from 'src/core/order-item-core/order-item-core.module';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { JewelleryModule } from '../jewellery/jewellery.module';
import { AuthModule } from '../auth/auth.module';
import { PurchasedOrderCoreModule } from 'src/core/purchased-order-core/purchased-order-core.module';
import { CartCoreModule } from 'src/core/cart-core/cart-core.module';
import { JewelleryService } from '../jewellery/jewellery.service';
import { JewelleryCoreModule } from 'src/core/jewellery-core/jewellery-core.module';
import { JewelleryCollectionCoreModule } from 'src/core/jewellery-collection-core/jewellery-collection-core.module';
import { WishlistCoreModule } from 'src/core/wishlist-core/wishlist-core.module';
import { CalculatorCoreModule } from 'src/core/calculator-core/calculator-core.module';
import { CertificateCoreModule } from 'src/core/certificate-core/certificate-core.module';
import { JewelleryVariantCoreModule } from 'src/core/jewellery-variant-core/jewellery-variant-core.module';
import { DiamondProductCoreModule } from 'src/core/diamond-product-core/diamond-product-core.module';
import { CartItemCoreModule } from 'src/core/cart-item-core/cart-item-core.module';
import { CategoryCoreModule } from 'src/core/category-core/category-core.module';
@Module({
  imports: [
    AuthModule,
    PurchasedOrderCoreModule,
    OrderItemCoreModule,
    PrismaModule,
    CartCoreModule,
    PurchasedOrderCoreModule,
    JewelleryModule,
    JewelleryCoreModule,
    JewelleryCollectionCoreModule,
    WishlistCoreModule,
    CalculatorCoreModule,
    JewelleryVariantCoreModule,
    CertificateCoreModule,
    DiamondProductCoreModule,
    CartItemCoreModule,
    CategoryCoreModule,
  ],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService, JewelleryService],
  exports: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
