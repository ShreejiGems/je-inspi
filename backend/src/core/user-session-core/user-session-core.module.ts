import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { UserSessionCoreService } from './user-session-core.service';

@Module({
  imports: [PrismaModule],
  providers: [UserSessionCoreService],
  exports: [UserSessionCoreService],
})
export class UserSessionCoreModule {}
