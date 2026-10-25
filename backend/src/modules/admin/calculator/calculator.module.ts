import { Module } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { CalculatorController } from './calculator.controller';
import { AuthModule } from 'src/modules/client/auth/auth.module';
import { CalculatorCoreModule } from 'src/core/calculator-core/calculator-core.module';
import { JewelleryCoreModule } from 'src/core/jewellery-core/jewellery-core.module';
import { JewelleryVariantCoreModule } from 'src/core/jewellery-variant-core/jewellery-variant-core.module';
import { GemCoreModule } from 'src/core/gem-core/gem-core.module';
import { DiamondProductCoreModule } from 'src/core/diamond-product-core/diamond-product-core.module';

@Module({
  imports: [
    AuthModule,
    CalculatorCoreModule,
    JewelleryCoreModule,
    JewelleryVariantCoreModule,
    GemCoreModule,
    DiamondProductCoreModule,
  ],
  controllers: [CalculatorController],
  providers: [CalculatorService],
})
export class CalculatorModule {}
