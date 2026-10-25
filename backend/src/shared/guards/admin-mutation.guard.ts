import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { PrismaClient, USER_TYPE } from '@prisma/client';
import { userMessage } from 'src/shared/keys/user.key';

@Injectable()
export class AdminMutationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const method: string = (request.method || '').toUpperCase();

    // Allow safe/read-only methods without admin
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      return true;
    }

    // Try to resolve user id from request (populated by passport) or decode token
    let userId: string | undefined = request.user?.id;

    if (!userId) {
      const authHeader: string | undefined = request.headers?.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const base64Payload = authHeader.split('.')[1];
          const decodedJson = Buffer.from(base64Payload, 'base64').toString(
            'utf8',
          );
          const payload = JSON.parse(decodedJson);
          userId = payload?.id;
        } catch {
          // fallthrough
        }
      }
    }

    if (!userId) {
      throw new BadRequestException(userMessage.NOT_ALLOWED);
    }

    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
    });

    if (!user || user.userType !== USER_TYPE.ADMIN) {
      throw new BadRequestException(userMessage.NOT_ALLOWED);
    }

    return true;
  }
}
