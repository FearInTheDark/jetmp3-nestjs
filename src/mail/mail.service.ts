import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    ) {
  }
  
  async sendForgotPasswordEmail(email: string, otp: string, resetUrl: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: 'forgot-password',
      context: {
        email,
        otp,
        resetUrl,
      },
    });
  }
}
