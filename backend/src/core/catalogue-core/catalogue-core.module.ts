import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { CatalogueCoreService } from './catalogue-core.service';

@Module({
  imports: [PrismaModule],
  providers: [CatalogueCoreService],
  exports: [CatalogueCoreService],
})
export class CatalogueCoreModule {}
