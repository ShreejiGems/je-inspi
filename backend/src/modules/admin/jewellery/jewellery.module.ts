import { Module } from '@nestjs/common';
import { JewelleryService } from './jewellery.service';
import { JewelleryController } from './jewellery.controller';
import { JewelleryCoreModule } from 'src/core/jewellery-core/jewellery-core.module';
import { JewelleryVariantCoreModule } from 'src/core/jewellery-variant-core/jewellery-variant-core.module';
import { CategoryCoreModule } from 'src/core/category-core/category-core.module';
import { SubCategoryCoreModule } from 'src/core/sub-category-core/sub-category-core.module';
import { TypeCoreModule } from 'src/core/type-core/type-core.module';
import { CollectionCoreModule } from 'src/core/collection-core/collection-core.module';
import { GemCoreModule } from 'src/core/gem-core/gem-core.module';
import { JewelleryCollectionCoreModule } from 'src/core/jewellery-collection-core/jewellery-collection-core.module';
import { CalculatorCoreModule } from 'src/core/calculator-core/calculator-core.module';
import { WishlistCoreModule } from 'src/core/wishlist-core/wishlist-core.module';
import { DiamondProductCoreModule } from 'src/core/diamond-product-core/diamond-product-core.module';

@Module({
  imports: [
    JewelleryCoreModule,
    JewelleryVariantCoreModule,
    CategoryCoreModule,
    SubCategoryCoreModule,
    TypeCoreModule,
    CollectionCoreModule,
    GemCoreModule,
    JewelleryCollectionCoreModule,
    CalculatorCoreModule,
    WishlistCoreModule,
    DiamondProductCoreModule,
    SubCategoryCoreModule,
    TypeCoreModule,
    JewelleryCoreModule,
  ],
  controllers: [JewelleryController],
  providers: [JewelleryService],
  exports: [JewelleryService],
})
export class JewelleryModule {}
