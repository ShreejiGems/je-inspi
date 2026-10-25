import { Module } from '@nestjs/common';
import { JewellerySubCategoryService } from './jewellery-sub-category.service';
import { JewellerySubCategoryController } from './jewellery-sub-category.controller';
import { SubCategoryCoreModule } from 'src/core/sub-category-core/sub-category-core.module';
import { AuthModule } from 'src/modules/client/auth/auth.module';
import { CategoryCoreModule } from 'src/core/category-core/category-core.module';
import { TypeCoreModule } from 'src/core/type-core/type-core.module';
import { JewelleryCoreModule } from 'src/core/jewellery-core/jewellery-core.module';

@Module({
  imports: [
    AuthModule,
    SubCategoryCoreModule,
    CategoryCoreModule,
    TypeCoreModule,
    JewelleryCoreModule,
  ],
  controllers: [JewellerySubCategoryController],
  providers: [JewellerySubCategoryService],
})
export class JewellerySubCategoryModule {}
