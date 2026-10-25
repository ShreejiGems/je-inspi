import { Module } from '@nestjs/common';
import { CalculatorModule } from './calculator/calculator.module';
import { JewelleryModule } from './jewellery/jewellery.module';
import { JewelleryCategoryModule } from './jewellery-category/jewellery-category.module';
import { JewellerySubCategoryModule } from './jewellery-sub-category/jewellery-sub-category.module';
import { JewelleryTypeModule } from './jewellery-type/jewellery-type.module';
import { CollectionModule } from './collection/collection.module';
import { DynamicModule } from './dynamic/dynamic.module';
import { UserModule } from './user/user.module';
import { DiamondModule } from './diamond/diamond.module';
import { EventModule } from './event/event.module';
import { CatalogueModule } from './catalogue/catalogue.module';
import { LocationModule } from './location/location.module';
import { CertificateModule } from './certificate/certificate.module';

@Module({
  imports: [
    CalculatorModule,
    UserModule,
    CertificateModule,
    JewelleryModule,
    JewelleryCategoryModule,
    JewellerySubCategoryModule,
    JewelleryTypeModule,
    CollectionModule,
    DynamicModule,
    DiamondModule,
    EventModule,
    CatalogueModule,
    LocationModule,
  ],
})
export class AdminModule {}
