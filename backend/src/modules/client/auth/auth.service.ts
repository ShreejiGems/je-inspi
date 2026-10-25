import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { WishlistResponseDto } from './dto/wishlist-response.dto';
import { STATUS } from '@prisma/client';
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
import { USER_TYPE, VERIFICATION_TYPE } from '@prisma/client';
import { UserCoreService } from 'src/core/user-core/user-core.service';
import {
  adminMessage,
  authMessages,
  passwordMessages,
  userMessage,
  userSessionMessage,
} from 'src/shared/keys/user.key';
import { compare, encrypt } from 'src/shared/module/bcrypt/bcrypt';
import { PasswordCoreService } from 'src/core/password-core/password-core.service';
import { ReferenceDetailsCoreService } from 'src/core/reference-details-core/reference-details-core.service';
import { UserSessionCoreService } from 'src/core/user-session-core/user-session-core.service';
import { JwtService } from '@nestjs/jwt';
import { UserSessionType } from 'src/shared/types/user-session.type';
import { WishlistCoreService } from 'src/core/wishlist-core/wishlist-core.service';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import Mailgun from 'mailgun.js';
import { CustomInquiryCoreService } from 'src/core/custom-inquiry-core/custom-inquiry-core.service';
import { OtpCoreService } from 'src/core/otp-core/otp-core.service';

