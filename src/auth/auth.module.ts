import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from 'src/mail/mail.service';
import { ResetTokenService } from 'src/auth/reset-token.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MailService, ResetTokenService],
})
export class AuthModule {
}
