import { Injectable } from '@nestjs/common';
import { referenceDetails, Prisma } from '@prisma/client';
import { referenceDetailsMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { ReferenceDetailsCorePaginateDto } from './dto/reference-details-core.dto';

@Injectable()
export class ReferenceDetailsCoreService extends PrismaBaseRepository<
  referenceDetails,
  ReferenceDetailsCorePaginateDto,
  Prisma.referenceDetailsCreateArgs,
  Prisma.referenceDetailsUpdateArgs,
  Prisma.referenceDetailsUpdateManyArgs,
  Prisma.referenceDetailsFindUniqueArgs,
  Prisma.referenceDetailsFindFirstArgs,
  Prisma.referenceDetailsFindManyArgs,
  Prisma.referenceDetailsDeleteArgs,
  Prisma.referenceDetailsDeleteManyArgs,
  Prisma.referenceDetailsCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.referenceDetails, {
      NOT_FOUND: referenceDetailsMessage.REFERENCE_DETAILS_NOT_FOUND,
      DELETED: referenceDetailsMessage.REFERENCE_DETAILS_IS_DELETED,
    });
  }
}
