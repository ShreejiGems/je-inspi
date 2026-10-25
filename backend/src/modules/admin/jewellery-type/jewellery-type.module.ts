import { Module } from '@nestjs/common';
import { JewelleryTypeService } from './jewellery-type.service';
import { JewelleryTypeController } from './jewellery-type.controller';
import { TypeCoreModule } from 'src/core/type-core/type-core.module';
import { SubCategoryCoreModule } from 'src/core/sub-category-core/sub-category-core.module';
import { AuthModule } from 'src/modules/client/auth/auth.module';
import { JewelleryCoreModule } from 'src/core/jewellery-core/jewellery-core.module';

@Module({
  imports: [
    AuthModule,
    TypeCoreModule,
    SubCategoryCoreModule,
    JewelleryCoreModule,
  ],
  controllers: [JewelleryTypeController],
  providers: [JewelleryTypeService],
})
export class JewelleryTypeModule {}
