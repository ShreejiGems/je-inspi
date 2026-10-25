import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { JewelleryCollectionCoreService } from './jewellery-collection-core.service';

@Module({
  imports: [PrismaModule],
  providers: [JewelleryCollectionCoreService],
  exports: [JewelleryCollectionCoreService],
})
export class JewelleryCollectionCoreModule {}
