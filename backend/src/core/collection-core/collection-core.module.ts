import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { CollectionCoreService } from './collection-core.service';

@Module({
  imports: [PrismaModule],
  providers: [CollectionCoreService],
  exports: [CollectionCoreService],
})
export class CollectionCoreModule {}
