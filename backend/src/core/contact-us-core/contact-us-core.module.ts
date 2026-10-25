import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { ContactUsCoreService } from './contact-us-core.service';

@Module({
  imports: [PrismaModule],
  providers: [ContactUsCoreService],
  exports: [ContactUsCoreService],
})
export class ContactUsCoreModule {}
