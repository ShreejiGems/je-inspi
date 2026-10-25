import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { AuthModule } from 'src/modules/client/auth/auth.module';
import { CollectionCoreModule } from 'src/core/collection-core/collection-core.module';

@Module({
  imports: [AuthModule, CollectionCoreModule],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
