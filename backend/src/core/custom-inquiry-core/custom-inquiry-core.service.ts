import { Injectable } from '@nestjs/common';
import { customInquiry, Prisma } from '@prisma/client';
import { customInquiryMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { CustomInquiryCorePaginateDto } from './dto/custom-inquiry-core.dto';

@Injectable()
export class CustomInquiryCoreService extends PrismaBaseRepository<
  customInquiry,
  CustomInquiryCorePaginateDto,
  Prisma.customInquiryCreateArgs,
  Prisma.customInquiryUpdateArgs,
  Prisma.customInquiryUpdateManyArgs,
  Prisma.customInquiryFindUniqueArgs,
  Prisma.customInquiryFindFirstArgs,
  Prisma.customInquiryFindManyArgs,
  Prisma.customInquiryDeleteArgs,
  Prisma.customInquiryDeleteManyArgs,
  Prisma.customInquiryCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.customInquiry, {
      NOT_FOUND: customInquiryMessage.CUSTOM_INQUIRY_NOT_FOUND,
      DELETED: customInquiryMessage.CUSTOM_INQUIRY_IS_DELETED,
    });
  }
}
