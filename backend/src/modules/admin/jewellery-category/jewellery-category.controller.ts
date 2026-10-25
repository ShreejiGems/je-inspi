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
  Query,
} from '@nestjs/common';
import { JewelleryCategoryService } from './jewellery-category.service';
import { CreateJewelleryCategoryDto } from './dto/create-jewellery-category.dto';
import { UpdateJewelleryCategoryDto } from './dto/update-jewellery-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';
import {
  BaseQueryCoreDto,
  CoreIncludesDto,
} from 'src/core/base-query-core/dto/base-query-core.dto';

@Controller('jewellery-category')
@ApiTags('jewellery-category')
export class JewelleryCategoryController {
  constructor(
    private readonly jewelleryCategoryService: JewelleryCategoryService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Post('create')
  @ApiOperation({ summary: 'create jewelley category' })
  async create(@Body() createJewelleryCategoryDto: CreateJewelleryCategoryDto) {
    return await this.jewelleryCategoryService.create(
      createJewelleryCategoryDto,
    );
  }

  @Get('get-all')
  @ApiOperation({ summary: 'get all jewelley category' })
  async findAll() {
    return await this.jewelleryCategoryService.findAll();
  }

  @Get('get-enabled')
  @ApiOperation({ summary: 'get all jewelley enabled category' })
  async findAllEnabled(@Query() baseQueryCoreDto: BaseQueryCoreDto) {
    return await this.jewelleryCategoryService.findAllEnabled(baseQueryCoreDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get jewelley category by id' })
  async findOne(@Param('id') id: string) {
    return await this.jewelleryCategoryService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'update jewelley category by id' })
  async update(
    @Param('id') id: string,
    @Body() updateJewelleryCategoryDto: UpdateJewelleryCategoryDto,
  ) {
    return await this.jewelleryCategoryService.update(
      id,
      updateJewelleryCategoryDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/enable')
  @ApiOperation({ summary: 'enable jewelley category by id' })
  async enable(@Param('id') id: string) {
    return await this.jewelleryCategoryService.enable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/disable')
  @ApiOperation({ summary: 'disable jewelley category by id' })
  async disable(@Param('id') id: string) {
    return await this.jewelleryCategoryService.disable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'delete jewelley category by id' })
  async remove(@Param('id') id: string) {
    return await this.jewelleryCategoryService.remove(id);
  }
}
