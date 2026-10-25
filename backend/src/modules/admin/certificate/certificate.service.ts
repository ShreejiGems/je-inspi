import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { CertificateCoreService } from 'src/core/certificate-core/certificate-core.service';

@Injectable()
export class CertificateService {
  constructor(private certificateCoreService: CertificateCoreService) {}

  async create(createCertificateDto: CreateCertificateDto) {
    return this.certificateCoreService.create({
      data: {
        weightStartsAt: createCertificateDto.weightStartsAt,
        weightEndsAt: createCertificateDto.weightEndsAt,
        price: createCertificateDto.price,
      },
    });
  }

  async findAll() {
    return this.certificateCoreService.findMany({
      where: { isDeleted: false },
    });
  }

  async findOne(id: string) {
    const certificate = await this.certificateCoreService.findUnique({
      where: { id, isDeleted: false },
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    return certificate;
  }

  async update(id: string, updateCertificateDto: UpdateCertificateDto) {
    // Check if certificate exists
    await this.findOne(id);

    return this.certificateCoreService.update({
      where: { id },
      data: {
        ...updateCertificateDto,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.certificateCoreService.update({
      where: { id },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });

    return { message: 'Certificate deleted successfully' };
  }
}
