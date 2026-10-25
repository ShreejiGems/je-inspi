import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './shared/module/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('health')
  async health() {
    try {
      await this.prisma.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', service: 'JE-Inspi API', database: 'connected' };
    } catch {
      throw new ServiceUnavailableException('JE-Inspi database is unavailable');
    }
  }
}
