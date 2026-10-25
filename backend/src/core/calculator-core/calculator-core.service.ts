import { Injectable } from '@nestjs/common';
import { calculatorMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { CalculatorCorePaginateDto } from './dto/calculator-core.dto';
import { Calculator, Prisma } from '@prisma/client';

@Injectable()
export class CalculatorCoreService extends PrismaBaseRepository<
  Calculator,
  CalculatorCorePaginateDto,
  Prisma.CalculatorCreateArgs,
  Prisma.CalculatorUpdateArgs,
  Prisma.CalculatorUpdateManyArgs,
  Prisma.CalculatorFindUniqueArgs,
  Prisma.CalculatorFindFirstArgs,
  Prisma.CalculatorFindManyArgs,
  Prisma.CalculatorDeleteArgs,
  Prisma.CalculatorDeleteManyArgs,
  Prisma.CalculatorCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.calculator, {
      NOT_FOUND: calculatorMessage.CALCULATOR_NOT_FOUND,
      DELETED: calculatorMessage.CALCULATOR_IS_DELETED,
    });
  }
}
