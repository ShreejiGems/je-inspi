import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { LocationCoreService } from './location-core.service';

@Module({
  imports: [PrismaModule],
  providers: [LocationCoreService],
  exports: [LocationCoreService],
})
export class LocationCoreModule {}
