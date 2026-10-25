import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { JewelleryCoreService } from 'src/core/jewellery-core/jewellery-core.service';
import { CalculatorCoreService } from 'src/core/calculator-core/calculator-core.service';
import { DiamondProductCoreService } from 'src/core/diamond-product-core/diamond-product-core.service';
import { JewelleryVariantCoreService } from 'src/core/jewellery-variant-core/jewellery-variant-core.service';
import { STATUS } from '@prisma/client';
import { GemCoreService } from 'src/core/gem-core/gem-core.service';

@Injectable()
export class RecalculatePriceCommand {
  constructor(
    private readonly jewelleryCoreService: JewelleryCoreService,
    private readonly calculatorCoreService: CalculatorCoreService,
    private readonly diamondProductCoreService: DiamondProductCoreService,
    private readonly jewelleryVariantCoreService: JewelleryVariantCoreService,
    private readonly gemCoreService: GemCoreService,
  ) {}

  @Command({
    command: 'cronJob:recalculatePrice',
    describe: 'Recalculate base price for all jewellery',
  })
  async reCalculatePrice() {
    const jewelleries = await this.jewelleryCoreService.findMany({
      where: { isDeleted: false },
    });

    const calculator = await this.calculatorCoreService.findFirst({
      where: { isDeleted: false, status: STATUS.ENABLED },
    });

    if (!calculator) return;

    for (const jewellery of jewelleries) {
      const variants = await this.jewelleryVariantCoreService.findMany({
        where: { jewelleryId: jewellery.id, isDeleted: false },
      });

      const updatedVariants = await Promise.all(
        variants.map(async (variant) => {
          let basePrice: number | null = null;
          let totalGemWeight = 0;

          let totalGemPrice = 0;
          let missingGemPrice = false;

          const gems = await this.gemCoreService.findMany({
            where: { variantId: variant.id, isDeleted: false },
          });

          if (gems && gems.length > 0) {
            // calculate total weight
            totalGemWeight = gems.reduce(
              (sum, g: any) => sum + (g?.weight || 0) * (g?.quantity || 0),
              0,
            );

            for (const gem of gems) {
              const diamondPrice =
                await this.diamondProductCoreService.findFirst({
                  where: {
                    shape: gem.shape,
                    weight: gem.weight,
                    color: gem.color,
                    clarity: gem.clarity,
                    gemOrigin: variant.gemOrigin,
                    isDeleted: false,
                    status: STATUS.ENABLED,
                  },
                  orderBy: { price: 'asc' },
                });

              if (diamondPrice) {
                totalGemPrice += diamondPrice.price * gem.quantity;
              } else {
                missingGemPrice = true;
              }
            }
          }

          // MATERIAL CALCULATION (same as create)
          const materialPrices = [
            {
              price: (variant.silver || 0) * calculator.silverPerGram,
            },
            {
              price: (variant.tenKtGold || 0) * calculator.tenKtGoldPerGram,
            },
            {
              price:
                (variant.forteenKtGold || 0) * calculator.forteenKtGoldPerGram,
            },
            {
              price:
                (variant.eighteenKtGold || 0) *
                calculator.eighteenKtGoldPerGram,
            },
          ];

          const validMaterialPrices = materialPrices.filter((m) => m.price > 0);

          const minMaterialPrice =
            validMaterialPrices.length > 0
              ? Math.min(...validMaterialPrices.map((m) => m.price))
              : 0;

          const inrPart =
            calculator.miscellaneous + minMaterialPrice + calculator.extraCost;

          if (missingGemPrice) {
            basePrice = 0;
          } else {
            basePrice =
              inrPart > 0 || totalGemPrice > 0
                ? Number(
                    (
                      (inrPart / calculator.usRate + totalGemPrice) /
                      calculator.duty /
                      calculator.profit
                    ).toFixed(2),
                  )
                : null;
          }

          await this.jewelleryVariantCoreService.update({
            where: { id: variant.id },
            data: {
              basePrice: basePrice ?? null,
              totalGemWeight: Number(totalGemWeight?.toFixed(2)),
            },
          });

          return basePrice;
        }),
      );

      // JEWELLERY BASE PRICE (same logic as create)
      const validPrices = updatedVariants.filter((p) => p !== null) as number[];

      const jewelleryBasePrice =
        validPrices.length > 0 ? Math.min(...validPrices) : null;

      await this.jewelleryCoreService.update({
        where: { id: jewellery.id },
        data: { basePrice: jewelleryBasePrice },
      });
    }
  }
}
