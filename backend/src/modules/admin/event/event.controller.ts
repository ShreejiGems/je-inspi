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
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';

@Controller('event')
@ApiTags('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Post('create')
  @ApiOperation({ summary: 'create event' })
  async create(@Body() createEventDto: CreateEventDto) {
    return await this.eventService.create(createEventDto);
  }

  @Get('get-all')
  @ApiOperation({ summary: 'get all events' })
  async findAll() {
    return await this.eventService.findAll();
  }

  @Get('get-enabled')
  @ApiOperation({ summary: 'get all enabled events' })
  async findAllEnabled(@Query() baseQueryCoreDto: BaseQueryCoreDto) {
    return await this.eventService.findAllEnabled(baseQueryCoreDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get event by id' })
  async findOne(@Param('id') id: string) {
    return await this.eventService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'update event by id' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return await this.eventService.update(id, updateEventDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/enable')
  @ApiOperation({ summary: 'enable event by id' })
  async enable(@Param('id') id: string) {
    return await this.eventService.enable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/disable')
  @ApiOperation({ summary: 'disable event by id' })
  async disable(@Param('id') id: string) {
    return await this.eventService.disable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'delete event by id' })
  async remove(@Param('id') id: string) {
    return await this.eventService.remove(id);
  }
}
