import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserCoreModule } from 'src/core/user-core/user-core.module';
import { UserSessionCoreModule } from 'src/core/user-session-core/user-session-core.module';
import { JwtModule } from '@nestjs/jwt';
import { PasswordCoreModule } from 'src/core/password-core/password-core.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ReferenceDetailsCoreModule } from 'src/core/reference-details-core/reference-details-core.module';
import { WishlistCoreModule } from 'src/core/wishlist-core/wishlist-core.module';
import { CustomInquiryCoreModule } from 'src/core/custom-inquiry-core/custom-inquiry-core.module';
import { OtpCoreModule } from 'src/core/otp-core/otp-core.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UserCoreModule,
    PasswordCoreModule,
    UserSessionCoreModule,
    ReferenceDetailsCoreModule,
    PasswordCoreModule,
    JwtModule,
    WishlistCoreModule,
    CustomInquiryCoreModule,
    OtpCoreModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
