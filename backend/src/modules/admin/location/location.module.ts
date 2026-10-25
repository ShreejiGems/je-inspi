import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { AuthModule } from 'src/modules/client/auth/auth.module';
import { LocationCoreModule } from 'src/core/location-core/location-core.module';

@Module({
  imports: [AuthModule, LocationCoreModule],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
