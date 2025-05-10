import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';

@Injectable()
export class ResetTokenService {
  constructor(private readonly databaseService: DatabaseService) {
  }
  
  async generate(userId: number) {
    const token = randomBytes(32).toString('hex');
    const expiration = addMinutes(new Date(), 30); // Token expires in 30 minutes
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    
    return this.databaseService.passwordResetToken.create({
      data: {
        userId,
        otp,
        token: token,
        expiresAt: expiration,
      },
    });
    
  }
  
  async validate(token: string) {
    const record = await this.databaseService.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });
    
    if (!record || record.expiresAt < new Date()) {
      throw new NotFoundException('Token not found or expired');
    }
    
    return record.user;
  }
  
  async delete(token: string) {
    await this.databaseService.passwordResetToken.delete({ where: { token } });
  }
}