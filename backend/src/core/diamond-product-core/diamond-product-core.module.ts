import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { DiamondProductCoreService } from './diamond-product-core.service';

@Module({
  imports: [PrismaModule],
  providers: [DiamondProductCoreService],
  exports: [DiamondProductCoreService],
})
export class DiamondProductCoreModule {}
