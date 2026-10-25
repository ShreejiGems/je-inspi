import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { SectionImageCoreService } from './section-image-core.service';

@Module({
  imports: [PrismaModule],
  providers: [SectionImageCoreService],
  exports: [SectionImageCoreService],
})
export class SectionImageCoreModule {}
