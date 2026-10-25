import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { ReferenceDetailsCoreService } from './reference-details-core.service';

@Module({
  imports: [PrismaModule],
  providers: [ReferenceDetailsCoreService],
  exports: [ReferenceDetailsCoreService],
})
export class ReferenceDetailsCoreModule {}
