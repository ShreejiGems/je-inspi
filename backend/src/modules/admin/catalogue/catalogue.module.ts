import { Module } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { CatalogueController } from './catalogue.controller';
import { AuthModule } from 'src/modules/client/auth/auth.module';
import { CatalogueCoreModule } from 'src/core/catalogue-core/catalogue-core.module';

@Module({
  imports: [AuthModule, CatalogueCoreModule],
  controllers: [CatalogueController],
  providers: [CatalogueService],
})
export class CatalogueModule {}
