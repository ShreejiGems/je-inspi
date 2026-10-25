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
import { CatalogueService } from './catalogue.service';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';

@Controller('catalogue')
@ApiTags('catalogue')
export class CatalogueController {
  constructor(private readonly catalogueService: CatalogueService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Post('create')
  @ApiOperation({ summary: 'create catalogue' })
  async create(@Body() createCatalogueDto: CreateCatalogueDto) {
    return await this.catalogueService.create(createCatalogueDto);
  }

  @Get('get-all')
  @ApiOperation({ summary: 'get all catalogues' })
  async findAll() {
    return await this.catalogueService.findAll();
  }

  @Get('get-enabled')
  @ApiOperation({ summary: 'get all enabled catalogues' })
  async findAllEnabled(@Query() baseQueryCoreDto: BaseQueryCoreDto) {
    return await this.catalogueService.findAllEnabled(baseQueryCoreDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get catalogue by id' })
  async findOne(@Param('id') id: string) {
    return await this.catalogueService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'update catalogue by id' })
  async update(
    @Param('id') id: string,
    @Body() updateCatalogueDto: UpdateCatalogueDto,
  ) {
    return await this.catalogueService.update(id, updateCatalogueDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/enable')
  @ApiOperation({ summary: 'enable catalogue by id' })
  async enable(@Param('id') id: string) {
    return await this.catalogueService.enable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/disable')
  @ApiOperation({ summary: 'disable catalogue by id' })
  async disable(@Param('id') id: string) {
    return await this.catalogueService.disable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'delete catalogue by id' })
  async remove(@Param('id') id: string) {
    return await this.catalogueService.remove(id);
  }
}
