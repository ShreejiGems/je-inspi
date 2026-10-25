import { Module } from '@nestjs/common';
import { JewelleryService } from './jewellery.service';
import { JewelleryController } from './jewellery.controller';
import { JewelleryCoreModule } from 'src/core/jewellery-core/jewellery-core.module';
import { JewelleryCollectionCoreModule } from 'src/core/jewellery-collection-core/jewellery-collection-core.module';
import { WishlistCoreModule } from 'src/core/wishlist-core/wishlist-core.module';
import { CalculatorCoreModule } from 'src/core/calculator-core/calculator-core.module';
import { JewelleryVariantCoreModule } from 'src/core/jewellery-variant-core/jewellery-variant-core.module';
import { CertificateCoreModule } from 'src/core/certificate-core/certificate-core.module';
import { DiamondProductCoreModule } from 'src/core/diamond-product-core/diamond-product-core.module';
import { CategoryCoreModule } from 'src/core/category-core/category-core.module';

@Module({
  imports: [
    JewelleryCoreModule,
    JewelleryCollectionCoreModule,
    WishlistCoreModule,
    CalculatorCoreModule,
    JewelleryVariantCoreModule,
    CertificateCoreModule,
    CategoryCoreModule,
    DiamondProductCoreModule,
  ],
  controllers: [JewelleryController],
  providers: [JewelleryService],
})
export class JewelleryModule {}
