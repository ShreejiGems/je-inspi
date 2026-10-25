import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/modules/client/auth/auth.module';
import { UserCoreModule } from 'src/core/user-core/user-core.module';
import { PasswordCoreModule } from 'src/core/password-core/password-core.module';

@Module({
  imports: [AuthModule, UserCoreModule, PasswordCoreModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
