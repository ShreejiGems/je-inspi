import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DiamondProductCoreService } from 'src/core/diamond-product-core/diamond-product-core.service';
import { fetchDiamondFeed, mapLabDiamond } from 'src/shared/libs/diamond-feed';

@Injectable()
export class FetchLabDiamondPriceCommand {
  constructor(private readonly diamondProductCoreService: DiamondProductCoreService) {}

  @Command({ command: 'cronJob:fetchLabDiamondPrice', describe: 'Import lab diamond inventory from its configured provider' })
  async importInventory() {
    const rows = await fetchDiamondFeed('lab');
    const summary = { received: rows.length, created: 0, updated: 0, skipped: 0 };
    for (let i = 0; i < rows.length; i += 500) {
      const batch: Prisma.DiamondProductCreateManyInput[] = [];
      for (const row of rows.slice(i, i + 500)) {
        try { batch.push(mapLabDiamond(row)); } catch { summary.skipped++; }
      }
      const saved = await this.diamondProductCoreService.importBatch(batch);
      summary.created += saved.created;
      summary.updated += saved.updated;
    }
    console.log('lab diamond import:', JSON.stringify(summary));
    return summary;
  }
}
