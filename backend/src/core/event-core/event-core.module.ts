import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { EventCoreService } from './event-core.service';

@Module({
  imports: [PrismaModule],
  providers: [EventCoreService],
  exports: [EventCoreService],
})
export class EventCoreModule {}
