import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@ApiTags('Certificate')
@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new certificate' })
  create(@Body() createCertificateDto: CreateCertificateDto) {
    return this.certificateService.create(createCertificateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all certificates' })
  findAll() {
    return this.certificateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a certificate by ID' })
  @ApiParam({ name: 'id', description: 'Certificate ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.certificateService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a certificate' })
  @ApiParam({ name: 'id', description: 'Certificate ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ) {
    return this.certificateService.update(id, updateCertificateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a certificate' })
  @ApiParam({ name: 'id', description: 'Certificate ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.certificateService.remove(id);
  }
}
