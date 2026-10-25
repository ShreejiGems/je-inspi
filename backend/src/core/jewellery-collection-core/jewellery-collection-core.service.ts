import { Injectable } from '@nestjs/common';
import { JewelleryCollection, Prisma } from '@prisma/client';
import { jewelleryCollectionMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { JewelleryCollectionCorePaginateDto } from './dto/jewellery-collection-core.dto';

@Injectable()
export class JewelleryCollectionCoreService extends PrismaBaseRepository<
  JewelleryCollection,
  JewelleryCollectionCorePaginateDto,
  Prisma.JewelleryCollectionCreateArgs,
  Prisma.JewelleryCollectionUpdateArgs,
  Prisma.JewelleryCollectionUpdateManyArgs,
  Prisma.JewelleryCollectionFindUniqueArgs,
  Prisma.JewelleryCollectionFindFirstArgs,
  Prisma.JewelleryCollectionFindManyArgs,
  Prisma.JewelleryCollectionDeleteArgs,
  Prisma.JewelleryCollectionDeleteManyArgs,
  Prisma.JewelleryCollectionCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.jewelleryCollection, {
      NOT_FOUND: jewelleryCollectionMessage.JEWELLERY_COLLECTION_NOT_FOUND,
      DELETED: jewelleryCollectionMessage.JEWELLERY_COLLECTION_IS_DELETED,
    });
  }
}
