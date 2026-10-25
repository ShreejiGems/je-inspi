import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { CalculatorCoreService } from './calculator-core.service';

@Module({
  imports: [PrismaModule],
  providers: [CalculatorCoreService],
  exports: [CalculatorCoreService],
})
export class CalculatorCoreModule {}
