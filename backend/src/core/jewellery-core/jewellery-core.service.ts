import { Injectable } from '@nestjs/common';
import { Jewellery, Prisma } from '@prisma/client';
import { jewelleryMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { JewelleryCorePaginateDto } from './dto/jewellery-core.dto';

@Injectable()
export class JewelleryCoreService extends PrismaBaseRepository<
  Jewellery,
  JewelleryCorePaginateDto,
  Prisma.JewelleryCreateArgs,
  Prisma.JewelleryUpdateArgs,
  Prisma.JewelleryUpdateManyArgs,
  Prisma.JewelleryFindUniqueArgs,
  Prisma.JewelleryFindFirstArgs,
  Prisma.JewelleryFindManyArgs,
  Prisma.JewelleryDeleteArgs,
  Prisma.JewelleryDeleteManyArgs,
  Prisma.JewelleryCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.jewellery, {
      NOT_FOUND: jewelleryMessage.JEWELLERY_NOT_FOUND,
      DELETED: jewelleryMessage.JEWELLERY_IS_DELETED,
    });
  }
}
