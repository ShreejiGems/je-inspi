import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationCoreService } from 'src/core/location-core/location-core.service';
import { STATUS } from '@prisma/client';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';

@Injectable()
export class LocationService {
  constructor(private locationCoreService: LocationCoreService) {}

  async create(createLocationDto: CreateLocationDto) {
    const { country, countryCode, phone, email } = createLocationDto;

    return await this.locationCoreService.create({
      data: { country, countryCode, phone, email },
    });
  }

  async findAll() {
    return await this.locationCoreService.findMany({
      where: { isDeleted: false },
    });
  }

  async findAllEnabled(baseQueryCoreDto: BaseQueryCoreDto) {
    const where = {
      isDeleted: false,
      status: STATUS.ENABLED,
    };

    return await this.locationCoreService.findPaginate(baseQueryCoreDto, where);
  }

  async findOne(id: string) {
    const locationExist = await this.locationCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!locationExist) {
      throw new BadRequestException('Location not found');
    }

    return locationExist;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const { country, countryCode, phone, email } = updateLocationDto;

    const locationExist = await this.locationCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!locationExist) {
      throw new BadRequestException('Location not found');
    }

    return await this.locationCoreService.update({
      where: { id },
      data: { country, countryCode, phone, email },
    });
  }

  async enable(id: string) {
    const locationExist = await this.locationCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!locationExist) {
      throw new BadRequestException('Location not found');
    }

    return await this.locationCoreService.update({
      where: { id },
      data: { status: STATUS.ENABLED },
    });
  }

  async disable(id: string) {
    const locationExist = await this.locationCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!locationExist) {
      throw new BadRequestException('Location not found');
    }

    return await this.locationCoreService.update({
      where: { id },
      data: { status: STATUS.DISABLED },
    });
  }

  async remove(id: string) {
    const locationExist = await this.locationCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!locationExist) {
      throw new BadRequestException('Location not found');
    }

    return await this.locationCoreService.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
