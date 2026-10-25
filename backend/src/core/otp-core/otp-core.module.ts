import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { OtpCoreService } from './otp-core.service';

@Module({
  imports: [PrismaModule],
  providers: [OtpCoreService],
  exports: [OtpCoreService],
})
export class OtpCoreModule {}
