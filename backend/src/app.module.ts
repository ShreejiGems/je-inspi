import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './modules/client/client.module';
import { AdminModule } from './modules/admin/admin.module';
import { UploadModule } from './shared/module/upload/upload.module';
import { PrismaModule } from './shared/module/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UploadModule, ClientModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
