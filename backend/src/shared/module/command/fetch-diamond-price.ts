import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DiamondProductCoreService } from 'src/core/diamond-product-core/diamond-product-core.service';
import { fetchDiamondFeed, mapNaturalDiamond } from 'src/shared/libs/diamond-feed';

@Injectable()
export class FetchDiamondPriceCommand {
  constructor(private readonly diamondProductCoreService: DiamondProductCoreService) {}

  @Command({ command: 'cronJob:fetchDiamondPrice', describe: 'Import natural diamond inventory from its configured provider' })
  async importInventory() {
    const rows = await fetchDiamondFeed('natural');
    const summary = { received: rows.length, created: 0, updated: 0, skipped: 0 };
    for (let i = 0; i < rows.length; i += 500) {
      const batch: Prisma.DiamondProductCreateManyInput[] = [];
      for (const row of rows.slice(i, i + 500)) {
        try { batch.push(mapNaturalDiamond(row)); } catch { summary.skipped++; }
      }
      const saved = await this.diamondProductCoreService.importBatch(batch);
      summary.created += saved.created;
      summary.updated += saved.updated;
    }
    console.log('natural diamond import:', JSON.stringify(summary));
    return summary;
  }
}
