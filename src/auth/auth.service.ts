import * as argon from 'argon2';
import { AuthDto, ResetPasswordDto } from 'src/auth/dto';
import { Prisma, Role } from '@prisma/client';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { ResetTokenService } from 'src/auth/reset-token.service';
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly resetTokenService: ResetTokenService,
  ) {
  }
  
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password, { type: argon.argon2id });
    try {
      const user = await this.databaseService.user.create({
        data: {
          email: dto.email,
          password: hash,
          name: dto.name,
        },
      });
      return {
        access_token: await this.signToken(user.id, user.email, user.role),
        expired_in: this.configService.get<string>('JWT_EXPIRED_IN') || process.env.JWT_EXPIRED_IN,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002')
        throw new ForbiddenException('Credentials taken', { description: 'The email or username is already taken' });
      throw error;
    }
  }
  
  async signin(dto: AuthDto) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect', { description: 'The email or password is incorrect' });
    
    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect', { description: 'The email or password is incorrect' });
    
    return {
      access_token: await this.signToken(user.id, user.email, user.role),
      expired_in: this.configService.get<string>('JWT_EXPIRED_IN') || process.env.JWT_EXPIRED_IN,
    };
  }
  
  async signToken(userId: number, email: string, role: Role): Promise<string> {
    const payload = {
      userId,
      email,
      role,
    };
    
    return this.jwtService.signAsync(payload);
  }
  
  async sendForgotPasswordEmail(email: string) {
    const user = await this.databaseService.user.findUnique({ where: { email } });
    if (!user) throw new ForbiddenException('Email not found', { description: 'The email does not exist' });
    
    const resetToken = await this.resetTokenService.generate(user.id);
    
    await this.mailService.sendForgotPasswordEmail(email, resetToken.otp);
    
    return {
      message: 'An email has been sent to reset your password',
      token: resetToken.token,
      otp: resetToken.otp,
    };
  }
  
  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.databaseService.passwordResetToken.findUnique({
      where: { token: dto.token, otp: dto.otp },
    });
    
    if (!record || record.expiresAt < new Date()) {
      throw new ForbiddenException('Token not found or expired', { description: 'The token is invalid or has expired' });
    }
    
    const hash = await argon.hash(dto.newPassword, { type: argon.argon2id });
    await this.databaseService.user.update({
      where: { id: record.userId },
      data: { password: hash },
    });
    await this.resetTokenService.delete(dto.token);
    
    return {
      message: 'Password reset successfully',
      action: 'RESET',
    };
  }
}
