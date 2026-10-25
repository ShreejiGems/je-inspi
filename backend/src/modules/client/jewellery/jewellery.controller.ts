import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JewelleryService } from './jewellery.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import { GetUserSession } from 'src/shared/decorators/get-user-session.decorator';
import { UserSessionType } from 'src/shared/types/user-session.type';
import { CalculateJewelleryPriceDto } from './dto/calculate-price.dto';
import { JewelleryFilterDto } from './dto/jewellery.dto';
import { PRODUCT_TYPE } from '@prisma/client';

@Controller('jewellery')
@ApiTags('Client - Jewellery')
export class JewelleryController {
  constructor(private readonly jewelleryService: JewelleryService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get all enabled jewellery products' })
  @ApiQuery({ name: 'userId', type: String, required: false })
  async findEnabled(
    @Query() filterDto: JewelleryFilterDto,
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
    @Query('userId') userId?: string,
  ) {
    return await this.jewelleryService.findEnabled(
      filterDto,
      baseQueryCoreDto,
      userId || null,
    );
  }

  @Get('calculate-jewellery-price')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Calculate jewellery price based on variant, material, and certificate selection',
  })
  async calculateJewelleryPrice(
    @Query() calculatePriceDto: CalculateJewelleryPriceDto,
    @GetUserSession() sessionData?: UserSessionType,
  ) {
    return await this.jewelleryService.calculateJewelleryPrice(
      calculatePriceDto,
      sessionData,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id/mark-wishlist')
  @ApiOperation({ summary: 'Mark jewellery and diamond as wishlisted' })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiQuery({ name: 'type', enum: PRODUCT_TYPE, required: true })
  async markWishlist(
    @Param('id') id: string,
    @GetUserSession() sessionData: UserSessionType,
    @Query('type') type: PRODUCT_TYPE,
  ) {
    return await this.jewelleryService.markWishlist(
      sessionData.user.id,
      id,
      type,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id/unmark-wishlist')
  @ApiOperation({ summary: 'Unmark jewellery or diamond from wishlist' })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiQuery({ name: 'type', enum: PRODUCT_TYPE, required: true })
  async unmarkWishlist(
    @Param('id') id: string,
    @GetUserSession() sessionData: UserSessionType,
    @Query('type') type: PRODUCT_TYPE,
  ) {
    return await this.jewelleryService.unmarkWishlist(
      sessionData.user.id,
      id,
      type,
    );
  }
}
