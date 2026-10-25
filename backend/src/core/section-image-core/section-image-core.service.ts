import { Injectable } from '@nestjs/common';
import { SectionImage, Prisma } from '@prisma/client';
import { sectionImageMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { SectionImageCorePaginateDto } from './dto/section-image-core.dto';

@Injectable()
export class SectionImageCoreService extends PrismaBaseRepository<
  SectionImage,
  SectionImageCorePaginateDto,
  Prisma.SectionImageCreateArgs,
  Prisma.SectionImageUpdateArgs,
  Prisma.SectionImageUpdateManyArgs,
  Prisma.SectionImageFindUniqueArgs,
  Prisma.SectionImageFindFirstArgs,
  Prisma.SectionImageFindManyArgs,
  Prisma.SectionImageDeleteArgs,
  Prisma.SectionImageDeleteManyArgs,
  Prisma.SectionImageCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.sectionImage, {
      NOT_FOUND: sectionImageMessage.SECTION_IMAGE_NOT_FOUND,
      DELETED: sectionImageMessage.SECTION_IMAGE_IS_DELETED,
    });
  }
}
