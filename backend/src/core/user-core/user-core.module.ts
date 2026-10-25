import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { UserCoreService } from './user-core.service';

@Module({
  imports: [PrismaModule],
  providers: [UserCoreService],
  exports: [UserCoreService],
})
export class UserCoreModule {}
