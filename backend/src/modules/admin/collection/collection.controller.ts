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
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';

@Controller('collection')
@ApiTags('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Post('create')
  @ApiOperation({ summary: 'create collection' })
  async create(@Body() createCollectionDto: CreateCollectionDto) {
    return await this.collectionService.create(createCollectionDto);
  }

  @Get('get-all')
  @ApiOperation({ summary: 'get all collections' })
  async findAll() {
    return await this.collectionService.findAll();
  }

  @Get('get-enabled')
  @ApiOperation({ summary: 'get all enabled collections' })
  async findAllEnabled() {
    return await this.collectionService.findAllEnabled();
  }

  @Get(':id')
  @ApiOperation({ summary: 'get collection by id' })
  async findOne(@Param('id') id: string) {
    return await this.collectionService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'update collection by id' })
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return await this.collectionService.update(id, updateCollectionDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/enable')
  @ApiOperation({ summary: 'enable collection by id' })
  async enable(@Param('id') id: string) {
    return await this.collectionService.enable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Put(':id/disable')
  @ApiOperation({ summary: 'disable collection by id' })
  async disable(@Param('id') id: string) {
    return await this.collectionService.disable(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminMutationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'delete collection by id' })
  async remove(@Param('id') id: string) {
    return await this.collectionService.remove(id);
  }
}
