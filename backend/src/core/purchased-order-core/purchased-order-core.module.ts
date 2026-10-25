import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { PurchasedOrderCoreService } from './purchased-order-core.service';

@Module({
  imports: [PrismaModule],
  providers: [PurchasedOrderCoreService],
  exports: [PurchasedOrderCoreService],
})
export class PurchasedOrderCoreModule {}
