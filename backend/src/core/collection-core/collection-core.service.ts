import { Injectable } from '@nestjs/common';
import { Collection, Prisma } from '@prisma/client';
import { collectionMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { CollectionCorePaginateDto } from './dto/collection-core.dto';

@Injectable()
export class CollectionCoreService extends PrismaBaseRepository<
  Collection,
  CollectionCorePaginateDto,
  Prisma.CollectionCreateArgs,
  Prisma.CollectionUpdateArgs,
  Prisma.CollectionUpdateManyArgs,
  Prisma.CollectionFindUniqueArgs,
  Prisma.CollectionFindFirstArgs,
  Prisma.CollectionFindManyArgs,
  Prisma.CollectionDeleteArgs,
  Prisma.CollectionDeleteManyArgs,
  Prisma.CollectionCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.collection, {
      NOT_FOUND: collectionMessage.COLLECTION_NOT_FOUND,
      DELETED: collectionMessage.COLLECTION_IS_DELETED,
    });
  }
}
