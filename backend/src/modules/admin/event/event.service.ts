import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventCoreService } from 'src/core/event-core/event-core.service';
import { STATUS } from '@prisma/client';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';

@Injectable()
export class EventService {
  constructor(private eventCoreService: EventCoreService) {}

  async create(createEventDto: CreateEventDto) {
    const { title, image, description } = createEventDto;

    return await this.eventCoreService.create({
      data: { title, image, description },
    });
  }

  async findAll() {
    return await this.eventCoreService.findMany({
      where: { isDeleted: false },
    });
  }

  async findAllEnabled(baseQueryCoreDto: BaseQueryCoreDto) {
    const where = {
      isDeleted: false,
      status: STATUS.ENABLED,
    };

    return await this.eventCoreService.findPaginate(baseQueryCoreDto, where);
  }

  async findOne(id: string) {
    const eventExist = await this.eventCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!eventExist) {
      throw new BadRequestException('Event not found');
    }

    return eventExist;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const { title, image, description } = updateEventDto;

    const eventExist = await this.eventCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!eventExist) {
      throw new BadRequestException('Event not found');
    }

    return await this.eventCoreService.update({
      where: { id },
      data: { title, image, description },
    });
  }

  async enable(id: string) {
    const eventExist = await this.eventCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!eventExist) {
      throw new BadRequestException('Event not found');
    }

    return await this.eventCoreService.update({
      where: { id },
      data: { status: STATUS.ENABLED },
    });
  }

  async disable(id: string) {
    const eventExist = await this.eventCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!eventExist) {
      throw new BadRequestException('Event not found');
    }

    return await this.eventCoreService.update({
      where: { id },
      data: { status: STATUS.DISABLED },
    });
  }

  async remove(id: string) {
    const eventExist = await this.eventCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!eventExist) {
      throw new BadRequestException('Event not found');
    }

    return await this.eventCoreService.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
