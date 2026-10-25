import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { CategoryCoreService } from './category-core.service';

@Module({
  imports: [PrismaModule],
  providers: [CategoryCoreService],
  exports: [CategoryCoreService],
})
export class CategoryCoreModule {}
