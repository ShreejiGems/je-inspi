import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { CartItemCoreService } from './cart-item-core.service';

@Module({
  imports: [PrismaModule],
  providers: [CartItemCoreService],
  exports: [CartItemCoreService],
})
export class CartItemCoreModule {}
