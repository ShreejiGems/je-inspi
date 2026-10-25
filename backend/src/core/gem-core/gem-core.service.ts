import { Injectable } from '@nestjs/common';
import { Gem, Prisma } from '@prisma/client';
import { gemMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { GemCorePaginateDto } from './dto/gem-core.dto';

@Injectable()
export class GemCoreService extends PrismaBaseRepository<
  Gem,
  GemCorePaginateDto,
  Prisma.GemCreateArgs,
  Prisma.GemUpdateArgs,
  Prisma.GemUpdateManyArgs,
  Prisma.GemFindUniqueArgs,
  Prisma.GemFindFirstArgs,
  Prisma.GemFindManyArgs,
  Prisma.GemDeleteArgs,
  Prisma.GemDeleteManyArgs,
  Prisma.GemCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.gem, {
      NOT_FOUND: gemMessage.GEM_NOT_FOUND,
      DELETED: gemMessage.GEM_IS_DELETED,
    });
  }
}
