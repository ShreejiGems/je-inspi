import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { JewelleryCoreService } from './jewellery-core.service';

@Module({
  imports: [PrismaModule],
  providers: [JewelleryCoreService],
  exports: [JewelleryCoreService],
})
export class JewelleryCoreModule {}
