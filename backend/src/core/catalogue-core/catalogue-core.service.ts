import { Injectable } from '@nestjs/common';
import { Catelogue, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { CatalogueCorePaginateDto } from './dto/catalogue-core.dto';

@Injectable()
export class CatalogueCoreService extends PrismaBaseRepository<
  Catelogue,
  CatalogueCorePaginateDto,
  Prisma.CatelogueCreateArgs,
  Prisma.CatelogueUpdateArgs,
  Prisma.CatelogueUpdateManyArgs,
  Prisma.CatelogueFindUniqueArgs,
  Prisma.CatelogueFindFirstArgs,
  Prisma.CatelogueFindManyArgs,
  Prisma.CatelogueDeleteArgs,
  Prisma.CatelogueDeleteManyArgs,
  Prisma.CatelogueCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.catelogue, {
      NOT_FOUND: 'Catalogue not found',
      DELETED: 'Catalogue is deleted',
    });
  }
}
