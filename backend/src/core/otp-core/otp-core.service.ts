import { Injectable } from '@nestjs/common';
import { Otp, Prisma } from '@prisma/client';
import { OtpMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { OtpCorePaginateDto } from './dto/otp-core.dto';

@Injectable()
export class OtpCoreService extends PrismaBaseRepository<
  Otp,
  OtpCorePaginateDto,
  Prisma.OtpCreateArgs,
  Prisma.OtpUpdateArgs,
  Prisma.OtpUpdateManyArgs,
  Prisma.OtpFindUniqueArgs,
  Prisma.OtpFindFirstArgs,
  Prisma.OtpFindManyArgs,
  Prisma.OtpDeleteArgs,
  Prisma.OtpDeleteManyArgs,
  Prisma.OtpCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.otp, {
      NOT_FOUND: OtpMessage.OTP_NOT_FOUND,
      DELETED: OtpMessage.OTP_IS_DELETED,
    });
  }
}
