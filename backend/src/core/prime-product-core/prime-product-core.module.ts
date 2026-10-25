import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { PrimeProductCoreService } from './prime-product-core.service';

@Module({
  imports: [PrismaModule],
  providers: [PrimeProductCoreService],
  exports: [PrimeProductCoreService],
})
export class PrimeProductCoreModule {}
