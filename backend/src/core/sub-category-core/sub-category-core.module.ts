import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { SubCategoryCoreService } from './sub-category-core.service';

@Module({
  imports: [PrismaModule],
  providers: [SubCategoryCoreService],
  exports: [SubCategoryCoreService],
})
export class SubCategoryCoreModule {}
