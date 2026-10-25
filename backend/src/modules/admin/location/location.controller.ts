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
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';

@Controller('location')
@ApiTags('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Post('create')
  @ApiOperation({ summary: 'create location' })
  async create(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationService.create(createLocationDto);
  }

  @Get('get-all')
  @ApiOperation({ summary: 'get all locations' })
  async findAll() {
    return await this.locationService.findAll();
  }

  @Get('get-enabled')
  @ApiOperation({ summary: 'get all enabled locations' })
  async findAllEnabled(@Query() baseQueryCoreDto: BaseQueryCoreDto) {
    return await this.locationService.findAllEnabled(baseQueryCoreDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get location by id' })
  async findOne(@Param('id') id: string) {
    return await this.locationService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'update location by id' })
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return await this.locationService.update(id, updateLocationDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/enable')
  @ApiOperation({ summary: 'enable location by id' })
  async enable(@Param('id') id: string) {
    return await this.locationService.enable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/disable')
  @ApiOperation({ summary: 'disable location by id' })
  async disable(@Param('id') id: string) {
    return await this.locationService.disable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'delete location by id' })
  async remove(@Param('id') id: string) {
    return await this.locationService.remove(id);
  }
}
