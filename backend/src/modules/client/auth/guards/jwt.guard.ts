import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const prisma = new PrismaClient();

    const session = await prisma.userSession.findFirst({
      where: { authToken: token, isDeleted: false },
    });
    if (!session || session.isDeleted) {
      throw new UnauthorizedException('Session not found or deleted');
    }

    return super.canActivate(context) as boolean;
  }
}
