import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { CartCoreService } from './cart-core.service';

@Module({
  imports: [PrismaModule],
  providers: [CartCoreService],
  exports: [CartCoreService],
})
export class CartCoreModule {}
