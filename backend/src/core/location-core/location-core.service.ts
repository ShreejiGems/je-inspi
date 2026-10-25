import { Injectable } from '@nestjs/common';
import { Location, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { LocationCorePaginateDto } from './dto/location-core.dto';

@Injectable()
export class LocationCoreService extends PrismaBaseRepository<
  Location,
  LocationCorePaginateDto,
  Prisma.LocationCreateArgs,
  Prisma.LocationUpdateArgs,
  Prisma.LocationUpdateManyArgs,
  Prisma.LocationFindUniqueArgs,
  Prisma.LocationFindFirstArgs,
  Prisma.LocationFindManyArgs,
  Prisma.LocationDeleteArgs,
  Prisma.LocationDeleteManyArgs,
  Prisma.LocationCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.location, {
      NOT_FOUND: 'Location not found',
      DELETED: 'Location is deleted',
    });
  }
}
