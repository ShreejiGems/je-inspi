import { Module } from '@nestjs/common';
import { DynamicService } from './dynamic.service';
import { DynamicController } from './dynamic.controller';
import { AuthModule } from 'src/modules/client/auth/auth.module';
import { SectionImageCoreModule } from 'src/core/section-image-core/section-image-core.module';
import { CategoryCoreModule } from 'src/core/category-core/category-core.module';
import { CalculatorCoreModule } from 'src/core/calculator-core/calculator-core.module';
import { DiamondProductCoreModule } from 'src/core/diamond-product-core/diamond-product-core.module';
import { JewelleryCoreModule } from 'src/core/jewellery-core/jewellery-core.module';
import { PrimeProductCoreModule } from 'src/core/prime-product-core/prime-product-core.module';

@Module({
  imports: [
    AuthModule,
    SectionImageCoreModule,
    CategoryCoreModule,
    CalculatorCoreModule,
    DiamondProductCoreModule,
    JewelleryCoreModule,
    PrimeProductCoreModule,
  ],
  controllers: [DynamicController],
  providers: [DynamicService],
})
export class DynamicModule {}
