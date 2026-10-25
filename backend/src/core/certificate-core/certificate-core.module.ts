import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/module/prisma/prisma.module';
import { CertificateCoreService } from './certificate-core.service';

@Module({
  imports: [PrismaModule],
  providers: [CertificateCoreService],
  exports: [CertificateCoreService],
})
export class CertificateCoreModule {}
