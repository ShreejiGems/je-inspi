import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient, STATUS } from '@prisma/client';
import { UserSessionType } from '../types/user-session.type';
import { authMessages } from '../keys/user.key';

export const GetUserSession = createParamDecorator(
  async (data: any, ctx: ExecutionContext): Promise<UserSessionType> => {
    if (data) {
      console.log('data', data);
    }
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers;

    if (!headers.authorization) {
      throw new UnauthorizedException(authMessages.AUTH_HEADER_NOT_FOUND);
    }

    const authHeaderValue = headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new UnauthorizedException(authMessages.AUTH_HEADER_IS_NOT_BEARER);
    }

    try {
      const prisma = new PrismaClient();

      const decodedToken = JSON.parse(atob(authHeaderValue.split('.')[1]));

      const user: any = await prisma.user.findFirst({
        where: {
          id: decodedToken.id,
          isDeleted: false,
        },
      });

      if (!user) {
        throw new UnauthorizedException(authMessages.USER_NOT_FOUND);
      }

      if (user.status === STATUS.DISABLED || user.isDeleted) {
        throw new UnauthorizedException(authMessages.USER_NOT_FOUND);
      }

      return { user };
    } catch {
      throw new UnauthorizedException(authMessages.TOKEN_EXPIRED);
    }
  },
);

export const GetUserRequestHeader = createParamDecorator(
  (data: any, ctx: ExecutionContext): UserSessionType => {
    if (data) {
      console.log('data', data);
    }
    const request = ctx.switchToHttp().getRequest();
    return request.headers;
  },
);
