import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';
import { JewelleryService } from './jewellery.service';
import { CreateJewelleryDto } from './dto/create-jewellery.dto';
import { UpdateJewelleryDto } from './dto/update-jewellery.dto';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import { JewelleryFilterDto } from './dto/jewellery.dto';
import { GetUserSession } from 'src/shared/decorators/get-user-session.decorator';
import { UserSessionType } from 'src/shared/types/user-session.type';
import { ImportJewelleryDto } from './dto/import-jewellery.dto';

@Controller('admin/jewellery')
@ApiTags('Admin - Jewellery Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminMutationGuard)
export class JewelleryController {
  constructor(private readonly jewelleryService: JewelleryService) {}

  @Post('import')
  @ApiOperation({ summary: 'Import jewellery products from Excel file' })
  async importFromExcel(@Body() importDto: ImportJewelleryDto) {
    return await this.jewelleryService.importFromExcel(importDto.fileUrl);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new jewellery product with variants' })
  async create(@Body() createJewelleryDto: CreateJewelleryDto) {
    return await this.jewelleryService.create(createJewelleryDto);
  }

  @Get('get-all')
  @ApiOperation({ summary: 'Get all jewellery products with pagination' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'filter by categoryId',
  })
  @ApiQuery({
    name: 'subCategoryId',
    required: false,
    type: String,
    description: 'filter by subCategoryId',
  })
  @ApiQuery({
    name: 'typeId',
    required: false,
    type: String,
    description: 'filter by typeId',
  })
  async findAll(
    @Query('categoryId') categoryId: string,
    @Query('subCategoryId') subCategoryId: string,
    @Query('typeId') typeId: string,
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
  ) {
    return await this.jewelleryService.findAll(
      categoryId,
      subCategoryId,
      typeId,
      baseQueryCoreDto,
    );
  }

  @Get('get-enabled')
  @ApiOperation({ summary: 'Get all enabled jewellery products' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'filter by categoryId',
  })
  @ApiQuery({
    name: 'subCategoryId',
    required: false,
    type: String,
    description: 'filter by subCategoryId',
  })
  @ApiQuery({
    name: 'typeId',
    required: false,
    type: String,
    description: 'filter by typeId',
  })
  async findEnabled(
    @Query('categoryId') categoryId: string,
    @Query('subCategoryId') subCategoryId: string,
    @Query('typeId') typeId: string,
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
  ) {
    return await this.jewelleryService.findEnabled(
      categoryId,
      subCategoryId,
      typeId,
      baseQueryCoreDto,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Search jewellery products with filters' })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Search by name',
  })
  @ApiQuery({
    name: 'sku',
    required: false,
    type: String,
    description: 'Search by SKU',
  })
  @ApiQuery({
    name: 'color',
    required: false,
    enum: ['WHITE', 'YELLOW', 'ROSE'],
    description: 'Filter by color',
  })
  @ApiQuery({
    name: 'gemOrigin',
    required: false,
    type: String,
    description: 'Filter by gem origin',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async search(@Query() searchDto: JewelleryFilterDto) {
    return await this.jewelleryService.search(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get jewellery product by ID with full details' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return await this.jewelleryService.findOne(id, sessionData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update jewellery product by ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJewelleryDto: UpdateJewelleryDto,
  ) {
    return await this.jewelleryService.update(id, updateJewelleryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete jewellery product by ID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.jewelleryService.remove(id);
  }

  // Variant-specific endpoints
  @Get(':id/variants')
  @ApiOperation({ summary: 'Get all variants for a jewellery product' })
  async getVariants(@Param('id', ParseUUIDPipe) id: string) {
    return await this.jewelleryService.getVariants(id);
  }

  @Get(':id/variants/:variantId')
  @ApiOperation({ summary: 'Get specific variant for a jewellery product' })
  async getVariant(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('variantId', ParseUUIDPipe) variantId: string,
  ) {
    return await this.jewelleryService.getVariant(id, variantId);
  }
}
