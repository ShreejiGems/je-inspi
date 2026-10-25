import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { CalculatorModule } from '../admin/calculator/calculator.module';
import { JewelleryModule } from './jewellery/jewellery.module';
import { CartModule } from './cart/cart.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    CalculatorModule,
    JewelleryModule,
    CartModule,
    PurchaseOrderModule,
  ],
  controllers: [],
  providers: [],
})
export class ClientModule {}
