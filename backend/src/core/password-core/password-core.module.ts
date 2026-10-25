import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { PasswordCoreService } from './password-core.service';

@Module({
  imports: [PrismaModule],
  providers: [PasswordCoreService],
  exports: [PasswordCoreService],
})
export class PasswordCoreModule {}
