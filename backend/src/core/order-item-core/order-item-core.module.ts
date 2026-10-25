import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { OrderItemCoreService } from './order-item-core.service';

@Module({
  imports: [PrismaModule],
  providers: [OrderItemCoreService],
  exports: [OrderItemCoreService],
})
export class OrderItemCoreModule {}
