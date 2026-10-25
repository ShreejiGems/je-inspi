import { Injectable } from '@nestjs/common';
import { Event, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { EventCorePaginateDto } from './dto/event-core.dto';

@Injectable()
export class EventCoreService extends PrismaBaseRepository<
  Event,
  EventCorePaginateDto,
  Prisma.EventCreateArgs,
  Prisma.EventUpdateArgs,
  Prisma.EventUpdateManyArgs,
  Prisma.EventFindUniqueArgs,
  Prisma.EventFindFirstArgs,
  Prisma.EventFindManyArgs,
  Prisma.EventDeleteArgs,
  Prisma.EventDeleteManyArgs,
  Prisma.EventCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.event, {
      NOT_FOUND: 'Event not found',
      DELETED: 'Event is deleted',
    });
  }
}
