import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';
import { EditCalculatorDto } from './dto/calculator.dto';
import { GetUserSession } from 'src/shared/decorators/get-user-session.decorator';
import { UserSessionType } from 'src/shared/types/user-session.type';

@Controller('calculator')
@ApiTags('calculator')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminMutationGuard)
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post('edit-calculator')
  @ApiOperation({ summary: 'Edit calculator' })
  async editCalculator(
    @Body() editCalculatorDto: EditCalculatorDto,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return await this.calculatorService.editCalculator(
      editCalculatorDto,
      sessionData,
    );
  }

  @Get('calculator')
  @ApiOperation({ summary: 'Get calculator' })
  async getCalculator() {
    return await this.calculatorService.getCalculator();
  }

  @Post('recalculate-price')
  @ApiOperation({ summary: 'Recalculate price' })
  async reCalculatePrice() {
    return await this.calculatorService.reCalculatePrice();
  }
}
