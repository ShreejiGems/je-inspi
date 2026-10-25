import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DynamicService } from './dynamic.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';
import {
  AddPrimeProductDto,
  AddSectionImageDto,
  MarketingImagesDto,
  PriceFilterDto,
} from './dto/dynamic.dto';

@Controller('dynamic')
@ApiTags('dynamic')
export class DynamicController {
  constructor(private readonly dynamicService: DynamicService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Post('section-image')
  @ApiOperation({ summary: 'get section images' })
  async AddEditSectionImage(@Body() AddSectionImageDto: AddSectionImageDto) {
    return await this.dynamicService.AddEditSectionImage(AddSectionImageDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Post('prime-product')
  @ApiOperation({ summary: 'Add/Edit prime products' })
  async AddPrimeProduct(@Query() addPrimeProductDto: AddPrimeProductDto) {
    return await this.dynamicService.AddPrimeProduct(addPrimeProductDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put('price-filter')
  @ApiOperation({ summary: 'Add/Edit price filter' })
  async AddEditPriceFilter(@Body() priceFilterDto: PriceFilterDto) {
    return await this.dynamicService.AddEditPriceFilter(priceFilterDto);
  }

  @Get('prime-product')
  @ApiOperation({ summary: 'Get prime products' })
  async getPrimeProduct() {
    return await this.dynamicService.getPrimeProduct();
  }

  @Get('section-image')
  @ApiOperation({ summary: 'Get section images' })
  async getSectionImage() {
    return await this.dynamicService.getSectionImage();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Post(':categoryId/marketing-images')
  @ApiOperation({ summary: 'post marketing images' })
  async marketingImages(
    @Param('categoryId') categoryId: string,
    @Body() marketingImagesDto: MarketingImagesDto,
  ) {
    return await this.dynamicService.marketingImages(
      categoryId,
      marketingImagesDto,
    );
  }
}
