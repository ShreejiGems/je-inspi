import { Module } from '@nestjs/common';
import { JewelleryCategoryService } from './jewellery-category.service';
import { JewelleryCategoryController } from './jewellery-category.controller';
import { AuthModule } from 'src/modules/client/auth/auth.module';
import { CategoryCoreModule } from 'src/core/category-core/category-core.module';
import { SubCategoryCoreModule } from 'src/core/sub-category-core/sub-category-core.module';
import { TypeCoreModule } from 'src/core/type-core/type-core.module';
import { JewelleryCoreModule } from 'src/core/jewellery-core/jewellery-core.module';

@Module({
  imports: [
    AuthModule,
    CategoryCoreModule,
    SubCategoryCoreModule,
    TypeCoreModule,
    JewelleryCoreModule,
  ],
  controllers: [JewelleryCategoryController],
  providers: [JewelleryCategoryService],
})
export class JewelleryCategoryModule {}
