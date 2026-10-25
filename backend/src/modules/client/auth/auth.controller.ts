import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PasswordResetService, PasswordResetGuard } from './password-reset.service';
import { RequestPasswordResetDto, ResetPasswordDto } from './dto/password-reset.dto';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  AdminSignupDto,
  ContactUsDto,
  CustomInquiryDto,
  LoginDto,
  SendOtpDto,
  UpdateProfileDto,
  UserSignupDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import {
  GetUserRequestHeader,
  GetUserSession,
} from 'src/shared/decorators/get-user-session.decorator';
import { UserSessionType } from 'src/shared/types/user-session.type';
import { JwtAuthGuard } from './guards/jwt.guard';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly passwordReset: PasswordResetService) {}

  @Post('admin-signup')
  @ApiOperation({ summary: 'admin sign-up' })
  async adminSignup(@Body() adminSignupDto: AdminSignupDto) {
    return await this.authService.adminSignup(adminSignupDto);
  }

  @Post('user-signup')
  @ApiOperation({ summary: 'User sign-up' })
  async userSignup(@Body() userSignupDto: UserSignupDto) {
    return await this.authService.userSignup(userSignupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'login for admin/users' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('refresh-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get refresh-token' })
  async refreshToken(@Req() req: Request) {
    return await this.authService.refreshToken(req.headers);
  }

  // @Post('send-email-otp')
  // @ApiOperation({ summary: 'send otp on user email' })
  // async sendEmail(@Body() emailOtpDto: EmailOtpDto) {
  //   return await this.authService.sendEmailOtp(emailOtpDto);
  // }

  // @Post('verify-email-otp')
  // @ApiOperation({ summary: 'verify otp on user email' })
  // async verifyEmailOtp(@Body() verifyEmailOtpDto: VerifyEmailOtpDto) {
  //   return await this.authService.verifyEmailOtp(verifyEmailOtpDto);
  // }

  @Post('request-password-reset')
  @UseGuards(PasswordResetGuard)
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return this.passwordReset.request(dto.email);
  }

  @Post('change-password')
  @UseGuards(PasswordResetGuard)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordReset.reset(dto.token, dto.password);
  }

  @Get(':userId/profile')
  @ApiOperation({ summary: 'User profile' })
  async userProfile(@Param('userId') userId: string) {
    return await this.authService.userProfile(userId);
  }

  @Post('update-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @GetUserSession() userSession: UserSessionType,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(
      userSession.user.id,
      updateProfileDto,
    );
  }

  @Get('wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user's wishlist" })
  async getMyWishlist(
    @GetUserSession() userSession: UserSessionType,
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
  ) {
    return this.authService.getMyWishlist(
      userSession.user.id,
      baseQueryCoreDto,
    );
  }

  @Delete('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'logout current user' })
  async logout(
    @GetUserRequestHeader() header: any,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return await this.authService.logout(header, sessionData);
  }

  @Post('contact-us')
  @ApiOperation({ summary: 'Contact us' })
  async contactUs(@Body() contactUsDto: ContactUsDto) {
    return await this.authService.contactUs(contactUsDto);
  }

  @Post('custom-inquiry')
  @ApiOperation({ summary: 'Custom inquiry' })
  async customInquiry(@Body() customInquiryDto: CustomInquiryDto) {
    return await this.authService.customInquiry(customInquiryDto);
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return await this.authService.sendOtp(sendOtpDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyOtp(verifyOtpDto);
  }
}