@Injectable()
export class AuthService {
  private mailgunClient: any;
  constructor(
    private userCoreService: UserCoreService,
    private passwordCoreService: PasswordCoreService,
    private referenceDetailsCoreService: ReferenceDetailsCoreService,
    private userSessionCoreService: UserSessionCoreService,
    private jwtService: JwtService,
    private wishlistCoreService: WishlistCoreService,
    private customInquiryCoreService: CustomInquiryCoreService,
    private otpCoreService: OtpCoreService,
  ) {
    const mailgun = new Mailgun(FormData);
    this.mailgunClient = process.env.MAILGUN_API_KEY
      ? mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY })
      : null;
  }

  private async sendMail(message: any) {
    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    if (
      !this.mailgunClient ||
      !process.env.MAILGUN_DOMAIN ||
      !process.env.MAIL_FROM ||
      recipients.some((recipient) => !recipient)
    ) {
      throw new ServiceUnavailableException('JE-Inspi email delivery is not configured');
    }
    return this.mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, message);
  }

  async adminSignup(adminSignupDto: AdminSignupDto) {
    const { email, password } = adminSignupDto;
    const userType = USER_TYPE.ADMIN;

    const isExist = await this.userCoreService.findFirst({
      where: { userType, isDeleted: false },
    });

    if (isExist) {
      throw new BadRequestException(adminMessage.USER_ALREADY_EXIST);
    }

    const user = await this.userCoreService.create({
      data: { email, userType },
    });

    const encryptedPassword = await encrypt(password);

    await this.passwordCoreService.create({
      data: { userId: user.id, password: encryptedPassword },
    });

    const authToken = this.jwtService
      .sign({ id: user.id }, { expiresIn: '1h' })
      .toString();

    const refreshToken = this.jwtService
      .sign({ id: user.id }, { expiresIn: '7d' })
      .toString();

    const userSession = await this.userSessionCoreService.create({
      data: { userId: user.id, authToken, refreshToken },
    });

    return { ...user, userSession };
  }

  async userSignup(userSignupDto: UserSignupDto) {
    const {
      email,
      companyName,
      title,
      firstName,
      lastName,
      countryCode,
      mobile,
      website,
      address,
      city,
      postalCode,
      country,
      companyNumber,
      registrationCopyImage,
      registrationCopyType,
      bussinessType,
      referenceDetail,
    } = userSignupDto;
    const userType = USER_TYPE.USER;

    const isExist = await this.userCoreService.findFirst({
      where: { userType, email, isDeleted: false },
    });

    if (isExist) {
      throw new BadRequestException(userMessage.USER_ALREADY_EXIST);
    }

    const user = await this.userCoreService.create({
      data: {
        email,
        userType,
        companyName,
        title,
        firstName,
        lastName,
        countryCode,
        mobile,
        website,
        address,
        city,
        postalCode,
        country,
        companyNumber,
        registrationCopyImage,
        registrationCopyType,
        bussinessType,
      },
    });

    const reference = await this.referenceDetailsCoreService.create({
      data: {
        userId: user.id,
        companyName: referenceDetail.companyName,
        contactPersonName: referenceDetail.contactPersonName,
        email: referenceDetail.email,
        countryCode: referenceDetail.countryCode,
        mobile: referenceDetail.mobile,
        address: referenceDetail.address,
        city: referenceDetail.city,
        postalCode: referenceDetail.postalCode,
        country: referenceDetail.country,
      },
    });

    // const authToken = this.jwtService
    //   .sign({ id: user.id }, { expiresIn: '1h' })
    //   .toString();

    // const refreshToken = this.jwtService
    //   .sign({ id: user.id }, { expiresIn: '7d' })
    //   .toString();

    // const userSession = await this.userSessionCoreService.create({
    //   data: { userId: user.id, authToken, refreshToken },
    // });

    return { ...user, reference };
  }

  async getMyWishlist(userId: string, baseQueryCoreDto: BaseQueryCoreDto) {
    const where: any = {
      userId,
      isDeleted: false,
      status: STATUS.ENABLED,
      OR: [
        {
          jewelleryId: { not: null },
          jewellery: {
            isDeleted: false,
            status: STATUS.ENABLED,
          },
        },
        {
          diamondProductId: { not: null },
          diamondProduct: {
            isDeleted: false,
            status: STATUS.ENABLED,
          },
        },
      ],
    };

    const wishlistItems = await this.wishlistCoreService.findPaginate(
      baseQueryCoreDto,
      where,
    );

    return wishlistItems;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { referenceDetail, ...userData } = updateProfileDto;

    // Check if user exists
    const user = await this.userCoreService.findFirst({
      where: { id: userId, isDeleted: false, userType: USER_TYPE.USER },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user data
    const updatedUser = await this.userCoreService.update({
      where: { id: userId },
      data: userData,
    });

    // Update reference details if provided
    if (referenceDetail) {
      await this.referenceDetailsCoreService.update({
        where: { userId },
        data: referenceDetail,
      });
    }

    // Fetch updated reference details
    const reference = await this.referenceDetailsCoreService.findFirst({
      where: { userId },
    });

    return { ...updatedUser, reference };
  }

  async login(loginDto: LoginDto) {
    const { email, password, userType } = loginDto;

    const user = await this.userCoreService.findFirst({
      where: { email, userType, isDeleted: false },
    });

    if (!user) {
      throw new BadRequestException(userMessage.USER_NOT_FOUND);
    }

    if (
      user &&
      user.userType === USER_TYPE.USER &&
      (user.verficationType === VERIFICATION_TYPE.PENDING ||
        user.verficationType === VERIFICATION_TYPE.REJECT)
    ) {
      return user;
    }

    const passwordData = await this.passwordCoreService.findFirst({
      where: { userId: user.id, isDeleted: false },
    });

    if (!passwordData) {
      throw new BadRequestException(passwordMessages.PASSWORD_NOT_FOUND);
    }

    const isPasswordMatch = await compare(password, passwordData.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(authMessages.INVALID_PASSWORD_ERROR);
    }

    const authToken = this.jwtService
      .sign({ id: user.id }, { expiresIn: '1h' })
      .toString();

    const refreshToken = this.jwtService
      .sign({ id: user.id }, { expiresIn: '7d' })
      .toString();

    const userSession = await this.userSessionCoreService.create({
      data: { userId: user.id, authToken, refreshToken },
    });

    return { ...user, userSession };
  }

  async refreshToken(header: any) {
    if (!header.authorization) {
      throw new UnauthorizedException(authMessages.AUTH_HEADER_NOT_FOUND);
    }

    const authHeaderValue = header.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new UnauthorizedException(authMessages.AUTH_HEADER_IS_NOT_BEARER);
    }

    const decodedToken = authHeaderValue.split(' ')[1];

    const userSession = await this.userSessionCoreService.findFirst({
      where: { refreshToken: decodedToken, isDeleted: false },
    });

    if (!userSession) {
      throw new BadRequestException(userSessionMessage.USER_SESSION_NOT_FOUND);
    }

    const authToken = this.jwtService
      .sign({ id: userSession.userId }, { expiresIn: '1h' })
      .toString();

    const refreshToken = this.jwtService
      .sign({ id: userSession.userId }, { expiresIn: '7d' })
      .toString();

    const newSession = await this.userSessionCoreService.create({
      data: { userId: userSession.userId, authToken, refreshToken },
    });

    return { newSession };
  }

  // async resetPasswordMail(email: string) {
  //   const user = await this.userCoreService.findFirst({
  //     where: { email, isDeleted: false },
  //   });

  //   if (!user) {
  //     throw new BadRequestException(userMessage.USER_NOT_FOUND);
  //   }

  //   const authToken = this.jwtService
  //     .sign({ id: user.id }, { expiresIn: '1h' })
  //     .toString();

  //   const newSession = await this.userSessionCoreService.create({
  //     data: { userId: user.id, authToken },
  //   });

  //   const link =
  //     `${process.env.BASE_URL}/auth/reset-password?auth=` +
  //     `${newSession.authToken}`;

  //   const sendSmtpEmail = new Brevo.SendSmtpEmail();

  //   sendSmtpEmail.subject = 'Reset Your Password';
  //   sendSmtpEmail.htmlContent = `
  //     <html>
  //       <body>
  //         <h1>Reset Your Password</h1>
  //         <p>Click on the link below to reset your password:</p>
  //         <a href="${link}">${link}</a>
  //       </body>
  //     </html>
  //   `;
  //   sendSmtpEmail.sender = {
  //     name: 'concertGoers',
  //     email: 'dhruvmatsquare@gmail.com',
  //   };
  //   sendSmtpEmail.to = [{ email, name: 'User' }];
  //   sendSmtpEmail.replyTo = {
  //     email: 'dhruvmatsquare@gmail.com',
  //     name: 'concertGoers',
  //   };
  //   sendSmtpEmail.headers = {
  //     'X-Requested-With': 'XMLHttpRequest',
  //   };
  //   sendSmtpEmail.params = {
  //     resetLink: link,
  //     subject: 'Password Reset Request',
  //   };

  //   try {
  //     const data = await this.brevoClient.sendTransacEmail(sendSmtpEmail);
  //     console.log('Email sent successfully, messageId:', data.messageId);
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }

  //   return link;
  // }

  async userProfile(userId: string) {
    return await this.userCoreService.findFirst({
      where: { id: userId, isDeleted: false },
    });
  }

  async resetPaassword(email: string, password: string) {
    const userExist = await this.userCoreService.findFirst({
      where: { email, isDeleted: false, userType: USER_TYPE.USER },
    });

    if (!userExist) {
      throw new BadRequestException(userMessage.USER_NOT_FOUND);
    }

    const passwordExist = await this.passwordCoreService.findFirst({
      where: { userId: userExist.id },
    });

    const encryptedPassword = await encrypt(password);

    if (passwordExist) {
      await this.passwordCoreService.update({
        where: { id: passwordExist.id },
        data: { password: encryptedPassword },
      });

      await this.userSessionCoreService.updateMany({
        where: { userId: userExist.id },
        data: { isDeleted: true },
      });
    } else {
      await this.passwordCoreService.create({
        data: { userId: userExist.id, password: encryptedPassword },
      });
    }

    return {
      success: true,
      status: 200,
      message: passwordMessages.PASSWORD_UPDATED,
    };
  }

  async logout(header: any, sessionData: UserSessionType) {
    if (!header.authorization) {
      throw new UnauthorizedException(authMessages.AUTH_HEADER_NOT_FOUND);
    }

    const tokenMatch = /^Bearer\s+(\S+)$/i.exec(header.authorization);
    if (!tokenMatch) {
      throw new UnauthorizedException(authMessages.AUTH_HEADER_IS_NOT_BEARER);
    }

    // Match the actual bearer token. Its JWT payload contains no authToken field.
    // Revoke every matching row because same-second logins may share a token.
    const result = await this.userSessionCoreService.updateMany({
      where: { userId: sessionData.user.id, authToken: tokenMatch[1], isDeleted: false },
      data: { isDeleted: true },
    });
    if (!result.count) {
      throw new UnauthorizedException(userSessionMessage.USER_SESSION_NOT_FOUND);
    }
    return { message: 'Logged out successfully' };
  }

  async contactUs(contactUsDto: ContactUsDto) {
    const {
      title,
      firstName,
      lastName,
      email,
      mobile,
      streetAddress,
      city,
      postalCode,
      country,
      message,
    } = contactUsDto;

    const messageData = {
      from: process.env.MAIL_FROM ?? '',
      to: [process.env.CONTACT_EMAIL ?? ''],
      subject:
        'Congratulations! Your profile has been successfully verified and your account is now active.',
      template: 'contact-us',
      'h:X-Mailgun-Variables': JSON.stringify({
        title,
        firstName,
        lastName,
        email,
        mobile,
        streetAddress,
        city,
        postalCode,
        country,
        message,
      }),
    };

    const data = await this.sendMail(messageData);

    return data;
  }

  async customInquiry(customInquiryDto: CustomInquiryDto) {
    const {
      inquiresFor,
      description,
      referenceImages,
      referenceLinks,
      title,
      firstName,
      lastName,
      email,
      countryCode,
      mobile,
      streetAddress,
      city,
      postalCode,
      country,
    } = customInquiryDto;

    const messageData = {
      from: process.env.MAIL_FROM ?? '',
      to: [process.env.CONTACT_EMAIL ?? ''],
      subject: 'Custom Inquiry',
      template: 'custom-inquiry',
      'h:X-Mailgun-Variables': JSON.stringify({
        inquiresFor,
        description,
        referenceImages,
        referenceLinks,
        title,
        firstName,
        lastName,
        email,
        countryCode,
        mobile,
        streetAddress,
        city,
        postalCode,
        country,
      }),
    };

    const data = await this.sendMail(messageData);

    const customInquiry = await this.customInquiryCoreService.create({
      data: {
        inquiresFor,
        description,
        referenceImages,
        referenceLinks,
        title,
        firstName,
        lastName,
        email,
        countryCode,
        mobile,
        streetAddress,
        city,
        postalCode,
        country,
      },
    });

    return customInquiry;
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { email, otpType } = sendOtpDto;

    if (otpType === 'FORGET_PASSWORD') {
      const userExist = await this.userCoreService.findFirst({
        where: { email, isDeleted: false, userType: USER_TYPE.USER },
      });

      if (!userExist) {
        throw new BadRequestException(userMessage.USER_NOT_FOUND);
      }
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000);

    const otp = await this.otpCoreService.create({
      data: { email, otp: randomOtp },
    });

    const messageData = {
      from: process.env.MAIL_FROM ?? '',
      to: [email],
      subject: 'Email Verification',
      template: 'email verification',
      'h:X-Mailgun-Variables': JSON.stringify({
        OTP: randomOtp,
      }),
    };

    await this.sendMail(messageData);

    return {
      message: 'Otp sent successfully',
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;

    const otpData = await this.otpCoreService.findFirst({
      where: { email, otp, isDeleted: false },
    });

    if (!otpData) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpCoreService.delete({ where: { id: otpData.id } });

    return {
      message: 'Otp verified successfully',
    };
  }
}
