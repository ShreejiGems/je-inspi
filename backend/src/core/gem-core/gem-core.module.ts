import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { GemCoreService } from './gem-core.service';

@Module({
  imports: [PrismaModule],
  providers: [GemCoreService],
  exports: [GemCoreService],
})
export class GemCoreModule {}
