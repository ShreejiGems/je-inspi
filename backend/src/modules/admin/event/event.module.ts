import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AuthModule } from 'src/modules/client/auth/auth.module';
import { EventCoreModule } from 'src/core/event-core/event-core.module';

@Module({
  imports: [AuthModule, EventCoreModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
