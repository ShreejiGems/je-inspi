import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { CertificateCoreModule } from 'src/core/certificate-core/certificate-core.module';

@Module({
  imports: [CertificateCoreModule],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
