import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { PrismaModule } from './shared/module/prisma/prisma.module';
import { PrismaService } from './shared/module/prisma/prisma.service';
import { FetchDiamondPriceCommand } from './shared/module/command/fetch-diamond-price';
import { DiamondProductCoreModule } from './core/diamond-product-core/diamond-product-core.module';
import { OtpCoreModule } from './core/otp-core/otp-core.module';
import { DeleteOtpCommand } from './shared/module/command/delete-otp';
import { CalculatorCoreModule } from './core/calculator-core/calculator-core.module';
import { CurrencyConversionCommand } from './shared/module/command/currency-conversion';
import { FetchLabDiamondPriceCommand } from './shared/module/command/fetch-lab-diamond-price';
import { GemCoreModule } from './core/gem-core/gem-core.module';
import { JewelleryCoreModule } from './core/jewellery-core/jewellery-core.module';
import { JewelleryVariantCoreModule } from './core/jewellery-variant-core/jewellery-variant-core.module';
import { RecalculatePriceCommand } from './shared/module/command/recalculate-price';

@Module({
  imports: [
    CommandModule,
    PrismaModule,
    DiamondProductCoreModule,
    OtpCoreModule,
    CalculatorCoreModule,
    JewelleryCoreModule,
    JewelleryVariantCoreModule,
    GemCoreModule,
  ],
  providers: [
    PrismaService,
    FetchDiamondPriceCommand,
    FetchLabDiamondPriceCommand,
    DeleteOtpCommand,
    CurrencyConversionCommand,
    RecalculatePriceCommand,
  ],
})
export class CommandAppModule {}
