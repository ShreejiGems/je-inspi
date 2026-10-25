import { Injectable } from '@nestjs/common';
import { Type, Prisma } from '@prisma/client';
import { typeMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { TypeCorePaginateDto } from './dto/type-core.dto';

@Injectable()
export class TypeCoreService extends PrismaBaseRepository<
  Type,
  TypeCorePaginateDto,
  Prisma.TypeCreateArgs,
  Prisma.TypeUpdateArgs,
  Prisma.TypeUpdateManyArgs,
  Prisma.TypeFindUniqueArgs,
  Prisma.TypeFindFirstArgs,
  Prisma.TypeFindManyArgs,
  Prisma.TypeDeleteArgs,
  Prisma.TypeDeleteManyArgs,
  Prisma.TypeCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.type, {
      NOT_FOUND: typeMessage.TYPE_NOT_FOUND,
      DELETED: typeMessage.TYPE_IS_DELETED,
    });
  }
}
