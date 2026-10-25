import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { CatalogueCoreService } from 'src/core/catalogue-core/catalogue-core.service';
import { STATUS } from '@prisma/client';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';

@Injectable()
export class CatalogueService {
  constructor(private catalogueCoreService: CatalogueCoreService) {}

  async create(createCatalogueDto: CreateCatalogueDto) {
    const { name, coverImage, pdfUrl } = createCatalogueDto;

    return await this.catalogueCoreService.create({
      data: { name, coverImage, pdfUrl },
    });
  }

  async findAll() {
    return await this.catalogueCoreService.findMany({
      where: { isDeleted: false },
    });
  }

  async findAllEnabled(baseQueryCoreDto: BaseQueryCoreDto) {
    const where = {
      isDeleted: false,
      status: STATUS.ENABLED,
    };

    return await this.catalogueCoreService.findPaginate(
      baseQueryCoreDto,
      where,
    );
  }

  async findOne(id: string) {
    const catalogueExist = await this.catalogueCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!catalogueExist) {
      throw new BadRequestException('Catalogue not found');
    }

    return catalogueExist;
  }

  async update(id: string, updateCatalogueDto: UpdateCatalogueDto) {
    const { name, coverImage, pdfUrl } = updateCatalogueDto;

    const catalogueExist = await this.catalogueCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!catalogueExist) {
      throw new BadRequestException('Catalogue not found');
    }

    return await this.catalogueCoreService.update({
      where: { id },
      data: { name, coverImage, pdfUrl },
    });
  }

  async enable(id: string) {
    const catalogueExist = await this.catalogueCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!catalogueExist) {
      throw new BadRequestException('Catalogue not found');
    }

    return await this.catalogueCoreService.update({
      where: { id },
      data: { status: STATUS.ENABLED },
    });
  }

  async disable(id: string) {
    const catalogueExist = await this.catalogueCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!catalogueExist) {
      throw new BadRequestException('Catalogue not found');
    }

    return await this.catalogueCoreService.update({
      where: { id },
      data: { status: STATUS.DISABLED },
    });
  }

  async remove(id: string) {
    const catalogueExist = await this.catalogueCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!catalogueExist) {
      throw new BadRequestException('Catalogue not found');
    }

    return await this.catalogueCoreService.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
