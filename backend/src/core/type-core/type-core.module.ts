import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { TypeCoreService } from './type-core.service';

@Module({
  imports: [PrismaModule],
  providers: [TypeCoreService],
  exports: [TypeCoreService],
})
export class TypeCoreModule {}
