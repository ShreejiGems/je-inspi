import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { JewelleryVariantCoreService } from './jewellery-variant-core.service';

@Module({
  imports: [PrismaModule],
  providers: [JewelleryVariantCoreService],
  exports: [JewelleryVariantCoreService],
})
export class JewelleryVariantCoreModule {}
