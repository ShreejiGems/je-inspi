import { Injectable } from '@nestjs/common';
import { Prisma, UserSession } from '@prisma/client';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { userSessionMessage } from 'src/shared/keys/user.key';
import { UserSessionCorePaginateDto } from './dto/user-session-core.dto';

@Injectable()
export class UserSessionCoreService extends PrismaBaseRepository<
  UserSession,
  UserSessionCorePaginateDto,
  Prisma.UserSessionCreateArgs,
  Prisma.UserSessionUpdateArgs,
  Prisma.UserSessionUpdateManyArgs,
  Prisma.UserSessionFindUniqueArgs,
  Prisma.UserSessionFindFirstArgs,
  Prisma.UserSessionFindManyArgs,
  Prisma.UserSessionDeleteArgs,
  Prisma.UserSessionDeleteManyArgs,
  Prisma.UserSessionCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.userSession, {
      NOT_FOUND: userSessionMessage.USER_SESSION_NOT_FOUND,
      DELETED: userSessionMessage.USER_SESSION_IS_DELETED,
    });
  }
}
