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
import { JewellerySubCategoryService } from './jewellery-sub-category.service';
import { CreateJewellerySubCategoryDto } from './dto/create-jewellery-sub-category.dto';
import { UpdateJewellerySubCategoryDto } from './dto/update-jewellery-sub-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';

@Controller('jewellery-sub-category')
@ApiTags('jewellery-sub-category')
export class JewellerySubCategoryController {
  constructor(
    private readonly jewellerySubCategoryService: JewellerySubCategoryService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Post('create')
  @ApiOperation({ summary: 'create jewelley sub-category' })
  async create(
    @Body() createJewellerySubCategoryDto: CreateJewellerySubCategoryDto,
  ) {
    return await this.jewellerySubCategoryService.create(
      createJewellerySubCategoryDto,
    );
  }

  @Get(':categoryId/get-all')
  @ApiOperation({ summary: 'get all jewelley sub-category' })
  async findAll(@Param('categoryId') categoryId: string) {
    return await this.jewellerySubCategoryService.findAll(categoryId);
  }

  @Get(':categoryId/get-all-enabled')
  @ApiOperation({ summary: 'get all jewelley sub-category' })
  async findAllEnabled(@Param('categoryId') categoryId: string) {
    return await this.jewellerySubCategoryService.findAllEnabled(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get jewelley sub-category by id' })
  async findOne(@Param('id') id: string) {
    return await this.jewellerySubCategoryService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'update jewelley sub-category by id' })
  async update(
    @Param('id') id: string,
    @Body() updateJewellerySubCategoryDto: UpdateJewellerySubCategoryDto,
  ) {
    return await this.jewellerySubCategoryService.update(
      id,
      updateJewellerySubCategoryDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/enable')
  @ApiOperation({ summary: 'enable jewelley sub-category by id' })
  async enable(@Param('id') id: string) {
    return await this.jewellerySubCategoryService.enable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/disable')
  @ApiOperation({ summary: 'enable jewelley sub-category by id' })
  async disable(@Param('id') id: string) {
    return await this.jewellerySubCategoryService.disable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'delete jewelley sub-category by id' })
  async remove(@Param('id') id: string) {
    return await this.jewellerySubCategoryService.remove(id);
  }
}
