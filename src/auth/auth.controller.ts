import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthDto, ResetPasswordDto } from 'src/auth/dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }
  
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
  
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
  
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.sendForgotPasswordEmail(email);
  }
  
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
