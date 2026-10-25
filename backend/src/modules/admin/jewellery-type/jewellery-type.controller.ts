import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JewelleryTypeService } from './jewellery-type.service';
import { CreateJewelleryTypeDto } from './dto/create-jewellery-type.dto';
import { UpdateJewelleryTypeDto } from './dto/update-jewellery-type.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';

@Controller('jewellery-type')
@ApiTags('jewellery-type')
export class JewelleryTypeController {
  constructor(private readonly jewelleryTypeService: JewelleryTypeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Post('create')
  @ApiOperation({ summary: 'create jewellery type' })
  async create(@Body() createJewelleryTypeDto: CreateJewelleryTypeDto) {
    return await this.jewelleryTypeService.create(createJewelleryTypeDto);
  }

  @Get(':subCategoryId/get-all')
  @ApiOperation({ summary: 'get all jewellery type' })
  async findAll(@Param('subCategoryId') subCategoryId: string) {
    return await this.jewelleryTypeService.findAll(subCategoryId);
  }

  @Get(':subCategoryId/get-all-enabled')
  @ApiOperation({ summary: 'get all enabled jewellery type' })
  async findAllEnabled(@Param('subCategoryId') subCategoryId: string) {
    return await this.jewelleryTypeService.findAllEnabled(subCategoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get jewellery type by id' })
  async findOne(@Param('id') id: string) {
    return await this.jewelleryTypeService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'update jewellery type by id' })
  async update(
    @Param('id') id: string,
    @Body() updateJewelleryTypeDto: UpdateJewelleryTypeDto,
  ) {
    return await this.jewelleryTypeService.update(id, updateJewelleryTypeDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/enable')
  @ApiOperation({ summary: 'enable jewellery type by id' })
  async enable(@Param('id') id: string) {
    return await this.jewelleryTypeService.enable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/disable')
  @ApiOperation({ summary: 'disable jewellery type by id' })
  async disable(@Param('id') id: string) {
    return await this.jewelleryTypeService.disable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'delete jewellery type by id' })
  async remove(@Param('id') id: string) {
    return await this.jewelleryTypeService.remove(id);
  }
}
