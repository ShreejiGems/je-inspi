import { Injectable } from '@nestjs/common';
import { Certificate, Prisma } from '@prisma/client';
import { certificateMessage } from 'src/shared/keys/user.key';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { CertificateCorePaginateDto } from './dto/certificate-core.dto';

@Injectable()
export class CertificateCoreService extends PrismaBaseRepository<
  Certificate,
  CertificateCorePaginateDto,
  Prisma.CertificateCreateArgs,
  Prisma.CertificateUpdateArgs,
  Prisma.CertificateUpdateManyArgs,
  Prisma.CertificateFindUniqueArgs,
  Prisma.CertificateFindFirstArgs,
  Prisma.CertificateFindManyArgs,
  Prisma.CertificateDeleteArgs,
  Prisma.CertificateDeleteManyArgs,
  Prisma.CertificateCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.prisma.certificate, {
      NOT_FOUND: certificateMessage.CERTIFICATE_NOT_FOUND,
      DELETED: certificateMessage.CERTIFICATE_IS_DELETED,
    });
  }
}
