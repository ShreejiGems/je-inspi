import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { USER_TYPE, VERIFICATION_TYPE } from '@prisma/client';
import {
  BaseQueryCoreDto,
  CoreIncludesDto,
} from 'src/core/base-query-core/dto/base-query-core.dto';
import { PasswordCoreService } from 'src/core/password-core/password-core.service';
import { UserCoreService } from 'src/core/user-core/user-core.service';
import { ApproveUserDto } from 'src/modules/client/auth/dto/auth.dto';
import { userMessage } from 'src/shared/keys/user.key';
import { encrypt } from 'src/shared/module/bcrypt/bcrypt';
import Mailgun from 'mailgun.js';

@Injectable()
export class UserService {
  private mailgunClient: any;
  constructor(
    private userCoreService: UserCoreService,
    private passwordCoreService: PasswordCoreService,
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

  async userList(baseQueryCoreDto: BaseQueryCoreDto) {
    return await this.userCoreService.findPaginate(baseQueryCoreDto, {
      isDeleted: false,
      verficationType: VERIFICATION_TYPE.APPROVE,
      userType: USER_TYPE.USER,
    });
  }

  async pendingRequest(baseQueryCoreDto: BaseQueryCoreDto) {
    return await this.userCoreService.findPaginate(baseQueryCoreDto, {
      isDeleted: false,
      verficationType: VERIFICATION_TYPE.PENDING,
      userType: USER_TYPE.USER,
    });
  }

  async userDetails(coreIncludesDto: CoreIncludesDto, id: string) {
    return await this.userCoreService.findUniqueIncludes(
      { where: { id, isDeleted: false } },
      coreIncludesDto,
    );
  }

  async approveUser(userId: string, approveUserDto: ApproveUserDto) {
    const { password, discount, paymentCycle, paymentMode } = approveUserDto;

    const userExist = await this.userCoreService.findFirst({
      where: { id: userId, isDeleted: false },
    });

    if (!userExist) {
      throw new BadRequestException(userMessage.USER_NOT_FOUND);
    }

    if (password) {
      const passwordExist = await this.passwordCoreService.findFirst({
        where: { userId, isDeleted: false },
      });

      const encryptedPassword = await encrypt(password);

      if (passwordExist) {
        await this.passwordCoreService.update({
          where: { id: passwordExist.id },
          data: { password: encryptedPassword },
        });
      } else {
        await this.passwordCoreService.create({
          data: { userId, password: encryptedPassword },
        });
      }
    }

    const message = {
      from: process.env.MAIL_FROM ?? '',
      to: [userExist.email],
      subject:
        'Congratulations! Your profile has been successfully verified and your account is now active.',
      template: 'user-credential',
      'h:X-Mailgun-Variables': JSON.stringify({
        name: userExist.firstName + ' ' + userExist.lastName,
        email: userExist.email,
        password,
      }),
    };

    const data = await this.sendMail(message);

    return await this.userCoreService.update({
      where: { id: userId },
      data: {
        discount,
        paymentCycle,
        paymentMode,
        verficationType: VERIFICATION_TYPE.APPROVE,
      },
    });
  }

  async rejectUser(userId: string) {
    const user = await this.userCoreService.findFirst({
      where: { id: userId, isDeleted: false },
    });

    if (!user) {
      throw new BadRequestException(userMessage.USER_NOT_FOUND);
    }

    return await this.userCoreService.update({
      where: { id: userId },
      data: { verficationType: VERIFICATION_TYPE.REJECT },
    });
  }

  async sendCredential(email: string, name: string, password: string) {
    const userExist = await this.userCoreService.findFirst({
      where: { email, isDeleted: false, userType: USER_TYPE.USER },
    });

    if (!userExist) {
      throw new BadRequestException(userMessage.USER_NOT_FOUND);
    }

    const message = {
      from: process.env.MAIL_FROM ?? '',
      to: [email],
      subject:
        'Congratulations! Your profile has been successfully Updated and your account is now active.',
      template: 'user-credential-updated',
      'h:X-Mailgun-Variables': JSON.stringify({
        name,
        email,
        password,
      }),
    };

    const data = await this.sendMail(message);

    return data;
  }

  async deleteUser(userId: string) {
    const userExist = await this.userCoreService.findFirst({
      where: { id: userId, isDeleted: false },
    });

    if (!userExist) {
      throw new BadRequestException(userMessage.USER_NOT_FOUND);
    }

    return await this.userCoreService.update({
      where: { id: userId },
      data: { isDeleted: true },
    });
  }
}
