import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DiamondService } from './diamond.service';
import {
  CreateDiamondDto,
  UpdateDiamondDto,
  SearchDiamondsDto,
} from './dto/diamond.dto';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';
import {
  GetUserRequestHeader,
  GetUserSession,
} from 'src/shared/decorators/get-user-session.decorator';
import { UserSessionType } from 'src/shared/types/user-session.type';

@ApiTags('Diamond Products')
@Controller('diamond')
export class DiamondController {
  constructor(private readonly diamondService: DiamondService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new diamond product' })
  async create(@Body() createDiamondDto: CreateDiamondDto) {
    return await this.diamondService.create(createDiamondDto);
  }

  @Get()
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all diamond products' })
  async findAll(
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
    @Query() searchDiamondsDto: SearchDiamondsDto,
    @GetUserRequestHeader() headers?: any,
  ) {
    return await this.diamondService.findAll(
      baseQueryCoreDto,
      searchDiamondsDto,
      headers,
    );
  }

  @Get('search-params')
  @ApiOperation({ summary: 'Get search params for diamond products' })
  async searchParams() {
    return await this.diamondService.searchParams();
  }
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get diamond product by ID' })
  async findOne(
    @Param('id') id: string,
    @GetUserRequestHeader() headers?: any,
  ) {
    return await this.diamondService.findOne(id, headers);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update diamond product' })
  async update(
    @Param('id') id: string,
    @Body() updateDiamondDto: UpdateDiamondDto,
  ) {
    return await this.diamondService.update(id, updateDiamondDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete diamond product' })
  async remove(@Param('id') id: string) {
    return await this.diamondService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Patch(':id/enable')
  @ApiOperation({ summary: 'Enable diamond product' })
  async enable(@Param('id') id: string) {
    return await this.diamondService.enable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Patch(':id/disable')
  @ApiOperation({ summary: 'Disable diamond product' })
  async disable(@Param('id') id: string) {
    return await this.diamondService.disable(id);
  }
}
