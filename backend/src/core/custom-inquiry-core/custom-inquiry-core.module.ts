import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { CustomInquiryCoreService } from './custom-inquiry-core.service';

@Module({
  imports: [PrismaModule],
  providers: [CustomInquiryCoreService],
  exports: [CustomInquiryCoreService],
})
export class CustomInquiryCoreModule {}
