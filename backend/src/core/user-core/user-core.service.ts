import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { userMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { UserCorePaginateDto } from './dto/user-core.dto';

@Injectable()
export class UserCoreService extends PrismaBaseRepository<
  User,
  UserCorePaginateDto,
  Prisma.UserCreateArgs,
  Prisma.UserUpdateArgs,
  Prisma.UserUpdateManyArgs,
  Prisma.UserFindUniqueArgs,
  Prisma.UserFindFirstArgs,
  Prisma.UserFindManyArgs,
  Prisma.UserDeleteArgs,
  Prisma.UserDeleteManyArgs,
  Prisma.UserCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.user, {
      NOT_FOUND: userMessage.USER_NOT_FOUND,
      DELETED: userMessage.USER_IS_DELETED,
    });
  }
}
