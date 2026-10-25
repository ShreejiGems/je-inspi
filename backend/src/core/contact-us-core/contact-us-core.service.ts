import { Injectable } from '@nestjs/common';
import { contactUs, Prisma } from '@prisma/client';
import { contactUsMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { ContactUsCorePaginateDto } from './dto/contact-us-core.dto';

@Injectable()
export class ContactUsCoreService extends PrismaBaseRepository<
  contactUs,
  ContactUsCorePaginateDto,
  Prisma.contactUsCreateArgs,
  Prisma.contactUsUpdateArgs,
  Prisma.contactUsUpdateManyArgs,
  Prisma.contactUsFindUniqueArgs,
  Prisma.contactUsFindFirstArgs,
  Prisma.contactUsFindManyArgs,
  Prisma.contactUsDeleteArgs,
  Prisma.contactUsDeleteManyArgs,
  Prisma.contactUsCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.contactUs, {
      NOT_FOUND: contactUsMessage.CONTACT_US_NOT_FOUND,
      DELETED: contactUsMessage.CONTACT_US_IS_DELETED,
    });
  }
}
