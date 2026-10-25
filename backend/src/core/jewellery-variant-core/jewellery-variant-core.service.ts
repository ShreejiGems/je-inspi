import { Injectable } from '@nestjs/common';
import { JewelleryVariant, Prisma } from '@prisma/client';
import { jewelleryVariantMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { JewelleryVariantCorePaginateDto } from './dto/jewellery-variant-core.dto';

@Injectable()
export class JewelleryVariantCoreService extends PrismaBaseRepository<
  JewelleryVariant,
  JewelleryVariantCorePaginateDto,
  Prisma.JewelleryVariantCreateArgs,
  Prisma.JewelleryVariantUpdateArgs,
  Prisma.JewelleryVariantUpdateManyArgs,
  Prisma.JewelleryVariantFindUniqueArgs,
  Prisma.JewelleryVariantFindFirstArgs,
  Prisma.JewelleryVariantFindManyArgs,
  Prisma.JewelleryVariantDeleteArgs,
  Prisma.JewelleryVariantDeleteManyArgs,
  Prisma.JewelleryVariantCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.jewelleryVariant, {
      NOT_FOUND: jewelleryVariantMessage.JEWELLERY_VARIANT_NOT_FOUND,
      DELETED: jewelleryVariantMessage.JEWELLERY_VARIANT_IS_DELETED,
    });
  }
}
