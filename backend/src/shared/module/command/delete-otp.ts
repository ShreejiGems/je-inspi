import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { OtpCoreService } from 'src/core/otp-core/otp-core.service';

@Injectable()
export class DeleteOtpCommand {
  constructor(private otpCoreService: OtpCoreService) {}
  @Command({
    command: 'cronJob:deleteOtp',
    describe: 'for auto delete Otp',
  })
  async autoDeleteOtp() {
    const tenMinutesAgo = DateTime.local().minus({ minutes: 10 }).toJSDate();

    console.log(tenMinutesAgo);
    await this.otpCoreService.deleteMany({
      where: { createdAt: { lt: tenMinutesAgo } },
    });
  }
}
